/* Copies only the site files into /public (the folder Vercel serves), then prerenders the pages. */
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const out = path.join(root, "public");
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out);
const items = [".well-known", "assets", "css", "data", "js", "vendor",
  "404.html", "blog.html", "blogs.html", "certifications.html", "contact.html", "index.html", "project.html", "projects.html",
  "favicon.svg", "google205fe98f277c14e1.html", "llms.txt", "manifest.json", "robots.txt", "sitemap.xml", "sw.js"];
for (const it of items) {
  const src = path.join(root, it);
  if (fs.existsSync(src)) fs.cpSync(src, path.join(out, it), { recursive: true });
  else console.warn("missing:", it);
}
console.log("public/ ready:", fs.readdirSync(out).length, "entries");
require("./prerender");   // fills <main> of every public route with real HTML (see prerender.js)
