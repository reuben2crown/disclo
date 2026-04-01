import "./scan-orchestrator.js";
import "./text-classifier.js";
import "./image-classifier.js";
import "./claims-checker.js";
import "./report-generator.js";
import "./evidence-verifier.js";
import "./auto-scan.js";

// Notification and retry/quota workers will be wired here as they are implemented.
console.log("Workers bootstrapped");
