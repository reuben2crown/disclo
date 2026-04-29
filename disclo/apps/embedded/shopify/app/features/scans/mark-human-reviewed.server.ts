import type { PrismaClient } from "@disclo/db";
import {
  appendAuditLog,
  refreshCompletedScanAggregates,
  ValidationError,
} from "@disclo/core";

export type MarkHumanReviewedResult =
  | { ok: true }
  | { ok: false; error: string; httpStatus: number };

export async function markScanItemHumanReviewed(
  prisma: PrismaClient,
  input: {
    shopDomain: string;
    scanId: string;
    itemId: string;
    reviewerName: string;
    notes?: string;
  },
): Promise<MarkHumanReviewedResult> {
  const reviewerName = input.reviewerName.trim();
  if (!reviewerName) {
    return { ok: false, error: "Reviewer name is required.", httpStatus: 400 };
  }

  const shop = await prisma.shop.findFirst({
    where: { platform: "shopify", externalDomain: input.shopDomain },
    select: { id: true },
  });
  if (!shop) {
    return { ok: false, error: "Shop not found.", httpStatus: 404 };
  }

  const item = await prisma.scanItem.findFirst({
    where: {
      id: input.itemId,
      scanId: input.scanId,
      shopId: shop.id,
    },
    select: { id: true, contentHash: true, status: true },
  });
  if (!item) {
    return { ok: false, error: "Scan item not found.", httpStatus: 404 };
  }
  if (item.status === "pending") {
    return { ok: false, error: "Item is still scanning.", httpStatus: 409 };
  }

  try {
    await appendAuditLog(prisma, {
      scanItemId: item.id,
      shopId: shop.id,
      action: "human_reviewed",
      contentHash: item.contentHash,
      expectedScanItemContentHash: item.contentHash,
      reviewerName,
      notes: input.notes?.trim() || null,
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return { ok: false, error: "Item changed. Re-run scan first.", httpStatus: 409 };
    }
    throw error;
  }

  await prisma.scanItem.update({
    where: { id: item.id },
    data: { status: "exempted" },
  });
  await refreshCompletedScanAggregates(prisma, input.scanId);
  return { ok: true };
}
