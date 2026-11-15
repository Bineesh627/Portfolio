/* Project #5: vehicle-rental-service
   caseStudyContent is plain HTML (h1/h2/p/ul/blockquote...). Use ${'$'}{...} only if you need a literal dollar-brace. */
SITE_DATA.projectsData.push({
  id: 5,
  title: "Vehicle Rental Service — Fleet Booking & Management Platform",
  description: "An enterprise fleet management mobile application and Django API supporting multi-tier roles, concurrency booking locks, dynamic pricing, and KYC validation.",
  image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800",
  tags: ["React Native", "Expo", "Django", "Python", "TypeScript", "NativeWind"],
  githubUrl: "https://github.com/Bineesh627/vehicle-rental-service",
  caseStudyContent: `
<h1>Vehicle Rental Service: Fleet Management Platform</h1>
<p>An enterprise fleet management system supporting multi-tier user logins, interactive booking timelines, real-time inventory adjustments, and billing calculations.</p>
<h2>The Challenge</h2>
<p>Managing vehicle inventory without double-bookings requires thread-safe transactions, real-time validation, and complex state charts.</p>
<h2>The Solution</h2>
<p>Constructed an event-driven system checking vehicle availability indexes prior to invoice creation, keeping fleet managers synced via socket notifications.</p>
<h2>Key Technical Components</h2>
<ul>
  <li><strong>Locking mechanism:</strong> Validates inventory timeline records synchronously before transactions submit.</li>
  <li><strong>Role Access:</strong> Segregated user privileges (Admins, Managers, Clients).</li>
  <li><strong>Billing calculator:</strong> Dynamic calculation engine processing duration, season rates, and taxes.</li>
</ul>
<blockquote><p>&quot;Moving fleet inventory reconciliation to database locks resolved 100% of double-booking reservation conflicts.&quot;</p>
</blockquote>
`,
  specs: [
    {
      label: "RELEASE_MODULE",
      value: "VEHICLE_RENTAL"
    },
    {
      label: "CLASSIFICATION",
      value: "FLEET_MANAGER"
    },
    {
      label: "MOBILE_CLIENT",
      value: "Expo Router (React Native)"
    },
    {
      label: "BACKEND_API",
      value: "Django 6.0 REST Framework"
    }
  ],
  gallery: [
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=600"
  ]
});
