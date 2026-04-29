export type ShopNotificationPrefs = {
  notifyScanComplete: boolean;
  notifyHighRisk: boolean;
};

export function defaultNotificationPreferences(): ShopNotificationPrefs {
  return { notifyScanComplete: true, notifyHighRisk: true };
}

/** Missing `shop_settings` row uses the same defaults as new Prisma rows. */
export function resolveNotificationPreferences(
  row: ShopNotificationPrefs | null | undefined,
): ShopNotificationPrefs {
  if (!row) return defaultNotificationPreferences();
  return row;
}

export function shouldEnqueueScanCompleteNotification(prefs: ShopNotificationPrefs): boolean {
  return prefs.notifyScanComplete;
}

export function shouldEnqueueHighRiskNotification(prefs: ShopNotificationPrefs): boolean {
  return prefs.notifyHighRisk;
}
