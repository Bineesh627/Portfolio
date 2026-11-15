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
    var touch = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    var ov = document.createElement('div');
    ov.className = 'lb';
    ov.id = 'lb-overlay';
    ov.setAttribute('role', 'dialog');
    ov.setAttribute('aria-label', 'Certificate full screen view');
    ov.innerHTML =
      '<button class="lb-close" aria-label="Close">' + ic('x', 20) + '</button>' +
      '<div class="lb-pan"><div class="inner" id="lb-content">' +
      '<img src="' + src + '" alt="Certificate full screen view" draggable="false" onerror="this.src=\'' + FALLBACK + '\'"></div></div>' +
      '<div class="lb-hint">' + (touch ? 'Pinch to zoom · drag to move · double-tap to reset' : 'Scroll to zoom · drag to move · double-click to reset') + '</div>' +
      '<div class="lb-tools" role="group" aria-label="Zoom controls">' +
        '<button type="button" data-z="out" aria-label="Zoom out">' + ic('zoom-out', 20) + '</button>' +
        '<span class="lb-zoom" id="lb-zoom">100%</span>' +
        '<button type="button" data-z="in" aria-label="Zoom in">' + ic('zoom-in', 20) + '</button>' +
        '<button type="button" data-z="reset" aria-label="Reset zoom">' + ic('rotate-ccw', 18) + '</button>' +
      '</div>';
    document.body.appendChild(ov);
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    S.refreshIcons();

    var content = ov.querySelector('#lb-content');
    content.style.transformOrigin = 'center center';
    var wrap = ov.querySelector('.lb-pan'), img = ov.querySelector('img'), label = ov.querySelector('#lb-zoom');

    function update() { apply(); label.textContent = Math.round(scale * 100) + '%'; }
    function zoomTo(v) { scale = Math.min(MAX, Math.max(MIN, v)); if (scale <= 1) { tx = 0; ty = 0; } update(); }
    function reset() { scale = 1; tx = 0; ty = 0; update(); }

    function close() {
      ov.remove();
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    }
    function onKey(e) {
      if (e.key === 'Escape') close();
      if (e.key === '+' || e.key === '=') zoomTo(scale * 1.25);
      if (e.key === '-') zoomTo(scale / 1.25);
      if (e.key === '0') reset();
    }
    document.addEventListener('keydown', onKey);

    ov.querySelector('.lb-close').addEventListener('click', function (e) { e.stopPropagation(); close(); });
    ov.querySelector('.lb-tools').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      var z = b.getAttribute('data-z');
      if (z === 'in') zoomTo(scale * 1.4); else if (z === 'out') zoomTo(scale / 1.4); else reset();
    });

    // mouse wheel zoom
    wrap.addEventListener('wheel', function (e) {
      e.preventDefault();
      zoomTo(scale * (e.deltaY < 0 ? 1.12 : 1 / 1.12));
    }, { passive: false });

    // mouse double-click toggles zoom
    wrap.addEventListener('dblclick', function () { if (scale > 1) reset(); else zoomTo(2); });

    // pointer drag + two-finger pinch + tap / double-tap (touch)
    var pointers = {}, lastDist = 0, dragging = false, lx = 0, ly = 0, moved = 0, lastTap = 0, pinched = false;
    wrap.addEventListener('pointerdown', function (e) {
      pointers[e.pointerId] = e;
      wrap.setPointerCapture(e.pointerId);
      var n = Object.keys(pointers).length;
      if (n === 1) { dragging = true; lx = e.clientX; ly = e.clientY; moved = 0; pinched = false; }
      if (n === 2) {
        var p = Object.keys(pointers).map(function (k) { return pointers[k]; });
        lastDist = Math.hypot(p[0].clientX - p[1].clientX, p[0].clientY - p[1].clientY);
        dragging = false; pinched = true;
      }
    });
    wrap.addEventListener('pointermove', function (e) {
      if (!pointers[e.pointerId]) return;
      pointers[e.pointerId] = e;
      var keys = Object.keys(pointers);
      if (keys.length === 2) {
        var p = keys.map(function (k) { return pointers[k]; });
        var d = Math.hypot(p[0].clientX - p[1].clientX, p[0].clientY - p[1].clientY);
        if (lastDist) zoomTo(scale * (d / lastDist));
        lastDist = d;
      } else if (dragging) {
        moved += Math.abs(e.clientX - lx) + Math.abs(e.clientY - ly);
        if (scale > 1) { tx += e.clientX - lx; ty += e.clientY - ly; apply(); }   // only pan when zoomed in
        lx = e.clientX; ly = e.clientY;
      }
    });
    function endPointer(e) {
      var wasTap = dragging && moved < 10 && !pinched && e.type === 'pointerup';
      delete pointers[e.pointerId]; dragging = false; lastDist = 0;
      if (!wasTap) return;
      var r = img.getBoundingClientRect();
      var onImage = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      if (!onImage) { close(); return; }                                     // tap on the dark area closes
      var now = Date.now();
      if (now - lastTap < 320) { lastTap = 0; if (scale > 1) reset(); else zoomTo(2.2); } else lastTap = now;   // double-tap
    }
    wrap.addEventListener('pointerup', endPointer);
    wrap.addEventListener('pointercancel', endPointer);
  }

  function render() {
    selected = 'all';
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

  S.page('certifications', render);
})();
