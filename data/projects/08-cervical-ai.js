/* Project #8: cervical_ai
   caseStudyContent is plain HTML (h1/h2/p/ul/blockquote...). Use ${'$'}{...} only if you need a literal dollar-brace. */
SITE_DATA.projectsData.push({
  id: 8,
  title: "Cervical AI — Federated Learning Cancer Screening",
  description: "A privacy-preserving multimodal AI system utilizing PyTorch models and the Flower federated learning framework for early cervical cancer detection.",
  image: "https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=format&fit=crop&q=80&w=800",
  tags: ["Python", "Django", "PyTorch", "Federated Learning", "Explainable AI"],
  githubUrl: "https://github.com/Bineesh627/cervical_ai",
  caseStudyContent: `
<h1>Cervical Cancer Detection with Federated Learning</h1>
<p>An advanced, privacy-preserving Multimodal AI System designed for the early detection and risk assessment of cervical cancer. By fusing clinical data (such as age, medical history, and smoking habits) with Pap smear image features, the system delivers high-accuracy diagnostic supports. Crucially, the project integrates Federated Learning (FL) to ensure absolute patient data privacy.</p>
<h2>The Challenge</h2>
<p>Early cervical cancer screening in low-resource environments suffers from a shortage of medical specialists. While centralized machine learning models can help, patient records and medical images are highly sensitive. Moving raw clinical data and medical scans to a centralized server raises severe privacy concerns, regulatory compliance issues, and data security risks.</p>
<h2>The Solution</h2>
<p>We engineered a decentralized system combining a Django web dashboard with PyTorch models and the Flower (flwr) federated learning framework. AI models train locally on client environments (hospitals/clinics), sending only updated model parameters to a central FL server rather than raw data. The application also integrates Explainable AI (XAI) tools—specifically Grad-CAM for image heatmaps and SHAP for clinical feature weights—to give clinicians transparent, interpretable diagnostic recommendations.</p>
<h2>Key Features</h2>
<ul>
  <li><strong>Multimodal Analysis:</strong> Synthesizes tabular clinical histories and digital cell imagery using feature fusion models to boost detection accuracy.</li>
  <li><strong>Federated Learning (FL):</strong> Uses Flower to execute privacy-preserving, distributed model training across client nodes without transferring raw data.</li>
  <li><strong>Explainable AI (XAI):</strong> Produces Grad-CAM overlays to highlight visual anomalies on Pap smear scans and SHAP plots to explain the impact of clinical metrics.</li>
  <li><strong>Role-Based Access Control:</strong> Distinct user paths for patients (to submit symptoms, upload scans, view predictions, and ask questions) and doctors (to review patient records, analyze XAI metrics, and answer questions).</li>
  <li><strong>Secure Web Console:</strong> Integrated Django application containing session controls, administrative logs, database state management, and real-time outputs.</li>
</ul>
<h2>Technology Stack</h2>
<ul>
  <li><strong>Backend Framework:</strong> Django (Python)</li>
  <li><strong>Machine Learning:</strong> PyTorch, Torchvision</li>
  <li><strong>Federated Learning:</strong> Flower (flwr)</li>
  <li><strong>Image Processing:</strong> OpenCV, Pillow</li>
  <li><strong>Explainability (XAI):</strong> SHAP, Grad-CAM (pytorch-gradcam)</li>
  <li><strong>Database:</strong> SQLite (default) / PostgreSQL</li>
  <li><strong>Frontend Layout:</strong> Bootstrap 5, HTML5, Vanilla CSS3, Javascript</li>
</ul>
<h2>Hugging Face Integration</h2>
<p>The custom dataset and pre-trained Vision Transformer model used inside this project are open-source and hosted on Hugging Face:</p>
<ul>
  <li><strong>Multimodal Dataset:</strong> <a href="https://huggingface.co/datasets/bineesh627/cervical-cancer-multimodal" target="_blank" rel="noopener noreferrer" class="active-tag text-decoration-none">cervical-cancer-multimodal</a></li>
  <li><strong>ViT Classification Model:</strong> <a href="https://huggingface.co/bineesh627/cervical-cancer-vit" target="_blank" rel="noopener noreferrer" class="active-tag text-decoration-none">cervical-cancer-vit</a></li>
</ul>
<blockquote><p>&quot;By distributing training locally using Flower and providing SHAP/Grad-CAM visibility, we achieve high-accuracy multimodal cancer screening without exposing sensitive patient records.&quot;</p>
</blockquote>
`,
  specs: [
    {
      label: "RELEASE_MODULE",
      value: "CERVICAL_BIOMEDICAL_AI"
    },
    {
      label: "CLASSIFICATION",
      value: "PRIVACY_PRESERVING_AI"
    },
    {
      label: "ML_ENGINE",
      value: "PyTorch & Flower (FL)"
    },
    {
      label: "EXPLAINER",
      value: "SHAP & Grad-CAM"
    }
  ],
  gallery: [
    "https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=600"
  ]
});
