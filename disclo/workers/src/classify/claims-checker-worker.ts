import { Worker } from "bullmq";
import { QUEUE_NAMES, getBullmqQueueOptions } from "@disclo/core";
import { requireRedisUrl } from "../lib/worker-connection.js";

/**
 * Reserved for future split: claims run in `text-classifier-worker.ts` per-item pipeline today.
 */
export const claimsCheckerWorker = new Worker(
  QUEUE_NAMES.claimsCheck,
  async (job) => {
    console.info(
      `claims-checker job ${job.id} skipped (claims run in text-classify worker)`,
    );
  },
  getBullmqQueueOptions(requireRedisUrl()),
);

void claimsCheckerWorker;
