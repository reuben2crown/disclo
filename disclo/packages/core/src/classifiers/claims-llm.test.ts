import { describe, expect, it, vi } from "vitest";
import { substantiateGreenClaims } from "./claims-llm.js";

describe("substantiateGreenClaims", () => {
  it("returns BARE_ASSERTION for all when plan disallows LLM", async () => {
    const fetchFn = vi.fn();
    const out = await substantiateGreenClaims({
      productDescription: "Eco-friendly bottle.",
      flaggedPhrases: ["eco-friendly"],
      planAllowsLlm: false,
      apiKey: "sk",
      fetchFn,
    });
    expect(fetchFn).not.toHaveBeenCalled();
    expect(out.every((r) => r.status === "BARE_ASSERTION")).toBe(true);
  });

  it("calls Anthropic and parses JSON response", async () => {
    const fetchFn = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          content: [
            {
              type: "text",
              text: JSON.stringify({
                results: [
                  { phrase: "eco-friendly", status: "BARE_ASSERTION" },
                ],
              }),
            },
          ],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );
    const out = await substantiateGreenClaims({
      productDescription: "Eco-friendly bottle.",
      flaggedPhrases: ["eco-friendly"],
      planAllowsLlm: true,
      apiKey: "sk-ant",
      fetchFn,
    });
    expect(fetchFn).toHaveBeenCalledTimes(1);
    const [, init] = fetchFn.mock.calls[0] as [string, RequestInit];
    expect(init.method).toBe("POST");
    expect(out).toHaveLength(1);
    expect(out[0]?.status).toBe("BARE_ASSERTION");
  });
});
