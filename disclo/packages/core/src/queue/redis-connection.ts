import type { ConnectionOptions } from "bullmq";

/**
 * Namespace for all BullMQ Redis keys when sharing one Upstash instance with other apps.
 * BullMQ stores keys as `{prefix}:{queueName}:…` (default prefix was `bull`).
 */
export const BULLMQ_PREFIX = "disclo_";

/**
 * BullMQ / ioredis connection options from `REDIS_URL` (e.g. Upstash `rediss://`).
 */
export function getBullmqConnectionFromUrl(redisUrl: string): ConnectionOptions {
  return {
    url: redisUrl,
    maxRetriesPerRequest: null,
  };
}

/** Queue / worker options: always set `prefix` so jobs never collide with other projects on shared Redis. */
export function getBullmqQueueOptions(redisUrl: string): {
  connection: ConnectionOptions;
  prefix: string;
} {
  return {
    connection: getBullmqConnectionFromUrl(redisUrl),
    prefix: BULLMQ_PREFIX,
  };
}

export function requireRedisUrl(): string {
  const url = process.env.REDIS_URL;
  if (!url) {
    throw new Error("REDIS_URL is required for queue workers");
  }
  return url;
}
