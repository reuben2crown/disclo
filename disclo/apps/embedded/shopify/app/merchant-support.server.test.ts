import { describe, expect, it, vi } from "vitest";
import { loadServerEnv } from "@disclo/core";
import { merchantSupportSuffix } from "./merchant-support.server.js";

vi.mock("@disclo/core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@disclo/core")>();
  return {
    ...actual,
    loadServerEnv: vi.fn(),
  };
});

describe("merchantSupportSuffix", () => {
  it("uses email sentence when MERCHANT_SUPPORT_EMAIL is set", () => {
    vi.mocked(loadServerEnv).mockReturnValue({
      NODE_ENV: "test",
      LOG_LEVEL: "silent",
      MERCHANT_SUPPORT_EMAIL: "help@example.com",
    } as unknown as ReturnType<typeof loadServerEnv>);
    expect(merchantSupportSuffix()).toContain("help@example.com");
    expect(merchantSupportSuffix()).toContain("email");
  });

  it("falls back to installer wording when email is unset", () => {
    vi.mocked(loadServerEnv).mockReturnValue({
      NODE_ENV: "test",
      LOG_LEVEL: "silent",
      MERCHANT_SUPPORT_EMAIL: undefined,
    } as unknown as ReturnType<typeof loadServerEnv>);
    expect(merchantSupportSuffix()).toContain("installed Disclo");
  });
});
