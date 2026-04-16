import type { BooleanPlanFeatureKey, NumericLimitKey } from "../../plan/plan-feature-keys.js";
import type { PlanMessageBundle } from "./types.js";

const booleanFeatureLabel: Record<BooleanPlanFeatureKey, string> = {
  textDetection: "AI-tekstdetektering",
  imageDetection: "AI-billeddetektering",
  fixDashboard: "Retningsdashboard",
  auditLog: "Revisionslog",
  auditLogPdfExport: "Eksportér revisionslog som PDF",
  monthlyAutoScan: "Månedlig autoscanning",
  rewriteEngine: "Omskrivningsforslag",
  whiteLabelReports: "Rapporter med dit brand",
  apiAccess: "API-adgang",
};

function limitExceeded(key: NumericLimitKey, limit: number): string {
  switch (key) {
    case "maxItemsPerScan":
      return `Hver scanning kan omfatte op til ${limit} produkter på din nuværende plan. Opgrader i Shopify-admin for at hæve grænsen, eller kontakt support.`;
    case "maxShops":
      return `Din nuværende plan omfatter ${limit} butik${limit === 1 ? "" : "ker"}. Opgrader i Shopify-admin for at tilføje flere.`;
    case "apiMonthlyCalls":
      return `Din plan omfatter ${limit} API-kald i denne faktureringsperiode. Opgrader i Shopify-admin, eller prøv igen efter perioden nulstilles.`;
    case "teamMembers":
      return `Din plan omfatter ${limit} plads${limit === 1 ? "" : "er"} til teammedlem. Opgrader i Shopify-admin for at tilføje flere.`;
  }
}

export const planBundleDa: PlanMessageBundle = {
  booleanFeatureLabel,
  featureNotOnPlan: (featureLabel: string) =>
    `Din nuværende plan omfatter ikke ${featureLabel}. Opgrader i Shopify-admin og prøv igen.`,
  limitExceeded,
};
