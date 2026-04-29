import type { ActionFunctionArgs } from "@remix-run/node";
import { loadServerEnv } from "@disclo/core";
import { Redis } from "ioredis";
import { syncShopPlanFromAppSubscriptionsWebhook } from "../../features/billing/subscription-sync.server.js";
import prisma from "../../db.server.js";
import { authenticate } from "../../shopify.server.js";

/**
 * BE-21: APP_SUBSCRIPTIONS_UPDATE — sync `shops.billing_id`, `shops.plan_id`, plan feature cache.
 */
export const action = async ({ request }: ActionFunctionArgs) => {
  const { topic, shop, payload } = await authenticate.webhook(request);
  const env = loadServerEnv();
  const redisUrl = env.REDIS_URL;
  let redis: Redis | null = null;
  if (redisUrl) {
    redis = new Redis(redisUrl, { maxRetriesPerRequest: null });
  }
  try {
    const result = await syncShopPlanFromAppSubscriptionsWebhook({
      prisma,
      redis,
      shopDomain: shop,
      payload,
    });
    if (!result.ok && result.reason !== "missing_subscription_fields") {
      console.warn(`[webhook] ${topic} shop=${shop}`, result);
    }
  } catch (err) {
    console.error(`[webhook] ${topic} shop=${shop}`, err);
  } finally {
    if (redis) {
      await redis.quit();
    }
  }
  return new Response();
};

export default function AppSubscriptionsUpdateWebhook() {
  return null;
}
