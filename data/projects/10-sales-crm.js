/* Project #10: CorePro Sales Hub — Sales CRM Platform
   caseStudyContent is plain HTML (h1/h2/p/ul/blockquote...). */
SITE_DATA.projectsData.push({
  id: 10,
  title: "CorePro Sales Hub — Sales CRM Platform",
  description: "A role-based sales CRM for CorePro Techno: lead management with CSV/Excel import, monthly target tracking for sales executives, and a live team dashboard for managers and admins.",
  image: "assets/img/projects/new/cover-salescrm.webp",
  tags: ["TanStack Start", "React 19", "TypeScript", "Tailwind CSS", "Firebase", "Firestore", "Recharts", "Zod"],
  githubUrl: "https://github.com/Bineesh627/sale-crm",
  caseStudyContent: `
<h1>CorePro Sales Hub: Sales CRM Platform for Growing Teams</h1>
<p>CorePro Sales Hub is the internal CRM built for <strong>CorePro Techno</strong>. Small sales teams usually juggle spreadsheets, chat threads and memory; this project replaces that with one fast workspace where leads, follow-ups and monthly targets live together.</p>
<h2>The Problem</h2>
<p>Managers had no real-time view of who was on track, executives had no single place for their assigned leads, and target progress was tallied by hand at the end of each month.</p>
<h2>What I Built</h2>
<ul>
<li><strong>Three-level access hierarchy:</strong> Administrator, Sales Manager and Sales Executive, each seeing only what their role needs. Executives work their own leads; managers see the whole team.</li>
<li><strong>Lead management:</strong> add leads manually or bulk-import from CSV/Excel, assign them to executives, move them through pipeline stages and log follow-ups.</li>
<li><strong>Automatic target tracking:</strong> managers set monthly targets per executive; progress updates by itself as leads are marked won, with an "Achieved" state once the target is met.</li>
<li><strong>Team dashboard:</strong> charts and tables showing pipeline health, conversion and which executives are ahead or behind.</li>
<li><strong>Team module:</strong> create and manage users and roles from inside the app.</li>
</ul>
<h2>Design Approach</h2>
<p>The interface is built for speed and clarity: a single sidebar shell, sortable tables, clear empty states and coloured status badges so a stage or target state can be read at a glance.</p>
<blockquote><p>A complete, role-based sales workspace: leads, targets and team performance in one place.</p></blockquote>
<h2>Tech Stack</h2>
<ul><li>TanStack Start, TanStack Router and React Query on React 19 with TypeScript</li><li>Tailwind CSS with Radix UI primitives</li><li>Firebase / Firestore with security rules and a seed script</li><li>Spreadsheet import with SheetJS, validation with Zod, charts with Recharts</li></ul>
`,
  specs: [
    { label: "Category", value: "Internal Sales CRM" },
    { label: "Roles", value: "Admin · Sales Manager · Sales Executive" },
    { label: "Frontend", value: "TanStack Start + React 19" },
    { label: "Backend", value: "Firebase / Firestore" }
  ],
  gallery: []
});
