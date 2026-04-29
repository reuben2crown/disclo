import "./scan/scan-orchestrator-worker.js";
import "./classify/text-classifier-worker.js";
import "./classify/image-classifier-worker.js";
import "./classify/claims-checker-worker.js";
import "./reports/report-generator-worker.js";
import "./notifications/notification-dispatcher-worker.js";
import "./evidence/evidence-verifier-worker.js";
import "./maintenance/auto-scan-worker.js";
import { registerAutoScanRepeatableJob } from "./maintenance/register-auto-scan-schedule.js";
import { registerEvidenceVerifyRepeatableJob } from "./maintenance/register-evidence-verify-schedule.js";

void registerAutoScanRepeatableJob().catch((err) =>
  console.error("registerAutoScanRepeatableJob failed", err),
);
void registerEvidenceVerifyRepeatableJob().catch((err) =>
  console.error("registerEvidenceVerifyRepeatableJob failed", err),
);

// Notification and retry/quota workers will be wired here as they are implemented.
console.log("Workers bootstrapped");
