import type { QualityTier } from "../models/types.js";

export function maxQualityTier(a: QualityTier, b: QualityTier): QualityTier {
  const order: QualityTier[] = ["none", "review", "high"];
  return order[Math.max(order.indexOf(a), order.indexOf(b))]!;
}
