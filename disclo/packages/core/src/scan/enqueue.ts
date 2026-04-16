import { Queue } from "bullmq";
import { QUEUE_NAMES } from "../models/types.js";
import { getBullmqQueueOptions } from "../queue/redis-connection.js";
import {
  scanOrchestratorJobSchema,
  type ScanOrchestratorJob,
} from "./payloads.js";

/** Producer-side queue for `scan` orchestration jobs (API, embedded app, cron callbacks). */
export function createScanOrchestratorQueue(redisUrl: string): Queue {
  return new Queue(QUEUE_NAMES.scan, getBullmqQueueOptions(redisUrl));
}

/**
 * Validates and enqueues a scan orchestrator job. Close the queue when the caller is done
 * (e.g. after each HTTP request in serverless-style runtimes).
 */
export async function enqueueScanOrchestratorJob(
  queue: Queue,
  job: ScanOrchestratorJob,
  options?: { jobId?: string },
): Promise<void> {
  const payload = scanOrchestratorJobSchema.parse(job);
  await queue.add("orchestrate", payload, {
    jobId: options?.jobId,
    removeOnComplete: true,
  });
}
