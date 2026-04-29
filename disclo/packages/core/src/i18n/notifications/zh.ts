import type { NotificationMessages } from "./types.js";

export const notificationMessagesZh: NotificationMessages = {
  reportScanCompleteTitle: "最近一次扫描已完成",
  reportScanCompleteBody: (shopDomain: string) =>
    `${shopDomain} 的分数与已标记条目已就绪。请从 Shopify 后台打开 Disclo 查看。`,
  reportMonthlyTitle: "月度合规摘要已就绪",
  reportMonthlyBody: (shopDomain: string) =>
    `请从 Shopify 后台打开 Disclo，阅读 ${shopDomain} 的月度摘要。`,
  highRiskAlertTitle: "高风险条目需要处理",
  highRiskAlertBody: (shopDomain: string) =>
    `请从 Shopify 后台打开 Disclo，检查 ${shopDomain} 的高风险条目。`,
  evidenceExpiryTitle: "证据即将过期",
  evidenceExpiryBody: (shopDomain: string) =>
    `请从 Shopify 后台打开 Disclo，更新与 ${shopDomain} 已标记声明关联的证据。`,
};
