import { Worker } from "bullmq";
import { QUEUE_NAMES, getBullmqQueueOptions } from "@disclo/core";
import { requireRedisUrl } from "./worker-connection.js";

export const imageClassifierWorker = new Worker(
  QUEUE_NAMES.imageClassify,
  async (job) => {
    console.info(`image-classifier job ${job.id} received (placeholder)`);
  },
  getBullmqQueueOptions(requireRedisUrl()),
);

void imageClassifierWorker;
