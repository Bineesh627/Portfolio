/* Project #3: MobileInfoga
   caseStudyContent is plain HTML (h1/h2/p/ul/blockquote...). Use ${'$'}{...} only if you need a literal dollar-brace. */
SITE_DATA.projectsData.push({
  id: 3,
  title: "MobileInfoga — OSINT Phone Reconnaissance Toolkit",
  description: "MobileInfoGa is a powerful OSINT tool designed to gather comprehensive details about phone numbers. Utilizing various techniques and integrations, it can retrieve information such as country of origin, carrier details, and potential online associations.",
  image: "assets/img/projects/project-img3.webp",
  tags: ["Python", "Telethon", "Phonenumbers"],
  githubUrl: "https://github.com/Bineesh627/MobileInfoga",
  caseStudyContent: `
<h1>MobileInfoga: OSINT Phone Directory Recon Tool</h1>
<p>MobileInfoGa is a powerful OSINT tool designed to gather comprehensive details about phone numbers. Utilizing various techniques and integrations, it can retrieve information such as country of origin, carrier details, and potential online associations.</p>
<h2>The Challenge</h2>
<p>Security reviews and spam trace tasks require manually cross-referencing information across scattered registries, which slow down investigations.</p>
<h2>The Solution</h2>
<p>Consolidated cell directory inquiries, country codes indices, and Telethon APIs into an automated python console wrapper that returns structured logs.</p>
<h2>Key Technical Components</h2>
<ul>
  <li><strong>Telethon API integrations:</strong> Scripted telegram data-point lookup and contact lists querying.</li>
  <li><strong>Registry Scraper:</strong> Auto-extracts carrier allocations and geographic indexes.</li>
  <li><strong>CLI Layout:</strong> Rich terminal interface to output categorized diagnostics tables.</li>
</ul>
<blockquote><p>&quot;Consolidating multiple directory API scans into a single command wrapper reduced investigation cycles from 20 minutes to under 10 seconds.&quot;</p>
</blockquote>
`,
  specs: [
    {
      label: "RELEASE_MODULE",
      value: "MOBILEINFOGA_OSINT"
    },
    {
      label: "CLASSIFICATION",
      value: "SECURITY_TOOL"
    },
    {
      label: "CORE_LIBRARY",
      value: "Telethon API"
    },
    {
      label: "INTERFACE",
      value: "Rich CLI Command"
    }
  ],
  gallery: [
    "assets/img/projects/project-img3.webp",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1601597111158-2fceff270190?auto=format&fit=crop&q=80&w=600"
  ]
});
