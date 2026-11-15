/* contact.js — contact page (/contact) */
(function () {
  'use strict';
  var S = window.Site, D = S.data, ic = S.ic;
  var P = D.profile, MAP_URL = P.mapUrl;

  function render() {
    S.setMetadata(D.pagesMetadata.contact);

    var info = [
      { icon: 'mail', label: 'Email', value: P.email, link: 'mailto:' + P.email, tone: '' },
      { icon: 'phone', label: 'Phone', value: P.phoneDisplay, link: P.phoneLink, tone: 'accent' },
      { icon: 'map-pin', label: 'Location', value: P.location, link: MAP_URL, tone: 'violet' }
    ].map(function (c) {
      return '<div class="card-x hoverable contact-item"><span class="icon-box ' + c.tone + '">' + ic(c.icon, 22) + '</span>' +
        '<div><span class="lbl">' + c.label + '</span><a class="val" href="' + c.link + '"' + (c.label === 'Location' ? ' target="_blank"' : '') + ' rel="noopener noreferrer">' + c.value + '</a></div></div>';
    }).join('');

    document.getElementById('app').innerHTML =
      '<section class="section page-top"><div class="container">' +
        '<div class="section-head"><span class="eyebrow">Contact</span>' +
        '<h1 class="section-title">Connect &amp; Collaborate</h1>' +
        '<p class="section-sub">Open channels for software developments and business consultations</p></div>' +
        '<div class="row g-4 align-items-stretch">' +
          '<div class="col-lg-6 d-flex flex-column gap-3">' + info + '</div>' +
          '<div class="col-lg-6"><div class="card-x hoverable map-card" id="map-card" role="link" tabindex="0">' +
            '<span class="icon-box">' + ic('map', 28) + '</span>' +
            '<h3 class="h5">' + S.esc(P.location) + '</h3>' +
            '<p class="text-muted mb-3">Click to open the location in Google Maps</p>' +
            '<span class="btn-ghost">' + ic('external-link', 16) + ' Open map</span>' +
          '</div></div>' +
        '</div>' +
        '<div class="text-center mt-5 pt-3"><h3 class="h6 text-muted mb-3">Find me online</h3><div class="d-flex justify-content-center">' + S.socialRow(18) + '</div></div>' +
      '</div></section>';

    var card = document.getElementById('map-card');
    function open() { window.open(MAP_URL, '_blank'); }
    card.addEventListener('click', open);
    card.addEventListener('keydown', function (e) { if (e.key === 'Enter') open(); });
    S.refreshIcons();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
})();
