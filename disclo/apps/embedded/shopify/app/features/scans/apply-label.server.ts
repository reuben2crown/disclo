import { createShopifyAdapter } from "@disclo/adapters";
import {
  AdapterError,
  appendAuditLog,
  createPlanFeatureService,
  getMerchantMessages,
  loadServerEnv,
  PlanError,
  refreshCompletedScanAggregates,
  requireFeature,
  shopifyAdminAppsSettingsUrl,
  ValidationError,
  type RegulationCode,
  type SupportedLocale,
} from "@disclo/core";
import { getRegulationByCode } from "@disclo/core/regulations";
import { Redis } from "ioredis";
import type { PrismaClient } from "@disclo/db";

export const AI_DISCLOSURE_METAFIELD_KEY = "eu_ai_compliance.ai_content_disclosure";

export type ApplyLabelResult =
  | { ok: true }
  | {
      ok: false;
      error: string;
      httpStatus: number;
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

/** Build storefront disclosure text from shop badge line and AI regulation citations. */
export function buildAiDisclosureLabelText(
  regulationCodes: string[],
  badgeTextShort: string,
): { labelText: string; aiRegulationCodes: RegulationCode[] } {
  const aiRegulationCodes = regulationCodes.filter((code): code is RegulationCode => {
    const c = getRegulationByCode(code);
    return c?.category === "ai_disclosure";
  });

  const citations = aiRegulationCodes
    .map((code) => getRegulationByCode(code)?.citationText)
    .filter(Boolean) as string[];

  const header =
    badgeTextShort.trim() ||
    (aiRegulationCodes[0]
      ? getRegulationByCode(aiRegulationCodes[0])?.defaultBadgeText
      : undefined) ||
    "This content was created with AI assistance.";

  const labelText =
    citations.length > 0
      ? `${header}\n\n${citations.map((c) => `• ${c}`).join("\n")}`
      : header;

  return { labelText, aiRegulationCodes };
}

/**
 * FE-06: Write AI disclosure metafield, append audit row, mark item labelled, refresh scan aggregates.
 */
export async function applyAiDisclosureLabel(
  prisma: PrismaClient,
  shopDomain: string,
  scanId: string,
  itemId: string,
  locale: SupportedLocale = "en",
): Promise<ApplyLabelResult> {
  const m = getMerchantMessages(locale);
  const env = loadServerEnv();
  const redisUrl = env.REDIS_URL;
  const encryptionKey = env.ENCRYPTION_KEY;

  if (!redisUrl) {
    return {
      ok: false,
      error: m.scanItemDetail.applyLabelQueueUnavailable,
      httpStatus: 503,
    };
  }
  if (!encryptionKey || encryptionKey.length < 32) {
    return {
      ok: false,
      error: m.scanItemDetail.applyLabelServerError,
      httpStatus: 503,
    };
  }

  const shop = await prisma.shop.findFirst({
    where: { platform: "shopify", externalDomain: shopDomain },
    select: { id: true },
  });
  if (!shop) {
    return {
      ok: false,
      error: m.scan.shopMissing,
      httpStatus: 404,
    };
  }

  const redis = new Redis(redisUrl, { maxRetriesPerRequest: null });
  try {
    const { getFeatures } = createPlanFeatureService(prisma, redis);
    const features = await getFeatures(shop.id);
    if (features == null) {
      return {
        ok: false,
        error: m.scan.planNotSynced,
        httpStatus: 400,
        ...shopifyAppsSettingsAction(locale, shopDomain),
      };
    }

    try {
      requireFeature(features, "fixDashboard", locale);
    } catch (e) {
      if (e instanceof PlanError) {
        return {
          ok: false,
          error: e.message,
          httpStatus: e.httpStatus,
          ...shopifyAppsSettingsAction(locale, shopDomain),
        };
      }
      throw e;
    }

    const item = await prisma.scanItem.findFirst({
      where: {
        id: itemId,
        scanId,
        shopId: shop.id,
      },
      include: {
        scan: { select: { id: true, status: true } },
      },
    });

    if (!item) {
      return {
        ok: false,
        error: m.scanItemDetail.itemNotFound,
        httpStatus: 404,
      };
    }

    if (item.status === "pending") {
      return {
        ok: false,
        error: m.scanItemDetail.itemStillScanning,
        httpStatus: 409,
      };
    }

    if (item.status === "exempted") {
      return {
        ok: false,
        error: m.scanItemDetail.itemExempted,
        httpStatus: 409,
      };
    }

    const settings = await prisma.shopSettings.findUnique({
      where: { shopId: shop.id },
      select: { badgeTextShort: true },
    });

    const { labelText, aiRegulationCodes } = buildAiDisclosureLabelText(
      item.regulations,
      settings?.badgeTextShort ?? "",
    );

    if (aiRegulationCodes.length === 0) {
      return {
        ok: false,
        error: m.scanItemDetail.noAiRegulations,
        httpStatus: 400,
      };
    }

    const adapter = createShopifyAdapter({ prisma, encryptionKey });

    try {
      await adapter.writeLabel({
        platform: "shopify",
        shop_id: shop.id,
        external_id: item.contentId,
        action: "add_label",
        label_text: labelText,
        meta_key: AI_DISCLOSURE_METAFIELD_KEY,
        meta_value: labelText,
      });
    } catch (e) {
      if (e instanceof AdapterError) {
        return {
          ok: false,
          error: m.scanItemDetail.applyLabelAdapterFailed(e.message),
          httpStatus: e.httpStatus,
        };
      }
      throw e;
    }

    try {
      await appendAuditLog(prisma, {
        scanItemId: item.id,
        shopId: shop.id,
        action: "labelled",
        contentHash: item.contentHash,
        expectedScanItemContentHash: item.contentHash,
        regulationCitations: aiRegulationCodes,
      });
    } catch (e) {
      if (e instanceof ValidationError) {
        return {
          ok: false,
          error: m.scanItemDetail.applyLabelStale,
          httpStatus: 409,
        };
      }
      throw e;
    }

    await prisma.scanItem.update({
      where: { id: item.id },
      data: { status: "labelled" },
    });

    await refreshCompletedScanAggregates(prisma, scanId);

    return { ok: true };
  } finally {
    await redis.quit();
  }
}
