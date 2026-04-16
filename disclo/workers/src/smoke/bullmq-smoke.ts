/**
 * INFRA-07 smoke: enqueue one job and process it with a disposable worker.
 * Run from monorepo root: `pnpm smoke:bullmq` (loads `disclo/.env` via dotenv-cli).
 */
import { Queue, Worker } from "bullmq";
import { getBullmqQueueOptions } from "@disclo/core";

const url = process.env.REDIS_URL;
if (!url) {
  console.error("REDIS_URL is not set. Add Upstash URL to disclo/.env.");
  process.exit(1);
}

const queueOpts = getBullmqQueueOptions(url);
const queueName = `infra-smoke-${Date.now()}`;

let processed = false;
const worker = new Worker(
  queueName,
  async () => {
    processed = true;
  },
  queueOpts,
);

const queue = new Queue(queueName, queueOpts);

try {
  await queue.add("ping", { ok: true });
  const deadline = Date.now() + 15_000;
  while (!processed && Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 100));
  }
  if (!processed) {
    throw new Error("Job was not processed within 15s");
  }
  console.log("BullMQ smoke OK (enqueue + worker consume)");
} finally {
  await worker.close();
  await queue.close();
}
