/** In-app notification copy produced by workers (English). */
export const notificationMessagesEn = {
  reportScanCompleteTitle: "Your latest scan is done",
  reportScanCompleteBody: (shopDomain: string) =>
    `Scores and flagged items for ${shopDomain} are ready. Open Disclo from Shopify admin to review them.`,
  reportMonthlyTitle: "Your monthly compliance summary is ready",
  reportMonthlyBody: (shopDomain: string) =>
    `Open Disclo from Shopify admin to read the monthly summary for ${shopDomain}.`,
  highRiskAlertTitle: "High-risk items need review",
  highRiskAlertBody: (shopDomain: string) =>
    `Open Disclo from Shopify admin to review high-risk items for ${shopDomain}.`,
  evidenceExpiryTitle: "Evidence is close to expiry",
  evidenceExpiryBody: (shopDomain: string) =>
    `Open Disclo from Shopify admin to refresh evidence linked to flagged claims for ${shopDomain}.`,
};
