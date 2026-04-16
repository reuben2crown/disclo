import type { BooleanPlanFeatureKey, NumericLimitKey } from "../../plan/plan-feature-keys.js";
import type { PlanMessageBundle } from "./types.js";

const booleanFeatureLabel: Record<BooleanPlanFeatureKey, string> = {
  textDetection: "Yapay zeka metin algılama",
  imageDetection: "Yapay zeka görsel algılama",
  fixDashboard: "Düzeltme paneli",
  auditLog: "Denetim günlüğü",
  auditLogPdfExport: "Denetim günlüğünü PDF olarak dışa aktar",
  monthlyAutoScan: "Aylık otomatik tarama",
  rewriteEngine: "Yeniden yazma önerileri",
  whiteLabelReports: "Markanıza uygun raporlar",
  apiAccess: "API erişimi",
};

function limitExceeded(key: NumericLimitKey, limit: number): string {
  switch (key) {
    case "maxItemsPerScan":
      return `Mevcut planda her tarama en fazla ${limit} ürün içerebilir. Limiti artırmak için Shopify yöneticisinden yükseltin veya destekle iletişime geçin.`;
    case "maxShops":
      return `Mevcut planınız ${limit} mağaza içerir. Daha fazlası için Shopify yöneticisinden yükseltin.`;
    case "apiMonthlyCalls":
      return `Planınız bu fatura döneminde ${limit} API çağrısı içerir. Shopify yöneticisinden yükseltin veya dönem yenilendikten sonra tekrar deneyin.`;
    case "teamMembers":
      return `Planınız ${limit} ekip üyesi kotası içerir. Daha fazlası için Shopify yöneticisinden yükseltin.`;
  }
}

export const planBundleTr: PlanMessageBundle = {
  booleanFeatureLabel,
  featureNotOnPlan: (featureLabel: string) =>
    `Mevcut planınız ${featureLabel} içermiyor. Shopify yöneticisinden yükseltip yeniden deneyin.`,
  limitExceeded,
};
