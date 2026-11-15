/* Project #14: Northridge Partners — Strategic Talent Landing Site
   caseStudyContent is plain HTML (h1/h2/p/ul/blockquote...). */
SITE_DATA.projectsData.push({
  id: 14,
  title: "Northridge Partners — Strategic Talent Landing Site",
  description: "A desktop-first, fully responsive React landing page for Northridge Partners, a strategic talent and recruitment partner, with a data-driven content file so copy can be edited without touching components.",
  image: "assets/img/projects/new/northridge-hero.webp",
  tags: ["React", "Vite", "Bootstrap 5", "Bootstrap Icons", "JavaScript", "Vercel"],
  githubUrl: "https://github.com/Bineesh627/NorthRidgePartner",
  liveUrl: "https://www.northridgepartner.com/",
  caseStudyContent: `
<h1>Northridge Partners: A Strategic Talent Partner Website</h1>
<p>Northridge Partners connects companies in IT, Fintech, BFSI and startups with specialist talent. I built a clean, credible landing page that explains the offer, shows the process and gets hiring managers to start a conversation.</p>
<h2>Page Structure</h2>
<ul>
<li><strong>Hero</strong> with headline stats: specialist talent, data-driven hiring and a long-term partnership approach.</li>
<li><strong>Solutions, Lines of business, Process, Industries</strong> and <strong>Why Choose Us</strong> sections.</li>
<li><strong>Trusted by, Impact, Case Studies</strong> and <strong>Testimonials</strong> for social proof.</li>
<li><strong>HerAmbition</strong> partner section and a <strong>Contact CTA</strong> that opens a pre-filled hiring-requirement email.</li>
</ul>
<h2>Easy to Maintain</h2>
<p>All copy, navigation links, stats and call-to-action text live in a single <code>content.js</code> data file, one component per section, and brand colours are CSS variables. The client can update the site without touching component code.</p>
<h2>Engineering Details</h2>
<ul>
<li>Custom <code>useSectionNav</code> hook for smooth scrolling, active menu highlighting and mobile menu closing.</li>
<li>Fully responsive Bootstrap 5 layout with Bootstrap Icons.</li>
<li>Vite build, deployed on Vercel.</li>
</ul>
`,
  specs: [
    { label: "Category", value: "Corporate Landing Page" },
    { label: "Sectors", value: "IT · Fintech · BFSI · Startups" },
    { label: "Frontend", value: "React + Vite + Bootstrap" },
    { label: "Content", value: "Single data file" }
  ],
  gallery: [
    "assets/img/projects/new/northridge-hero.webp",
    "assets/img/projects/new/northridge-industry-1.webp",
    "assets/img/projects/new/northridge-industry-2.webp",
    "assets/img/projects/new/northridge-industry-3.webp",
    "assets/img/projects/new/northridge-herambition.webp"
]
});
