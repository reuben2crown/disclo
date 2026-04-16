import type { NotificationMessages } from "./types.js";

export const notificationMessagesIt: NotificationMessages = {
  reportScanCompleteTitle: "La tua ultima scansione è completata",
  reportScanCompleteBody: (shopDomain: string) =>
    `Punteggi e articoli segnalati per ${shopDomain} sono pronti. Apri Disclo dall’admin Shopify per rivederli.`,
  reportMonthlyTitle: "Il tuo riepilogo mensile di conformità è pronto",
  reportMonthlyBody: (shopDomain: string) =>
    `Apri Disclo dall’admin Shopify per leggere il riepilogo mensile di ${shopDomain}.`,
};
