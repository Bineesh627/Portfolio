/* boot.js - starts the app once the DOM is ready and registers the service worker. */
(function () {
  'use strict';

  function start() {
    window.Site.router.start();
    if (location.protocol === 'file:') {
      var n = document.createElement('div');
      n.setAttribute('style', 'position:fixed;left:12px;right:12px;bottom:12px;z-index:9999;padding:12px 16px;border-radius:12px;background:#1d1f3a;color:#fff;font:14px/1.5 system-ui,sans-serif;box-shadow:0 8px 30px rgba(0,0,0,.4)');
      n.innerHTML = '<strong>Preview mode.</strong> You opened this file directly, so links and the app features need a local server. Run <code style="color:#c084fc">node dev-server.js</code> in this folder and open <code style="color:#c084fc">http://localhost:3000</code>. <a href="#" style="color:#fff;margin-left:8px">Dismiss</a>';
      n.querySelector('a').addEventListener('click', function (e) { e.preventDefault(); n.remove(); });
      document.body.appendChild(n);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();

  /* offline support + instant repeat visits */
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js').catch(function (e) { if (window.console) console.warn('SW registration failed', e); });
    });
  }
})();
