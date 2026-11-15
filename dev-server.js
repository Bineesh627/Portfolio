// Zero-dependency local server that behaves like Vercel (clean URLs, 404.html).
//   node dev-server.js          -> http://localhost:3000
const http = require("http"), fs = require("fs"), path = require("path");
const PORT = process.env.PORT || 3000, ROOT = __dirname;
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".webmanifest": "application/manifest+json", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml",
  ".webp": "image/webp", ".txt": "text/plain", ".xml": "application/xml", ".ico": "image/x-icon" };
http.createServer((req, res) => {
  const p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  let file = path.join(ROOT, p);
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  if (p.endsWith("/")) file = path.join(file, "index.html");
  else if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) file = fs.existsSync(file + ".html") ? file + ".html" : null;
  let code = 200;
  if (!file) { file = path.join(ROOT, "404.html"); code = 404; }
  res.writeHead(code, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream", "Cache-Control": "no-cache" });
  fs.createReadStream(file).pipe(res);
}).listen(PORT, () => console.log("Portfolio running at http://localhost:" + PORT));
