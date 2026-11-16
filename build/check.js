#!/usr/bin/env node
/* =====================================================================
   build/check.js   -   npm test   (also the last step of npm run build)

   Verifies the BUILT output in /public the way a crawler sees it: plain
   HTML, no JavaScript. Fails (exit 1) if a public page is empty, still
   shows the loading spinner, lacks route-specific metadata, or if the
   vercel.json rewrites for /project?slug= and /blog?slug= are stale.
   ===================================================================== */
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");
const { ROOT, loadSiteData, STATIC_ROUTES, dynamicRoutes, rewritesFor } = require("./lib/site-data");

const D = loadSiteData();
const BASE = String(D.profile.baseUrl).replace(/\/$/, "");
const errors = [];
const fail = (where, msg) => errors.push(`${where}: ${msg}`);
const norm = (s) => String(s).replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
const decode = (html) => new JSDOM(`<body>${html}</body>`).window.document.body.textContent.replace(/\s+/g, " ").trim();

const titles = new Map(), descriptions = new Map();
let checked = 0;

function checkPage(file, canonicalUrl, mustContain) {
  const where = file;
  const full = path.join(ROOT, "public", file);
  if (!fs.existsSync(full)) return fail(where, "file is missing (was the build run?)");
  const html = fs.readFileSync(full, "utf8");
  const doc = new JSDOM(html).window.document;          // parsed WITHOUT running scripts, like a non-JS crawler
  const main = doc.getElementById("app");
  const text = main.textContent.replace(/\s+/g, " ").trim();
  checked++;

  if (main.querySelector(".boot")) fail(where, "loading spinner is still in <main>");
  if (!main.querySelector("h1")) fail(where, "no <h1> in the initial HTML");
  if (text.length < 200) fail(where, `<main> has only ${text.length} characters of text`);
  if (!doc.querySelector("#site-nav a[href]")) fail(where, "navigation links are missing from the initial HTML");
  if (!doc.querySelector("#site-footer a[href]")) fail(where, "footer is missing from the initial HTML");
  if (/You need to enable JavaScript/i.test(html)) fail(where, "old 'enable JavaScript' fallback is still present");

  const title = doc.title.trim();
  const desc = (doc.querySelector('meta[name="description"]') || {}).content || "";
  if (!title) fail(where, "empty <title>");
  if (desc.length < 40) fail(where, "missing or too short meta description");
  const canon = (doc.querySelector('link[rel="canonical"]') || {}).href;
  if (canon !== canonicalUrl) fail(where, `canonical is ${canon}, expected ${canonicalUrl}`);
  const og = (p) => (doc.querySelector(`meta[property="${p}"]`) || {}).content;
  if (og("og:url") !== canonicalUrl) fail(where, `og:url is ${og("og:url")}, expected ${canonicalUrl}`);
  if (og("og:title") !== title) fail(where, "og:title does not match <title>");
  if (!og("og:description")) fail(where, "missing og:description");
  if (!/^https:\/\//.test(og("og:image") || "")) fail(where, "og:image is not an absolute https URL");

  for (const [what, needle] of mustContain) {
    if (!text.includes(norm(needle))) fail(where, `expected content missing: ${what} ("${norm(needle).slice(0, 60)}")`);
  }
  (titles.get(title) || titles.set(title, []).get(title)).push(file);
  (descriptions.get(desc) || descriptions.set(desc, []).get(desc)).push(file);
  return { doc, text };
}

/* ---------- public pages ---------- */
const P = D.profile;
checkPage("index.html", BASE + "/", [["name", P.name], ["hero description", P.hero.description], ["about text", P.about.paragraphs[0]]]);
checkPage("projects.html", BASE + "/projects", D.projectsData.map((p) => ["project " + p.slug, p.title]));
checkPage("blogs.html", BASE + "/blogs", D.blogsData.map((b) => ["blog " + b.slug, decode(b.title)]));
checkPage("certifications.html", BASE + "/certifications", D.certificationsData.map((c) => ["certificate " + c.title, c.title]));
checkPage("contact.html", BASE + "/contact", [["email", P.email], ["phone", P.phoneDisplay]]);

for (const r of dynamicRoutes(D)) {
  const url = BASE + r.path + r.query;
  if (r.kind === "project") {
    const p = D.projectsData.find((x) => x.slug === r.slug);
    checkPage(r.out, url, [["project title", p.title], ["technology", p.tags[0]]]);
  } else {
    const b = D.blogsData.find((x) => x.slug === r.slug);
    checkPage(r.out, url, [["post title", decode(b.title)]]);
  }
}

/* every page needs its own title and description (no duplicate / misleading metadata) */
for (const [what, map] of [["title", titles], ["meta description", descriptions]])
  for (const [v, files] of map) if (files.length > 1) fail(files.join(", "), `share the same ${what}: "${v.slice(0, 70)}"`);

/* ---------- unknown slugs must still fall back to the client-rendered template ---------- */
for (const f of ["project.html", "blog.html"]) {
  const html = fs.readFileSync(path.join(ROOT, "public", f), "utf8");
  if (!/<script defer src="js\/app\.js">/.test(html)) fail(f, "client bundle is not loaded");
  if (!/<noscript>[\s\S]*Some features need JavaScript/.test(html)) fail(f, "accessible no-JavaScript message is missing");
}

/* ---------- vercel.json rewrites + robots ---------- */
const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, "vercel.json"), "utf8"));
if (JSON.stringify(cfg.rewrites || []) !== JSON.stringify(rewritesFor(D))) fail("vercel.json", "rewrites are out of date: run `npm run build` and commit vercel.json");
for (const rw of cfg.rewrites || []) {
  if (!fs.existsSync(path.join(ROOT, "public", rw.destination))) fail("vercel.json", `rewrite points to a missing file: ${rw.destination}`);
}
if (!/Disallow:\s*\/_prerendered\//.test(fs.readFileSync(path.join(ROOT, "public", "robots.txt"), "utf8"))) fail("robots.txt", "does not disallow /_prerendered/");

if (errors.length) {
  console.error(`CHECK FAILED (${errors.length}):\n - ` + errors.join("\n - "));
  process.exit(1);
}
console.log(`check ok: ${checked} pages have real HTML + route-specific metadata, rewrites in sync`);
