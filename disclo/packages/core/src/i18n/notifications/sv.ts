import type { NotificationMessages } from "./types.js";

export const notificationMessagesSv: NotificationMessages = {
  reportScanCompleteTitle: "Din senaste skanning är klar",
  reportScanCompleteBody: (shopDomain: string) =>
    `Betyg och flaggade artiklar för ${shopDomain} är klara. Öppna Disclo från Shopify-admin för att granska dem.`,
  reportMonthlyTitle: "Din månatliga compliance-sammanfattning är klar",
  reportMonthlyBody: (shopDomain: string) =>
    `Öppna Disclo från Shopify-admin för att läsa månadssammanfattningen för ${shopDomain}.`,
  highRiskAlertTitle: "Högriskartiklar behöver granskas",
  highRiskAlertBody: (shopDomain: string) =>
    `Öppna Disclo från Shopify-admin för att granska högriskartiklar för ${shopDomain}.`,
  evidenceExpiryTitle: "Bevis närmar sig utgång",
  evidenceExpiryBody: (shopDomain: string) =>
    `Öppna Disclo från Shopify-admin för att uppdatera bevis kopplade till flaggade påståenden för ${shopDomain}.`,
};
