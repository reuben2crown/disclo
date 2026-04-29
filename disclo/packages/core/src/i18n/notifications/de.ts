import type { NotificationMessages } from "./types.js";

export const notificationMessagesDe: NotificationMessages = {
  reportScanCompleteTitle: "Ihr letzter Scan ist fertig",
  reportScanCompleteBody: (shopDomain: string) =>
    `Ergebnisse und markierte Artikel für ${shopDomain} sind bereit. Öffnen Sie Disclo aus dem Shopify-Admin, um sie zu prüfen.`,
  reportMonthlyTitle: "Ihre monatliche Compliance-Zusammenfassung ist bereit",
  reportMonthlyBody: (shopDomain: string) =>
    `Öffnen Sie Disclo aus dem Shopify-Admin, um die Monatsübersicht für ${shopDomain} zu lesen.`,
  highRiskAlertTitle: "Risikoreiche Inhalte prüfen",
  highRiskAlertBody: (shopDomain: string) =>
    `Öffnen Sie Disclo aus dem Shopify-Admin, um risikoreiche Inhalte für ${shopDomain} zu prüfen.`,
  evidenceExpiryTitle: "Nachweis läuft bald ab",
  evidenceExpiryBody: (shopDomain: string) =>
    `Öffnen Sie Disclo aus dem Shopify-Admin, um Nachweise für ${shopDomain} zu aktualisieren.`,
};
