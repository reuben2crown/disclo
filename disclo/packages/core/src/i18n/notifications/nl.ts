import type { NotificationMessages } from "./types.js";

export const notificationMessagesNl: NotificationMessages = {
  reportScanCompleteTitle: "Uw laatste scan is klaar",
  reportScanCompleteBody: (shopDomain: string) =>
    `Scores en gemarkeerde items voor ${shopDomain} zijn klaar. Open Disclo vanuit Shopify-admin om ze te bekijken.`,
  reportMonthlyTitle: "Uw maandelijkse compliance-samenvatting is klaar",
  reportMonthlyBody: (shopDomain: string) =>
    `Open Disclo vanuit Shopify-admin om de maandsamenvatting voor ${shopDomain} te lezen.`,
  highRiskAlertTitle: "Items met hoog risico moeten worden beoordeeld",
  highRiskAlertBody: (shopDomain: string) =>
    `Open Disclo vanuit Shopify-admin om items met hoog risico voor ${shopDomain} te bekijken.`,
  evidenceExpiryTitle: "Bewijs verloopt bijna",
  evidenceExpiryBody: (shopDomain: string) =>
    `Open Disclo vanuit Shopify-admin om bewijs te vernieuwen dat gekoppeld is aan gemarkeerde claims voor ${shopDomain}.`,
};
