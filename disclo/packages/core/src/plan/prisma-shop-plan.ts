import type { PrismaClient } from "@disclo/db";
import type { PlanOverrideInput, PlanRowSnapshot } from "./plan-features.js";
import type { ShopPlanRow } from "./plan-resolver.js";

function planRowFromDb(plan: {
  id: string;
  name: string;
  displayName: string;
  maxItemsPerScan: number | null;
  textDetection: boolean;
  imageDetection: boolean;
  fixDashboard: boolean;
  auditLog: boolean;
  auditLogPdfExport: boolean;
  monthlyAutoScan: boolean;
  rewriteEngine: boolean;
  maxShops: number | null;
  whiteLabelReports: boolean;
  apiAccess: boolean;
  apiMonthlyCalls: number | null;
  teamMembers: number;
  slaSupport: string;
}): PlanRowSnapshot {
  return {
    id: plan.id,
    name: plan.name,
    displayName: plan.displayName,
    maxItemsPerScan: plan.maxItemsPerScan,
    textDetection: plan.textDetection,
    imageDetection: plan.imageDetection,
    fixDashboard: plan.fixDashboard,
    auditLog: plan.auditLog,
    auditLogPdfExport: plan.auditLogPdfExport,
    monthlyAutoScan: plan.monthlyAutoScan,
    rewriteEngine: plan.rewriteEngine,
    maxShops: plan.maxShops,
    whiteLabelReports: plan.whiteLabelReports,
    apiAccess: plan.apiAccess,
    apiMonthlyCalls: plan.apiMonthlyCalls,
    teamMembers: plan.teamMembers,
    slaSupport: plan.slaSupport,
  };
}

function overrideFromDb(override: {
  overrides: unknown;
  expiresAt: Date | null;
}): PlanOverrideInput {
  return {
    overrides: override.overrides,
    expiresAt: override.expiresAt,
  };
}

/** Loads shop + plan + optional override for `createGetFeatures` + Prisma. */
export function createPrismaFetchShopPlan(
  prisma: PrismaClient,
): (shopId: string) => Promise<ShopPlanRow | null> {
  return async (shopId: string) => {
    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
      include: { plan: true, planOverride: true },
    });
    if (!shop) {
      return null;
    }
    return {
      plan: planRowFromDb(shop.plan),
      planOverride: shop.planOverride
        ? overrideFromDb(shop.planOverride)
        : null,
    };
  };
}
