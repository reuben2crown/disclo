import { Worker } from "bullmq";
import { QUEUE_NAMES } from "@disclo/core";
import { requireRedisUrl } from "./worker-connection.js";

export const imageClassifierWorker = new Worker(
  QUEUE_NAMES.imageClassify,
  async (job) => {
    console.info(`image-classifier job ${job.id} received (placeholder)`);
  },
  { connection: { url: requireRedisUrl() } }
);

void imageClassifierWorker;
