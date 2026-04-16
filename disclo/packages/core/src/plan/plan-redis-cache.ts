import type { Redis } from "ioredis";
import type { PlanCache } from "./plan-resolver.js";

/** Redis-backed cache for serialized `PlanFeatures` JSON. */
export function createIoredisPlanCache(redis: Redis): PlanCache {
  return {
    async get(key: string) {
      return redis.get(key);
    },
    async set(key: string, value: string, ttlSeconds: number) {
      await redis.set(key, value, "EX", ttlSeconds);
    },
  };
}
