import type { NotificationMessages } from "./types.js";

export const notificationMessagesJa: NotificationMessages = {
  reportScanCompleteTitle: "直近のスキャンが完了しました",
  reportScanCompleteBody: (shopDomain: string) =>
    `${shopDomain} のスコアとフラグ付き項目の準備ができました。Shopify 管理画面から Disclo を開いて確認してください。`,
  reportMonthlyTitle: "月次コンプライアンス概要の準備ができました",
  reportMonthlyBody: (shopDomain: string) =>
    `${shopDomain} の月次概要を読むには、Shopify 管理画面から Disclo を開いてください。`,
};
