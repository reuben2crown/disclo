import type { BooleanPlanFeatureKey, NumericLimitKey } from "../../plan/plan-feature-keys.js";
import type { PlanMessageBundle } from "./types.js";

const booleanFeatureLabel: Record<BooleanPlanFeatureKey, string> = {
  textDetection: "AI 文本检测",
  imageDetection: "AI 图片检测",
  fixDashboard: "整改控制台",
  auditLog: "审计日志",
  auditLogPdfExport: "导出审计日志为 PDF",
  monthlyAutoScan: "每月自动扫描",
  rewriteEngine: "改写建议",
  whiteLabelReports: "带贵司品牌的报告",
  apiAccess: "API 访问",
};

function limitExceeded(key: NumericLimitKey, limit: number): string {
  switch (key) {
    case "maxItemsPerScan":
      return `在当前套餐下，每次扫描最多包含 ${limit} 个商品。请在 Shopify 后台升级套餐以提高上限，或联系支持。`;
    case "maxShops":
      return `当前套餐包含 ${limit} 个店铺。请在 Shopify 后台升级以添加更多。`;
    case "apiMonthlyCalls":
      return `套餐在本计费周期内包含 ${limit} 次 API 调用。请在 Shopify 后台升级，或在周期重置后重试。`;
    case "teamMembers":
      return `套餐包含 ${limit} 个团队成员席位。请在 Shopify 后台升级以添加更多。`;
  }
}

export const planBundleZh: PlanMessageBundle = {
  booleanFeatureLabel,
  featureNotOnPlan: (featureLabel: string) =>
    `当前套餐不包含${featureLabel}。请在 Shopify 后台升级后重试。`,
  limitExceeded,
};
