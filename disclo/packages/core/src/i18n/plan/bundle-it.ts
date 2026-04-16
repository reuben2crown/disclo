import type { BooleanPlanFeatureKey, NumericLimitKey } from "../../plan/plan-feature-keys.js";
import type { PlanMessageBundle } from "./types.js";

const booleanFeatureLabel: Record<BooleanPlanFeatureKey, string> = {
  textDetection: "Rilevamento testo IA",
  imageDetection: "Rilevamento immagini IA",
  fixDashboard: "Dashboard correzioni",
  auditLog: "Registro di audit",
  auditLogPdfExport: "Esporta registro di audit in PDF",
  monthlyAutoScan: "Scansione automatica mensile",
  rewriteEngine: "Suggerimenti di riscrittura",
  whiteLabelReports: "Report con il tuo marchio",
  apiAccess: "Accesso API",
};

function limitExceeded(key: NumericLimitKey, limit: number): string {
  switch (key) {
    case "maxItemsPerScan":
      return `Ogni scansione può includere fino a ${limit} prodotti sul piano attuale. Passa a un piano superiore nell’admin Shopify per alzare il limite, o contatta l’assistenza.`;
    case "maxShops":
      return `Il piano attuale include ${limit} negozio${limit === 1 ? "" : "i"}. Passa a un piano superiore nell’admin Shopify per aggiungerne altri.`;
    case "apiMonthlyCalls":
      return `Il piano include ${limit} chiamate API in questo periodo di fatturazione. Passa a un piano superiore nell’admin Shopify, o riprova dopo il reset del periodo.`;
    case "teamMembers":
      return `Il piano include ${limit} post${limit === 1 ? "o" : "i"} per membri del team. Passa a un piano superiore nell’admin Shopify per aggiungerne altri.`;
  }
}

export const planBundleIt: PlanMessageBundle = {
  booleanFeatureLabel,
  featureNotOnPlan: (featureLabel: string) =>
    `Il piano attuale non include ${featureLabel}. Passa a un piano superiore nell’admin Shopify e riprova.`,
  limitExceeded,
};
