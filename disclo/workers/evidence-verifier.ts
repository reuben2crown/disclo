import { Worker } from "bullmq";
import { QUEUE_NAMES } from "@disclo/core";
import { requireRedisUrl } from "./worker-connection.js";

export const evidenceVerifierWorker = new Worker(
  QUEUE_NAMES.evidenceVerify,
  async (job) => {
    console.info(`evidence-verifier job ${job.id} received (placeholder)`);
  },
  { connection: { url: requireRedisUrl() } }
);

void evidenceVerifierWorker;
