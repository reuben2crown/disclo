import type { BooleanPlanFeatureKey, NumericLimitKey } from "../../plan/plan-feature-keys.js";

export type PlanMessageBundle = {
  booleanFeatureLabel: Record<BooleanPlanFeatureKey, string>;
  featureNotOnPlan: (featureLabel: string) => string;
  limitExceeded: (key: NumericLimitKey, limit: number) => string;
};
