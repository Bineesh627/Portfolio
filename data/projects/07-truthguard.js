/* Project #7: TruthGuard
   caseStudyContent is plain HTML (h1/h2/p/ul/blockquote...). Use ${'$'}{...} only if you need a literal dollar-brace. */
SITE_DATA.projectsData.push({
  id: 7,
  slug: "truthguard",
  title: "TruthGuard — LSTM-Based Fake News Detector",
  description: "A Django-based web application that uses a TensorFlow/Keras LSTM neural network to detect fake news from text or URLs in real-time.",
  image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800",
  tags: ["Django", "TensorFlow", "Python", "Bootstrap", "Tailwind CSS"],
  githubUrl: "https://github.com/Bineesh627/fakenewsdetector",
  caseStudyContent: `
<h1>TruthGuard: LSTM-Based Fake News Detector</h1>
<p>TruthGuard is a robust, full-stack Django web application designed to combat misinformation by performing real-time fake news detection on text inputs and URLs. Powering this platform is a deep learning LSTM (Long Short-Term Memory) neural network that classifies articles with high accuracy, backed by a comprehensive user ecosystem, community feedback/voting mechanisms, and an advanced administration dashboard.</p>
<h2>The Challenge</h2>
<p>The rapid dissemination of misinformation online makes manual verification impossible. Modern fake news spreads virally, requiring automated, intelligent systems that can process arbitrary text or parse articles via URLs, analyze their deep sequential and semantic patterns in real-time, and adapt to community corrections to improve classification over time.</p>
<h2>The Solution</h2>
<p>We engineered a web application using Django 4.2 integrated with a TensorFlow/Keras LSTM neural network. Users can paste text or submit URLs for instant analysis, receiving a credibility label along with a confidence score. The platform incorporates user authentication, community-driven voting on predictions, a structured correction submission framework, and an active administration panel for monitoring logs and managing retraining pipelines.</p>
<h2>Key Technical Components</h2>
<ul>
  <li><strong>LSTM Neural Network:</strong> A deep learning classifier built with TensorFlow and Keras, utilizing custom tokenization, sequence padding, and joblib/pickle serialization for highly precise sequential text classification.</li>
  <li><strong>Django Web Framework:</strong> Provides robust backend routing, session-based user authentication, database models (Predictions, Votes, Feedback, ActivityLogs), and SQLite integration.</li>
  <li><strong>Interactive Frontend:</strong> Uses Bootstrap 5 and Tailwind CSS for utility-first styling, Lucide Icons, and SweetAlert2 for beautiful, responsive alerts and status popups.</li>
  <li><strong>Community-Driven Validation:</strong> Enables users to vote (Up/Down) on predictions and submit correction feedback to flag false predictions.</li>
  <li><strong>Admin Dashboard:</strong> A comprehensive diagnostic dashboard for system stats, user management, activity log tracking, feedback review, and data export.</li>
</ul>
<h2>Hugging Face Integration</h2>
<p>The training dataset and the serialized LSTM neural network model utilized in this project are hosted and open-sourced on Hugging Face:</p>
<ul>
  <li><strong>Training Dataset:</strong> <a href="https://huggingface.co/datasets/bineesh627/real-vs-fake-news-text" target="_blank" rel="noopener noreferrer" class="active-tag text-decoration-none">real-vs-fake-news-text</a></li>
  <li><strong>LSTM Classification Model:</strong> <a href="https://huggingface.co/bineesh627/fake_news_lstm" target="_blank" rel="noopener noreferrer" class="active-tag text-decoration-none">fake_news_lstm</a></li>
</ul>
<blockquote><p>&quot;By combining an optimized LSTM sequential model with a community validation loop, TruthGuard delivers deep learning-based credibility assessments in real-time under 200 milliseconds.&quot;</p>
</blockquote>
`,
  specs: [
    {
      label: "FRAMEWORK",
      value: "Django 4.2"
    },
    {
      label: "ALGORITHM",
      value: "LSTM Neural Network"
    },
    {
      label: "DATABASE",
      value: "SQLite 3"
    },
    {
      label: "FRONTEND",
      value: "Bootstrap 5 & Tailwind"
    }
  ],
  gallery: [
    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600"
  ]
});
