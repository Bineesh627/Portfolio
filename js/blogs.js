/* blogs.js — blog index (/blogs) with category filter and scroll reveal */
(function () {
  'use strict';
  var S = window.Site, D = S.data, ic = S.ic, esc = S.esc;
  var FALLBACK = 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800';
  var selected = null;
  var observer = null;

  function cards() {
    var list = selected ? D.blogsData.filter(function (p) { return p.category === selected; }) : D.blogsData;
    return list.map(function (post) {
      return '<div class="col-md-6 col-lg-4 reveal"><a href="/blog?slug=' + post.slug + '" class="card-x hoverable blog-card text-decoration-none">' +
        (post.cover_image_url
          ? '<div class="blog-thumb"><img src="' + post.cover_image_url + '" alt="' + esc(post.cover_image_alt || post.title) + '" loading="lazy" onerror="this.src=\'' + FALLBACK + '\'"></div>'
          : '') +
        '<div class="blog-body">' +
          '<div><span class="chip primary">' + esc(post.category) + '</span></div>' +
          '<h3>' + esc(post.title) + '</h3>' +
          '<p>' + esc(post.excerpt) + '</p>' +
          '<div class="blog-meta"><span>' + ic('calendar', 14) + esc(S.formatLongDate(post.published_at)) + '</span><span>' + ic('clock', 14) + post.read_time + ' min read</span></div>' +
        '</div></a></div>';
    }).join('');
  }

  function paint() {
    var grid = document.getElementById('blogs-grid');
    grid.innerHTML = cards();
    S.refreshIcons();

    if (observer) observer.disconnect();
    var items = grid.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            var i = Array.prototype.indexOf.call(items, en.target);
            en.target.style.transitionDelay = (i * 0.08) + 's';
            en.target.classList.add('in');
            observer.unobserve(en.target);
          }
        });
      }, { threshold: 0.1 });
      items.forEach(function (el) { observer.observe(el); });
    } else {
      items.forEach(function (el) { el.classList.add('in'); });
    }
  }

  function render() {
    selected = null;
    S.cleanup(function () { if (observer) { observer.disconnect(); observer = null; } });
    S.setMetadata(D.pagesMetadata.blogs);
    var cats = [];
    D.blogsData.forEach(function (p) { if (cats.indexOf(p.category) === -1) cats.push(p.category); });

    document.getElementById('app').innerHTML =
      '<section class="section page-top" id="blog"><div class="container">' +
        '<div class="section-head"><span class="eyebrow">Blog</span>' +
        '<h1 class="section-title">Insights &amp; Technical Blogs</h1>' +
        '<p class="section-sub">Articles on tech architecture, software engineering, and business models</p></div>' +
        '<div class="pill-tabs">' +
          '<button class="pill-tab active" data-cat="">All posts</button>' +
          cats.map(function (c) { return '<button class="pill-tab" data-cat="' + esc(c) + '">' + esc(c) + '</button>'; }).join('') +
        '</div>' +
        '<div class="row g-4" id="blogs-grid"></div>' +
      '</div></section>';

    var tabs = document.querySelectorAll('.pill-tab');
    tabs.forEach(function (b) {
      b.addEventListener('click', function () {
        selected = b.getAttribute('data-cat') || null;
        tabs.forEach(function (x) { x.classList.toggle('active', x === b); });
        paint();
      });
    });
    paint();
  }

  S.page('blogs', render);
})();
