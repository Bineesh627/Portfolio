/* Project #17: AgriCrop AI — Smart Crop Recommendation & Analytics
   caseStudyContent is plain HTML (h1/h2/p/ul/blockquote...). */
SITE_DATA.projectsData.push({
  id: 17,
  slug: "agricrop-ai",
  title: "AgriCrop AI — Smart Crop Recommendation & Analytics",
  description: "A Django and scikit-learn web app that recommends the best crop from soil nutrients (N, P, K, pH) and climate (temperature, humidity, rainfall), with a crop library, prediction history and farmer/admin roles.",
  image: "assets/img/projects/new/cover-agricrop.webp",
  tags: ["Python", "Django", "Scikit-Learn", "Random Forest", "Pandas", "NumPy", "SQLite", "JavaScript"],
  githubUrl: "https://github.com/Bineesh627/agricrop_ai",
  caseStudyContent: `
<h1>AgriCrop AI: Know What to Grow Before You Plant</h1>
<p>AgriCrop AI helps farmers, advisors and researchers choose the most suitable crop for their land. It combines a trained machine-learning model with a practical crop knowledge base inside a Django web app.</p>
<h2>How It Works</h2>
<ul>
<li>The user enters soil nutrient levels (<strong>Nitrogen, Phosphorus, Potassium</strong>) and <strong>pH</strong>, plus <strong>temperature, humidity and rainfall</strong>.</li>
<li>Inputs are scaled and passed to a <strong>Random Forest classifier</strong> (an ensemble of 100 decision trees) trained on a crop-recommendation dataset.</li>
<li>The app returns the recommended crop with supporting agronomic guidance.</li>
</ul>
<h2>Features</h2>
<ul>
<li><strong>Crop library:</strong> ideal growing conditions, fertiliser split-dosing, water needs and harvest periods for cereals, pulses, fruits and cash crops, seeded from a structured catalogue.</li>
<li><strong>Prediction history</strong> so logged-in users can review past recommendations.</li>
<li><strong>Roles:</strong> Farmer and Administrator profiles; admins can retrain the model from within the app.</li>
<li><strong>Feedback and support</strong> form to reach the administrators.</li>
<li><strong>Seed scripts</strong> that populate the database with standard crop profiles.</li>
</ul>
<h2>Tech Stack</h2>
<ul><li>Python, Django 4.2, SQLite</li><li>Scikit-Learn, Pandas, NumPy, Joblib</li><li>HTML, CSS, JavaScript and Font Awesome</li></ul>
`,
  specs: [
    { label: "Category", value: "Agri-Tech ML Application" },
    { label: "Model", value: "Random Forest Classifier" },
    { label: "Inputs", value: "N · P · K · pH · Temp · Humidity · Rainfall" },
    { label: "Users", value: "Farmers · Administrators" }
  ],
  gallery: []
});
