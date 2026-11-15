/* Project #19: Fitaval — Multi-Tenant Fitness Business Platform
   caseStudyContent is plain HTML. liveUrl / githubUrl are optional. */
SITE_DATA.projectsData.push({
  id: 19,
  slug: "fitaval",
  title: "Fitaval — Multi-Tenant Fitness Business Platform",
  description: "A complete fitness-business ecosystem: a member mobile app, a gym management CRM and a super-admin console, giving gym owners, staff, trainers and platform operators one connected system.",
  image: "assets/img/projects/new/cover-fitaval.webp",
  tags: ["Flutter", "Dart", "React", "JavaScript", "Mobile App", "Web CRM", "Multi-Tenant", "Role-Based Access"],
  liveUrl: "https://www.fitaval.com/",
  caseStudyContent: `
<h1>Fitaval: One Platform for the Whole Fitness Business</h1>
<p>Fitaval is a multi-tenant fitness club management platform I co-founded and lead as <strong>CTO</strong>. It replaces the patchwork of disconnected tools gyms rely on with a single connected system for owners, staff, trainers, members and the platform team itself.</p>
<h2>The Problem</h2>
<p>Gyms typically run member records, attendance, subscriptions, payments, staff schedules and reviews in separate tools. Owners lack a clear picture, front-desk teams repeat work, and onboarding a new gym is slow.</p>
<h2>Three Connected Surfaces</h2>
<ul>
<li><strong>Member mobile app:</strong> onboarding, sign-in, discovery, memberships, profile, notifications and settings, built mobile-first for Android and iOS.</li>
<li><strong>Gym management CRM:</strong> dashboard metrics, member and attendance monitoring, plans and pricing, subscriptions, payments and finance views, staff and trainer records, and review management.</li>
<li><strong>Super-admin console:</strong> gym registration review and verification, multi-gym oversight, payout and settlement management, and audit and security visibility.</li>
</ul>
<p>A <strong>unified sign-in portal</strong> routes each person to the right experience for their role.</p>
<h2>Who It Serves</h2>
<ul>
<li><strong>Gym owners:</strong> run the business from one dashboard.</li>
<li><strong>Front-desk staff:</strong> check attendance and assist onboarding.</li>
<li><strong>Trainers:</strong> manage profiles, schedules and assignments.</li>
<li><strong>Platform administrators:</strong> verify gyms and oversee the network.</li>
</ul>
<h2>What Makes It Hard</h2>
<p>Several gyms share one platform, so every role and tenant boundary has to be precise. Subscriptions, wallets, payments and attendance must stay consistent with each other, and the product has to feel simple to a gym owner while carrying a lot of business logic underneath.</p>
<blockquote><p>The goal is not another gym app. It is a business operating system for fitness.</p></blockquote>
<h2>My Role</h2>
<p>As co-founder and CTO I own product architecture, engineering delivery and the technical roadmap across the mobile app and web platforms.</p>
<p>Visit <a href="https://www.fitaval.com/" target="_blank" rel="noopener noreferrer">fitaval.com</a>.</p>
`,
  specs: [
    { label: "Category", value: "Fitness SaaS Platform" },
    { label: "Surfaces", value: "Mobile App \u00b7 Gym CRM \u00b7 Super Admin" },
    { label: "My Role", value: "Co-founder & CTO" },
    { label: "Model", value: "Multi-tenant, role-based" }
  ],
  gallery: []
});
