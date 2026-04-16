import { describe, expect, it } from "vitest";
import { resolveLocalePreference } from "./locale-preference.js";

describe("resolveLocalePreference", () => {
  it("prefers a valid cookie over Accept-Language", () => {
    expect(
      resolveLocalePreference("de", "fr-CA,fr;q=0.9", "en"),
    ).toBe("de");
  });

  it("ignores invalid cookie values", () => {
    expect(
      resolveLocalePreference("xx", "es-ES,es;q=0.9", "en"),
    ).toBe("es");
  });

  it("falls through to resolveLocale when cookie is empty", () => {
    expect(resolveLocalePreference("", "ja-JP", "en")).toBe("ja");
    expect(resolveLocalePreference(null, null, "fr")).toBe("fr");
  });
});
