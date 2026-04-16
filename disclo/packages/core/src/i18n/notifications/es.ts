import type { NotificationMessages } from "./types.js";

export const notificationMessagesEs: NotificationMessages = {
  reportScanCompleteTitle: "Tu último análisis ha terminado",
  reportScanCompleteBody: (shopDomain: string) =>
    `Los resultados y los artículos marcados de ${shopDomain} están listos. Abre Disclo desde el admin de Shopify para revisarlos.`,
  reportMonthlyTitle: "Tu resumen mensual de cumplimiento está listo",
  reportMonthlyBody: (shopDomain: string) =>
    `Abre Disclo desde el admin de Shopify para leer el resumen mensual de ${shopDomain}.`,
};
