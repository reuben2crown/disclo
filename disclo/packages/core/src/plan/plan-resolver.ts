import type { PlanFeatures } from "./plan-features.js";
import { buildPlanFeatures, type PlanOverrideInput, type PlanRowSnapshot } from "./plan-features.js";

export const DEFAULT_PLAN_FEATURES_TTL_SECONDS = 300;

export interface PlanCache {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttlSeconds: number): Promise<void>;
}

export interface ShopPlanRow {
  plan: PlanRowSnapshot;
  planOverride: PlanOverrideInput | null;
}

export interface CreateGetFeaturesOptions {
  cache: PlanCache;
  fetchRow: (shopId: string) => Promise<ShopPlanRow | null>;
  ttlSeconds?: number;
  cacheKeyPrefix?: string;
}

function defaultCacheKey(prefix: string, shopId: string): string {
  return `${prefix}${shopId}`;
}

/**
 * Cached plan feature resolver. Postgres (via `fetchRow`) is the source of truth;
 * Redis (via `cache`) reduces load with a short TTL.
 */
export function createGetFeatures(options: CreateGetFeaturesOptions) {
  const ttlSeconds = options.ttlSeconds ?? DEFAULT_PLAN_FEATURES_TTL_SECONDS;
  const cacheKeyPrefix = options.cacheKeyPrefix ?? "disclo:plan_features:";

  return async function getFeatures(
    shopId: string,
    opts?: { skipCache?: boolean },
  ): Promise<PlanFeatures | null> {
    const key = defaultCacheKey(cacheKeyPrefix, shopId);

    if (!opts?.skipCache) {
      const hit = await options.cache.get(key);
      if (hit) {
        try {
          return JSON.parse(hit) as PlanFeatures;
        } catch {
          /* stale or corrupt cache — refetch */
        }
      }
    }

    const row = await options.fetchRow(shopId);
    if (!row) {
      return null;
    }

    const features = buildPlanFeatures(row.plan, row.planOverride);
    await options.cache.set(key, JSON.stringify(features), ttlSeconds);
    return features;
  };
}
