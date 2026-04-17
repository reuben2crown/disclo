import type { PrismaClient } from "@disclo/db";

export type ScanProgressSnapshot = {
  id: string;
  status: string;
  totalItems: number | null;
  processedItems: number;
  progressPct: number;
  riskScore: number | null;
  completedAt: string | null;
  flaggedItems: number | null;
};

function countProcessedItems(
  groups: Array<{ status: string; _count: number }>,
): number {
  let n = 0;
  for (const g of groups) {
    if (
      g.status === "classified" ||
      g.status === "exempted" ||
      g.status === "labelled"
    ) {
      n += g._count;
    }
  }
  return n;
}

/** FE-03: tenant-scoped scan progress for polling UI. */
export async function getScanProgressSnapshot(
  prisma: PrismaClient,
  shopDomain: string,
  scanId: string,
): Promise<ScanProgressSnapshot | null> {
  const scan = await prisma.scan.findFirst({
    where: {
      id: scanId,
      shop: {
        platform: "shopify",
        externalDomain: shopDomain,
      },
    },
    select: {
      id: true,
      status: true,
      totalItems: true,
      riskScore: true,
      completedAt: true,
      flaggedItems: true,
    },
  });

  if (!scan) {
    return null;
  }

  const groups = await prisma.scanItem.groupBy({
    by: ["status"],
    where: { scanId },
    _count: true,
  });
  const mapped = groups.map((g) => {
    const c = g._count;
    const n =
      c == null ? 0 : typeof c === "number" ? c : (c as { _all: number })._all;
    return { status: g.status, _count: n };
  });
  const processedItems = countProcessedItems(mapped);
  const totalItems = scan.totalItems;
  const progressPct =
    totalItems != null && totalItems > 0
      ? Math.min(100, Math.round((processedItems / totalItems) * 100))
      : 0;

  return {
    id: scan.id,
    status: scan.status,
    totalItems,
    processedItems,
    progressPct,
    riskScore: scan.riskScore,
    completedAt: scan.completedAt ? scan.completedAt.toISOString() : null,
    flaggedItems: scan.flaggedItems,
  };
}
