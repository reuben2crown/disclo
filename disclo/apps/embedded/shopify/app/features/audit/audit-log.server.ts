import type { AuditLogPdfInputRow } from "@disclo/core";
import type { PrismaClient } from "@disclo/db";

export type AuditLogListRow = {
  id: string;
  action: string;
  reviewedAt: string;
  contentHash: string;
  notes: string | null;
  scanItemId: string;
  productContentId: string;
  regulations: string[];
};

const DEFAULT_TAKE = 500;

/** FE-13 / BE-11: tenant-scoped audit rows with scan item context. */
export async function loadAuditLogsForShop(
  prisma: PrismaClient,
  shopDomain: string,
  options: { regulationFilter: string | null; take?: number },
): Promise<AuditLogListRow[] | null> {
  const shop = await prisma.shop.findFirst({
    where: { platform: "shopify", externalDomain: shopDomain },
    select: { id: true },
  });
  if (!shop) {
    return null;
  }

  const take = options.take ?? DEFAULT_TAKE;
  const regulation = options.regulationFilter?.trim() || null;

  const logs = await prisma.auditLog.findMany({
    where: {
      shopId: shop.id,
      ...(regulation
        ? {
            scanItem: {
              regulations: { has: regulation },
            },
          }
        : {}),
    },
    orderBy: { reviewedAt: "desc" },
    take,
    include: {
      scanItem: {
        select: {
          id: true,
          contentId: true,
          regulations: true,
        },
      },
    },
  });

  return logs.map((l) => ({
    id: l.id,
    action: l.action,
    reviewedAt: l.reviewedAt.toISOString(),
    contentHash: l.contentHash,
    notes: l.notes,
    scanItemId: l.scanItemId,
    productContentId: l.scanItem.contentId,
    regulations: l.scanItem.regulations,
  }));
}

export function auditListRowsToPdfInput(rows: AuditLogListRow[]): AuditLogPdfInputRow[] {
  return rows.map((r) => ({
    id: r.id,
    action: r.action,
    reviewedAt: r.reviewedAt,
    contentHash: r.contentHash,
    notes: r.notes,
    scanItemId: r.scanItemId,
    productContentId: r.productContentId,
    regulations: r.regulations,
  }));
}
