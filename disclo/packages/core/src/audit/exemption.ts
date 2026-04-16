import type { PrismaClient } from "@disclo/db";

/**
 * Content hash from the latest `human_reviewed` audit for this scan item, if any.
 */
export async function getLatestHumanReviewedContentHash(
  prisma: PrismaClient,
  scanItemId: string,
): Promise<string | null> {
  const row = await prisma.auditLog.findFirst({
    where: { scanItemId, action: "human_reviewed" },
    orderBy: { reviewedAt: "desc" },
    select: { contentHash: true },
  });
  return row?.contentHash ?? null;
}

/**
 * Editorial exemption expires when content changes after a human review (REQUIREMENTS §10.4).
 */
export function shouldExpireEditorialExemption(
  previousReviewHash: string | null,
  currentContentHash: string,
): boolean {
  if (previousReviewHash == null) {
    return false;
  }
  return previousReviewHash !== currentContentHash;
}
