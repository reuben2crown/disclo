import type { ConnectionOptions } from "bullmq";

/**
 * BullMQ / ioredis connection options from `REDIS_URL` (e.g. Upstash `rediss://`).
 */
export function getBullmqConnectionFromUrl(redisUrl: string): ConnectionOptions {
  return {
    url: redisUrl,
    maxRetriesPerRequest: null,
  };
}

export function requireRedisUrl(): string {
  const url = process.env.REDIS_URL;
  if (!url) {
    throw new Error("REDIS_URL is required for queue workers");
  }
  return url;
}
