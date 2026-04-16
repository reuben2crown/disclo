import type { PrismaClient } from "@disclo/db";

export type ShopScanListRow = {
  id: string;
  createdAt: string;
  scanType: string;
  status: string;
  totalItems: number | null;
  flaggedItems: number | null;
  riskScore: number | null;
};

export type LoadShopScansListOptions = {
  /** When set, only scans that have at least one item tagged with this regulation code. */
  regulationFilter?: string | null;
  sortDir?: "asc" | "desc";
  limit?: number;
};

/**
 * FE-04: scans for the embedded list (shop scoped by Shopify session domain).
 */
export async function loadShopScansForList(
  prisma: PrismaClient,
  shopDomain: string,
  opts: LoadShopScansListOptions = {},
): Promise<ShopScanListRow[]> {
  const limit = opts.limit ?? 100;
  const sortDir = opts.sortDir ?? "desc";
  const reg = opts.regulationFilter?.trim();

  const shopWhere = {
    platform: "shopify" as const,
    externalDomain: shopDomain,
  };

  const itemsFilter =
    reg && reg.length > 0
      ? { some: { regulations: { has: reg } } }
      : undefined;

  const scans = await prisma.scan.findMany({
    where: {
      shop: shopWhere,
      ...(itemsFilter ? { scanItems: itemsFilter } : {}),
    },
    orderBy: { createdAt: sortDir },
    take: limit,
    select: {
      id: true,
      createdAt: true,
      scanType: true,
      status: true,
      totalItems: true,
      flaggedItems: true,
      riskScore: true,
    },
  });

  return scans.map((s) => ({
    id: s.id,
    createdAt: s.createdAt.toISOString(),
    scanType: s.scanType,
    status: s.status,
    totalItems: s.totalItems,
    flaggedItems: s.flaggedItems,
    riskScore: s.riskScore,
  }));
}
