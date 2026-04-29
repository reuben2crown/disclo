import type { PrismaClient } from "@disclo/db";
import type { Redis } from "ioredis";
import { invalidateShopPlanFeaturesCache } from "../../plan/plan-redis-cache.js";
import type {
  BillingFinalizeInput,
  BillingFinalizeResult,
} from "./billing-types.js";

/**
 * Shared post-provider billing completion: plan row updates + plan-features cache invalidation.
 * Shopify, Dodo, and future providers call this after parsing their own webhook or callback payloads.
 */
export async function finalizeBillingSubscriptionChange(args: {
  prisma: PrismaClient;
  redis: Redis | null;
  input: BillingFinalizeInput;
}): Promise<BillingFinalizeResult> {
  const { prisma, redis, input } = args;
  const {
    shopDomain,
    providerSubscriptionId,
    providerPlanSlug,
    lifecycleStatus,
  } = input;

  const shop = await prisma.shop.findFirst({
    where: { platform: "shopify", externalDomain: shopDomain },
    select: { id: true },
  });
  if (!shop) return { ok: false, reason: "shop_not_found" };

  const freePlan = await prisma.plan.findUnique({ where: { name: "free" } });
  if (!freePlan) return { ok: false, reason: "free_plan_row_missing" };

  if (lifecycleStatus === "ended") {
    await prisma.shop.update({
      where: { id: shop.id },
      data: { planId: freePlan.id, billingId: null },
    });
    if (redis) await invalidateShopPlanFeaturesCache(redis, shop.id);
    return { ok: true };
  }

  if (lifecycleStatus === "noop") {
    return { ok: true };
  }

  if (!providerPlanSlug) return { ok: false, reason: "missing_provider_plan_slug" };

  const target = await prisma.plan.findUnique({ where: { name: providerPlanSlug } });
  if (!target || !target.active) return { ok: false, reason: "unknown_plan_slug" };

  await prisma.shop.update({
    where: { id: shop.id },
    data: {
      planId: target.id,
      billingId: providerSubscriptionId,
    },
  });
  if (redis) await invalidateShopPlanFeaturesCache(redis, shop.id);
  return { ok: true };
}
