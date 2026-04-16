import type { PrismaClient } from "@disclo/db";
import { resolveRegulationsForMarkets } from "@disclo/core/regulations";

export type RegulationSummary = {
  code: string;
  displayName: string;
  category: string;
};

export type RiskBreakdown = {
  total: number;
  none: number;
  review: number;
  high: number;
};

export type ActiveScanSummary = {
  id: string;
  status: string;
  totalItems: number | null;
  processedItems: number;
  progressPct: number;
};

export type DashboardShopSnapshot = {
  shopId: string;
  displayLabel: string;
  planDisplayName: string;
  targetMarkets: string[];
  /** Latest scan by createdAt (any status). */
  lastScanId: string | null;
  lastScanAt: string | null;
  lastScanStatus: string | null;
  /** Score from latest completed scan, or latest scan if it completed. */
  displayRiskScore: number | null;
  activeScan: ActiveScanSummary | null;
  /** From most recent completed scan with items. */
  riskBreakdown: RiskBreakdown | null;
  applicableRegulations: RegulationSummary[];
  onboarding: {
    shopLinked: boolean;
    marketsConfigured: boolean;
    firstScanComplete: boolean;
  };
};

function scanItemGroupCount(
  c: number | { _all: number } | null,
): number {
  if (c == null) {
    return 0;
  }
  return typeof c === "number" ? c : c._all;
}

function countProcessedItems(
  groups: Array<{ status: string; _count: number }>,
): number {
  let n = 0;
  for (const g of groups) {
    if (g.status === "classified" || g.status === "exempted") {
      n += g._count;
    }
  }
  return n;
}

/**
 * Loads shop, regulations, scan summaries, and risk breakdown for the embedded dashboard (FE-02).
 */
export async function getDashboardShopSnapshot(
  prisma: PrismaClient,
  shopDomain: string,
): Promise<DashboardShopSnapshot | null> {
  const shop = await prisma.shop.findUnique({
    where: {
      platform_externalDomain: {
        platform: "shopify",
        externalDomain: shopDomain,
      },
    },
    include: {
      plan: true,
      shopSettings: true,
    },
  });

  if (!shop) {
    return null;
  }

  const targetMarkets = shop.shopSettings?.targetMarkets?.length
    ? shop.shopSettings.targetMarkets
    : ["EU"];

  const applicableRegulations = resolveRegulationsForMarkets(targetMarkets).map(
    (r) => ({
      code: r.code,
      displayName: r.displayName,
      category: r.category,
    }),
  );

  const latestScan = await prisma.scan.findFirst({
    where: { shopId: shop.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      status: true,
      startedAt: true,
      completedAt: true,
      riskScore: true,
      totalItems: true,
    },
  });

  const lastScanAt =
    latestScan?.completedAt ?? latestScan?.startedAt ?? null;

  const lastCompleted = await prisma.scan.findFirst({
    where: { shopId: shop.id, status: "completed" },
    orderBy: { completedAt: "desc" },
    select: {
      id: true,
      riskScore: true,
      completedAt: true,
      scanItems: { select: { riskLevel: true } },
    },
  });

  let riskBreakdown: RiskBreakdown | null = null;
  if (lastCompleted?.scanItems.length) {
    const items = lastCompleted.scanItems;
    riskBreakdown = {
      total: items.length,
      none: items.filter((i) => i.riskLevel === "none").length,
      review: items.filter((i) => i.riskLevel === "review").length,
      high: items.filter((i) => i.riskLevel === "high").length,
    };
  }

  let displayRiskScore: number | null = null;
  if (latestScan?.status === "completed" && latestScan.riskScore != null) {
    displayRiskScore = latestScan.riskScore;
  } else if (lastCompleted?.riskScore != null) {
    displayRiskScore = lastCompleted.riskScore;
  }

  let activeScan: ActiveScanSummary | null = null;
  if (
    latestScan &&
    (latestScan.status === "pending" || latestScan.status === "running")
  ) {
    const groups = await prisma.scanItem.groupBy({
      by: ["status"],
      where: { scanId: latestScan.id },
      _count: true,
    });
    const mapped = groups.map((g) => ({
      status: g.status,
      _count: scanItemGroupCount(g._count),
    }));
    const processedItems = countProcessedItems(mapped);
    const totalItems = latestScan.totalItems;
    const progressPct =
      totalItems != null && totalItems > 0
        ? Math.min(100, Math.round((processedItems / totalItems) * 100))
        : 0;

    activeScan = {
      id: latestScan.id,
      status: latestScan.status,
      totalItems,
      processedItems,
      progressPct,
    };
  }

  return {
    shopId: shop.id,
    displayLabel: shop.displayName ?? shop.externalDomain,
    planDisplayName: shop.plan.displayName,
    targetMarkets,
    lastScanId: latestScan?.id ?? null,
    lastScanAt: lastScanAt ? lastScanAt.toISOString() : null,
    lastScanStatus: latestScan?.status ?? null,
    displayRiskScore,
    activeScan,
    riskBreakdown,
    applicableRegulations,
    onboarding: {
      shopLinked: true,
      marketsConfigured: targetMarkets.length > 0,
      firstScanComplete: lastCompleted != null,
    },
  };
}
