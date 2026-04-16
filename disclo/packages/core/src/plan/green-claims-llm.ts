import type { PlanFeatures } from "./plan-features.js";

/**
 * Green-claims LLM substantiation (BE-08) is gated to Pro+ style plans.
 * Uses `rewriteEngine` on the effective plan row (same gate as rewrite engine in seed).
 */
export function greenClaimsLlmAllowedFromFeatures(
  features: PlanFeatures | null,
): boolean {
  return features?.rewriteEngine === true;
}
