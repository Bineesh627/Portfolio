# Bineesh S — Developer Portfolio (HTML · CSS · JavaScript · Bootstrap 5)

Static site, no build step: open `index.html` or serve the folder (`python3 -m http.server`).

- Pages: `index.html`, `projects.html`, `project.html?id=N`, `certifications.html`, `blogs.html`, `blog.html?slug=...`, `contact.html`
- `data/` – ALL site content (see `data/README.md` for how to add projects, blogs, skills…). Don't edit `js/` to change content.
- `js/common.js` – navbar, theme switch (light/dark), footer, metadata · `js/<page>.js` – one script per page
- `css/style.css` – the whole theme; colours, fonts and spacing are CSS variables at the top (`:root` / `[data-theme="dark"]`)
- `vendor/` – Bootstrap 5.3.3 and Lucide icons (local copies)
- `js/chat-widget.js` + `data/chatbot.js` – live AI chat (calls the Cloudflare Worker in `worker/`; set `workerUrl` in `data/chatbot.js`). See `worker/README.md`.

## Web app (SPA + PWA)
The site is now a single-load web app:
- `js/router.js` swaps only the page content on navigation (no reloads); nav, footer and chat stay mounted.
- `sw.js` + `manifest.json` make it installable and usable offline.
- The browser loads ONE script (`js/app.js`) and ONE stylesheet (`css/app.css`), both generated.

**After editing any source file (data/*, js/*.js, css/*.css) rebuild before deploying:**

    cd build && npm install && npm run build

Do not edit `js/app.js`, `js/icons.js` or `css/app.css` by hand; they are overwritten by the build.
New icon names are picked up automatically from `ic('name')` / `icon: "name"`.

## Run locally
Do not double-click `index.html` (browsers block the manifest and service worker on `file://`). Instead:

    node dev-server.js        # then open http://localhost:3000
