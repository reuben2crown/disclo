import type { NotificationMessages } from "./types.js";

export const notificationMessagesRu: NotificationMessages = {
  reportScanCompleteTitle: "Последнее сканирование завершено",
  reportScanCompleteBody: (shopDomain: string) =>
    `Оценки и отмеченные позиции для ${shopDomain} готовы. Откройте Disclo из админки Shopify, чтобы просмотреть их.`,
  reportMonthlyTitle: "Готов ежемесячный отчёт о соответствии",
  reportMonthlyBody: (shopDomain: string) =>
    `Откройте Disclo из админки Shopify, чтобы прочитать месячную сводку для ${shopDomain}.`,
  highRiskAlertTitle: "Требуется проверка позиций с высоким риском",
  highRiskAlertBody: (shopDomain: string) =>
    `Откройте Disclo из админки Shopify, чтобы проверить позиции с высоким риском для ${shopDomain}.`,
  evidenceExpiryTitle: "Срок действия подтверждения скоро истечёт",
  evidenceExpiryBody: (shopDomain: string) =>
    `Откройте Disclo из админки Shopify, чтобы обновить подтверждения для отмеченных заявлений магазина ${shopDomain}.`,
};
