import type { BooleanPlanFeatureKey, NumericLimitKey } from "../../plan/plan-feature-keys.js";
import type { PlanMessageBundle } from "./types.js";

const booleanFeatureLabel: Record<BooleanPlanFeatureKey, string> = {
  textDetection: "AI-tekstdetectie",
  imageDetection: "AI-beelddetectie",
  fixDashboard: "Correctie-dashboard",
  auditLog: "Auditlog",
  auditLogPdfExport: "Auditlog exporteren als PDF",
  monthlyAutoScan: "Maandelijkse autoscan",
  rewriteEngine: "Herschrijfsuggesties",
  whiteLabelReports: "Rapporten met uw merk",
  apiAccess: "API-toegang",
};

function limitExceeded(key: NumericLimitKey, limit: number): string {
  switch (key) {
    case "maxItemsPerScan":
      return `Elke scan kan tot ${limit} producten bevatten op uw huidige plan. Upgrade in Shopify-admin om de limiet te verhogen, of neem contact op met support.`;
    case "maxShops":
      return `Uw huidige plan omvat ${limit} winkel${limit === 1 ? "" : "en"}. Upgrade in Shopify-admin om er meer toe te voegen.`;
    case "apiMonthlyCalls":
      return `Uw plan omvat ${limit} API-aanroepen in deze factureringsperiode. Upgrade in Shopify-admin, of probeer het opnieuw na reset van de periode.`;
    case "teamMembers":
      return `Uw plan omvat ${limit} teamlid${limit === 1 ? "" : "en"}plaats${limit === 1 ? "" : "en"}. Upgrade in Shopify-admin om er meer toe te voegen.`;
  }
}

export const planBundleNl: PlanMessageBundle = {
  booleanFeatureLabel,
  featureNotOnPlan: (featureLabel: string) =>
    `Uw huidige plan bevat geen ${featureLabel}. Upgrade in Shopify-admin en probeer het opnieuw.`,
  limitExceeded,
};
