import type { BooleanPlanFeatureKey, NumericLimitKey } from "../../plan/plan-feature-keys.js";
import type { PlanMessageBundle } from "./types.js";

const booleanFeatureLabel: Record<BooleanPlanFeatureKey, string> = {
  textDetection: "AI-textdetektering",
  imageDetection: "AI-bilddetektering",
  fixDashboard: "Korrekturpanel",
  auditLog: "Granskningslogg",
  auditLogPdfExport: "Exportera granskningslogg som PDF",
  monthlyAutoScan: "Månatlig autoskanning",
  rewriteEngine: "Omskrivningsförslag",
  whiteLabelReports: "Rapporter med ert varumärke",
  apiAccess: "API-åtkomst",
};

function limitExceeded(key: NumericLimitKey, limit: number): string {
  switch (key) {
    case "maxItemsPerScan":
      return `Varje skanning kan omfatta upp till ${limit} produkter på din nuvarande plan. Uppgradera i Shopify-admin för att höja gränsen, eller kontakta support.`;
    case "maxShops":
      return `Din nuvarande plan omfattar ${limit} butik${limit === 1 ? "" : "er"}. Uppgradera i Shopify-admin för att lägga till fler.`;
    case "apiMonthlyCalls":
      return `Din plan omfattar ${limit} API-anrop i denna faktureringsperiod. Uppgradera i Shopify-admin, eller försök igen när perioden nollställs.`;
    case "teamMembers":
      return `Din plan omfattar ${limit} plats${limit === 1 ? "" : "er"} för teammedlem. Uppgradera i Shopify-admin för att lägga till fler.`;
  }
}

export const planBundleSv: PlanMessageBundle = {
  booleanFeatureLabel,
  featureNotOnPlan: (featureLabel: string) =>
    `Din nuvarande plan inkluderar inte ${featureLabel}. Uppgradera i Shopify-admin och försök igen.`,
  limitExceeded,
};
