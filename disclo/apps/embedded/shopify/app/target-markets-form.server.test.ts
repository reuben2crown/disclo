import { describe, expect, it } from "vitest";
import { parseTargetMarketsFromForm } from "./target-markets-form.server.js";

describe("parseTargetMarketsFromForm", () => {
  it("normalizes casing and de-duplicates", () => {
    expect(parseTargetMarketsFromForm(["eu", " EU ", "us"])).toEqual([
      "EU",
      "US",
    ]);
  });

  it("drops values outside the allowlist", () => {
    expect(
      parseTargetMarketsFromForm(["EU", "ZZ", "US-FL", "nope"]),
    ).toEqual(["EU", "US-FL"]);
  });

  it("returns empty when nothing valid remains", () => {
    expect(parseTargetMarketsFromForm(["", "  ", "XX"])).toEqual([]);
  });
});
