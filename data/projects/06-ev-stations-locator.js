/* Project #6: ev-stations-locator
   caseStudyContent is plain HTML (h1/h2/p/ul/blockquote...). Use ${'$'}{...} only if you need a literal dollar-brace. */
SITE_DATA.projectsData.push({
  id: 6,
  slug: "ev-stations-locator",
  title: "EV Stations Locator — Charging Point Finder",
  description: "A web utility mapping and locating nearby electric vehicle charging stations, integrating Google Maps API and routing systems.",
  image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800",
  tags: ["HTML", "CSS", "Javascript"],
  githubUrl: "https://github.com/Bineesh627/ev-stations-locator",
  caseStudyContent: `
<h1>EV Stations Locator: Charging Point Map Guide</h1>
<p>A real-time mapping workspace built to reduce range anxiety for EV drivers. Incorporates current coordinates to locate charging outlets, filter by plug categories, and build map route steps.</p>
<h2>The Challenge</h2>
<p>Public charging infrastructure coordinates change frequently, and drivers require filtered views based on connector formats and station availability.</p>
<h2>The Solution</h2>
<p>Integrated Google Maps API with responsive location triggers that fetch nearby markers, display distance profiles, and offer direct driving instructions.</p>
<h2>Key Technical Components</h2>
<ul>
  <li><strong>Map interface:</strong> Responsive coordinate tracking using Google Maps directions layers.</li>
  <li><strong>Hardware filters:</strong> Real-time plugin categorization based on connector variables (CCS, CHAdeMO, Type 2).</li>
  <li><strong>Geolocation lookup:</strong> Instantly pinpoints current client coordinates for quick distance sorting.</li>
</ul>
<blockquote><p>&quot;Integrating responsive plug hardware sorting filters cut charger navigation lookup steps down to a single button press.&quot;</p>
</blockquote>
`,
  specs: [
    {
      label: "RELEASE_MODULE",
      value: "EV_STATIONS_LOCATOR"
    },
    {
      label: "CLASSIFICATION",
      value: "MAPPING_UTILITY"
    },
    {
      label: "API_INTEGRATION",
      value: "Google Maps directions"
    },
    {
      label: "GEOLOCATION",
      value: "Live HTML5 Client"
    }
  ],
  gallery: [
    "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&q=80&w=600"
  ]
});
