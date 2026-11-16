/* =====================================================================
   sw.js - service worker (offline + fast repeat visits).
   VERSION is rewritten by build/build.js, which clears old caches.

   - HTML / JS / CSS / JSON : network first (always fresh), cache as fallback
   - images, vendor, fonts   : cache first (instant), refreshed in background
   - Offline navigation      : every route falls back to the cached app shell
   ===================================================================== */
const VERSION = '93df890cf9';
const CORE = 'core-' + VERSION;
const RUNTIME = 'runtime-' + VERSION;
const MAX_RUNTIME_ENTRIES = 120;

const PRECACHE = [
  '/', '/css/app.css', '/js/app.js', '/vendor/bootstrap.min.css', '/manifest.json', '/favicon.svg',
  '/assets/img/pwa/icon-192.png', '/assets/img/profile/profile-pic.webp'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CORE).then((c) => Promise.all(PRECACHE.map((u) => c.add(u).catch(() => {})))).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CORE && k !== RUNTIME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

async function trim(cacheName, max) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > max) await Promise.all(keys.slice(0, keys.length - max).map((k) => cache.delete(k)));
}

async function networkFirst(request, cacheName, fallbackUrl) {
  const cache = await caches.open(cacheName);
  try {
    const res = await fetch(request);
    if (res && res.ok) cache.put(request, res.clone());
    return res;
  } catch (err) {
    const hit = (await cache.match(request, { ignoreSearch: true })) || (await caches.match(request, { ignoreSearch: true }));
    if (hit) return hit;
    if (fallbackUrl) { const shell = await caches.match(fallbackUrl); if (shell) return shell; }
    return new Response('Offline', { status: 503, statusText: 'Offline' });
  }
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(request);
  if (hit) {
    fetch(request).then((res) => { if (res && (res.ok || res.type === 'opaque')) cache.put(request, res); }).catch(() => {});
    return hit;
  }
  try {
    const res = await fetch(request);
    if (res && (res.ok || res.type === 'opaque')) { cache.put(request, res.clone()); trim(cacheName, MAX_RUNTIME_ENTRIES); }
    return res;
  } catch (err) {
    return new Response('', { status: 504 });
  }
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // page navigations -> network first, fall back to the cached shell (the app routes by URL)
  if (req.mode === 'navigate') { event.respondWith(networkFirst(req, CORE, '/')); return; }

  if (url.origin === self.location.origin) {
    if (/\.(?:js|css|json|html|txt|xml)$/.test(url.pathname) && !url.pathname.startsWith('/vendor/')) {
      event.respondWith(networkFirst(req, CORE)); return;
    }
    event.respondWith(cacheFirst(req, url.pathname.startsWith('/vendor/') ? CORE : RUNTIME)); return;
  }

  // Google Fonts + project images hosted elsewhere
  if (/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname) || url.hostname === 'images.unsplash.com') {
    event.respondWith(cacheFirst(req, RUNTIME));
  }
  // everything else (analytics, the AI worker) goes straight to the network
});
