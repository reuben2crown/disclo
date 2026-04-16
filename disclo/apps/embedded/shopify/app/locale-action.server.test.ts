import { describe, expect, it } from "vitest";
import { safeLocaleReturnTo } from "./locale-action.server.js";

describe("safeLocaleReturnTo", () => {
  it("allows internal paths", () => {
    expect(safeLocaleReturnTo("/app/scans?x=1", "/app")).toBe("/app/scans?x=1");
  });

  it("rejects protocol-relative and open redirects", () => {
    expect(safeLocaleReturnTo("//evil.com", "/app")).toBe("/app");
    expect(safeLocaleReturnTo("https://evil.com", "/app")).toBe("/app");
  });

  it("rejects non-strings and uses fallback", () => {
    expect(safeLocaleReturnTo(null, "/")).toBe("/");
  });
});
