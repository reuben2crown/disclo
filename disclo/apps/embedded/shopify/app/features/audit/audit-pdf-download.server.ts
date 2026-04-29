import {
  buildAuditLogPdf,
  createPlanFeatureService,
  getMerchantMessages,
  loadServerEnv,
  PlanError,
  requireFeature,
  shopifyAdminAppsSettingsUrl,
  type SupportedLocale,
} from "@disclo/core";
import { Redis } from "ioredis";
import type { PrismaClient } from "@disclo/db";
import {
  auditListRowsToPdfInput,
  loadAuditLogsForShop,
} from "./audit-log.server.js";

export type AuditPdfDownloadResult =
  | { ok: true; response: Response }
  | {
      ok: false;
      status: number;
      message: string;
      actionUrl?: string;
      actionLabel?: string;
    };

function appsSettingsAction(
  locale: SupportedLocale,
  shopDomain: string,
): { actionUrl: string; actionLabel: string } {
  return {
    actionUrl: shopifyAdminAppsSettingsUrl(shopDomain),
    actionLabel: getMerchantMessages(locale).hints.openAppsToManagePlan,
  };
}

/** BE-11: PDF bytes as downloadable Response (plan-gated: auditLogPdfExport). */
export async function buildAuditPdfDownloadResponse(
  prisma: PrismaClient,
  shopDomain: string,
  locale: SupportedLocale,
  regulationFilter: string | null,
): Promise<AuditPdfDownloadResult> {
  const m = getMerchantMessages(locale);
  const env = loadServerEnv();
  const redisUrl = env.REDIS_URL;
  if (!redisUrl) {
    return {
      ok: false,
      status: 503,
      message: m.scan.queueUnavailable,
    };
  }

  const shop = await prisma.shop.findFirst({
    where: { platform: "shopify", externalDomain: shopDomain },
    select: { id: true },
  });
  if (!shop) {
    return { ok: false, status: 404, message: m.scan.shopMissing };
  }

  const redis = new Redis(redisUrl, { maxRetriesPerRequest: null });
  try {
    const { getFeatures } = createPlanFeatureService(prisma, redis);
    const features = await getFeatures(shop.id);
    if (features == null) {
      return {
        ok: false,
        status: 400,
        message: m.scan.planNotSynced,
        ...appsSettingsAction(locale, shopDomain),
      };
    }

    try {
      requireFeature(features, "auditLogPdfExport", locale);
    } catch (e) {
      if (e instanceof PlanError) {
        return {
          ok: false,
          status: e.httpStatus,
          message: e.message,
          ...appsSettingsAction(locale, shopDomain),
        };
      }
      throw e;
    }

    const rows =
      (await loadAuditLogsForShop(prisma, shopDomain, {
        regulationFilter,
      })) ?? [];

    const pdfRows = auditListRowsToPdfInput(rows);
    const bytes = await buildAuditLogPdf({
      shopDomain,
      rows: pdfRows,
      title: "Disclo — audit log export",
      declarationLines: [
        m.auditLog.intro.split(". ")[0] + ".",
        "SHA-256 record digest covers the included entries in deterministic order (sorted by row id).",
      ],
    });

    const safeShop = shopDomain.replace(/[^a-z0-9.-]+/gi, "_");
    const filename = `disclo-audit-${safeShop}-${new Date().toISOString().slice(0, 10)}.pdf`;

    return {
      ok: true,
      response: new Response(Buffer.from(bytes), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${filename}"`,
          "Cache-Control": "no-store",
        },
      }),
    };
  } finally {
    await redis.quit();
  }
}
