import "./scan/scan-orchestrator-worker.js";
import "./classify/text-classifier-worker.js";
import "./classify/image-classifier-worker.js";
import "./classify/claims-checker-worker.js";
import "./reports/report-generator-worker.js";
import "./evidence/evidence-verifier-worker.js";
import "./maintenance/auto-scan-worker.js";
import { registerAutoScanRepeatableJob } from "./maintenance/register-auto-scan-schedule.js";

void registerAutoScanRepeatableJob().catch((err) =>
  console.error("registerAutoScanRepeatableJob failed", err),
);

// Notification and retry/quota workers will be wired here as they are implemented.
console.log("Workers bootstrapped");
