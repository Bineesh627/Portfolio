/* project.js — single project case study (/project?slug=name) */
(function () {
  'use strict';
  var S = window.Site, D = S.data, ic = S.ic, esc = S.esc;

  var FALLBACK = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600';
  var params = new URLSearchParams(location.search);
  var slug = params.get('slug');
  var legacyId = params.get('id');          // old links: /project?id=N -> redirect to the slug URL
  var project = D.projectsData.filter(function (p) {
    return slug ? p.slug === slug : (legacyId && p.id === parseInt(legacyId, 10));
  })[0];
  if (project && !slug && window.history && history.replaceState) {
    history.replaceState(null, '', '/project?slug=' + project.slug + location.hash);
  }
  var id = project ? project.id : null;     // metadata is keyed by numeric id

  var active = null, zoomed = false;

  function notFound() {
    S.setMetadata({
      title: 'Error 404: Project Not Found',
      description: 'The requested project case study could not be located in the explorer shell archive.'
    });
    document.getElementById('app').innerHTML = S.notFoundWindow({
      backHref: '/projects', heading: 'Project not found',
      message: 'The requested project case study could not be located.', btnLabel: 'Back to projects'
    });
    S.refreshIcons();
  }

  function lightboxHtml() {
    var multi = project.gallery.length > 1;
    return '<div class="lb" id="cs-lb" style="display:none">' +
      '<button class="lb-close" id="cs-close" aria-label="Close">' + ic('x', 20) + '</button>' +
      (multi ? '<button class="lb-nav prev" id="cs-prev" aria-label="Previous image">' + ic('chevron-left', 22) + '</button>' +
               '<button class="lb-nav next" id="cs-next" aria-label="Next image">' + ic('chevron-right', 22) + '</button>' : '') +
      '<div class="lb-stage" id="cs-stage"><img id="cs-lb-img" src="" alt="Screenshot preview"></div>' +
      '<div class="lb-counter" id="cs-counter"></div>' +
    '</div>';
  }

  function paintLightbox() {
    var g = project.gallery;
    var lb = document.getElementById('cs-lb');
    if (!lb) return;
    if (active === null) { lb.style.display = 'none'; return; }
    lb.style.display = 'flex';
    var img = document.getElementById('cs-lb-img');
    img.src = g[active];
    img.classList.toggle('zoomed', zoomed);
    img.style.transformOrigin = 'center center';
    document.body.style.overflow = 'hidden';
    var c = document.getElementById('cs-counter');
    if (c) c.textContent = (active + 1) + ' / ' + g.length;
  }

  function closeLb() { active = null; zoomed = false; paintLightbox(); document.body.style.overflow = ''; }
  function openLb(i) { active = i; zoomed = false; paintLightbox(); }
  function next() { active = (active + 1) % project.gallery.length; zoomed = false; paintLightbox(); }
  function prev() { active = (active - 1 + project.gallery.length) % project.gallery.length; zoomed = false; paintLightbox(); }

  function render() {
    if (!project) { notFound(); return; }

    var meta = D.projectsMetadata[id] || {};
    S.setMetadata({
      title: meta.title || project.title,
      description: meta.description || project.description,
      keywords: meta.keywords || (project.tags ? project.tags.join(', ') : ''),
      image: meta.image || project.image
    });

    var specs = (project.specs || [])
      .filter(function (x) { return x.label !== 'RELEASE_MODULE'; })
      .map(function (x) {
        return '<div class="spec-row"><span class="k">' + esc(S.humanize(x.label)) + '</span><span class="v">' + esc(x.value) + '</span></div>';
      }).join('');

    var gallery = (project.gallery && project.gallery.length)
      ? '<h3 class="h5 mt-5 mb-3">Screenshots</h3><div class="row g-3">' +
        project.gallery.map(function (url, i) {
          return '<div class="col-sm-6"><div class="gallery-item" data-idx="' + i + '">' +
            '<img src="' + url + '" alt="' + esc(project.title) + ' screenshot ' + (i + 1) + '" loading="lazy" onerror="this.src=\'' + FALLBACK + '\'"><span>View full size</span></div></div>';
        }).join('') + '</div>'
      : '';

    document.getElementById('app').innerHTML =
      '<section class="section page-top"><div class="container">' +
        '<a href="/projects" class="back-link">' + ic('arrow-left', 16) + ' Back to projects</a>' +
        '<header class="mb-4"><span class="eyebrow">Case study · Project 0' + project.id + '</span>' +
          '<h1 class="cs-title">' + esc(project.title) + '</h1>' +
          '<div class="tag-row">' + project.tags.map(function (t) { return '<span class="chip primary">' + esc(t) + '</span>'; }).join('') + '</div></header>' +
        '<div class="row g-4">' +
          '<div class="col-lg-4 order-lg-2"><aside class="card-x cs-side">' +
            '<h4>' + ic('layers', 18, 'text-primary-x') + ' Project details</h4>' +
            '<div class="spec-row"><span class="k">Project name</span><span class="v">' + esc(project.title) + '</span></div>' +
            (project.liveUrl ? '<div class="spec-row"><span class="k">Live website</span><a class="v" href="' + project.liveUrl + '" target="_blank" rel="noopener noreferrer">' + esc(project.liveUrl.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')) + ' ' + ic('external-link', 13) + '</a></div>' : '') +
            (project.githubUrl ? '<div class="spec-row"><span class="k">Repository</span><a class="v" href="' + project.githubUrl + '" target="_blank" rel="noopener noreferrer">View on GitHub ' + ic('external-link', 13) + '</a></div>' : '') +
            specs +
            '<div class="spec-row"><span class="k">Tech stack</span><div class="tag-row mt-1">' + project.tags.map(function (t) { return '<span class="chip">' + esc(t) + '</span>'; }).join('') + '</div></div>' +
            (project.liveUrl ? '<a href="' + project.liveUrl + '" target="_blank" rel="noopener noreferrer" class="btn-brand w-100 justify-content-center mt-3">' + ic('globe', 18) + ' Visit live website</a>' : '') +
            (project.githubUrl ? '<a href="' + project.githubUrl + '" target="_blank" rel="noopener noreferrer" class="' + (project.liveUrl ? 'btn-ghost' : 'btn-brand') + ' w-100 justify-content-center mt-3">' + ic('github', 18) + ' View repository</a>' : '') +
          '</aside></div>' +
          '<div class="col-lg-8 order-lg-1"><div class="card-x cs-content"><div class="rich">' + project.caseStudyContent + '</div>' + gallery + '</div></div>' +
        '</div>' +
      '</div>' + (project.gallery && project.gallery.length ? lightboxHtml() : '') + '</section>';

    S.refreshIcons();

    if (!(project.gallery && project.gallery.length)) return;

    var lb = document.getElementById('cs-lb');
    lb.style.display = 'none';
    document.querySelectorAll('.cs-gallery-item').forEach(function (el) {
      el.addEventListener('click', function () { openLb(parseInt(el.getAttribute('data-idx'), 10)); });
    });
    lb.addEventListener('click', closeLb);
    document.getElementById('cs-stage').addEventListener('click', function (e) { e.stopPropagation(); });
    document.getElementById('cs-close').addEventListener('click', closeLb);
    var nx = document.getElementById('cs-next'), pv = document.getElementById('cs-prev');
    if (nx) nx.addEventListener('click', function (e) { e.stopPropagation(); next(); });
    if (pv) pv.addEventListener('click', function (e) { e.stopPropagation(); prev(); });

    var img = document.getElementById('cs-lb-img');
    img.addEventListener('click', function (e) { e.stopPropagation(); zoomed = !zoomed; img.classList.toggle('zoomed', zoomed); if (!zoomed) img.style.transformOrigin = 'center center'; });
    img.addEventListener('mousemove', function (e) {
      if (!zoomed) return;
      var r = img.getBoundingClientRect();
      img.style.transformOrigin = (((e.clientX - r.left) / r.width) * 100) + '% ' + (((e.clientY - r.top) / r.height) * 100) + '%';
    });
    img.addEventListener('error', function () { img.src = FALLBACK; });

    window.addEventListener('keydown', function (e) {
      if (active === null) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
})();
