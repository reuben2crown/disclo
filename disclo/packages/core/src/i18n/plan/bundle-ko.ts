import type { BooleanPlanFeatureKey, NumericLimitKey } from "../../plan/plan-feature-keys.js";
import type { PlanMessageBundle } from "./types.js";

const booleanFeatureLabel: Record<BooleanPlanFeatureKey, string> = {
  textDetection: "AI 텍스트 감지",
  imageDetection: "AI 이미지 감지",
  fixDashboard: "수정 대시보드",
  auditLog: "감사 로그",
  auditLogPdfExport: "감사 로그 PDF 보내기",
  monthlyAutoScan: "월간 자동 스캔",
  rewriteEngine: "다시 쓰기 제안",
  whiteLabelReports: "브랜드에 맞는 보고서",
  apiAccess: "API 액세스",
};

function limitExceeded(key: NumericLimitKey, limit: number): string {
  switch (key) {
    case "maxItemsPerScan":
      return `현재 요금제에서는 스캔당 최대 ${limit}개 상품이 포함됩니다. 한도를 올리려면 Shopify 관리자에서 업그레이드하거나 지원팀에 문의하세요.`;
    case "maxShops":
      return `현재 요금제에는 ${limit}개 스토어가 포함됩니다. 더 추가하려면 Shopify 관리자에서 업그레이드하세요.`;
    case "apiMonthlyCalls":
      return `요금제에는 이 청구 기간에 ${limit}회의 API 호출이 포함됩니다. Shopify 관리자에서 업그레이드하거나 기간이 바뀐 뒤 다시 시도하세요.`;
    case "teamMembers":
      return `요금제에는 팀 멤버 ${limit}석이 포함됩니다. 더 추가하려면 Shopify 관리자에서 업그레이드하세요.`;
  }
}

export const planBundleKo: PlanMessageBundle = {
  booleanFeatureLabel,
  featureNotOnPlan: (featureLabel: string) =>
    `현재 요금제에 ${featureLabel}이(가) 포함되어 있지 않습니다. Shopify 관리자에서 업그레이드한 뒤 다시 시도하세요.`,
  limitExceeded,
};
