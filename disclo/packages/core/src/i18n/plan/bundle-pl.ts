import type { BooleanPlanFeatureKey, NumericLimitKey } from "../../plan/plan-feature-keys.js";
import type { PlanMessageBundle } from "./types.js";

const booleanFeatureLabel: Record<BooleanPlanFeatureKey, string> = {
  textDetection: "Wykrywanie tekstu AI",
  imageDetection: "Wykrywanie obrazów AI",
  fixDashboard: "Panel poprawek",
  auditLog: "Dziennik audytu",
  auditLogPdfExport: "Eksport dziennika audytu do PDF",
  monthlyAutoScan: "Comiesięczny autoskan",
  rewriteEngine: "Propozycje przepisania",
  whiteLabelReports: "Raporty z Twoją marką",
  apiAccess: "Dostęp do API",
};

function limitExceeded(key: NumericLimitKey, limit: number): string {
  switch (key) {
    case "maxItemsPerScan":
      return `Każdy skan może objąć do ${limit} produktów na obecnym planie. Ulepsz plan w panelu Shopify, aby podnieść limit, lub skontaktuj się z pomocą.`;
    case "maxShops":
      return `Obecny plan obejmuje ${limit} sklep${limit === 1 ? "" : limit < 5 ? "e" : "ów"}. Ulepsz plan w panelu Shopify, aby dodać więcej.`;
    case "apiMonthlyCalls":
      return `Plan obejmuje ${limit} wywołań API w tym okresie rozliczeniowym. Ulepsz plan w panelu Shopify lub spróbuj ponownie po odnowieniu okresu.`;
    case "teamMembers":
      return `Plan obejmuje ${limit} miejs${limit === 1 ? "ce" : "a"} członka zespołu. Ulepsz plan w panelu Shopify, aby dodać więcej.`;
  }
}

export const planBundlePl: PlanMessageBundle = {
  booleanFeatureLabel,
  featureNotOnPlan: (featureLabel: string) =>
    `Obecny plan nie obejmuje ${featureLabel}. Ulepsz plan w panelu Shopify i spróbuj ponownie.`,
  limitExceeded,
};
