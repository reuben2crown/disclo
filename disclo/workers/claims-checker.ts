import { Worker } from "bullmq";
import { QUEUE_NAMES, getBullmqQueueOptions } from "@disclo/core";
import { requireRedisUrl } from "./worker-connection.js";

export const claimsCheckerWorker = new Worker(
  QUEUE_NAMES.claimsCheck,
  async (job) => {
    console.info(`claims-checker job ${job.id} received (placeholder)`);
  },
  getBullmqQueueOptions(requireRedisUrl()),
);

void claimsCheckerWorker;
