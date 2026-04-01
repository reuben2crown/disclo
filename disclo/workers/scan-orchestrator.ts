/**
 * Scan orchestrator worker entrypoint.
 * Deploy as a separate Railway service; connects to Redis + Postgres via jobs.
 */
import { Queue } from "bullmq";
import { QUEUE_NAMES, getBullmqQueueOptions } from "@disclo/core";
import { requireRedisUrl } from "./worker-connection.js";

export const scanQueue = new Queue(
  QUEUE_NAMES.scan,
  getBullmqQueueOptions(requireRedisUrl()),
);

void scanQueue;
