import type { BooleanPlanFeatureKey, NumericLimitKey } from "../../plan/plan-feature-keys.js";
import type { PlanMessageBundle } from "./types.js";

const booleanFeatureLabel: Record<BooleanPlanFeatureKey, string> = {
  textDetection: "AI テキスト検出",
  imageDetection: "AI 画像検出",
  fixDashboard: "修正ダッシュボード",
  auditLog: "監査ログ",
  auditLogPdfExport: "監査ログを PDF でエクスポート",
  monthlyAutoScan: "毎月の自動スキャン",
  rewriteEngine: "書き換え候補",
  whiteLabelReports: "自社ブランドのレポート",
  apiAccess: "API アクセス",
};

function limitExceeded(key: NumericLimitKey, limit: number): string {
  switch (key) {
    case "maxItemsPerScan":
      return `現在のプランでは、各スキャンに最大 ${limit} 件の商品が含まれます。上限を上げるには Shopify 管理画面でアップグレードするか、サポートに連絡してください。`;
    case "maxShops":
      return `現在のプランには ${limit} 店舗が含まれます。追加するには Shopify 管理画面でアップグレードしてください。`;
    case "apiMonthlyCalls":
      return `プランにはこの請求期間で ${limit} 回の API 呼び出しが含まれます。Shopify 管理画面でアップグレードするか、期間が切り替わった後に再試行してください。`;
    case "teamMembers":
      return `プランにはチームメンバー ${limit} 席が含まれます。追加するには Shopify 管理画面でアップグレードしてください。`;
  }
}

export const planBundleJa: PlanMessageBundle = {
  booleanFeatureLabel,
  featureNotOnPlan: (featureLabel: string) =>
    `現在のプランに ${featureLabel} は含まれません。Shopify 管理画面でアップグレードしてから再試行してください。`,
  limitExceeded,
};
