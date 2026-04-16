import type { BooleanPlanFeatureKey, NumericLimitKey } from "../../plan/plan-feature-keys.js";
import type { PlanMessageBundle } from "./types.js";

/** Exact admin path so merchants do not have to guess where to upgrade. */
const shopifyPlanStepsEn =
  "In Shopify admin, open Settings, then Apps and sales channels, then open Disclo. On that screen, choose Manage subscription or pick a plan that includes what you need.";

const booleanFeatureLabel: Record<BooleanPlanFeatureKey, string> = {
  textDetection: "AI text detection",
  imageDetection: "AI image detection",
  fixDashboard: "Fix dashboard",
  auditLog: "Audit log",
  auditLogPdfExport: "PDF audit export",
  monthlyAutoScan: "Monthly auto-scan",
  rewriteEngine: "Rewrite suggestions",
  whiteLabelReports: "Reports with your branding",
  apiAccess: "API access",
};

function limitExceeded(key: NumericLimitKey, limit: number): string {
  switch (key) {
    case "maxItemsPerScan":
      return `Each scan can include up to ${limit} products on your current plan. ${shopifyPlanStepsEn} Then return here and start a new scan. For billing help, contact support.`;
    case "maxShops":
      return `Your current plan includes ${limit} shop${limit === 1 ? "" : "s"}. ${shopifyPlanStepsEn} Then continue in Disclo.`;
    case "apiMonthlyCalls":
      return `Your plan includes ${limit} API calls this billing period. ${shopifyPlanStepsEn} Or wait until the period resets, then try again.`;
    case "teamMembers":
      return `Your plan includes ${limit} team member seat${limit === 1 ? "" : "s"}. ${shopifyPlanStepsEn} Then invite teammates again from Disclo.`;
  }
}

export const planBundleEn: PlanMessageBundle = {
  booleanFeatureLabel,
  featureNotOnPlan: (featureLabel: string) =>
    `Your current plan does not include ${featureLabel}. ${shopifyPlanStepsEn} Then return to Disclo and try again.`,
  limitExceeded,
};
