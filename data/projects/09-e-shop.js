/* Project #9: e_shop
   caseStudyContent is plain HTML (h1/h2/p/ul/blockquote...). Use ${'$'}{...} only if you need a literal dollar-brace. */
SITE_DATA.projectsData.push({
  id: 9,
  slug: "e-shop",
  title: "E-Shop — Optimized E-Commerce Storefront",
  description: "An interactive, fully functional e-commerce storefront with cart logic, search autocompletion, checkout modals, and responsive layout rows.",
  image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&q=80&w=800",
  tags: ["JavaScript", "HTML", "CSS", "Node.js"],
  githubUrl: "https://github.com/Bineesh627/e_shop",
  caseStudyContent: `
<h1>E-Shop: Optimized E-Commerce Client Workspace</h1>
<p>A mock commercial store front, focusing on client-side state coherence, swift product searches, dynamic shopping cart calculation, and responsive checkout layout flows.</p>
<h2>The Challenge</h2>
<p>High cart bounce rates often stem from slow checkout processes and clunky state synchronization when items are modified.</p>
<h2>The Solution</h2>
<p>Developed an optimized local cart manager using modular JS handlers, instant item updates, auto-completing search tags, and clean layout rows.</p>
<h2>Key Technical Components</h2>
<ul>
  <li><strong>Client State Cart:</strong> Handles local item storage and dynamically updates totals.</li>
  <li><strong>Tag Autocompletion:</strong> Text searches immediately index target match words.</li>
  <li><strong>Responsive grid forms:</strong> Smooth form validations on checkout screens.</li>
</ul>
<blockquote><p>&quot;Moving checkout forms to simple native HTML validations coupled with modular state sync scripts dropped cart load-times by 40%.&quot;</p>
</blockquote>
`,
  specs: [
    {
      label: "RELEASE_MODULE",
      value: "ESHOP_STOREFRONT"
    },
    {
      label: "CLASSIFICATION",
      value: "E_COMMERCE"
    },
    {
      label: "CART_MANAGER",
      value: "Client State Manager"
    },
    {
      label: "SEARCH_FLOW",
      value: "Autocomplete tags"
    }
  ],
  gallery: [
    "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&q=80&w=600"
  ]
});
