import type { NotificationMessages } from "./types.js";

export const notificationMessagesKo: NotificationMessages = {
  reportScanCompleteTitle: "최근 스캰이 완료되었습니다",
  reportScanCompleteBody: (shopDomain: string) =>
    `${shopDomain}의 점수와 표시된 항목이 준비되었습니다. Shopify 관리자에서 Disclo를 열어 확인하세요.`,
  reportMonthlyTitle: "월간 준수 요약이 준비되었습니다",
  reportMonthlyBody: (shopDomain: string) =>
    `${shopDomain}의 월간 요약을 읽으려면 Shopify 관리자에서 Disclo를 여세요.`,
};
