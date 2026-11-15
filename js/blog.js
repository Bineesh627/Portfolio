/* blog.js — single blog post (/blog?slug=...) */
(function () {
  'use strict';
  var S = window.Site, D = S.data, ic = S.ic, esc = S.esc;
  var FALLBACK_W = 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200';
  var FALLBACK_S = 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800';

  var slug, post;

  function notFound() {
    S.setMetadata({
      title: 'Error 404: Blog Post Not Found',
      description: 'The requested blog resource could not be found or loaded from the technical insights database index.'
    });
    document.getElementById('app').innerHTML = S.notFoundWindow({
      backHref: '/blogs', heading: 'Post not found',
      message: 'The requested blog post could not be found.', btnLabel: 'Back to blog'
    });
    S.refreshIcons();
  }

  function openLightbox(src) {
    var ov = document.createElement('div');
    ov.className = 'lb';
    ov.innerHTML = '<button class="lb-close" aria-label="Close">' + ic('x', 20) + '</button>' +
      '<div class="lb-stage"><img src="' + src + '" alt="Zoomed image" onerror="this.src=\'' + FALLBACK_W + '\'"></div>';
    document.body.appendChild(ov);
    S.refreshIcons();
    function close() { ov.remove(); document.removeEventListener('keydown', onKey); }
    function onKey(e) { if (e.key === 'Escape') close(); }
    document.addEventListener('keydown', onKey);
    ov.addEventListener('click', close);
  }

  function render() {
    slug = new URLSearchParams(location.search).get('slug');
    post = D.blogsData.filter(function (p) { return p.slug === slug; })[0];
    if (!post) { notFound(); return; }

    var meta = D.blogsMetadata[slug] || {};
    S.setMetadata({
      title: meta.title || post.title,
      description: meta.description || post.excerpt,
      keywords: meta.keywords || (post.tags ? post.tags.join(', ') : ''),
      image: meta.image || post.cover_image_url
    });

    var related = D.blogsData.filter(function (p) { return p.id !== post.id; }).slice(0, 2);
    var relatedHtml = related.length
      ? '<section class="related"><h3 class="h4 mb-4">Keep reading</h3><div class="row g-4">' +
        related.map(function (r) {
          return '<div class="col-md-6"><a href="/blog?slug=' + r.slug + '" class="card-x hoverable blog-card text-decoration-none">' +
            (r.cover_image_url ? '<div class="blog-thumb"><img src="' + r.cover_image_url + '" alt="' + esc(r.cover_image_alt || r.title) + '" loading="lazy" onerror="this.src=\'' + FALLBACK_S + '\'"></div>' : '') +
            '<div class="blog-body"><div><span class="chip primary">' + esc(r.category) + '</span></div><h3>' + esc(r.title) + '</h3>' +
            (r.excerpt ? '<p>' + esc(r.excerpt) + '</p>' : '') +
            '<div class="blog-meta"><span>' + ic('calendar', 14) + esc(S.formatLongDate(r.published_at)) + '</span><span class="text-primary-x" style="color:var(--primary);font-weight:600">Read post ' + ic('arrow-right', 14) + '</span></div></div></a></div>';
        }).join('') + '</div></section>'
      : '';

    var tags = (post.tags && post.tags.length)
      ? '<div class="tag-row mt-4">' + post.tags.map(function (t) { return '<span class="chip">#' + esc(t) + '</span>'; }).join('') + '</div>'
      : '';

    document.getElementById('app').innerHTML =
      '<div class="read-progress"><div id="read-bar"></div></div>' +
      '<article class="section page-top"><div class="container"><div class="post-wrap">' +
        '<a href="/blogs" class="back-link">' + ic('arrow-left', 16) + ' Back to blog</a>' +
        '<header class="fade-up"><span class="chip primary">' + esc(post.category) + '</span>' +
          '<h1 class="post-title">' + esc(post.title) + '</h1>' +
          '<div class="post-meta"><span>' + ic('calendar', 16) + esc(S.formatLongDate(post.published_at)) + '</span><span>' + ic('clock', 16) + post.read_time + ' min read</span></div></header>' +
        (post.cover_image_url ? '<img src="' + post.cover_image_url + '" alt="' + esc(post.cover_image_alt || post.title) + '" class="post-cover" id="post-cover" onerror="this.src=\'' + FALLBACK_W + '\'">' : '') +
        '<div class="post-body" id="post-body">' + post.content + '</div>' + tags +
        '<div class="share-box"><p class="text-muted small mb-2">Enjoyed this article? Share it.</p>' +
          '<button id="share-btn" class="btn-ghost" type="button">' + ic('share-2', 16) + ' Copy link</button></div>' +
        relatedHtml +
      '</div></div></article>' +
      '<div class="toast-x" id="share-toast" hidden>' + ic('check', 16) + ' Link copied to clipboard</div>';

    S.refreshIcons();

    var bar = document.getElementById('read-bar');
    function onScroll() {
      var total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) bar.style.width = ((window.scrollY / total) * 100) + '%';
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    S.cleanup(function () { window.removeEventListener('scroll', onScroll); });

    var cover = document.getElementById('post-cover');
    if (cover) cover.addEventListener('click', function () { openLightbox(post.cover_image_url); });
    document.querySelectorAll('#post-body img').forEach(function (img) {
      img.addEventListener('click', function () { openLightbox(img.getAttribute('src')); });
    });

    var toast = document.getElementById('share-toast');
    document.getElementById('share-btn').addEventListener('click', function () {
      function done() { toast.hidden = false; setTimeout(function () { toast.hidden = true; }, 3000); }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(window.location.href).then(done).catch(function (e) { console.error('Failed to copy text: ', e); });
      } else {
        var t = document.createElement('textarea'); t.value = window.location.href; document.body.appendChild(t); t.select();
        try { document.execCommand('copy'); done(); } catch (e) { console.error(e); }
        t.remove();
      }
    });
  }

  S.page('blog', render);
})();
