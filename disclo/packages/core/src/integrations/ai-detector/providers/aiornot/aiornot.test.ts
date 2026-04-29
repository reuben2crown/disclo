import { beforeEach, describe, expect, it, vi } from "vitest";
import { AiOrNotScanner } from "./aiornot.js";

describe("AiOrNotScanner", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    process.env.AIORNOT_BASE_URL = "https://api.aiornot.com";
    process.env.AIORNOT_API_KEY = "aiornot-key";
    process.env.AIORNOT_MIN_WORDS = "0";
  });

  it("uses /v2/text/sync with form-encoded body", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          id: "ao-1",
          created_at: "2026-04-29T12:00:00Z",
          report: {
            ai_text: {
              is_detected: true,
              confidence: 0.77,
              annotations: [[0.77, "sample annotation"]],
            },
          },
          metadata: { word_count: 120 },
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const provider = new AiOrNotScanner();
    const result = await provider.scanText("This sample text should be treated as detector input.", "req-ao");

    const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain("https://api.aiornot.com/v2/text/sync?");
    expect(result.ai_detected).toBe(true);
    expect(result.ai_confidence).toBe(0.77);
  });
});
