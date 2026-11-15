// Regenerates knowledge.js from ../llms.txt  ->  node build-knowledge.js
const fs = require("fs");
const k = fs.readFileSync(__dirname + "/../llms.txt", "utf8");
fs.writeFileSync(__dirname + "/knowledge.js",
  "// Generated from ../llms.txt  (re-run: node build-knowledge.js)\nexport const KNOWLEDGE = " + JSON.stringify(k) + ";\n");
console.log("knowledge.js updated (" + k.length + " chars)");
