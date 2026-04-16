import type { PrismaClient } from "@disclo/db";
import type { Redis } from "ioredis";
import { createGetFeatures } from "./plan-resolver.js";
import { createPrismaFetchShopPlan } from "./prisma-shop-plan.js";
import { createIoredisPlanCache } from "./plan-redis-cache.js";

/** Wires Prisma + Redis into `getFeatures` for API and workers. */
export function createPlanFeatureService(prisma: PrismaClient, redis: Redis) {
  const cache = createIoredisPlanCache(redis);
  const fetchRow = createPrismaFetchShopPlan(prisma);
  const getFeatures = createGetFeatures({ cache, fetchRow });
  return { getFeatures };
}
