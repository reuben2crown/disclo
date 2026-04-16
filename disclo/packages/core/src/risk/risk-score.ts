import type { QualityTier } from "../models/types.js";

export interface RiskScoreItemInput {
  riskLevel: QualityTier;
  /** Extra penalty when multiple regulations apply to the same item. */
  regulationCodes?: string[];
}

/**
 * 100 = fully compliant (REQUIREMENTS §7.4). Clamped 0–100.
 */
export function computeComplianceScore(items: RiskScoreItemInput[]): number {
  if (items.length === 0) {
    return 100;
  }

  const weightedPenalty = items.reduce((sum, item) => {
    let p = 0;
    if (item.riskLevel === "high") {
      p = 3;
    } else if (item.riskLevel === "review") {
      p = 1;
    }
    const regs = item.regulationCodes?.length ?? 0;
    if (regs > 1) {
      p += (regs - 1) * 0.5;
    }
    return sum + p;
  }, 0);

  const raw = 100 - (weightedPenalty / (items.length * 3)) * 100;
  return Math.max(0, Math.min(100, Math.round(raw)));
}
