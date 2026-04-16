import { Worker } from "bullmq";
import { QUEUE_NAMES, getBullmqQueueOptions } from "@disclo/core";
import { requireRedisUrl } from "../lib/worker-connection.js";

export const evidenceVerifierWorker = new Worker(
  QUEUE_NAMES.evidenceVerify,
  async (job) => {
    console.info(`evidence-verifier job ${job.id} received (placeholder)`);
  },
  getBullmqQueueOptions(requireRedisUrl()),
);

void evidenceVerifierWorker;
