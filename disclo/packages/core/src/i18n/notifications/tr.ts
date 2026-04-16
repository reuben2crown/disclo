import type { NotificationMessages } from "./types.js";

export const notificationMessagesTr: NotificationMessages = {
  reportScanCompleteTitle: "Son taramanız bitti",
  reportScanCompleteBody: (shopDomain: string) =>
    `${shopDomain} için puanlar ve işaretli öğeler hazır. İncelemek için Shopify yöneticisinden Disclo'yu açın.`,
  reportMonthlyTitle: "Aylık uyumluluk özeti hazır",
  reportMonthlyBody: (shopDomain: string) =>
    `${shopDomain} için aylık özeti okumak üzere Shopify yöneticisinden Disclo'yu açın.`,
};
