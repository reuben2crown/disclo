import { Worker } from "bullmq";
import { QUEUE_NAMES } from "@disclo/core";
import { requireRedisUrl } from "./worker-connection.js";

export const autoScanWorker = new Worker(
  QUEUE_NAMES.autoScan,
  async (job) => {
    console.info(`auto-scan job ${job.id} received (placeholder)`);
  },
  { connection: { url: requireRedisUrl() } }
);

void autoScanWorker;
