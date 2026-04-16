import type { BooleanPlanFeatureKey, NumericLimitKey } from "../../plan/plan-feature-keys.js";
import type { PlanMessageBundle } from "./types.js";

const booleanFeatureLabel: Record<BooleanPlanFeatureKey, string> = {
  textDetection: "Deteção de texto por IA",
  imageDetection: "Deteção de imagem por IA",
  fixDashboard: "Painel de correções",
  auditLog: "Registo de auditoria",
  auditLogPdfExport: "Exportar registo de auditoria em PDF",
  monthlyAutoScan: "Análise automática mensal",
  rewriteEngine: "Sugestões de reescrita",
  whiteLabelReports: "Relatórios com a sua marca",
  apiAccess: "Acesso à API",
};

function limitExceeded(key: NumericLimitKey, limit: number): string {
  switch (key) {
    case "maxItemsPerScan":
      return `Cada análise pode incluir até ${limit} produtos no seu plano atual. Faça upgrade no admin Shopify para subir o limite, ou contacte o suporte.`;
    case "maxShops":
      return `O seu plano atual inclui ${limit} loja${limit === 1 ? "" : "s"}. Faça upgrade no admin Shopify para adicionar mais.`;
    case "apiMonthlyCalls":
      return `O seu plano inclui ${limit} chamadas API neste período de faturação. Faça upgrade no admin Shopify, ou tente de novo após o período reiniciar.`;
    case "teamMembers":
      return `O seu plano inclui ${limit} lugar${limit === 1 ? "" : "es"} de membro de equipa. Faça upgrade no admin Shopify para adicionar mais.`;
  }
}

export const planBundlePt: PlanMessageBundle = {
  booleanFeatureLabel,
  featureNotOnPlan: (featureLabel: string) =>
    `O seu plano atual não inclui ${featureLabel}. Faça upgrade no admin Shopify e tente de novo.`,
  limitExceeded,
};
