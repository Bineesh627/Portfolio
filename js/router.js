/* =====================================================================
   router.js - client-side router (History API).
   The nav, footer and chat widget are drawn once; navigating only swaps
   the content of <main id="app">, so there is no page reload and no
   re-download / re-parse of scripts.

   Routes map a URL path to a page registered with Site.page(name, fn).
   Pages that start timers / listeners register Site.cleanup(fn) and the
   router runs those before leaving the page.
   ===================================================================== */
(function () {
  'use strict';
  var S = window.Site;

  var ROUTES = {
    '/': 'home', '/projects': 'projects', '/project': 'project',
    '/blogs': 'blogs', '/blog': 'blog', '/certifications': 'certifications', '/contact': 'contact'
  };

  var cleanups = [];
  var first = true;

  S.cleanup = function (fn) { cleanups.push(fn); };

  /* opened straight from disk (file://) there is no server, so map the file name to a route */
  var FILE_MODE = location.protocol === 'file:';
  var FILE_ROUTE = { 'index.html': '/', 'projects.html': '/projects', 'project.html': '/project', 'blogs.html': '/blogs', 'blog.html': '/blog', 'certifications.html': '/certifications', 'contact.html': '/contact' };
  function currentPath() {
    return FILE_MODE ? (FILE_ROUTE[location.pathname.split('/').pop()] || '/') : normalize(location.pathname);
  }

  function normalize(p) {
    p = p.replace(/\/index\.html$/, '/').replace(/\.html$/, '');
    if (p.length > 1) p = p.replace(/\/+$/, '');
    return p || '/';
  }

  function runCleanups() {
    while (cleanups.length) { try { cleanups.pop()(); } catch (e) { if (window.console) console.error(e); } }
    // lightboxes appended to <body> by pages
    document.querySelectorAll('body > .lb').forEach(function (n) { n.remove(); });
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }

  function notFound() {
    S.setMetadata({ title: 'Page not found', description: 'The page you are looking for does not exist.' });
    document.getElementById('app').innerHTML = S.notFoundWindow({
      backHref: '/', heading: 'Page not found',
      message: 'The page you are looking for does not exist.', btnLabel: 'Back to home'
    });
  }

  function render() {
    var name = ROUTES[currentPath()];
    var host = document.getElementById('app');
    runCleanups();

    try {
      if (name && S.pages[name]) S.pages[name](); else notFound();
    } catch (e) {
      if (window.console) console.error(e);
      host.innerHTML = '<div class="container page-top pb-5"><div class="card-x nf"><h2 class="mb-2">Something went wrong</h2>' +
        '<p class="text-muted mb-4">Please reload the page.</p><a href="/" class="btn-brand">Back to home</a></div></div>';
    }

    S.setActive(name || '');
    host.classList.remove('page-in'); void host.offsetWidth; host.classList.add('page-in');

    if (!first && typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', { page_title: document.title, page_location: location.href, page_path: location.pathname + location.search });
    }
    first = false;
  }

  function scrollTop() { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }

  function go(url, replace) {
    var cur = location.pathname + location.search;
    try { history.replaceState({ y: window.scrollY }, '', location.href); } catch (e) {}
    var u = new URL(url, location.href);
    if (u.pathname + u.search === cur && !replace) {            // same page: just go to top / anchor
      if (u.hash && document.querySelector(u.hash)) document.querySelector(u.hash).scrollIntoView(); else scrollTop();
      return;
    }
    history[replace ? 'replaceState' : 'pushState']({ y: 0 }, '', u.pathname + u.search + u.hash);
    render();
    if (u.hash && document.querySelector(u.hash)) document.querySelector(u.hash).scrollIntoView(); else scrollTop();
  }
  S.navigate = go;

  /* intercept clicks on internal links */
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return;
    if (FILE_MODE) return;                       // no server: let the browser follow links normally
    var u;
    try { u = new URL(a.href, location.href); } catch (err) { return; }
    if (u.origin !== location.origin || !(normalize(u.pathname) in ROUTES)) return;   // external, /llms.txt, etc.
    e.preventDefault();
    go(u.pathname + u.search + u.hash);
  });

  /* back / forward */
  window.addEventListener('popstate', function (e) {
    render();
    var y = e.state && e.state.y;
    window.scrollTo({ top: y || 0, left: 0, behavior: 'instant' });
  });
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  S.router = { start: function () { S.boot(); render(); }, render: render };
})();
