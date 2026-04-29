import { Queue } from "bullmq";
import {
  QUEUE_NAMES,
  evidenceVerifyJobSchema,
  getBullmqQueueOptions,
} from "@disclo/core";
import { requireRedisUrl } from "../lib/worker-connection.js";

/** Registers daily evidence verification (safe at every boot). */
export async function registerEvidenceVerifyRepeatableJob(): Promise<void> {
  const opts = getBullmqQueueOptions(requireRedisUrl());
  const q = new Queue(QUEUE_NAMES.evidenceVerify, opts);
  try {
    const payload = evidenceVerifyJobSchema.parse({
      source: "daily-tick",
      limit: 200,
    });
    await q.add("daily-tick", payload, {
      repeat: { pattern: "0 5 * * *" },
      jobId: "disclo-evidence-verify-daily-cron",
    });
  } finally {
    await q.close();
  }
}
