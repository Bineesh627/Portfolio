/* =====================================================================
   DATA LOADER — the ONLY place that lists data files.
   Every page loads this file; it loads the files below, in order.

   To add a PROJECT : create data/projects/<name>.js (copy an existing one),
                      then add its path to the "projects" list.
   To add a BLOG POST: create data/blogs/<slug>.js (copy an existing one),
                      then add its path to the "blogs" list.
   Order in the lists = order shown on the website.
   ===================================================================== */
(function () {
  window.SITE_DATA = { projectsData: [], blogsData: [] };

  var files = [
    /* site-wide settings */
    "data/profile.js",
    "data/metadata.js",
    "data/chatbot.js",

    /* home page sections */
    "data/services.js",
    "data/why-choose-me.js",
    "data/experience.js",
    "data/awards.js",
    "data/skills.js",
    "data/qualifications.js",
    "data/testimonials.js",
    "data/faq.js",

    /* certifications page */
    "data/certifications.js",

    /* projects (one file each; order here = order on the site) */
    "data/projects/21-nikah-com.js",
    "data/projects/19-fitaval.js",
    "data/projects/20-gate-hypermarket.js",
    "data/projects/10-sales-crm.js",
    "data/projects/11-uplixo.js",
    "data/projects/12-nikah-net.js",
    "data/projects/13-herambition.js",
    "data/projects/14-northridge-partners.js",
    "data/projects/15-sri-vinayaka-group.js",
    "data/projects/16-kaizer-lars.js",
    "data/projects/17-agricrop-ai.js",
    "data/projects/18-innoverse.js",
    "data/projects/08-cervical-ai.js",
    "data/projects/01-rag-chatbot.js",
    "data/projects/07-truthguard.js",
    "data/projects/02-culinary-community-sharing-platform.js",
    "data/projects/03-mobileinfoga.js",
    "data/projects/04-selio-marketing-co.js",
    "data/projects/05-vehicle-rental-service.js",
    "data/projects/06-ev-stations-locator.js",
    "data/projects/09-e-shop.js",

    /* blog posts (one file each) */
    "data/blogs/stop-the-scam-workshop.js",
    "data/blogs/ksc-founders-meetup-2026.js",
    "data/blogs/startup-saturday.js",
    "data/blogs/dr-cv-raman-award.js",
    "data/blogs/karate-blackbelt-milestone.js"
  ];

  // paths are relative to the HTML page; scripts load in order, before the page code runs
  files.forEach(function (f) { document.write('<script src="' + f + '"><\/script>'); });
})();
