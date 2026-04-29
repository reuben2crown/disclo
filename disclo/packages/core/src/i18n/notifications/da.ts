import type { NotificationMessages } from "./types.js";

export const notificationMessagesDa: NotificationMessages = {
  reportScanCompleteTitle: "Din seneste scanning er færdig",
  reportScanCompleteBody: (shopDomain: string) =>
    `Scorer og markerede varer for ${shopDomain} er klar. Åbn Disclo fra Shopify-admin for at gennemgå dem.`,
  reportMonthlyTitle: "Din månedlige overholdelsesoversigt er klar",
  reportMonthlyBody: (shopDomain: string) =>
    `Åbn Disclo fra Shopify-admin for at læse månedsoversigten for ${shopDomain}.`,
  highRiskAlertTitle: "Varer med høj risiko skal gennemgås",
  highRiskAlertBody: (shopDomain: string) =>
    `Åbn Disclo fra Shopify-admin for at gennemgå varer med høj risiko for ${shopDomain}.`,
  evidenceExpiryTitle: "Bevis er tæt på udløb",
  evidenceExpiryBody: (shopDomain: string) =>
    `Åbn Disclo fra Shopify-admin for at opdatere beviser knyttet til markerede påstande for ${shopDomain}.`,
};
