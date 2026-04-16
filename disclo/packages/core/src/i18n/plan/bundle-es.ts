import type { BooleanPlanFeatureKey, NumericLimitKey } from "../../plan/plan-feature-keys.js";
import type { PlanMessageBundle } from "./types.js";

const booleanFeatureLabel: Record<BooleanPlanFeatureKey, string> = {
  textDetection: "Detección de texto con IA",
  imageDetection: "Detección de imágenes con IA",
  fixDashboard: "Panel de correcciones",
  auditLog: "Registro de auditoría",
  auditLogPdfExport: "Exportar registro de auditoría en PDF",
  monthlyAutoScan: "Análisis automático mensual",
  rewriteEngine: "Sugerencias de reescritura",
  whiteLabelReports: "Informes con tu marca",
  apiAccess: "Acceso a la API",
};

function limitExceeded(key: NumericLimitKey, limit: number): string {
  switch (key) {
    case "maxItemsPerScan":
      return `Cada análisis puede incluir hasta ${limit} productos en tu plan actual. Mejora el plan en el admin de Shopify para subir el límite, o contacta con soporte.`;
    case "maxShops":
      return `Tu plan actual incluye ${limit} tienda${limit === 1 ? "" : "s"}. Mejora el plan en el admin de Shopify para añadir más.`;
    case "apiMonthlyCalls":
      return `Tu plan incluye ${limit} llamadas a la API en este periodo de facturación. Mejora el plan en el admin de Shopify, o vuelve a intentarlo cuando se reinicie el periodo.`;
    case "teamMembers":
      return `Tu plan incluye ${limit} plaza${limit === 1 ? "" : "s"} de miembro del equipo. Mejora el plan en el admin de Shopify para añadir más.`;
  }
}

export const planBundleEs: PlanMessageBundle = {
  booleanFeatureLabel,
  featureNotOnPlan: (featureLabel: string) =>
    `Tu plan actual no incluye ${featureLabel}. Mejora el plan en el admin de Shopify y vuelve a intentarlo.`,
  limitExceeded,
};
