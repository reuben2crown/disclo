import { Worker } from "bullmq";
import { QUEUE_NAMES, getBullmqQueueOptions } from "@disclo/core";
import { requireRedisUrl } from "./worker-connection.js";

export const reportGeneratorWorker = new Worker(
  QUEUE_NAMES.report,
  async (job) => {
    console.info(`report-generator job ${job.id} received (placeholder)`);
  },
  getBullmqQueueOptions(requireRedisUrl()),
);

void reportGeneratorWorker;
