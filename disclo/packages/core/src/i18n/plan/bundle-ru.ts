import type { BooleanPlanFeatureKey, NumericLimitKey } from "../../plan/plan-feature-keys.js";
import type { PlanMessageBundle } from "./types.js";

const booleanFeatureLabel: Record<BooleanPlanFeatureKey, string> = {
  textDetection: "Распознавание текста ИИ",
  imageDetection: "Распознавание изображений ИИ",
  fixDashboard: "Панель исправлений",
  auditLog: "Журнал аудита",
  auditLogPdfExport: "Экспорт журнала аудита в PDF",
  monthlyAutoScan: "Ежемесячное автосканирование",
  rewriteEngine: "Предложения по переписыванию",
  whiteLabelReports: "Отчёты с вашим брендом",
  apiAccess: "Доступ к API",
};

function limitExceeded(key: NumericLimitKey, limit: number): string {
  switch (key) {
    case "maxItemsPerScan":
      return `На текущем плане в каждое сканирование входит не более ${limit} товаров. Повысьте план в админке Shopify или обратитесь в поддержку.`;
    case "maxShops":
      return `Текущий план включает ${limit} магазин${limit === 1 ? "" : limit < 5 ? "а" : "ов"}. Повысьте план в админке Shopify, чтобы добавить ещё.`;
    case "apiMonthlyCalls":
      return `План включает ${limit} вызовов API в этом расчётном периоде. Повысьте план в админке Shopify или повторите после сброса периода.`;
    case "teamMembers":
      return `План включает ${limit} мест${limit === 1 ? "о" : "а"} для участника команды. Повысьте план в админке Shopify, чтобы добавить ещё.`;
  }
}

export const planBundleRu: PlanMessageBundle = {
  booleanFeatureLabel,
  featureNotOnPlan: (featureLabel: string) =>
    `Текущий план не включает ${featureLabel}. Повысьте план в админке Shopify и повторите попытку.`,
  limitExceeded,
};
