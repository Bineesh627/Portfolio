/* Loads the portfolio data files (data/*.js) in Node, exactly as the browser does. */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..", "..");
const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");

function loadSiteData() {
  const files = [...read("data/loader.js").matchAll(/"(data\/[^"]+\.js)"/g)].map((m) => m[1]);
  const ctx = { window: {} };
  ctx.window.SITE_DATA = { projectsData: [], blogsData: [] };
  ctx.SITE_DATA = ctx.window.SITE_DATA;
  vm.createContext(ctx);
  for (const f of files) vm.runInContext(read(f), ctx, { filename: f });
  return ctx.SITE_DATA;
}

/* the public routes that get their own prerendered HTML */
const STATIC_ROUTES = [
  { path: "/", template: "index.html", out: "index.html" },
  { path: "/projects", template: "projects.html", out: "projects.html" },
  { path: "/blogs", template: "blogs.html", out: "blogs.html" },
  { path: "/certifications", template: "certifications.html", out: "certifications.html" },
  { path: "/contact", template: "contact.html", out: "contact.html" },
];

/* dynamic routes: /project?slug=x and /blog?slug=x (served at the SAME url through a rewrite, no duplicate pages) */
function dynamicRoutes(D) {
  return [
    ...D.projectsData.map((p) => ({ kind: "project", slug: p.slug, path: "/project", query: "?slug=" + p.slug, template: "project.html", out: `_prerendered/project/${p.slug}.html` })),
    ...D.blogsData.map((b) => ({ kind: "blog", slug: b.slug, path: "/blog", query: "?slug=" + b.slug, template: "blog.html", out: `_prerendered/blog/${b.slug}.html` })),
  ];
}

/* vercel.json rewrites that map /project?slug=x -> its prerendered file */
function rewritesFor(D) {
  return dynamicRoutes(D).map((r) => ({
    source: r.path,
    has: [{ type: "query", key: "slug", value: r.slug }],
    destination: "/" + r.out,
  }));
}

module.exports = { ROOT, loadSiteData, STATIC_ROUTES, dynamicRoutes, rewritesFor };
