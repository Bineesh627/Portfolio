/* projects.js — projects listing (/projects) */
(function () {
  'use strict';
  var S = window.Site, D = S.data, ic = S.ic, esc = S.esc;

  function render() {
    S.setMetadata(D.pagesMetadata.projects);
    var cards = D.projectsData.map(function (p) {
      var tags = p.tags.slice(0, 5).map(function (t) { return '<span class="chip">' + esc(t) + '</span>'; }).join('');
      var extra = p.tags.length > 5 ? '<span class="chip primary">+' + (p.tags.length - 5) + '</span>' : '';
      return '<div class="col-md-6 col-lg-4"><a href="/project?slug=' + p.slug + '" class="card-x hoverable project-card text-decoration-none">' +
        '<div class="project-thumb"><img src="' + p.image + '" alt="' + esc(p.title) + '" loading="lazy" onerror="this.src=\'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800\'"></div>' +
        '<div class="project-body"><div class="tag-row">' + tags + extra + '</div>' +
          '<h3>' + esc(p.title) + '</h3><p>' + esc(p.description) + '</p>' +
          '<span class="project-more">View case study ' + ic('arrow-right', 16) + '</span></div>' +
      '</a></div>';
    }).join('');

    document.getElementById('app').innerHTML =
      '<section class="section page-top"><div class="container">' +
        '<div class="section-head"><span class="eyebrow">Portfolio</span>' +
        '<h1 class="section-title">Product &amp; Software Projects</h1>' +
        '<p class="section-sub">A curated catalog of my technical releases and business projects</p></div>' +
        '<div class="row g-4">' + cards + '</div>' +
        '<div class="text-center mt-5"><a class="btn-ghost" target="_blank" rel="noopener noreferrer" href="https://github.com/Bineesh627">' + ic('github', 18) + ' More on GitHub</a></div>' +
      '</div></section>';
    S.refreshIcons();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
})();
