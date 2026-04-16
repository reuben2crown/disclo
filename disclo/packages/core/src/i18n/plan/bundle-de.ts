import type { BooleanPlanFeatureKey, NumericLimitKey } from "../../plan/plan-feature-keys.js";
import type { PlanMessageBundle } from "./types.js";

const booleanFeatureLabel: Record<BooleanPlanFeatureKey, string> = {
  textDetection: "KI-Texterkennung",
  imageDetection: "KI-Bilderkennung",
  fixDashboard: "Korrektur-Dashboard",
  auditLog: "Auditprotokoll",
  auditLogPdfExport: "Auditprotokoll als PDF exportieren",
  monthlyAutoScan: "Monatlicher Auto-Scan",
  rewriteEngine: "Umschreibvorschläge",
  whiteLabelReports: "Berichte mit Ihrer Marke",
  apiAccess: "API-Zugriff",
};

function limitExceeded(key: NumericLimitKey, limit: number): string {
  switch (key) {
    case "maxItemsPerScan":
      return `Pro Scan sind auf Ihrem aktuellen Plan höchstens ${limit} Produkte möglich. Upgraden Sie im Shopify-Admin, um das Limit zu erhöhen, oder wenden Sie sich an den Support.`;
    case "maxShops":
      return `Ihr aktueller Plan umfasst ${limit} Shop${limit === 1 ? "" : "s"}. Upgraden Sie im Shopify-Admin, um weitere hinzuzufügen.`;
    case "apiMonthlyCalls":
      return `Ihr Plan umfasst ${limit} API-Aufrufe in diesem Abrechnungszeitraum. Upgraden Sie im Shopify-Admin, oder versuchen Sie es nach dem Zurücksetzen des Zeitraums erneut.`;
    case "teamMembers":
      return `Ihr Plan umfasst ${limit} Teammitglied${limit === 1 ? "-Platz" : "-Plätze"}. Upgraden Sie im Shopify-Admin, um weitere hinzuzufügen.`;
  }
}

export const planBundleDe: PlanMessageBundle = {
  booleanFeatureLabel,
  featureNotOnPlan: (featureLabel: string) =>
    `Ihr aktueller Plan umfasst nicht ${featureLabel}. Upgraden Sie im Shopify-Admin und versuchen Sie es erneut.`,
  limitExceeded,
};
