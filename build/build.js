#!/usr/bin/env node
/* =====================================================================
   build/build.js  -  run:  cd build && npm install && npm run build

   Produces the files the website actually loads:
     js/icons.js   only the Lucide icons the site uses (not the 368 KB library)
     js/app.js     icons + all data + common + router + pages + chat widget, minified
     css/app.css   style.css + chat-widget.css, minified
   and stamps a fresh cache version into sw.js.

   Edit the SOURCE files (data/*, js/*.js, css/style.css ...), then rebuild.
   ===================================================================== */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const esbuild = require("esbuild");

const ROOT = path.join(__dirname, "..");
const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");
const write = (p, s) => fs.writeFileSync(path.join(ROOT, p), s);

/* ---------- 1. icons ---------- */
const BRAND = new Set(["instagram", "facebook", "youtube", "linkedin", "huggingface", "whatsapp"]);

function walk(dir) {
  return fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
}

const sources = [...walk("js"), ...walk("data")].filter(
  (f) => f.endsWith(".js") && !/(^|[\\/])js[\\/](app|icons)\.js$/.test(f) && !/loader\.js$/.test(f));

const names = new Set(JSON.parse(read("build/icons-extra.json")));
for (const f of sources) {
  const src = read(f);
  for (const m of src.matchAll(/\bic\(\s*['"]([a-z0-9-]+)['"]/g)) names.add(m[1]);
  for (const m of src.matchAll(/\bicon:\s*['"]([a-z0-9-]+)['"]/g)) names.add(m[1]);
}

const legacy = JSON.parse(read("build/icons-legacy.json"));
const iconDir = path.join(path.dirname(require.resolve("lucide-static/package.json")), "icons");
const icons = {};
const missing = [];
for (const n of [...names].sort()) {
  if (BRAND.has(n)) continue;
  const file = path.join(iconDir, n + ".svg");
  if (fs.existsSync(file)) {
    icons[n] = fs.readFileSync(file, "utf8")
      .replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>[\s\S]*$/, "").replace(/\s*\n\s*/g, "");
  } else if (legacy[n]) icons[n] = legacy[n];
  else missing.push(n);
}
if (missing.length) console.warn("WARNING: icons not found:", missing.join(", "));
write("js/icons.js", "window.SITE_ICONS=" + JSON.stringify(icons) + ";\n");
console.log("icons:", Object.keys(icons).length);

/* ---------- 2. javascript bundle ---------- */
const dataFiles = [...read("data/loader.js").matchAll(/"(data\/[^"]+\.js)"/g)].map((m) => m[1]);
const order = [
  "js/icons.js",
  ...dataFiles,
  "js/common.js", "js/router.js",
  "js/home.js", "js/projects.js", "js/project.js", "js/blogs.js", "js/blog.js",
  "js/certifications.js", "js/contact.js",
  "js/chat-widget.js", "js/boot.js",
];
const js = "window.SITE_DATA={projectsData:[],blogsData:[]};\n" +
  order.map((f) => `/* ${f} */\n${read(f)}\n;`).join("\n");
const jsOut = esbuild.transformSync(js, { minify: true, target: "es2018", legalComments: "none" }).code;
write("js/app.js", jsOut);

/* ---------- 3. css bundle ---------- */
const css = ["css/style.css", "css/chat-widget.css"].map(read).join("\n");
const cssOut = esbuild.transformSync(css, { loader: "css", minify: true }).code;
write("css/app.css", cssOut);

/* ---------- 4. cache version for the service worker ---------- */
const version = crypto.createHash("sha1").update(jsOut + cssOut).digest("hex").slice(0, 10);
write("sw.js", read("sw.js").replace(/const VERSION = '[^']*';/, `const VERSION = '${version}';`));

const kb = (s) => (Buffer.byteLength(s) / 1024).toFixed(1) + " KB";
console.log(`app.js ${kb(jsOut)} | app.css ${kb(cssOut)} | sw cache version ${version}`);
