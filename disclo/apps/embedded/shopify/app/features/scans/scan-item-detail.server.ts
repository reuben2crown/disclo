import type { PrismaClient } from "@disclo/db";
import { createShopifyAdapter } from "@disclo/adapters";
import { getRegulationByCode } from "@disclo/core/regulations";

export type ScanItemRowForList = {
  id: string;
  contentId: string;
  contentType: string;
  riskLevel: string;
  status: string;
  aiProbability: string | null;
};

/** FE-05: list items for a tenant-owned scan (progress page, item links). */
export async function listScanItemsForTenantScan(
  prisma: PrismaClient,
  shopDomain: string,
  scanId: string,
): Promise<ScanItemRowForList[] | null> {
  const scan = await prisma.scan.findFirst({
    where: {
      id: scanId,
      shop: { platform: "shopify", externalDomain: shopDomain },
    },
    select: { id: true },
  });
  if (!scan) {
    return null;
  }
  const items = await prisma.scanItem.findMany({
    where: { scanId },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      contentId: true,
      contentType: true,
      riskLevel: true,
      status: true,
      aiProbability: true,
    },
  });
  return items.map((i) => ({
    ...i,
    aiProbability: i.aiProbability?.toString() ?? null,
  }));
}

export type ScanItemAuditRow = {
  id: string;
  action: string;
  reviewedAt: string;
  notes: string | null;
};

export type ScanItemDetailPayload = {
  scan: { id: string; status: string; completedAt: string | null };
  item: {
    id: string;
    contentId: string;
    contentType: string;
    field: string;
    riskLevel: string;
    status: string;
    regulations: string[];
    flaggedClaims: string[];
    aiProbability: string | null;
    contentHash: string;
  };
  audits: ScanItemAuditRow[];
  regulationLabels: Array<{ code: string; displayName: string }>;
  productPreview: { title: string; bodyExcerpt: string } | null;
};

function excerptBody(body: string, maxChars: number): string {
  const t = body.trim();
  if (t.length <= maxChars) {
    return t;
  }
  return `${t.slice(0, maxChars)}…`;
}

/** FE-05: tenant-scoped scan item with audit history and optional Shopify preview. */
export async function loadScanItemDetail(
  prisma: PrismaClient,
  shopDomain: string,
  scanId: string,
  itemId: string,
  options?: { encryptionKey?: string },
): Promise<ScanItemDetailPayload | null> {
  const item = await prisma.scanItem.findFirst({
    where: {
      id: itemId,
      scanId,
      shop: { platform: "shopify", externalDomain: shopDomain },
    },
    include: {
      scan: { select: { id: true, status: true, completedAt: true } },
      auditLogs: {
        orderBy: { createdAt: "desc" },
        take: 50,
        select: { id: true, action: true, reviewedAt: true, notes: true },
      },
    },
  });

  if (!item) {
    return null;
  }

  const regulationLabels = item.regulations.map((code) => {
    const c = getRegulationByCode(code);
    return {
      code,
      displayName: c?.displayName ?? code,
    };
  });

  let productPreview: { title: string; bodyExcerpt: string } | null = null;
  const key = options?.encryptionKey;
  if (key && key.length >= 32 && item.platform === "shopify") {
    try {
      const adapter = createShopifyAdapter({ prisma, encryptionKey: key });
      const req = await adapter.fetchProductByNumericId(
        item.shopId,
        item.contentId,
      );
      if (req) {
        const title = req.fields.title?.trim() ?? "";
        const body = req.fields.body?.trim() ?? "";
        productPreview = {
          title: title || `Product ${item.contentId}`,
          bodyExcerpt: excerptBody(`${title}\n\n${body}`.trim(), 4000),
        };
      }
    } catch {
      productPreview = null;
    }
  }

  return {
    scan: {
      id: item.scan.id,
      status: item.scan.status,
      completedAt: item.scan.completedAt
        ? item.scan.completedAt.toISOString()
        : null,
    },
    item: {
      id: item.id,
      contentId: item.contentId,
      contentType: item.contentType,
      field: item.field,
      riskLevel: item.riskLevel,
      status: item.status,
      regulations: item.regulations,
      flaggedClaims: item.flaggedClaims,
      aiProbability: item.aiProbability?.toString() ?? null,
      contentHash: item.contentHash,
    },
    audits: item.auditLogs.map((a) => ({
      id: a.id,
      action: a.action,
      reviewedAt: a.reviewedAt.toISOString(),
      notes: a.notes,
    })),
    regulationLabels,
    productPreview,
  };
}
