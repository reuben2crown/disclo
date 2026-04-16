import { describe, expect, it } from "vitest";
import { decryptString, encryptString } from "./crypto.js";

const TEST_KEY = "01234567890123456789012345678901"; // 32 chars

describe("crypto", () => {
  it("round-trips plaintext", () => {
    const plain = "oauth-token-or-secret";
    const enc = encryptString(plain, TEST_KEY);
    expect(enc).not.toContain(plain);
    expect(decryptString(enc, TEST_KEY)).toBe(plain);
  });

  it("rejects short keys", () => {
    expect(() => encryptString("x", "short")).toThrow();
  });
});
