import type { PrismaClient } from "@disclo/db";

/**
 * Shops whose **plan** includes monthly auto-scan (BE-19).
 * Adapter fetch + `scan` enqueue still happen outside the BullMQ-only worker boundary.
 */
export async function listShopIdsWithMonthlyAutoScanPlan(
  prisma: PrismaClient,
): Promise<string[]> {
  const rows = await prisma.shop.findMany({
    where: { plan: { monthlyAutoScan: true } },
    select: { id: true },
  });
  return rows.map((r) => r.id);
}
