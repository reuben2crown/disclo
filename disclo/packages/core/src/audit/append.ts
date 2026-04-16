import type { PrismaClient } from "@disclo/db";
import type { RegulationCode } from "../models/types.js";
import { ValidationError } from "../utils/errors.js";
import type { AuditAction } from "./actions.js";

export interface AppendAuditLogInput {
  scanItemId: string;
  shopId: string;
  action: AuditAction;
  /** Hash of the content at the time of this action (SHA-256 hex). */
  contentHash: string;
  /**
   * When set, must match `scan_items.content_hash` or append fails (stale UI / race).
   */
  expectedScanItemContentHash?: string;
  reviewerName?: string;
  reviewerEmail?: string;
  notes?: string;
  createdByUserId?: string;
  evidenceItemId?: string;
  /** Optional regulation codes cited for this action (stored in `notes` prefix). */
  regulationCitations?: RegulationCode[];
}

function mergeNotes(
  base: string | undefined,
  citations: RegulationCode[] | undefined,
): string | null {
  const parts: string[] = [];
  if (citations?.length) {
    parts.push(`Citations: ${citations.join(", ")}`);
  }
  if (base?.trim()) {
    parts.push(base.trim());
  }
  if (parts.length === 0) {
    return null;
  }
  return parts.join("\n");
}

/**
 * Append-only audit row. Validates shop ownership and content-hash consistency.
 */
export async function appendAuditLog(
  prisma: PrismaClient,
  input: AppendAuditLogInput,
): Promise<{ id: string }> {
  const scanItem = await prisma.scanItem.findUnique({
    where: { id: input.scanItemId },
  });
  if (!scanItem) {
    throw new ValidationError(`Scan item not found: ${input.scanItemId}`);
  }
  if (scanItem.shopId !== input.shopId) {
    throw new ValidationError("shopId does not match scan item");
  }
  if (
    input.expectedScanItemContentHash != null &&
    scanItem.contentHash !== input.expectedScanItemContentHash
  ) {
    throw new ValidationError("Content hash mismatch; entry is stale");
  }
  if (input.action === "human_reviewed" && !input.reviewerName?.trim()) {
    throw new ValidationError("reviewerName is required for human_reviewed");
  }

  const notes = mergeNotes(input.notes, input.regulationCitations);

  const row = await prisma.auditLog.create({
    data: {
      scanItemId: input.scanItemId,
      shopId: input.shopId,
      action: input.action,
      contentHash: input.contentHash,
      reviewerName: input.reviewerName ?? null,
      reviewerEmail: input.reviewerEmail ?? null,
      notes,
      createdByUserId: input.createdByUserId ?? null,
      evidenceItemId: input.evidenceItemId ?? null,
    },
  });
  return { id: row.id };
}
