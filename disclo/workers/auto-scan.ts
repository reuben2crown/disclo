import { Worker } from "bullmq";
import { QUEUE_NAMES, getBullmqQueueOptions } from "@disclo/core";
import { requireRedisUrl } from "./worker-connection.js";

export const autoScanWorker = new Worker(
  QUEUE_NAMES.autoScan,
  async (job) => {
    console.info(`auto-scan job ${job.id} received (placeholder)`);
  },
  getBullmqQueueOptions(requireRedisUrl()),
);

void autoScanWorker;
