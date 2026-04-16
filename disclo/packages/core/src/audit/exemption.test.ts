import { describe, expect, it } from "vitest";
import { shouldExpireEditorialExemption } from "./exemption.js";

describe("shouldExpireEditorialExemption", () => {
  it("returns false when there was no prior review hash", () => {
    expect(shouldExpireEditorialExemption(null, "a")).toBe(false);
  });

  it("returns false when hash unchanged", () => {
    expect(shouldExpireEditorialExemption("same", "same")).toBe(false);
  });

  it("returns true when content hash changed after review", () => {
    expect(shouldExpireEditorialExemption("old", "new")).toBe(true);
  });
});
