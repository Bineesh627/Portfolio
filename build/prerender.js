#!/usr/bin/env node
/* =====================================================================
   build/prerender.js   (run by publish.js, after build.js)

   Problem: every page template has an empty <main id="app"> that the
   JavaScript fills in, so crawlers / link-preview bots that do not run
   JavaScript saw no content.

   Solution: run the site's OWN bundle (js/app.js) inside jsdom once per
   public route, take the finished nav / <main> / footer HTML and the
   route's <title>, description, canonical and Open Graph tags, and write
   them into a copy of the page template in /public. No page markup is
   duplicated, so the prerendered HTML can never drift from what the
   browser draws. In the browser the same bundle still runs and re-draws
   the page, so navigation, refresh and back/forward keep working.

   Dynamic routes:
     /project?slug=x and /blog?slug=x are written to
     public/_prerendered/<kind>/<slug>.html and served at the SAME url by
     a vercel.json rewrite (matches the slug query). No duplicate URLs;
     unknown slugs still fall back to the normal template.
     vercel.json is regenerated locally. On Vercel (or with --check) a
     stale vercel.json fails the build, because Vercel reads it before
     the build starts.
   ===================================================================== */
const fs = require("fs");
const path = require("path");
const { JSDOM, VirtualConsole } = require("jsdom");
const { ROOT, loadSiteData, STATIC_ROUTES, dynamicRoutes, rewritesFor } = require("./lib/site-data");

const PUBLIC = path.join(ROOT, "public");
const appJs = fs.readFileSync(path.join(ROOT, "js", "app.js"), "utf8");
const D = loadSiteData();
const BASE = String(D.profile.baseUrl).replace(/\/$/, "");

const META = [
  ["name", "description"], ["name", "keywords"],
  ["property", "og:title"], ["property", "og:description"], ["property", "og:image"], ["property", "og:url"], ["property", "og:type"],
  ["property", "twitter:title"], ["property", "twitter:description"], ["property", "twitter:image"], ["property", "twitter:url"],
];

/* run the real app for one url and return what it drew */
async function renderRoute(template, url) {
  const errors = [];
  const vc = new VirtualConsole();
  vc.on("jsdomError", (e) => { if (!/Not implemented/i.test(e.message)) errors.push(e.message); });
  vc.on("error", (...a) => errors.push(a.join(" ")));
  const dom = new JSDOM(template, { url: BASE + url, runScripts: "outside-only", pretendToBeVisual: true, virtualConsole: vc });
  const w = dom.window;
  w.scrollTo = () => {};
  if (!w.matchMedia) w.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
  try {
    w.eval(appJs);
    if (w.document.readyState !== "complete") await new Promise((r) => w.addEventListener("load", r));
  } catch (e) { errors.push(String(e && e.stack || e)); }

  const doc = w.document;
  const app = doc.getElementById("app");
  /* make the snapshot meaningful without JavaScript */
  app.classList.remove("page-in");
  app.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
  const typed = doc.getElementById("typed-role");
  if (typed && w.Site) typed.textContent = w.Site.data.profile.hero.roles[0];

  const out = {
    errors,
    nav: doc.getElementById("site-nav").innerHTML,
    app: app.innerHTML,
    footer: doc.getElementById("site-footer").innerHTML,
    title: doc.title,
    h1: (app.querySelector("h1") || {}).textContent || "",
    meta: META.map(([a, v]) => { const el = doc.querySelector(`meta[${a}="${v}"]`); return [a, v, el ? el.getAttribute("content") : null]; }),
    canonical: (doc.querySelector('link[rel="canonical"]') || { getAttribute: () => null }).getAttribute("href"),
    page: doc.body.getAttribute("data-page"),
  };
  w.close();
  return out;
}

function jsonLd(route, r) {
  if (route.kind === "blog") {
    const b = D.blogsData.find((x) => x.slug === route.slug);
    return { "@context": "https://schema.org", "@type": "BlogPosting", headline: r.h1, description: r.meta.find((m) => m[1] === "description")[2],
      datePublished: b.published_at, url: r.canonical, author: { "@type": "Person", name: D.profile.name, url: BASE + "/" },
      image: (r.meta.find((m) => m[1] === "og:image")[2]) || undefined, mainEntityOfPage: r.canonical };
  }
  if (route.kind === "project") {
    const p = D.projectsData.find((x) => x.slug === route.slug);
    return { "@context": "https://schema.org", "@type": "CreativeWork", name: r.h1, description: r.meta.find((m) => m[1] === "description")[2],
      url: r.canonical, keywords: (p.tags || []).join(", "), author: { "@type": "Person", name: D.profile.name, url: BASE + "/" } };
  }
  return null;
}

/* write the drawn page into a copy of the template */
function compose(template, r, route) {
  const dom = new JSDOM(template);
  const doc = dom.window.document;
  doc.getElementById("site-nav").innerHTML = r.nav;
  doc.getElementById("app").innerHTML = r.app;
  doc.getElementById("app").setAttribute("data-prerendered", "true");
  doc.getElementById("site-footer").innerHTML = r.footer;
  if (r.page) doc.body.setAttribute("data-page", r.page);

  doc.title = r.title;
  for (const [a, v, content] of r.meta) {
    if (content === null || content === "") continue;
    let el = doc.querySelector(`meta[${a}="${v}"]`);
    if (!el) { el = doc.createElement("meta"); el.setAttribute(a, v); doc.head.appendChild(el); }
    el.setAttribute("content", content);
  }
  const imgNow = (r.meta.find((m) => m[1] === "og:image") || [])[2];
  const alt = doc.querySelector('meta[property="og:image:alt"]');
  if (alt && imgNow && route.kind) alt.setAttribute("content", r.h1);
  let link = doc.querySelector('link[rel="canonical"]');
  if (!link) { link = doc.createElement("link"); link.setAttribute("rel", "canonical"); doc.head.appendChild(link); }
  link.setAttribute("href", r.canonical);

  const ld = jsonLd(route, r);
  if (ld) {
    const s = doc.createElement("script");
    s.setAttribute("type", "application/ld+json");
    s.textContent = JSON.stringify(ld);
    doc.body.appendChild(s);
  }
  return "<!DOCTYPE html>\n" + doc.documentElement.outerHTML + "\n";
}

async function main() {
  const dynamic = dynamicRoutes(D);
  const jobs = [
    ...STATIC_ROUTES.map((r) => ({ ...r, url: r.path, kind: null })),
    ...dynamic.map((r) => ({ ...r, url: r.path + r.query })),
  ];
  const failures = [];
  const templates = {};
  for (const job of jobs) {
    const template = templates[job.template] || (templates[job.template] = fs.readFileSync(path.join(ROOT, job.template), "utf8"));
    const r = await renderRoute(template, job.url);
    const problems = [...r.errors];
    if (!r.h1) problems.push("no <h1> was drawn (page failed or shows 'not found')");
    if (/class="boot"/.test(r.app)) problems.push("loading spinner is still in <main>");
    if (r.app.length < 800) problems.push("<main> content is suspiciously small");
    if (problems.length) { failures.push(`${job.url}: ${problems.join("; ")}`); continue; }
    const file = path.join(PUBLIC, job.out);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, compose(template, r, job));
  }
  if (failures.length) { console.error("PRERENDER FAILED:\n - " + failures.join("\n - ")); process.exit(1); }
  console.log(`prerendered ${jobs.length} pages (${STATIC_ROUTES.length} static + ${dynamic.length} slug pages)`);

  /* vercel.json rewrites for the slug pages */
  const vpath = path.join(ROOT, "vercel.json");
  const cfg = JSON.parse(fs.readFileSync(vpath, "utf8"));
  const want = rewritesFor(D);
  if (JSON.stringify(cfg.rewrites || []) !== JSON.stringify(want)) {
    if (process.env.VERCEL || process.argv.includes("--check")) {
      console.error("vercel.json rewrites are out of date. Run `npm run build` locally and commit vercel.json (Vercel reads it before the build starts).");
      process.exit(1);
    }
    cfg.rewrites = want;
    fs.writeFileSync(vpath, JSON.stringify(cfg, null, 2) + "\n");
    console.log("vercel.json rewrites updated: commit this file");
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
