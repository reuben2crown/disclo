import type { Redis } from "ioredis";
import type { PlanCache } from "./plan-resolver.js";
import { DEFAULT_PLAN_FEATURES_CACHE_KEY_PREFIX } from "./plan-resolver.js";

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

/** Drops the serialized feature row for a shop so the next `getFeatures` hits Postgres. */
export async function invalidateShopPlanFeaturesCache(
  redis: Redis,
  shopId: string,
  keyPrefix: string = DEFAULT_PLAN_FEATURES_CACHE_KEY_PREFIX,
): Promise<void> {
  await redis.del(`${keyPrefix}${shopId}`);
}
