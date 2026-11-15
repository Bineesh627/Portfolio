/* certifications.js — credentials page with category filter + pan/zoom lightbox */
(function () {
  'use strict';
  var S = window.Site, D = S.data, ic = S.ic, esc = S.esc;

  var FALLBACK = 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&q=80&w=800';
  var FILTERS = D.profile.certificationFilters;
  var selected = 'all';

  function cardsHtml() {
    var list = selected === 'all'
      ? D.certificationsData
      : D.certificationsData.filter(function (c) { return c.categories && c.categories.indexOf(selected) !== -1; });

    return list.map(function (c) {
      return '<div class="col-md-6 col-lg-4"><div class="card-x hoverable cert-card">' +
        '<div class="cert-img" data-img="' + c.image + '">' +
          '<img src="' + c.image + '" alt="' + esc(c.title) + '" loading="lazy" onerror="this.src=\'' + FALLBACK + '\'">' +
          '<div class="ov">' + ic('zoom-in', 24) + '<span>View certificate</span></div>' +
        '</div>' +
        '<div class="cert-body">' +
          '<div class="cert-issuer">' + ic('award', 14) + esc(c.issuer) + '</div>' +
          '<h3>' + esc(c.title) + '</h3>' +
          (c.certificateId ? '<div class="cert-id">ID: ' + esc(c.certificateId) + '</div>' : '') +
          '<p>' + esc(c.description) + '</p>' +
          '<div class="cert-date">' + ic('calendar', 14) + '<span>' + esc(c.completionDate) + '</span></div>' +
        '</div></div></div>';
    }).join('');
  }

  function paintGrid() {
    var grid = document.getElementById('certs-grid');
    grid.innerHTML = cardsHtml();
    grid.querySelectorAll('.cert-img').forEach(function (w) {
      w.addEventListener('click', function () { openLightbox(w.getAttribute('data-img')); });
    });
    S.refreshIcons();
  }

  /* ---------- lightbox with wheel zoom, drag pan and pinch (react-zoom-pan-pinch replacement) ---------- */
  var scale = 1, tx = 0, ty = 0;
  var MIN = 0.5, MAX = 4;

  function apply() {
    var c = document.getElementById('lb-content');
    if (c) c.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + scale + ')';
  }

  function openLightbox(src) {
    scale = 1; tx = 0; ty = 0;
    var ov = document.createElement('div');
    ov.className = 'lb';
    ov.id = 'lb-overlay';
    ov.innerHTML =
      '<button class="lb-close" aria-label="Close">' + ic('x', 20) + '</button>' +
      '<div class="lb-pan"><div class="inner" id="lb-content">' +
      '<img src="' + src + '" alt="Certificate full screen view" draggable="false" onerror="this.src=\'' + FALLBACK + '\'"></div></div>' +
      '<div class="lb-hint">Scroll to zoom · drag to move · double-click to reset</div>';
    document.body.appendChild(ov);
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    S.refreshIcons();

    var content = ov.querySelector('#lb-content');
    content.style.transformOrigin = 'center center';
    var wrap = ov.querySelector('.lb-pan');

    function close() {
      ov.remove();
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    }
    function onKey(e) { if (e.key === 'Escape') close(); }
    document.addEventListener('keydown', onKey);

    ov.querySelector('.lb-close').addEventListener('click', function (e) { e.stopPropagation(); close(); });
    wrap.addEventListener('click', function (e) { if (e.target === wrap) close(); });

    // wheel zoom
    wrap.addEventListener('wheel', function (e) {
      e.preventDefault();
      var f = e.deltaY < 0 ? 1.12 : 1 / 1.12;
      scale = Math.min(MAX, Math.max(MIN, scale * f));
      apply();
    }, { passive: false });

    // double-click toggles zoom
    wrap.addEventListener('dblclick', function () {
      if (scale > 1) { scale = 1; tx = 0; ty = 0; } else { scale = 2; }
      apply();
    });

    // pointer drag + two-finger pinch
    var pointers = {}, lastDist = 0, dragging = false, lx = 0, ly = 0;
    wrap.addEventListener('pointerdown', function (e) {
      pointers[e.pointerId] = e;
      wrap.setPointerCapture(e.pointerId);
      if (Object.keys(pointers).length === 1) { dragging = true; lx = e.clientX; ly = e.clientY; }
      if (Object.keys(pointers).length === 2) {
        var p = Object.keys(pointers).map(function (k) { return pointers[k]; });
        lastDist = Math.hypot(p[0].clientX - p[1].clientX, p[0].clientY - p[1].clientY);
        dragging = false;
      }
    });
    wrap.addEventListener('pointermove', function (e) {
      if (!pointers[e.pointerId]) return;
      pointers[e.pointerId] = e;
      var keys = Object.keys(pointers);
      if (keys.length === 2) {
        var p = keys.map(function (k) { return pointers[k]; });
        var d = Math.hypot(p[0].clientX - p[1].clientX, p[0].clientY - p[1].clientY);
        if (lastDist) { scale = Math.min(MAX, Math.max(MIN, scale * (d / lastDist))); apply(); }
        lastDist = d;
      } else if (dragging) {
        tx += e.clientX - lx; ty += e.clientY - ly; lx = e.clientX; ly = e.clientY; apply();
      }
    });
    function endPointer(e) { delete pointers[e.pointerId]; dragging = false; lastDist = 0; }
    wrap.addEventListener('pointerup', endPointer);
    wrap.addEventListener('pointercancel', endPointer);
  }

  function render() {
    S.setMetadata(D.pagesMetadata.certifications);
    document.getElementById('app').innerHTML =
      '<section class="section page-top"><div class="container">' +
        '<div class="section-head"><span class="eyebrow">Credentials</span>' +
        '<h1 class="section-title">Professional Certifications</h1>' +
        '<p class="section-sub">Verified academic achievements and developer certifications</p></div>' +
        '<div class="pill-tabs">' +
          FILTERS.map(function (f) { return '<button type="button" class="pill-tab' + (f.key === selected ? ' active' : '') + '" data-key="' + f.key + '">' + esc(f.label) + '</button>'; }).join('') +
        '</div>' +
        '<div class="row g-4" id="certs-grid"></div>' +
      '</div></section>';

    var tabs = document.querySelectorAll('.pill-tab');
    tabs.forEach(function (b) {
      b.addEventListener('click', function () {
        selected = b.getAttribute('data-key');
        tabs.forEach(function (x) { x.classList.toggle('active', x === b); });
        paintGrid();
      });
    });
    paintGrid();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
})();
