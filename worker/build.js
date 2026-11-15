#!/usr/bin/env node
/* =====================================================================
   worker/build.js   -   node worker/build.js

   Reads ALL portfolio data (../data/*) and writes:
     worker/worker.js    the deployable Cloudflare Worker (single file)
     worker/knowledge.md human-readable copy of everything the AI knows
   SEO data (metadata.js) and the fake sample testimonials are NOT used.
   ===================================================================== */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");

/* ---------- load site data exactly like the browser does ---------- */
const files = [...read("data/loader.js").matchAll(/"(data\/[^"]+\.js)"/g)].map((m) => m[1]);
const ctx = { window: {} };
ctx.window.SITE_DATA = { projectsData: [], blogsData: [] };
ctx.SITE_DATA = ctx.window.SITE_DATA;
vm.createContext(ctx);
for (const f of files) vm.runInContext(read(f), ctx, { filename: f });
const D = ctx.SITE_DATA;
const P = D.profile;
const BASE = P.baseUrl.replace(/\/$/, "");

/* ---------- helpers ---------- */
const ENT = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", middot: "·", rsquo: "'", lsquo: "'", ldquo: '"', rdquo: '"', ndash: "–", mdash: "—", hellip: "…" };
function strip(html) {
  return String(html || "")
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<li[^>]*>/gi, "\n- ").replace(/<\/(p|h[1-6]|div|ul|ol|blockquote)>/gi, "\n").replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (m, e) => {
      if (e[0] === "#") { const n = e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10); return String.fromCodePoint(n || 32); }
      return ENT[e.toLowerCase()] || " ";
    })
    .replace(/[ \t]+/g, " ").replace(/ ?\n ?/g, "\n").replace(/\n{2,}/g, "\n").trim();
}
const clip = (s, n) => (s.length > n ? s.slice(0, n).replace(/\s+\S*$/, "") + "…" : s);
const first = (s, n) => clip(String(s).split(/(?<=[.!?])\s/)[0], n);
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function fdate(iso) { const d = new Date(iso); return isNaN(d) ? String(iso) : `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`; }
const line = (label, v) => (v ? `${label}: ${v}` : "");
const lines = (...a) => a.filter(Boolean).join("\n");

const chunks = [];
const add = (id, keys, text, always = false) => chunks.push({ id, keys, text: text.trim(), always });

/* ---------- ALWAYS-ON CORE ---------- */
const about = P.about.paragraphs.join(" ");
add("identity", "bineesh who about overview introduction profile", lines(
  `# BINEESH S: PORTFOLIO KNOWLEDGE`,
  `## Identity`,
  `Name: ${P.name}`,
  `Roles: ${P.hero.roles.join(", ")}; also a tech entrepreneur (founder / co-founder of Fusintech, Corepro Techno LLP and Fitaval).`,
  `Location: ${P.location}`,
  `Work status: ${P.about.facts.find((f) => f.label === "Work")?.value || "Freelancer"}. ${P.cta.availability}.`,
  `Tagline: ${P.hero.description}`,
  `About: ${about}`,
  `Portfolio website: ${BASE}/`
), true);

add("contact", "contact email phone call whatsapp linkedin github instagram twitter hugging face social reach", lines(
  `## Contact and social links (share ONLY when the visitor asks)`,
  `Email: ${P.email}`,
  `Phone / WhatsApp: ${P.phoneDisplay}`,
  `Location: ${P.location}`,
  ...P.socials.filter((s) => !/whatsapp|email/i.test(s.label)).map((s) => `${s.label}: ${s.url}`),
  `Contact page: ${BASE}/contact`,
  `(WhatsApp button is added automatically by the website when the conversation reaches the closing step.)`
), true);

add("services", "service offer hire freelance work build develop price cost quote", lines(
  `## Services (what Bineesh can build for clients)`,
  ...D.servicesData.map((s) => `- ${s.title}: ${s.description} Includes: ${s.features.join(", ")}.`),
  `Engagement: freelance, contract and milestone-based projects, plus consultations. Pricing is not published; it depends on scope, and Bineesh gives a clear quote after a short discovery chat.`
), true);

add("why", "why choose work with benefits strengths", lines(
  `## Why work with Bineesh`,
  ...D.whyChooseMeData.map((w) => `- ${w.title}: ${w.description} (${w.statLabel}: ${w.statValue})`),
  `Site-stated performance indicators: ${P.performance.meters.map((m) => `${m.label} ${m.value}%`).join(", ")}.`
), true);

add("experience-brief", "experience career work job role company founder ceo cto caio intern", lines(
  `## Experience summary (newest first)`,
  ...D.experienceData.map((e) => `- ${e.title} at ${e.company} (${e.date})${e.employmentType ? ", " + e.employmentType : ""}${e.workMode ? ", " + e.workMode : ""}${e.location ? ", " + e.location : ""}`)
), true);

add("project-index", "project projects portfolio built work case study", lines(
  `## All projects (${D.projectsData.length}). For any project, share its case study page: ${BASE}/project?slug=SLUG`,
  ...D.projectsData.map((p) => `- ${p.title} [slug: ${p.slug}]: ${first(p.description, 150)}`)
), true);

add("blog-index", "blog blogs article articles post posts news event events", lines(
  `## Blog posts (${D.blogsData.length}). Share a post as: ${BASE}/blog?slug=SLUG . Blog overview: ${BASE}/blogs`,
  ...D.blogsData.map((b) => `- ${strip(b.title)} [slug: ${b.slug}] (${fdate(b.published_at)}, ${b.category}): ${clip(strip(b.excerpt), 140)}`)
), true);

add("cert-index", "certificate certificates certification certifications course courses training", lines(
  `## Certificates (${D.certificationsData.length}). Overview page: ${BASE}/certifications`,
  ...D.certificationsData.map((c) => `- ${c.title} (${c.issuer}, ${c.completionDate})`)
), true);

/* ---------- DETAIL CHUNKS (retrieved on demand) ---------- */
for (const p of D.projectsData) {
  const specs = (p.specs || []).filter((s) => s.label !== "RELEASE_MODULE").map((s) => `${s.label}: ${s.value}`).join("; ");
  add(`project-${p.slug}`, `${p.title} ${p.slug.replace(/-/g, " ")} ${(p.tags || []).join(" ")} project`, lines(
    `## Project: ${p.title}`,
    `Case study page (share this): ${BASE}/project?slug=${p.slug}`,
    p.liveUrl ? `Live website (share only if asked to see it): ${p.liveUrl}` : "",
    p.githubUrl ? `Source repository: ${p.githubUrl}` : "",
    `Technologies: ${(p.tags || []).join(", ")}`,
    `Summary: ${p.description}`,
    specs ? `Quick facts: ${specs}` : "",
    `Case study details: ${clip(strip(p.caseStudyContent).replace(/\n/g, " "), 2400)}`
  ));
}

for (const b of D.blogsData) {
  add(`blog-${b.slug}`, `${strip(b.title)} ${b.slug.replace(/-/g, " ")} ${(b.tags || []).join(" ")} ${b.category} blog`, lines(
    `## Blog post: ${strip(b.title)}`,
    `Link (share this): ${BASE}/blog?slug=${b.slug}`,
    `Published: ${fdate(b.published_at)} | Category: ${b.category} | Reading time: ${b.read_time || "n/a"} min | Tags: ${(b.tags || []).join(", ")}`,
    `Content: ${clip(strip(b.content).replace(/\n/g, " "), 2400)}`
  ));
}

for (const e of D.experienceData) {
  add(`exp-${e.id}`, `${e.company} ${e.title} experience career ${e.workMode || ""} ${e.employmentType || ""}`, lines(
    `## Experience: ${e.title} at ${e.company}`,
    `Period: ${e.date} (${e.status === "ACTIVE" ? "current role" : "completed"})`,
    line("Employment type", e.employmentType), line("Work mode", e.workMode), line("Location", e.location),
    `What he does / did: ${e.description}`,
    e.link ? `Company website (share only if asked): ${e.link}` : ""
  ));
}

add("education", "education degree college university school study studied bca qualification qualifications graduation hsc sslc", lines(
  `## Education`,
  ...D.qualificationsData.map((q) => `- ${q.degree}${q.field ? " (" + q.field + ")" : ""}, ${q.institution}, graduation/completion ${fdate(q.graduation_date)}. ${q.description}${q.highlights && q.highlights.length ? " Highlights: " + q.highlights.join("; ") : ""}`)
));

const byCat = {};
for (const s of D.skillsData) (byCat[s.category] = byCat[s.category] || []).push(`${s.name} (${s.levelLabel})`);
const catLabel = Object.fromEntries(P.skillCategories.map((c) => [c.key, c.label]));
add("skills", "skill skills tech technology stack language languages framework frameworks tools expert level python react ai ml", lines(
  `## Skills and proficiency`,
  ...Object.keys(byCat).map((k) => `- ${catLabel[k] || k}: ${byCat[k].join(", ")}`)
));

add("awards", "award awards achievement achievements honor prize recognition raman karate black belt event events", lines(
  `## Awards and achievements`,
  ...D.awardsData.map((a) => `- ${a.title} (${a.category}). ${a.description} ${(a.specs || []).map((s) => s.label + ": " + s.value).join("; ")}.${a.slug ? " Read: " + BASE + "/blog?slug=" + a.slug : ""}`)
));

add("certifications-detail", "certificate certificates certification certifications course issuer ibm outskill redteam edapt nxtwave be10x k-disc ihrd macfast ai cybersecurity", lines(
  `## Certificates in detail. Overview page: ${BASE}/certifications`,
  ...D.certificationsData.map((c) => `- ${c.title}, issued by ${c.issuer}, ${c.completionDate}. Categories: ${(c.categories || []).join(", ")}.${c.certificateId ? " ID: " + c.certificateId + "." : ""} ${c.description}`)
));

add("workflow-faq", "workflow process how work faq question price pricing cost timeline communication delivery stack languages rate payment support maintenance", lines(
  `## Frequently asked questions`,
  ...D.faqData.map((f) => `Q: ${f.question}\nA: ${f.answer}`)
));

/* ---------- assemble worker.js ---------- */
const prompt = fs.readFileSync(path.join(__dirname, "system-prompt.md"), "utf8").replace(/https:\/\/bineeshs\.vercel\.app/g, BASE);
const config = { whatsappNumber: P.whatsappNumber, baseUrl: BASE };
const template = fs.readFileSync(path.join(__dirname, "src", "worker.template.js"), "utf8");
const out = template
  .replace("/*__CONFIG__*/", () => JSON.stringify(config))
  .replace("/*__PROMPT__*/", () => JSON.stringify(prompt))
  .replace("/*__CHUNKS__*/", () => JSON.stringify(chunks, null, 1));
fs.writeFileSync(path.join(__dirname, "worker.js"), out);

fs.writeFileSync(path.join(__dirname, "knowledge.md"),
  "<!-- Generated by build.js: everything the AI knows. Always-on sections are sent with every question; the rest are retrieved when relevant. -->\n\n" +
  chunks.map((c) => c.text).join("\n\n") + "\n");

const core = chunks.filter((c) => c.always).reduce((n, c) => n + c.text.length, 0);
console.log(`chunks: ${chunks.length} (${chunks.filter((c) => c.always).length} always-on, ${core} chars) | total knowledge ${chunks.reduce((n, c) => n + c.text.length, 0)} chars | worker.js ${(out.length / 1024).toFixed(1)} KB`);
