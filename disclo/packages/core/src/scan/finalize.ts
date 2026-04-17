import type { PrismaClient } from "@disclo/db";
import type { QualityTier } from "../models/types.js";
import { computeComplianceScore } from "../risk/risk-score.js";

/**
 * When every scan item is `classified`, sets scan `completed`, `riskScore`, `completedAt`.
 */
export async function finalizeScanIfComplete(
  prisma: PrismaClient,
  scanId: string,
): Promise<void> {
  const scan = await prisma.scan.findUnique({
    where: { id: scanId },
    include: { scanItems: true },
  });
  if (!scan || scan.totalItems == null || scan.totalItems === 0) {
    return;
  }

  const processed = scan.scanItems.filter(
    (i) =>
      i.status === "classified" ||
      i.status === "exempted" ||
      i.status === "labelled",
  );
  if (processed.length < scan.totalItems) {
    return;
  }

  const itemsForScore = scan.scanItems.filter(
    (i) => i.status !== "exempted",
  );
  if (itemsForScore.length === 0) {
    await prisma.scan.update({
      where: { id: scanId },
      data: {
        status: "completed",
        riskScore: 100,
        completedAt: new Date(),
        flaggedItems: 0,
      },
    });
    return;
  }

  const score = computeComplianceScore(
    itemsForScore.map((i) => ({
      riskLevel: i.riskLevel as QualityTier,
      regulationCodes: i.regulations,
    })),
  );

  await prisma.scan.update({
    where: { id: scanId },
    data: {
      status: "completed",
      riskScore: score,
      completedAt: new Date(),
      flaggedItems: itemsForScore.filter((i) => i.riskLevel !== "none").length,
    },
  });
}

/**
 * Recompute compliance score and flagged count for a scan that already finished.
 * Call after post-complete item updates (for example Apply label).
 */
export async function refreshCompletedScanAggregates(
  prisma: PrismaClient,
  scanId: string,
): Promise<void> {
  const scan = await prisma.scan.findUnique({
    where: { id: scanId },
    include: { scanItems: true },
  });
  if (!scan || scan.status !== "completed") {
    return;
  }

  const itemsForScore = scan.scanItems.filter((i) => i.status !== "exempted");
  if (itemsForScore.length === 0) {
    await prisma.scan.update({
      where: { id: scanId },
      data: {
        riskScore: 100,
        flaggedItems: 0,
      },
    });
    return;
  }

  const score = computeComplianceScore(
    itemsForScore.map((i) => ({
      riskLevel: i.riskLevel as QualityTier,
      regulationCodes: i.regulations,
    })),
  );

  await prisma.scan.update({
    where: { id: scanId },
    data: {
      riskScore: score,
      flaggedItems: itemsForScore.filter((i) => i.riskLevel !== "none").length,
    },
  });
}
