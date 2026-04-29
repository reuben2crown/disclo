import type { NotificationMessages } from "./types.js";

export const notificationMessagesPl: NotificationMessages = {
  reportScanCompleteTitle: "Ostatni skan się zakończył",
  reportScanCompleteBody: (shopDomain: string) =>
    `Wyniki i oflagowane pozycje dla ${shopDomain} są gotowe. Otwórz Disclo z panelu Shopify, aby je przejrzeć.`,
  reportMonthlyTitle: "Miesięczne podsumowanie zgodności jest gotowe",
  reportMonthlyBody: (shopDomain: string) =>
    `Otwórz Disclo z panelu Shopify, aby przeczytać miesięczne podsumowanie dla ${shopDomain}.`,
  highRiskAlertTitle: "Pozycje o wysokim ryzyku wymagają przeglądu",
  highRiskAlertBody: (shopDomain: string) =>
    `Otwórz Disclo z panelu Shopify, aby przejrzeć pozycje o wysokim ryzyku dla ${shopDomain}.`,
  evidenceExpiryTitle: "Dowód zbliża się do wygaśnięcia",
  evidenceExpiryBody: (shopDomain: string) =>
    `Otwórz Disclo z panelu Shopify, aby odświeżyć dowody powiązane z oznaczonymi twierdzeniami dla ${shopDomain}.`,
};
