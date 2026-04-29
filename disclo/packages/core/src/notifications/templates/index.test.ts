import { describe, expect, it } from "vitest";
import { renderNotificationEmailTemplate } from "./index.js";

describe("renderNotificationEmailTemplate", () => {
  it("renders escaped title/body and link", () => {
    const out = renderNotificationEmailTemplate({
      job: {
        userId: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
        kind: "high_risk_alert",
        link: "/app/scans",
      },
      title: "High <risk>",
      body: "Review & fix",
    });
    expect(out.subject).toBe("High <risk>");
    expect(out.html).toContain("High &lt;risk&gt;");
    expect(out.html).toContain("Review &amp; fix");
    expect(out.html).toContain('href="/app/scans"');
    expect(out.html).toContain("<!DOCTYPE html>");
  });
});
