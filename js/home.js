/* =====================================================================
   home.js — home page sections
   Hero · About · Services · Why Choose Me · Experience · Awards ·
   Skills · Qualifications · Testimonials · FAQ · WhatsApp CTA
   ===================================================================== */
(function () {
  'use strict';
  var S = window.Site, D = S.data, ic = S.ic, esc = S.esc, P = D.profile;

  function head(eyebrow, title, sub) {
    return '<div class="section-head">' +
      '<span class="eyebrow">' + eyebrow + '</span>' +
      '<h2 class="section-title">' + title + '</h2>' +
      '<p class="section-sub">' + sub + '</p></div>';
  }

  /* ------------------------------- HERO ------------------------------- */
  function hero() {
    return '<section class="hero" id="home"><div class="container"><div class="row align-items-center g-5">' +
      '<div class="col-lg-7 fade-up">' +
        '<div class="hero-hello">' + esc(P.hero.greeting) + '</div>' +
        '<h1 class="hero-name">' + heroName() + '</h1>' +
        '<div class="hero-role"><span class="typed" id="typed-role"></span><span class="caret"></span></div>' +
        '<p class="hero-desc">' + esc(P.hero.description) + '</p>' +
        '<div class="hero-loc">' + ic('map-pin', 16) + ' ' + esc(P.location) + '</div>' +
        '<div class="hero-actions">' +
          '<a class="btn-brand" href="/contact">' + esc(P.hero.primaryButton) + ' ' + ic('arrow-right', 16) + '</a>' +
          '<a class="btn-ghost" href="/projects">' + esc(P.hero.secondaryButton) + '</a>' +
        '</div>' +
        S.socialRow(18) +
      '</div>' +
      '<div class="col-lg-5 fade-up" style="animation-delay:.15s"><div class="hero-photo">' +
        '<img src="' + esc(P.hero.image) + '" alt="' + esc(P.hero.imageAlt) + '">' +
      '</div></div>' +
    '</div></div></section>';
  }

  function heroName() {
    var parts = String(P.name).split(' '), last = parts.pop();
    return parts.length ? esc(parts.join(' ')) + ' <span class="gradient-text">' + esc(last) + '</span>' : '<span class="gradient-text">' + esc(last) + '</span>';
  }

  function initHero() {
    var roles = P.hero.roles;
    var el = document.getElementById('typed-role');
    var loop = 0, deleting = false, text = '', delta = 180;
    function tick() {
      var full = roles[loop % roles.length];
      text = deleting ? full.substring(0, text.length - 1) : full.substring(0, text.length + 1);
      el.textContent = text;
      delta = deleting ? 50 : 110;
      if (!deleting && text === full) { deleting = true; delta = 1800; }
      else if (deleting && text === '') { deleting = false; loop++; delta = 400; }
      setTimeout(tick, delta);
    }
    tick();
  }

  /* ------------------------------- ABOUT ------------------------------ */
  function about() {
    function fact(k, v) { return '<div class="fact"><div class="k">' + k + '</div><div class="v">' + v + '</div></div>'; }
    return '<section class="section" id="about"><div class="container">' +
      head('About', esc(P.about.title), esc(P.about.subtitle)) +
      '<div class="row align-items-center g-5">' +
        '<div class="col-lg-5"><div class="about-photo">' +
          '<img src="' + esc(P.about.image) + '" alt="' + esc(P.about.imageAlt) + '" onerror="this.src=\'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600\'">' +
        '</div></div>' +
        '<div class="col-lg-7 about-body">' +
          P.about.paragraphs.map(function (t) { return '<p>' + esc(t) + '</p>'; }).join('') +
          '<div class="about-facts">' +
            P.about.facts.map(function (f) { return fact(f.label, esc(f.value)); }).join('') +
          '</div>' +
          '<a class="btn-brand" href="/contact">' + esc(P.about.buttonLabel) + ' ' + ic('arrow-right', 16) + '</a>' +
        '</div>' +
      '</div></div></section>';
  }

  /* ----------------------------- SERVICES ----------------------------- */
  function services() {
    var tone = ['', 'violet', 'accent', ''];
    var cards = D.servicesData.map(function (s, i) {
      return '<div class="col-md-6"><div class="card-x hoverable service-card">' +
        '<div class="d-flex align-items-center justify-content-between">' +
          '<span class="icon-box ' + (tone[i % 4]) + '">' + ic(s.icon, 22) + '</span>' +
          '<span class="chip ' + (tone[i % 4] || 'primary') + '">' + esc(S.humanize(s.status)) + '</span>' +
        '</div>' +
        '<h3>' + esc(s.title) + '</h3>' +
        '<p>' + esc(s.description) + '</p>' +
        '<ul class="check-list">' + s.features.map(function (f) { return '<li>' + ic('check-circle', 16) + '<span>' + esc(f) + '</span></li>'; }).join('') + '</ul>' +
      '</div></div>';
    }).join('');
    return '<section class="section section-alt" id="services"><div class="container">' +
      head('Services', 'My Services', 'Tactical engineering &amp; high-performance solutions') +
      '<div class="row g-4">' + cards + '</div></div></section>';
  }

  /* --------------------------- WHY CHOOSE ME -------------------------- */
  function whyChooseMe() {
    function meter(label, pct) {
      return '<div class="meter"><div class="row-top"><span>' + label + '</span><span>' + pct + '%</span></div>' +
        '<div class="track"><div class="fill" style="width:' + pct + '%"></div></div></div>';
    }
    var tone = ['', 'violet', 'accent'];
    var pillars = D.whyChooseMeData.map(function (e, i) {
      return '<div class="col-12"><div class="card-x feature-card">' +
        '<span class="icon-box ' + tone[i % 3] + '">' + ic(e.icon, 22) + '</span>' +
        '<div class="flex-grow-1"><h3>' + esc(e.title) + '</h3><p>' + esc(e.description) + '</p>' +
        '<div class="feature-stat"><span>' + esc(S.humanize(e.statLabel)) + '</span><span>' + esc(S.humanize(e.statValue)) + '</span></div></div>' +
      '</div></div>';
    }).join('');
    return '<section class="section" id="why-choose-me"><div class="container">' +
      head('Why me', 'Why Choose Me', 'Systems reliability metrics &amp; project execution parameters') +
      '<div class="row g-5 align-items-start">' +
        '<div class="col-lg-5"><div class="card-x p-4" style="position:sticky;top:100px">' +
          '<h3 class="h5 mb-1">' + esc(P.performance.title) + '</h3>' +
          '<p class="text-muted small mb-4">' + esc(P.performance.subtitle) + '</p>' +
          P.performance.meters.map(function (m) { return meter(m.label, m.value); }).join('') +
        '</div></div>' +
        '<div class="col-lg-7"><div class="row g-3">' + pillars + '</div></div>' +
      '</div></div></section>';
  }

  /* ----------------------------- EXPERIENCE --------------------------- */
  function experience() {
    var items = D.experienceData.map(function (e) {
      var current = e.status === 'ACTIVE';
      var company = e.link
        ? '<a class="tl-company" href="' + e.link + '" target="_blank" rel="noopener noreferrer">' + esc(e.company) + ic('external-link', 13) + '</a>'
        : '<span class="tl-company">' + esc(e.company) + '</span>';
      var LABELS = { instagram: 'Instagram', facebook: 'Facebook', linkedin: 'LinkedIn', youtube: 'YouTube', whatsapp: 'WhatsApp', website: 'Website' };
      var socials = (e.socials && e.socials.length)
        ? '<div class="tl-socials">' + e.socials.map(function (s) {
            var icon = s.type === 'website' ? ic('globe', 18) : S.brand[s.type](18);
            var label = esc(e.company) + ' on ' + LABELS[s.type];
            return '<a class="soc-btn soc-' + s.type + '" href="' + s.url + '" target="_blank" rel="noopener noreferrer" aria-label="' + label + '" title="' + LABELS[s.type] + '">' + icon + '</a>';
          }).join('') + '</div>'
        : '';
      return '<div class="tl-item' + (current ? ' current' : '') + '"><span class="tl-dot"></span><div class="card-x tl-card">' +
        '<div class="d-flex flex-wrap justify-content-between align-items-center gap-2">' +
          '<span class="tl-date">' + esc(e.date) + '</span>' +
          '<span class="chip ' + (current ? 'accent' : '') + '">' + (current ? 'Current' : 'Completed') + '</span>' +
        '</div>' +
        '<h3>' + esc(e.title) + '</h3>' + company +
        '<div class="tl-meta">' +
          (e.location ? '<span class="d-inline-flex align-items-center gap-1">' + ic('map-pin', 14) + esc(e.location) + '</span>' : '') +
          (e.employmentType ? '<span class="chip primary">' + esc(e.employmentType) + '</span>' : '') +
          (e.workMode ? '<span class="chip violet">' + esc(e.workMode) + '</span>' : '') +
        '</div>' +
        '<p>' + esc(e.description) + '</p>' + socials +
      '</div></div>';
    }).join('');
    return '<section class="section section-alt" id="experience"><div class="container">' +
      head('Experience', 'Professional Timeline', 'My leadership roles and software engineering background') +
      '<div class="timeline">' + items + '</div></div></section>';
  }

  /* ------------------------------ AWARDS ------------------------------ */
  function awards() {
    var cards = D.awardsData.map(function (a) {
      var slides = a.images.map(function (img, i) {
        return '<div class="award-slide' + (i === 0 ? ' active' : '') + '"><img src="' + img + '" alt="' + esc(a.title) + ' preview ' + (i + 1) + '" onerror="this.src=\'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600\'"></div>';
      }).join('');
      var dots = a.images.length > 1 ? '<div class="award-dots">' + a.images.map(function (_, i) { return '<i class="' + (i === 0 ? 'active' : '') + '" data-dot="' + i + '"></i>'; }).join('') + '</div>' : '';
      return '<div class="col-lg-6"><div class="card-x award-card">' +
        '<div class="award-media" data-slides="' + a.images.length + '">' + slides + dots + '</div>' +
        '<div class="award-body">' +
          '<div><span class="chip primary">' + ic('award', 13) + esc(a.category) + '</span></div>' +
          '<h3>' + esc(a.title) + '</h3>' +
          '<p class="text-muted mb-0">' + esc(a.description) + '</p>' +
          '<div class="award-specs">' + a.specs.map(function (s) { return '<div class="fact"><div class="k">' + esc(s.label) + '</div><div class="v">' + esc(s.value) + '</div></div>'; }).join('') + '</div>' +
          '<div class="mt-auto"><a href="/blog?slug=' + a.slug + '" class="btn-ghost">Read full story ' + ic('arrow-right', 16) + '</a></div>' +
        '</div></div></div>';
    }).join('');
    return '<section class="section" id="awards"><div class="container">' +
      head('Recognition', 'Honors &amp; Awards', 'Milestones of distinction, martial discipline &amp; innovation') +
      '<div class="row g-4">' + cards + '</div></div></section>';
  }

  function initAwards() {
    document.querySelectorAll('.award-media').forEach(function (box) {
      var slides = box.querySelectorAll('.award-slide');
      var dots = box.querySelectorAll('.award-dots i');
      if (slides.length <= 1) return;
      var cur = 0, timer;
      function show(n) {
        cur = n;
        slides.forEach(function (s, i) { s.classList.toggle('active', i === cur); });
        dots.forEach(function (d, i) { d.classList.toggle('active', i === cur); });
      }
      function start() { timer = setInterval(function () { show((cur + 1) % slides.length); }, 4000); }
      dots.forEach(function (d, i) { d.addEventListener('click', function () { clearInterval(timer); show(i); start(); }); });
      start();
    });
  }

  /* ------------------------------- SKILLS ----------------------------- */
  function skills() {
    var tabs = P.skillCategories.map(function (c, i) {
      return '<button type="button" class="pill-tab' + (i === 0 ? ' active' : '') + '" data-cat="' + esc(c.key) + '">' + esc(c.label) + '</button>';
    }).join('');
    return '<section class="section section-alt" id="skills"><div class="container">' +
      head('Skills', 'Technical Skills', 'Core capabilities and programming proficiencies') +
      '<div class="pill-tabs">' + tabs + '</div>' +
      '<div class="row g-3 justify-content-center" id="skills-grid"></div></div></section>';
  }

  function renderSkills(cat) {
    var list = D.skillsData.filter(function (s) { return s.category === cat; });
    document.getElementById('skills-grid').innerHTML = list.map(function (skill) {
      var logo = skill.icon
        ? '<img class="logo" src="' + skill.icon + '" alt="' + esc(skill.name) + ' logo" onerror="this.style.display=\'none\'">'
        : '<div class="ph">' + esc(skill.name.substring(0, 2).toUpperCase()) + '</div>';
      return '<div class="col-6 col-md-4 col-lg-3"><div class="card-x hoverable skill-card">' + logo +
        '<h4>' + esc(skill.name) + '</h4><span class="level ' + String(skill.levelLabel).toLowerCase() + '">' + esc(skill.levelLabel) + '</span></div></div>';
    }).join('');
  }

  function initSkills() {
    var btns = document.querySelectorAll('.pill-tab');
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        btns.forEach(function (x) { x.classList.toggle('active', x === b); });
        renderSkills(b.getAttribute('data-cat'));
      });
    });
    renderSkills(P.skillCategories[0].key);
  }

  /* --------------------------- QUALIFICATIONS ------------------------- */
  function formatQualDate(dateString) {
    var parsed = Date.parse(dateString);
    if (isNaN(parsed)) return dateString;
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  }

  function qualifications() {
    var cards = D.qualificationsData.map(function (q) {
      return '<div class="col-12"><div class="card-x hoverable qual-card">' +
        '<div class="d-flex flex-column flex-md-row justify-content-between gap-3">' +
          '<div class="d-flex gap-3"><span class="icon-box">' + ic('graduation-cap', 22) + '</span>' +
            '<div><h3>' + esc(q.degree) + '</h3><div class="qual-field">' + ic('database', 14) + esc(q.field) + '</div></div></div>' +
          '<span class="chip primary align-self-start">' + ic('calendar', 13) + esc(formatQualDate(q.graduation_date)) + '</span>' +
        '</div>' +
        '<div class="qual-inst">' + ic('landmark', 16, 'text-muted') + esc(q.institution) + '</div>' +
        (q.description ? '<p class="mb-0 text-muted">' + esc(q.description) + '</p>' : '') +
        (q.score ? '<div class="qual-score">GPA<b>' + esc(q.score) + '</b></div>' : '') +
      '</div></div>';
    }).join('');
    return '<section class="section" id="qualifications"><div class="container">' +
      head('Education', 'Academic Qualifications', 'My educational background and academic records') +
      '<div class="row g-4">' + cards + '</div></div></section>';
  }

  /* ---------------------------- TESTIMONIALS -------------------------- */
  function testimonials() {
    var cards = D.testimonialsData.map(function (t) {
      var stars = '';
      for (var i = 0; i < t.rating; i++) stars += ic('star', 16, '', 'fill="currentColor"');
      var initials = t.clientName.split(' ').map(function (w) { return w[0]; }).join('').slice(0, 2).toUpperCase();
      return '<div class="col-md-6 col-lg-4"><div class="card-x testi-card">' +
        '<div class="stars">' + stars + '</div>' +
        '<p class="testi-quote">' + esc(t.quote) + '</p>' +
        '<div class="testi-author"><div class="avatar">' + esc(initials) + '</div>' +
          '<div><div class="n">' + esc(t.clientName) + '</div><div class="r">' + esc(t.role) + '</div></div></div>' +
        '<div class="mt-3"><span class="chip">' + esc(t.projectType) + '</span></div>' +
      '</div></div>';
    }).join('');
    return '<section class="section section-alt" id="testimonials"><div class="container">' +
      head('Testimonials', 'Client Testimonials', 'Verified system integration feedback from project owners') +
      '<div class="row g-4">' + cards + '</div></div></section>';
  }

  /* -------------------------------- FAQ ------------------------------- */
  function faq() {
    var items = D.faqData.map(function (f) {
      return '<div class="faq-item"><button class="faq-q" aria-expanded="false"><span><span class="cat">' + esc(f.category) + '</span><span class="q">' + esc(f.question) + '</span></span>' + ic('chevron-down', 20) + '</button>' +
        '<div class="faq-a"><div>' + esc(f.answer) + '</div></div></div>';
    }).join('');
    return '<section class="section" id="faq"><div class="container">' +
      head('FAQ', 'Frequently Asked Questions', 'Resolving standard contract parameters &amp; objections') +
      '<div class="faq-wrap">' + items + '</div></div></section>';
  }

  function initFaq() {
    var items = document.querySelectorAll('.faq-item');
    items.forEach(function (item) {
      item.querySelector('.faq-q').addEventListener('click', function () {
        var open = item.classList.contains('open');
        items.forEach(function (o) {
          o.classList.remove('open');
          o.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
          o.querySelector('.faq-a').style.maxHeight = '0';
        });
        if (!open) {
          item.classList.add('open');
          item.querySelector('.faq-q').setAttribute('aria-expanded', 'true');
          var a = item.querySelector('.faq-a');
          a.style.maxHeight = a.scrollHeight + 'px';
        }
      });
    });
  }

  /* ------------------------------ CONTACT CTA -------------------------- */
  function waUrl(msg) { return 'https://wa.me/' + P.whatsappNumber + '?text=' + encodeURIComponent(msg); }

  function cta() {
    var C = P.cta, first = C.topics[0];
    var chips = C.topics.map(function (t, i) {
      return '<button type="button" class="cta-chip' + (i === 0 ? ' active' : '') + '" data-i="' + i + '" aria-pressed="' + (i === 0) + '">' + esc(t.label) + '</button>';
    }).join('');
    return '<section class="section pt-0"><div class="container"><div class="cta-x">' +
      '<div class="cta-x-main">' +
        '<span class="cta-pill"><i class="cta-dot" aria-hidden="true"></i>' + esc(C.availability) + '</span>' +
        '<h2 class="cta-x-title">' + esc(C.titleStart) + ' <span class="grad-text">' + esc(C.titleHighlight) + '</span></h2>' +
        '<p class="cta-x-text">' + esc(C.text) + '</p>' +
        '<div class="cta-topics" role="group" aria-label="' + esc(C.topicsLabel) + '"><span class="cta-topics-label">' + esc(C.topicsLabel) + '</span>' + chips + '</div>' +
        '<div class="cta-actions">' +
          '<a id="cta-wa" href="' + waUrl(first.message) + '" target="_blank" rel="noopener noreferrer" class="btn-brand cta-wa">' + S.brand.whatsapp(18) + ' ' + esc(C.buttonLabel) + '</a>' +
          '<a href="mailto:' + P.email + '" class="btn-ghost">' + ic('mail', 18) + ' ' + esc(C.emailLabel) + '</a>' +
        '</div>' +
      '</div>' +
      '<a id="cta-preview" class="cta-phone" href="' + waUrl(first.message) + '" target="_blank" rel="noopener noreferrer" aria-label="' + esc(C.buttonLabel) + '">' +
        '<div class="cta-phone-head"><span class="cta-phone-av">B</span><span><strong>Bineesh S</strong><small>WhatsApp</small></span><span class="cta-phone-wa">' + S.brand.whatsapp(20) + '</span></div>' +
        '<div class="cta-phone-body"><div class="cta-msg" id="cta-msg">' + esc(first.message) + '<em>now</em></div></div>' +
        '<div class="cta-phone-foot">' + ic('send', 14) + ' ' + esc(C.previewHint) + '</div>' +
      '</a>' +
    '</div></div></section>';
  }

  function initCta() {
    var chips = document.querySelectorAll('.cta-chip');
    var wa = document.getElementById('cta-wa'), pv = document.getElementById('cta-preview'), msg = document.getElementById('cta-msg');
    if (!chips.length || !wa) return;
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var m = P.cta.topics[+chip.getAttribute('data-i')].message;
        chips.forEach(function (c) { c.classList.toggle('active', c === chip); c.setAttribute('aria-pressed', c === chip); });
        wa.href = pv.href = waUrl(m);
        msg.firstChild.nodeValue = m;
        msg.classList.remove('pop'); void msg.offsetWidth; msg.classList.add('pop');
      });
    });
  }

  /* -------------------------------- boot ------------------------------ */
  function render() {
    S.setMetadata(D.pagesMetadata.home);
    document.getElementById('app').innerHTML =
      hero() + about() + services() + whyChooseMe() + experience() + awards() +
      skills() + qualifications() + testimonials() + faq() + cta();
    initHero(); initAwards(); initSkills(); initFaq(); initCta();
    S.refreshIcons();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
})();
