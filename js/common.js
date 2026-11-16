/* =====================================================================
   common.js — shared layout (navbar, footer, cursor), metadata helper,
   icon helper and card tilt effect. Runs on every page.
   ===================================================================== */
(function () {
  'use strict';

  var D = window.SITE_DATA;
  var P = D.profile;
  var BASE_URL = P.baseUrl;

  /* ---------- tiny helpers ---------- */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // Inline SVG icon from the generated set (js/icons.js). No icon library at runtime.
  function ic(name, size, cls, extra) {
    size = size || 16;
    var body = (window.SITE_ICONS || {})[name];
    if (!body) { if (window.console) console.warn('Missing icon:', name); return ''; }
    return '<svg xmlns="http://www.w3.org/2000/svg" class="lucide' + (cls ? ' ' + cls : '') + '" width="' + size + '" height="' + size +
      '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"' +
      (extra ? ' ' + extra : '') + '>' + body + '</svg>';
  }

  function refreshIcons() { /* icons are already inline SVG; kept so page scripts need no change */ }

  // Brand icons not present in Lucide (from react-icons: Simple Icons / Font Awesome)
  var BRAND = {
    instagram: function (s) {
      return '<svg fill="currentColor" role="img" viewBox="0 0 24 24" height="' + s + '" width="' + s + '" xmlns="http://www.w3.org/2000/svg"><path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"></path></svg>';
    },
    facebook: function (s) {
      return '<svg fill="currentColor" role="img" viewBox="0 0 24 24" height="' + s + '" width="' + s + '" xmlns="http://www.w3.org/2000/svg"><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"></path></svg>';
    },
    youtube: function (s) {
      return '<svg fill="currentColor" role="img" viewBox="0 0 24 24" height="' + s + '" width="' + s + '" xmlns="http://www.w3.org/2000/svg"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path></svg>';
    },
    linkedin: function (s) {
      return '<svg fill="currentColor" role="img" viewBox="0 0 24 24" height="' + s + '" width="' + s + '" xmlns="http://www.w3.org/2000/svg"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path></svg>';
    },
    huggingface: function (s) {
      return '<svg stroke="currentColor" fill="currentColor" stroke-width="0" role="img" viewBox="0 0 24 24" height="' + s + '" width="' + s + '" xmlns="http://www.w3.org/2000/svg"><path d="M12.025 1.13c-5.77 0-10.449 4.647-10.449 10.378 0 1.112.178 2.181.503 3.185.064-.222.203-.444.416-.577a.96.96 0 0 1 .524-.15c.293 0 .584.124.84.284.278.173.48.408.71.694.226.282.458.611.684.951v-.014c.017-.324.106-.622.264-.874s.403-.487.762-.543c.3-.047.596.06.787.203s.31.313.4.467c.15.257.212.468.233.542.01.026.653 1.552 1.657 2.54.616.605 1.01 1.223 1.082 1.912.055.537-.096 1.059-.38 1.572.637.121 1.294.187 1.967.187.657 0 1.298-.063 1.921-.178-.287-.517-.44-1.041-.384-1.581.07-.69.465-1.307 1.081-1.913 1.004-.987 1.647-2.513 1.657-2.539.021-.074.083-.285.233-.542.09-.154.208-.323.4-.467a1.08 1.08 0 0 1 .787-.203c.359.056.604.29.762.543s.247.55.265.874v.015c.225-.34.457-.67.683-.952.23-.286.432-.52.71-.694.257-.16.547-.284.84-.285a.97.97 0 0 1 .524.151c.228.143.373.388.43.625l.006.04a10.3 10.3 0 0 0 .534-3.273c0-5.731-4.678-10.378-10.449-10.378M8.327 6.583a1.5 1.5 0 0 1 .713.174 1.487 1.487 0 0 1 .617 2.013c-.183.343-.762-.214-1.102-.094-.38.134-.532.914-.917.71a1.487 1.487 0 0 1 .69-2.803m7.486 0a1.487 1.487 0 0 1 .689 2.803c-.385.204-.536-.576-.916-.71-.34-.12-.92.437-1.103.094a1.487 1.487 0 0 1 .617-2.013 1.5 1.5 0 0 1 .713-.174m-10.68 1.55a.96.96 0 1 1 0 1.921.96.96 0 0 1 0-1.92m13.838 0a.96.96 0 1 1 0 1.92.96.96 0 0 1 0-1.92M8.489 11.458c.588.01 1.965 1.157 3.572 1.164 1.607-.007 2.984-1.155 3.572-1.164.196-.003.305.12.305.454 0 .886-.424 2.328-1.563 3.202-.22-.756-1.396-1.366-1.63-1.32q-.011.001-.02.006l-.044.026-.01.008-.03.024q-.018.017-.035.036l-.032.04a1 1 0 0 0-.058.09l-.014.025q-.049.088-.11.19a1 1 0 0 1-.083.116 1.2 1.2 0 0 1-.173.18q-.035.029-.075.058a1.3 1.3 0 0 1-.251-.243 1 1 0 0 1-.076-.107c-.124-.193-.177-.363-.337-.444-.034-.016-.104-.008-.2.022-.35.12-1.058.618-1.378 1.264-1.14-.874-1.563-2.316-1.563-3.202 0-.334.109-.457.305-.454m.84 3.17c.11 0 .207.025.296.075.072.04.14.098.19.17.08.113.149.28.264.411.114.13.3.246.504.284.14.026.285 0 .43-.045a2.5 2.5 0 0 0 .59-.296c.043-.03.087-.052.138-.07.214-.074.45-.04.673.073.31.157.572.469.731.912.082.226.103.445.052.65-.082.327-.31.567-.672.771-.234.133-.474.184-.7.184-.45 0-.805-.2-1.056-.407-.208-.172-.37-.4-.546-.65-.184-.26-.378-.553-.659-.736-.132-.086-.286-.14-.457-.14s-.325.054-.457.14c-.28.183-.475.476-.659.736-.176.25-.338.478-.546.65-.25.207-.606.407-1.056.407-.226 0-.466-.051-.7-.184-.363-.204-.59-.444-.672-.771-.051-.205-.03-.424.052-.65.16-.443.42-.755.731-.912.222-.113.459-.147.673-.073a.8.8 0 0 1 .138.07c.153.108.357.203.59.296.145.045.29.07.43.045.204-.038.39-.154.504-.284.115-.131.184-.298.264-.411a.7.7 0 0 1 .19-.17.6.6 0 0 1 .296-.075"></path></svg>';
    },
    whatsapp: function (s) {
      return '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="' + s + '" width="' + s + '" xmlns="http://www.w3.org/2000/svg"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"></path></svg>';
    }
  };

  /* ---------- page metadata (port of useMetadata) ---------- */
  function setMetadata(opts) {
    opts = opts || {};
    var title = opts.title, description = opts.description, keywords = opts.keywords,
        image = opts.image, type = opts.type || 'website';
    var baseTitle = P.baseTitle;
    var fullTitle = title ? title + ' | ' + P.name : baseTitle;
    document.title = fullTitle;

    function metaTag(attr, val, content) {
      if (content === undefined || content === null) return;
      var el = document.querySelector('meta[' + attr + '="' + val + '"]');
      if (!el) { el = document.createElement('meta'); el.setAttribute(attr, val); document.head.appendChild(el); }
      el.setAttribute('content', content);
    }
    function linkTag(rel, href) {
      if (!href) return;
      var el = document.querySelector('link[rel="' + rel + '"]');
      if (!el) { el = document.createElement('link'); el.setAttribute('rel', rel); document.head.appendChild(el); }
      el.setAttribute('href', href);
    }

    var defaults = D.pagesMetadata.home;
    var currentUrl = BASE_URL + location.pathname + location.search;
    var desc = description || defaults.description;
    var kw = keywords || defaults.keywords;
    var img = image
      ? (/^https?:/.test(image) ? image : BASE_URL + '/' + String(image).replace(/^\//, ''))
      : '';

    metaTag('name', 'description', desc);
    metaTag('name', 'keywords', kw);
    metaTag('property', 'og:title', fullTitle);
    metaTag('property', 'og:description', desc);
    metaTag('property', 'og:image', img || null);
    metaTag('property', 'og:url', currentUrl);
    metaTag('property', 'og:type', type);
    metaTag('property', 'twitter:title', fullTitle);
    metaTag('property', 'twitter:description', desc);
    metaTag('property', 'twitter:image', img || null);
    metaTag('property', 'twitter:url', currentUrl);
    linkTag('canonical', currentUrl);
  }

  function formatLongDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  // "DELIVERY_CYCLE" -> "Delivery Cycle"
  function humanize(str) {
    return String(str == null ? '' : str).replace(/_/g, ' ').toLowerCase().replace(/(^|\s)\S/g, function (c) { return c.toUpperCase(); });
  }

  /* ---------- NAV BAR ---------- */
  var NAV = [
    { key: 'home', href: '/', label: 'Home' },
    { key: 'projects', href: '/projects', label: 'Projects' },
    { key: 'certifications', href: '/certifications', label: 'Certifications' },
    { key: 'blogs', href: '/blogs', label: 'Blog' },
    { key: 'contact', href: '/contact', label: 'Contact' }
  ];

  function renderNav(active) {
    var links = NAV.map(function (n) {
      return '<li class="nav-item"><a class="nav-link' + (active === n.key ? ' active' : '') + '" href="' + n.href + '"' + (active === n.key ? ' aria-current="page"' : '') + '>' + n.label + '</a></li>';
    }).join('');
    return '' +
      '<nav class="navbar navbar-expand-lg site-nav">' +
        '<div class="container">' +
          '<a class="navbar-brand" href="/"><span class="brand-mark">' + esc(P.brandInitial) + '</span>' + esc(P.name) + '</a>' +
          '<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">' + ic('menu', 20) + '</button>' +
          '<div class="collapse navbar-collapse" id="mainNav">' +
            '<ul class="navbar-nav mx-auto mb-2 mb-lg-0">' + links + '</ul>' +
            '<div class="nav-actions d-flex align-items-center gap-2">' +
              '<button class="theme-toggle" id="theme-toggle" type="button" aria-label="Toggle light or dark theme">' + ic('sun', 18, 'icon-sun') + ic('moon', 18, 'icon-moon') + '</button>' +
              '<button class="theme-toggle" id="install-btn" type="button" hidden aria-label="Install app" title="Install app">' + ic('download', 18) + '</button>' +
              '<a href="/contact" class="btn-brand">Let’s talk</a>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</nav>';
  }

  /* ---------- THEME ---------- */
  function initTheme() {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      document.documentElement.setAttribute('data-bs-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  /* ---------- FOOTER ---------- */
  function socialIcon(key, size) {
    return BRAND[key] ? BRAND[key](size) : ic(key, size);
  }

  function socialRow(size) {
    return '<div class="social-row">' + P.socials.map(function (s) {
      return '<a href="' + s.url + '" target="_blank" rel="noopener noreferrer" class="social-link social-' + esc(s.icon) + '" aria-label="' + esc(s.label) + '" title="' + esc(s.label) + '">' + socialIcon(s.icon, size) + '</a>';
    }).join('') + '</div>';
  }

  function renderFooter() {
    return '' +
      '<footer class="site-footer"><div class="container">' +
        '<div class="row g-5">' +
          '<div class="col-lg-5">' +
            '<a class="navbar-brand d-inline-flex mb-3" href="/"><span class="brand-mark">' + esc(P.brandInitial) + '</span>' + esc(P.name) + '</a>' +
            '<p class="text-muted" style="max-width:420px">' + esc(P.footer.tagline) + '</p>' +
            socialRow(18) +
          '</div>' +
          '<div class="col-6 col-lg-3 offset-lg-1"><h5>Navigate</h5><ul class="footer-links">' +
            NAV.map(function (n) { return '<li><a href="' + n.href + '">' + n.label + '</a></li>'; }).join('') +
            '<li><a href="llms.txt" target="_blank" rel="noopener noreferrer">AI Learning Agent</a></li>' +
          '</ul></div>' +
          '<div class="col-6 col-lg-3"><h5>Contact</h5><ul class="footer-links">' +
            '<li><a href="mailto:' + esc(P.email) + '">' + esc(P.email) + '</a></li>' +
            '<li><a href="' + esc(P.phoneLink) + '">' + esc(P.phoneDisplay) + '</a></li>' +
            '<li><span class="text-muted">' + esc(P.location) + '</span></li>' +
          '</ul></div>' +
        '</div>' +
        '<div class="footer-bottom"><span>© ' + new Date().getFullYear() + ' ' + esc(P.name) + '. All rights reserved.</span><span>' + esc(P.footer.builtWith) + '</span></div>' +
      '</div></footer>';
  }

  /* ---------- 404 card used by detail pages ---------- */
  function notFoundWindow(opts) {
    return '<div class="container page-top pb-5"><div class="card-x nf">' +
      ic('circle-alert', 52, 'big') +
      '<h2 class="mb-2">' + opts.heading + '</h2>' +
      '<p class="text-muted mb-4">' + opts.message + '</p>' +
      '<a href="' + opts.backHref + '" class="btn-brand">' + ic('arrow-left', 16) + ' ' + opts.btnLabel + '</a>' +
    '</div></div>';
  }

  /* ---------- active nav link (called by the router on every navigation) ---------- */
  var NAV_OF = { home: 'home', projects: 'projects', project: 'projects', certifications: 'certifications', blogs: 'blogs', blog: 'blogs', contact: 'contact' };
  function setActive(page) {
    var key = NAV_OF[page] || '';
    document.querySelectorAll('.site-nav .nav-link').forEach(function (a, i) {
      var on = NAV[i] && NAV[i].key === key;
      a.classList.toggle('active', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    var menu = document.getElementById('mainNav');           // close the mobile menu after navigating
    if (menu && menu.classList.contains('show')) {
      menu.classList.remove('show');
      var t = document.querySelector('.navbar-toggler'); if (t) { t.setAttribute('aria-expanded', 'false'); t.classList.add('collapsed'); }
    }
  }

  /* ---------- mobile menu toggle (replaces the 80 KB Bootstrap JS bundle) ---------- */
  function initNavToggle() {
    var t = document.querySelector('.navbar-toggler'), menu = document.getElementById('mainNav');
    if (!t || !menu) return;
    t.addEventListener('click', function () {
      var open = menu.classList.toggle('show');
      t.setAttribute('aria-expanded', open ? 'true' : 'false');
      t.classList.toggle('collapsed', !open);
    });
  }

  /* ---------- "Install app" button (PWA) ---------- */
  var installEvent = null;
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault(); installEvent = e;
    var b = document.getElementById('install-btn'); if (b) b.hidden = false;
  });
  window.addEventListener('appinstalled', function () {
    installEvent = null; var b = document.getElementById('install-btn'); if (b) b.hidden = true;
  });
  function initInstall() {
    var b = document.getElementById('install-btn'); if (!b) return;
    b.hidden = !installEvent;
    b.addEventListener('click', function () {
      if (!installEvent) return;
      installEvent.prompt();
      installEvent.userChoice.then(function () { installEvent = null; b.hidden = true; });
    });
  }

  /* ---------- page registry + cleanup (used by router.js and the page scripts) ---------- */
  var pages = {};
  function page(name, fn) { pages[name] = fn; }

  /* ---------- boot: draw nav + footer ONCE; the router swaps only <main> ---------- */
  function boot() {
    var navHost = document.getElementById('site-nav');
    var footHost = document.getElementById('site-footer');
    if (navHost) navHost.innerHTML = renderNav('');
    if (footHost) footHost.innerHTML = renderFooter();
    initTheme(); initNavToggle(); initInstall();
  }

  window.Site = {
    data: D, esc: esc, ic: ic, brand: BRAND, refreshIcons: refreshIcons, setMetadata: setMetadata,
    formatLongDate: formatLongDate, humanize: humanize, socialRow: socialRow, notFoundWindow: notFoundWindow,
    pages: pages, page: page, setActive: setActive, boot: boot
  };
})();
