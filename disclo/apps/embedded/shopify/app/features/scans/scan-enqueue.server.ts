import { createShopifyAdapter } from "@disclo/adapters";
import {
  AdapterError,
  PlanError,
  createPlanFeatureService,
  createScanOrchestratorQueue,
  enqueueScanOrchestratorJob,
  getMerchantMessages,
  listShopIdsWithMonthlyAutoScanPlan,
  loadServerEnv,
  requireFeature,
  shopifyAdminAppsSettingsUrl,
  type SupportedLocale,
} from "@disclo/core";
import { Redis } from "ioredis";
import type { PrismaClient } from "@disclo/db";
import {
  merchantCatalogAdapterError,
  merchantFullScanQueueError,
  merchantFullScanServerError,
  merchantIncrementalQueueError,
  merchantIncrementalServerError,
  merchantNoProductsError,
  merchantPlanNotSyncedError,
  merchantProductMissingError,
  merchantShopMissingError,
  merchantUnexpectedFullScanError,
  merchantUnexpectedIncrementalError,
} from "./scan-enqueue-messages.server";

export type EnqueueScanResult =
  | { ok: true; scanId: string }
  | {
      ok: false;
      error: string;
      httpStatus: number;
      /** Shopify admin deep link so the embedded app can show a one-tap CTA (plan, billing, install). */
      actionUrl?: string;
      actionLabel?: string;
    };

function shopifyAppsSettingsAction(
  locale: SupportedLocale,
  shopDomain: string,
): { actionUrl: string; actionLabel: string } {
  return {
    actionUrl: shopifyAdminAppsSettingsUrl(shopDomain),
    actionLabel: getMerchantMessages(locale).hints.openAppsToManagePlan,
  };
}

function discloErrorStatus(err: unknown, fallback: number): number {
  if (err instanceof PlanError || err instanceof AdapterError) {
    return err.httpStatus;
  }
  return fallback;
}

async function withScanQueue<T>(
  redisUrl: string,
  run: (ctx: {
    queue: ReturnType<typeof createScanOrchestratorQueue>;
    redis: Redis;
  }) => Promise<T>,
): Promise<T> {
  const queue = createScanOrchestratorQueue(redisUrl);
  const redis = new Redis(redisUrl, { maxRetriesPerRequest: null });
  try {
    return await run({ queue, redis });
  } finally {
    await queue.close();
    await redis.quit();
  }
}

/**
 * Full catalog scan for a Shopify shop (merchant button or monthly auto-scan).
 */
export async function enqueueFullShopScan(
  prisma: PrismaClient,
  shopDomain: string,
  triggeredBy: "merchant" | "system_monthly",
  locale: SupportedLocale = "en",
): Promise<EnqueueScanResult> {
  const env = loadServerEnv();
  const redisUrl = env.REDIS_URL;
  const encryptionKey = env.ENCRYPTION_KEY;
  if (!redisUrl) {
    return {
      ok: false,
      error: merchantFullScanQueueError(locale),
      httpStatus: 503,
    };
  }
  if (!encryptionKey || encryptionKey.length < 32) {
    return {
      ok: false,
      error: merchantFullScanServerError(locale),
      httpStatus: 503,
    };
  }

  const shop = await prisma.shop.findUnique({
    where: {
      platform_externalDomain: {
        platform: "shopify",
        externalDomain: shopDomain,
      },
    },
  });

  if (!shop) {
    return {
      ok: false,
      error: merchantShopMissingError(locale),
      httpStatus: 404,
      ...shopifyAppsSettingsAction(locale, shopDomain),
    };
  }

  const adapter = createShopifyAdapter({ prisma, encryptionKey });

  try {
    return await withScanQueue(redisUrl, async ({ queue, redis }) => {
      const { getFeatures } = createPlanFeatureService(prisma, redis);
      const features = await getFeatures(shop.id);
      if (!features) {
        return {
          ok: false,
          error: merchantPlanNotSyncedError(locale),
          httpStatus: 400,
          ...shopifyAppsSettingsAction(locale, shopDomain),
        };
      }

      requireFeature(features, "textDetection", locale);
      if (triggeredBy === "system_monthly") {
        requireFeature(features, "monthlyAutoScan", locale);
      }

      const all = await adapter.fetchContent(shop.id);
      const limit = features.maxItemsPerScan;
      const requests =
        limit === null || limit === undefined ? all : all.slice(0, limit);

      if (requests.length === 0) {
        return {
          ok: false,
          error: merchantNoProductsError(locale),
          httpStatus: 400,
        };
      }

      const scan = await prisma.scan.create({
        data: {
          shopId: shop.id,
          scanType: "full",
          status: "pending",
          triggeredBy,
        },
      });

      await enqueueScanOrchestratorJob(queue, {
        scanId: scan.id,
        shopId: shop.id,
        requests,
      });

      return { ok: true, scanId: scan.id };
    });
  } catch (e) {
    if (e instanceof PlanError) {
      return {
        ok: false,
        error: e.message,
        httpStatus: e.httpStatus,
        ...shopifyAppsSettingsAction(locale, shopDomain),
      };
    }
    if (e instanceof AdapterError) {
      return {
        ok: false,
        error: merchantCatalogAdapterError(locale),
        httpStatus: e.httpStatus,
      };
    }
    console.error("[disclo] enqueueFullShopScan", e);
    return {
      ok: false,
      error: merchantUnexpectedFullScanError(locale),
      httpStatus: discloErrorStatus(e, 500),
    };
  }
}

/**
 * Single-product incremental scan (webhooks).
 */
export async function enqueueProductIncrementalScan(
  prisma: PrismaClient,
  shopDomain: string,
  numericProductId: string,
  locale: SupportedLocale = "en",
): Promise<EnqueueScanResult> {
  const env = loadServerEnv();
  const redisUrl = env.REDIS_URL;
  const encryptionKey = env.ENCRYPTION_KEY;
  if (!redisUrl) {
    return {
      ok: false,
      error: merchantIncrementalQueueError(locale),
      httpStatus: 503,
    };
  }
  if (!encryptionKey || encryptionKey.length < 32) {
    return {
      ok: false,
      error: merchantIncrementalServerError(locale),
      httpStatus: 503,
    };
  }

  const shop = await prisma.shop.findUnique({
    where: {
      platform_externalDomain: {
        platform: "shopify",
        externalDomain: shopDomain,
      },
    },
  });

  if (!shop) {
    return {
      ok: false,
      error: merchantShopMissingError(locale),
      httpStatus: 404,
      ...shopifyAppsSettingsAction(locale, shopDomain),
    };
  }

  const adapter = createShopifyAdapter({ prisma, encryptionKey });

  try {
    return await withScanQueue(redisUrl, async ({ queue, redis }) => {
      const { getFeatures } = createPlanFeatureService(prisma, redis);
      const features = await getFeatures(shop.id);
      if (!features) {
        return {
          ok: false,
          error: merchantPlanNotSyncedError(locale),
          httpStatus: 400,
          ...shopifyAppsSettingsAction(locale, shopDomain),
        };
      }
      requireFeature(features, "textDetection", locale);

      const request = await adapter.fetchProductByNumericId(
        shop.id,
        numericProductId,
      );
      if (!request) {
        return {
          ok: false,
          error: merchantProductMissingError(locale),
          httpStatus: 404,
        };
      }

      const scan = await prisma.scan.create({
        data: {
          shopId: shop.id,
          scanType: "incremental",
          status: "pending",
          triggeredBy: "webhook_product",
        },
      });

      await enqueueScanOrchestratorJob(queue, {
        scanId: scan.id,
        shopId: shop.id,
        requests: [request],
      });

      return { ok: true, scanId: scan.id };
    });
  } catch (e) {
    if (e instanceof PlanError) {
      return {
        ok: false,
        error: e.message,
        httpStatus: e.httpStatus,
        ...shopifyAppsSettingsAction(locale, shopDomain),
      };
    }
    if (e instanceof AdapterError) {
      return {
        ok: false,
        error: merchantCatalogAdapterError(locale),
        httpStatus: e.httpStatus,
      };
    }
    console.error("[disclo] enqueueProductIncrementalScan", e);
    return {
      ok: false,
      error: merchantUnexpectedIncrementalError(locale),
      httpStatus: discloErrorStatus(e, 500),
    };
  }
}

export type MonthlyAutoScanBatchResult = {
  enqueued: number;
  skipped: number;
  errors: Array<{ shopId: string; message: string }>;
};

/**
 * Called from the internal HTTPS endpoint (worker tick). Workers stay free of `@disclo/adapters`.
 */
export async function enqueueMonthlyAutoScansFromPlan(
  prisma: PrismaClient,
  locale?: SupportedLocale,
): Promise<MonthlyAutoScanBatchResult> {
  const loc = locale ?? loadServerEnv().DEFAULT_LOCALE;
  const ids = await listShopIdsWithMonthlyAutoScanPlan(prisma);
  const errors: Array<{ shopId: string; message: string }> = [];
  let enqueued = 0;
  let skipped = 0;

  for (const shopId of ids) {
    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
      select: { externalDomain: true },
    });
    if (!shop) {
      skipped += 1;
      continue;
    }

    const result = await enqueueFullShopScan(
      prisma,
      shop.externalDomain,
      "system_monthly",
      loc,
    );
    if (result.ok) {
      enqueued += 1;
    } else {
      if (result.httpStatus === 403) {
        skipped += 1;
        continue;
      }
      errors.push({ shopId, message: result.error });
    }
  }

  return { enqueued, skipped, errors };
}
