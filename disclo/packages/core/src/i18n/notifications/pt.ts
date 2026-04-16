import type { NotificationMessages } from "./types.js";

export const notificationMessagesPt: NotificationMessages = {
  reportScanCompleteTitle: "A sua última análise terminou",
  reportScanCompleteBody: (shopDomain: string) =>
    `As pontuações e os artigos sinalizados de ${shopDomain} estão prontos. Abra o Disclo a partir do admin Shopify para os rever.`,
  reportMonthlyTitle: "O seu resumo mensal de conformidade está pronto",
  reportMonthlyBody: (shopDomain: string) =>
    `Abra o Disclo a partir do admin Shopify para ler o resumo mensal de ${shopDomain}.`,
};
