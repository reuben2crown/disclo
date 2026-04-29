import type { PrismaClient } from "@disclo/db";
import type { Redis } from "ioredis";
import {
  parseAppSubscriptionWebhookPayload,
  parsePlanSlugFromDiscloSubscriptionName,
  subscriptionStatusIsEnded,
  subscriptionStatusIsLive,
} from "./subscription-payload.server.js";
import { finalizeBillingSubscriptionChange } from "@disclo/core";

/**
 * Updates `shops.plan_id`, `shops.billing_id`, and clears plan cache after a verified
 * `APP_SUBSCRIPTIONS_UPDATE` webhook.
 */
export async function syncShopPlanFromAppSubscriptionsWebhook(args: {
  prisma: PrismaClient;
  redis: Redis | null;
  shopDomain: string;
  payload: unknown;
}): Promise<{ ok: true } | { ok: false; reason: string }> {
  const { prisma, redis, shopDomain, payload } = args;

  const parsed = parseAppSubscriptionWebhookPayload(payload);
  if (!parsed) {
    return { ok: false, reason: "missing_subscription_fields" };
  }

  const status = parsed.status;
  const billingId = parsed.adminGraphqlApiId ?? null;

  if (subscriptionStatusIsEnded(status)) {
    return finalizeBillingSubscriptionChange({
      prisma,
      redis,
      input: {
        shopDomain,
        providerSubscriptionId: null,
        providerPlanSlug: null,
        lifecycleStatus: "ended",
      },
    });
  }

  if (!subscriptionStatusIsLive(status)) {
    return finalizeBillingSubscriptionChange({
      prisma,
      redis,
      input: {
        shopDomain,
        providerSubscriptionId: billingId,
        providerPlanSlug: null,
        lifecycleStatus: "noop",
      },
    });
  }

  const slug = parsePlanSlugFromDiscloSubscriptionName(parsed.name);
  if (!slug) {
    console.warn(
      `[billing] APP_SUBSCRIPTIONS_UPDATE unmapped subscription name="${parsed.name}" shop=${shopDomain}`,
    );
    return { ok: false, reason: "unmapped_subscription_name" };
  }
  const result = await finalizeBillingSubscriptionChange({
    prisma,
    redis,
    input: {
      shopDomain,
      providerSubscriptionId: billingId,
      providerPlanSlug: slug,
      lifecycleStatus: "live",
    },
  });
  if (!result.ok && result.reason === "unknown_plan_slug") {
    console.warn(
      `[billing] APP_SUBSCRIPTIONS_UPDATE unknown plan slug="${slug}" shop=${shopDomain}`,
    );
  }
  return result;
}
