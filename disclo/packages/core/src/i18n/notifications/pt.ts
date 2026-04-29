import type { NotificationMessages } from "./types.js";

export const notificationMessagesPt: NotificationMessages = {
  reportScanCompleteTitle: "A sua última análise terminou",
  reportScanCompleteBody: (shopDomain: string) =>
    `As pontuações e os artigos sinalizados de ${shopDomain} estão prontos. Abra o Disclo a partir do admin Shopify para os rever.`,
  reportMonthlyTitle: "O seu resumo mensal de conformidade está pronto",
  reportMonthlyBody: (shopDomain: string) =>
    `Abra o Disclo a partir do admin Shopify para ler o resumo mensal de ${shopDomain}.`,
  highRiskAlertTitle: "Itens de alto risco precisam de revisão",
  highRiskAlertBody: (shopDomain: string) =>
    `Abra o Disclo a partir do admin Shopify para rever itens de alto risco de ${shopDomain}.`,
  evidenceExpiryTitle: "A evidência está perto de expirar",
  evidenceExpiryBody: (shopDomain: string) =>
    `Abra o Disclo a partir do admin Shopify para renovar a evidência ligada a alegações assinaladas de ${shopDomain}.`,
};
