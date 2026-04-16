import { describe, expect, it } from "vitest";
import { resolveLocale } from "./resolve-locale.js";

describe("resolveLocale", () => {
  it("prefers French from Accept-Language", () => {
    expect(resolveLocale("fr-CA,fr;q=0.9,en;q=0.8", "en")).toBe("fr");
  });

  it("prefers English when listed first", () => {
    expect(resolveLocale("en-US,fr;q=0.9", "fr")).toBe("en");
  });

  it("uses fallback when header is empty", () => {
    expect(resolveLocale(null, "fr")).toBe("fr");
  });

  it("maps German and Spanish tags", () => {
    expect(resolveLocale("de-DE", "en")).toBe("de");
    expect(resolveLocale("es-MX,en;q=0.5", "en")).toBe("es");
  });

  it("maps Chinese variants to zh", () => {
    expect(resolveLocale("zh-CN,en;q=0.8", "en")).toBe("zh");
    expect(resolveLocale("zh-Hans", "en")).toBe("zh");
  });

  it("uses fallback for unknown primary languages", () => {
    expect(resolveLocale("xx-YY", "en")).toBe("en");
  });
});
