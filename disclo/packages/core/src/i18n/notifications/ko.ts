import type { NotificationMessages } from "./types.js";

export const notificationMessagesKo: NotificationMessages = {
  reportScanCompleteTitle: "최근 스캰이 완료되었습니다",
  reportScanCompleteBody: (shopDomain: string) =>
    `${shopDomain}의 점수와 표시된 항목이 준비되었습니다. Shopify 관리자에서 Disclo를 열어 확인하세요.`,
  reportMonthlyTitle: "월간 준수 요약이 준비되었습니다",
  reportMonthlyBody: (shopDomain: string) =>
    `${shopDomain}의 월간 요약을 읽으려면 Shopify 관리자에서 Disclo를 여세요.`,
  highRiskAlertTitle: "고위험 항목 검토가 필요합니다",
  highRiskAlertBody: (shopDomain: string) =>
    `${shopDomain}의 고위험 항목을 검토하려면 Shopify 관리자에서 Disclo를 여세요.`,
  evidenceExpiryTitle: "증빙 만료가 임박했습니다",
  evidenceExpiryBody: (shopDomain: string) =>
    `${shopDomain}의 표시된 주장에 연결된 증빙을 갱신하려면 Shopify 관리자에서 Disclo를 여세요.`,
};
