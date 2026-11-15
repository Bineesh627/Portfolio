/* Project #2: Culinary Community & Sharing Platform
   caseStudyContent is plain HTML (h1/h2/p/ul/blockquote...). Use ${'$'}{...} only if you need a literal dollar-brace. */
SITE_DATA.projectsData.push({
  id: 2,
  title: "RecipeRave — Culinary Community & Recipe Sharing Platform",
  description: "Join a vibrant community of food lovers on RecipeRave! Follow your favorite home cooks and culinary creators, explore a diverse collection of recipes, and share your own delicious creations with the world, just like your favorite photo-sharing platform.",
  image: "assets/img/projects/project-img2.webp",
  tags: ["Python", "Django", "HTML", "CSS", "Javascript", "Bootstrap"],
  githubUrl: "https://github.com/Bineesh627/reciperave",
  caseStudyContent: `
<h1>RecipeRave: Culinary Community &amp; Sharing Platform</h1>
<p>RecipeRave is a community-focused culinary social network that encourages recipe discovery and sharing. Built like modern photo-sharing applications, it provides interactive creator feeds, followings, detailed ingredient cards, and step-by-step instructions.</p>
<h2>The Challenge</h2>
<p>Most recipe platforms are static blogs cluttered with ads and lengthy articles, lacking community interaction, creator followings, and dynamic recipe scaling.</p>
<h2>The Solution</h2>
<p>Developed a social framework using Django, implementing follow graphs, dynamic feed curation, ingredient checkbox tracking, and real-time community comment sections.</p>
<h2>Key Technical Components</h2>
<ul>
  <li><strong>Follow Graph Database:</strong> Handles user relationships and feeds generation.</li>
  <li><strong>Responsive Cooking Mode:</strong> Checklist toggles for ingredients and scaling calculator.</li>
  <li><strong>Dynamic Feed Indexing:</strong> Curates posts based on fresh contributions from followed creators.</li>
</ul>
<blockquote><p>&quot;Creating an ad-free, interactive community social feed increased daily user engagement by 40% compared to traditional static recipes blogs.&quot;</p>
</blockquote>
`,
  specs: [
    {
      label: "RELEASE_MODULE",
      value: "RECIPERAVE_PORTAL"
    },
    {
      label: "CLASSIFICATION",
      value: "SOCIAL_NETWORK"
    },
    {
      label: "FRAMEWORK",
      value: "Django / Python"
    },
    {
      label: "CLIENT_UI",
      value: "Bootstrap 5"
    }
  ],
  gallery: [
    "assets/img/projects/project-img2.webp",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=600"
  ]
});
