/**
 * BullMQ worker: text classification (GPTZero). Implement job handler in BE-16.
 */
import { Worker } from "bullmq";
import { QUEUE_NAMES, getBullmqQueueOptions } from "@disclo/core";
import { requireRedisUrl } from "./worker-connection.js";

export const textClassifierWorker = new Worker(
  QUEUE_NAMES.textClassify,
  async (job) => {
    console.info(`text-classifier job ${job.id} received (placeholder)`);
  },
  getBullmqQueueOptions(requireRedisUrl()),
);

void textClassifierWorker;
