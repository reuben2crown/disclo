import { Worker } from "bullmq";
import { QUEUE_NAMES, getBullmqQueueOptions, loadServerEnv } from "@disclo/core";
import { requireRedisUrl } from "../lib/worker-connection.js";

/**
 * BE-19: repeatable tick hits the Shopify app internal URL so enqueue stays out of workers.
 */
export const autoScanWorker = new Worker(
  QUEUE_NAMES.autoScan,
  async (job) => {
    const env = loadServerEnv();
    const appUrl = env.SHOPIFY_APP_URL;
    const secret = env.INTERNAL_API_SECRET;
    if (!appUrl || !secret) {
      console.warn(
        `auto-scan job ${job.id}: skip — SHOPIFY_APP_URL or INTERNAL_API_SECRET not set`,
      );
      return;
    }

    const url = new URL("/internal/monthly-scan", appUrl).toString();
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
    });

    const body = await res.text();
    if (!res.ok) {
      console.error(
        `auto-scan job ${job.id}: internal scan HTTP ${res.status} — ${body.slice(0, 500)}`,
      );
      return;
    }

    console.info(`auto-scan job ${job.id}: internal monthly-scan ok — ${body.slice(0, 300)}`);
  },
  getBullmqQueueOptions(requireRedisUrl()),
);

void autoScanWorker;
