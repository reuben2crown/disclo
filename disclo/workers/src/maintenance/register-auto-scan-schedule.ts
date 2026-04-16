import { Queue } from "bullmq";
import { QUEUE_NAMES, getBullmqQueueOptions } from "@disclo/core";
import { requireRedisUrl } from "../lib/worker-connection.js";

/**
 * Registers a monthly BullMQ repeatable job on `auto-scan`. Safe to call on every worker boot;
 * BullMQ dedupes by repeat key + job id.
 */
export async function registerAutoScanRepeatableJob(): Promise<void> {
  const opts = getBullmqQueueOptions(requireRedisUrl());
  const q = new Queue(QUEUE_NAMES.autoScan, opts);
  try {
    await q.add(
      "monthly-tick",
      { source: "repeatable" },
      {
        repeat: { pattern: "0 6 1 * *" },
        jobId: "disclo-auto-scan-monthly-cron",
      },
    );
  } finally {
    await q.close();
  }
}
