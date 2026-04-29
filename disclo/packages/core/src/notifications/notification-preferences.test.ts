import { describe, expect, it } from "vitest";
import {
  defaultNotificationPreferences,
  resolveNotificationPreferences,
  shouldEnqueueHighRiskNotification,
  shouldEnqueueScanCompleteNotification,
} from "./notification-preferences.js";

describe("notification-preferences", () => {
  it("defaults both channels on when settings row is missing", () => {
    expect(resolveNotificationPreferences(null)).toEqual(defaultNotificationPreferences());
  });

  it("respects explicit false for scan complete", () => {
    const prefs = resolveNotificationPreferences({
      notifyScanComplete: false,
      notifyHighRisk: true,
    });
    expect(shouldEnqueueScanCompleteNotification(prefs)).toBe(false);
    expect(shouldEnqueueHighRiskNotification(prefs)).toBe(true);
  });

  it("respects explicit false for high risk", () => {
    const prefs = resolveNotificationPreferences({
      notifyScanComplete: true,
      notifyHighRisk: false,
    });
    expect(shouldEnqueueScanCompleteNotification(prefs)).toBe(true);
    expect(shouldEnqueueHighRiskNotification(prefs)).toBe(false);
  });
});
