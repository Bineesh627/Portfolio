/* =====================================================================
   PROFILE & SITE SETTINGS
   Everything personal that shows up in the hero, about section, footer,
   contact page, buttons and filters. Edit the values - not the code.
   ===================================================================== */
SITE_DATA.profile = {

  /* ---- identity ---- */
  name: "Bineesh S",
  brandInitial: "B",                       // letter shown in the logo square
  baseUrl: "https://bineeshs.vercel.app",  // used for SEO / canonical links
  baseTitle: "Bineesh S — AI Developer, Cybersecurity Expert & Tech Entrepreneur",

  /* ---- contact ---- */
  location: "Alappuzha, Kerala, India",
  mapUrl: "https://www.google.com/maps?q=Alappuzha,+Kerala,+India",
  email: "sbineesh172@gmail.com",
  phoneDisplay: "+91 95673 14355",
  phoneLink: "tel:+919567314355",
  whatsappNumber: "919567314355",          // digits only, with country code
  githubUrl: "https://github.com/Bineesh627",

  /* ---- hero (top of the home page) ---- */
  hero: {
    greeting: "Hello, I’m",
    roles: ["AI Engineer", "AI Developer", "Python Developer", "Cybersecurity Expert"],  // typed one after another
    description: "Freelance AI Engineer and Python Developer specializing in Machine Learning, Deep Learning, and Computer Vision solutions. Dedicated to building advanced intelligent agents, training custom neural networks, and deploying secure full-stack automation pipelines.",
    image: "assets/img/profile/profile-workmode.webp",
    imageAlt: "Bineesh S — AI Engineer & Tech Founder in Work Mode",
    primaryButton: "Get in touch",
    secondaryButton: "View projects"
  },

  /* ---- about section ---- */
  about: {
    title: "About Bineesh S",
    subtitle: "Tech Innovator, AI Engineer & Founder",
    image: "assets/img/profile/profile-pic.webp",
    imageAlt: "Bineesh S — AI Developer, Cybersecurity Specialist & Tech Entrepreneur Profile",
    paragraphs: [
      "AI Engineer and Python developer specializing in advanced machine learning model development, computer vision, and privacy-preserving federated architectures. Highly motivated developer with a proven capability of training neural networks, designing intelligent agents, and deploying explainable AI tools.",
      "Leveraging deep learning frameworks (PyTorch, TensorFlow) and federated learning structures (Flower) alongside cybersecurity methodologies to architect secure, intelligence-driven software ecosystems and interactive data workspaces."
    ],
    facts: [
      { label: "Name", value: "Bineesh S" },
      { label: "Work", value: "Independent (Freelancer)" },
      { label: "Role", value: "AI Engineer" },
      { label: "Location", value: "Alappuzha, Kerala, India" }
    ],
    buttonLabel: "Work with me"
  },

  /* ---- "Why choose me" progress bars ---- */
  performance: {
    title: "Performance Overview",
    subtitle: "Readings from active client contracts",
    meters: [
      { label: "Core accuracy rating", value: 100 },
      { label: "Security compliance", value: 98 },
      { label: "On-time delivery", value: 95 }
    ]
  },

  /* ---- contact call-to-action (bottom of home page) ----
     Each topic is a quick-pick chip; picking one rewrites the WhatsApp
     message that will be pre-filled. */
  cta: {
    availability: "Open for freelance & contract projects",
    titleStart: "Got an idea?",
    titleHighlight: "Let's build it together.",
    text: "Tell me what you're working on. Pick a topic, review the message below and send it on WhatsApp, or email me if you prefer.",
    topicsLabel: "What's it about?",
    topics: [
      { label: "AI / ML project",  message: "Hi Bineesh, I saw your portfolio and I'd like to discuss an AI / machine learning project." },
      { label: "Website or app",   message: "Hi Bineesh, I saw your portfolio and I'd like to discuss a website or app project." },
      { label: "Consultation",     message: "Hi Bineesh, I saw your portfolio and I'd like to book a quick consultation." },
      { label: "Something else",   message: "Hi Bineesh, I saw your portfolio and would like to connect!" }
    ],
    buttonLabel: "Message on WhatsApp",
    emailLabel: "Send an email",
    previewHint: "This message will be pre-filled in WhatsApp"
  },

  /* ---- footer ---- */
  footer: {
    tagline: "Freelance AI Engineer & Python Developer. Designing high-performance automation agents, advanced machine learning workflows, and custom software architectures.",
    builtWith: "Built with HTML, CSS, JavaScript & Bootstrap"
  },

  /* ---- social links (footer, hero and contact page) ----
     icon: github | linkedin | huggingface | twitter | instagram | whatsapp | mail
           (or any Lucide icon name, see https://lucide.dev/icons) */
  socials: [
    { label: "GitHub",       icon: "github",      url: "https://github.com/Bineesh627" },
    { label: "LinkedIn",     icon: "linkedin",    url: "https://www.linkedin.com/in/bineesh627" },
    { label: "Hugging Face", icon: "huggingface", url: "https://huggingface.co/bineesh627" },
    { label: "Twitter",      icon: "twitter",     url: "https://twitter.com/bineesh627" },
    { label: "Instagram",    icon: "instagram",   url: "https://www.instagram.com/dream_boy_.627" },
    { label: "WhatsApp",     icon: "whatsapp",    url: "https://wa.me/+919567314355" },
    { label: "Email",        icon: "mail",        url: "mailto:sbineesh172@gmail.com" }
  ],

  /* ---- tabs / filters ---- */
  skillCategories: [                       // key must match "category" in data/skills.js
    { key: "ai",               label: "AI & ML" },
    { key: "backend",          label: "Backend" },
    { key: "cybersecurity",    label: "Cybersecurity" },
    { key: "frontend",         label: "Frontend" },
    { key: "tools",            label: "Tools" },
    { key: "entrepreneurship", label: "Entrepreneurship" }
  ],
  certificationFilters: [                  // key must match an entry of "categories" in data/certifications.js
    { key: "all",         label: "All" },
    { key: "Featured",    label: "Featured" },
    { key: "AI",          label: "AI" },
    { key: "Security",    label: "Security" },
    { key: "Cloud",       label: "Cloud" },
    { key: "Design",      label: "Design" },
    { key: "Soft",        label: "Soft" },
    { key: "Competition", label: "Competition" }
  ]
};
