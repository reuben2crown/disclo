import { getPlanMessages } from "../i18n/plan/registry.js";
import type { SupportedLocale } from "../i18n/locale.js";
import { PlanError } from "../utils/errors.js";
import type { PlanFeatures } from "./plan-features.js";
import type { BooleanPlanFeatureKey, NumericLimitKey } from "./plan-feature-keys.js";

export type { BooleanPlanFeatureKey, NumericLimitKey } from "./plan-feature-keys.js";

export function requireFeature(
  features: PlanFeatures,
  key: BooleanPlanFeatureKey,
  locale: SupportedLocale = "en",
): void {
  const t = getPlanMessages(locale);
  if (!features[key]) {
    throw new PlanError(t.featureNotOnPlan(t.booleanFeatureLabel[key]));
  }
}

/**
 * Ensures `currentUsage` is strictly below the plan limit.
 * `null` limit means unlimited (agency/enterprise style).
 */
export function requireWithinLimit(
  features: PlanFeatures,
  key: NumericLimitKey,
  currentUsage: number,
  locale: SupportedLocale = "en",
): void {
  const limit = features[key];
  if (limit === null || limit === undefined) {
    return;
  }
  if (currentUsage >= limit) {
    const t = getPlanMessages(locale);
    throw new PlanError(t.limitExceeded(key, limit));
  }
}
