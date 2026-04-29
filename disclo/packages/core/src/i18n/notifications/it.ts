import type { NotificationMessages } from "./types.js";

export const notificationMessagesIt: NotificationMessages = {
  reportScanCompleteTitle: "La tua ultima scansione è completata",
  reportScanCompleteBody: (shopDomain: string) =>
    `Punteggi e articoli segnalati per ${shopDomain} sono pronti. Apri Disclo dall’admin Shopify per rivederli.`,
  reportMonthlyTitle: "Il tuo riepilogo mensile di conformità è pronto",
  reportMonthlyBody: (shopDomain: string) =>
    `Apri Disclo dall’admin Shopify per leggere il riepilogo mensile di ${shopDomain}.`,
  highRiskAlertTitle: "Gli articoli ad alto rischio richiedono una revisione",
  highRiskAlertBody: (shopDomain: string) =>
    `Apri Disclo dall’admin Shopify per rivedere gli articoli ad alto rischio di ${shopDomain}.`,
  evidenceExpiryTitle: "La prova è vicina alla scadenza",
  evidenceExpiryBody: (shopDomain: string) =>
    `Apri Disclo dall’admin Shopify per aggiornare le prove collegate alle dichiarazioni segnalate di ${shopDomain}.`,
};
