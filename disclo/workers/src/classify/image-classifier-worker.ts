import { Worker } from "bullmq";
import { QUEUE_NAMES, getBullmqQueueOptions } from "@disclo/core";
import { requireRedisUrl } from "../lib/worker-connection.js";

/**
 * Reserved for future split: Hive runs in `text-classifier-worker.ts` per-item pipeline today.
 */
export const imageClassifierWorker = new Worker(
  QUEUE_NAMES.imageClassify,
  async (job) => {
    console.info(
      `image-classifier job ${job.id} skipped (images classified in text-classify worker)`,
    );
  },
  getBullmqQueueOptions(requireRedisUrl()),
);

void imageClassifierWorker;
