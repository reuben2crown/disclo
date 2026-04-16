import type { NotificationMessages } from "./types.js";

export const notificationMessagesFr: NotificationMessages = {
  reportScanCompleteTitle: "Votre dernière analyse est terminée",
  reportScanCompleteBody: (shopDomain: string) =>
    `Les scores et articles signalés pour ${shopDomain} sont prêts. Ouvrez Disclo depuis l’admin Shopify pour les consulter.`,
  reportMonthlyTitle: "Votre résumé mensuel de conformité est prêt",
  reportMonthlyBody: (shopDomain: string) =>
    `Ouvrez Disclo depuis l’admin Shopify pour lire le résumé mensuel de ${shopDomain}.`,
};
