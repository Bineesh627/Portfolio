/* Project #1: Rag Chatbot
   caseStudyContent is plain HTML (h1/h2/p/ul/blockquote...). Use ${'$'}{...} only if you need a literal dollar-brace. */
SITE_DATA.projectsData.push({
  id: 1,
  slug: "rag-chatbot",
  title: "RAG Chatbot — AI College Assistant",
  description: "Developed a college chatbot leveraging Retrieval-Augmented Generation (RAG) in collaboration with the principal. The system employs intelligent agents to extract information from the college website and PDF documents, all managed through a dedicated admin panel for seamless operation.",
  image: "assets/img/projects/project-img1.webp",
  tags: ["Python", "Bootstrap", "Django", "Langchain", "HTML", "CSS", "Javascript", "Numpy"],
  githubUrl: "https://github.com/Bineesh627/college_chatbot",
  caseStudyContent: `
<h1>RAG Chatbot: Context-Aware College Assistant</h1>
<p>This case study explores the development of an intelligent query resolver developed for academic institutions. By utilizing advanced Retrieval-Augmented Generation (RAG) pipelines, the chatbot extracts, sanitizes, and presents context-grounded information to students, faculty, and visitors directly from institutional web archives and PDF records.</p>
<h2>The Challenge</h2>
<p>Academic databases and institutional portals contain scattered documents (circulars, course catalogs, exam timetables) making it difficult for users to resolve routine queries instantly, placing a heavy load on support desks.</p>
<h2>The Solution</h2>
<p>We implemented a Langchain-driven ingestion engine that indexes documents into vector spaces. Coupled with local Ollama LLMs and integrated with a Django-based admin panel, it supports real-time source citations and system dashboard management.</p>
<h2>Key Technical Components</h2>
<ul>
  <li><strong>Vector Ingestion Pipeline:</strong> Dynamic indexing of PDF schedules and HTML scraping scripts.</li>
  <li><strong>Context-Grounded Generation:</strong> Prompt layouts structured to prevent LLM hallucinations.</li>
  <li><strong>Admin Dashboard:</strong> Diagnostic panel to audit queries and fine-tune ingestion indices.</li>
  <li><strong>Source Citation:</strong> Highlights exact file pathways and text contexts used to build answers.</li>
</ul>
<blockquote><p>&quot;Moving search queries from standard indexing to vector semantic search reduced repetitive student support tickets by 60% within the initial semester of pilot execution.&quot;</p>
</blockquote>
`,
  specs: [
    {
      label: "RELEASE_MODULE",
      value: "RAG_CHATBOT"
    },
    {
      label: "CLASSIFICATION",
      value: "OPEN_SOURCE"
    },
    {
      label: "DATABASE_ENGINE",
      value: "ChromaDB"
    },
    {
      label: "NLP_FRAMEWORK",
      value: "Langchain"
    }
  ],
  gallery: [
    "assets/img/projects/project-img1.webp",
    "https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600"
  ]
});
