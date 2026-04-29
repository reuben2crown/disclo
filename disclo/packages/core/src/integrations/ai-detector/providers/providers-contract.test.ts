import { beforeEach, describe, expect, it, vi } from "vitest";
import { AiOrNotScanner } from "./aiornot/aiornot.js";
import { GptZeroTextScannerProvider } from "./gptzero.js";
import { HiveAiDetector } from "./hive/hive.js";

describe("AI detector provider contracts", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    process.env.GPTZERO_BASE_URL = "https://api.gptzero.me";
    process.env.GPTZERO_API_KEY = "gptzero-key";
    process.env.HIVE_BASE_URL = "https://api.thehive.ai/api";
    process.env.HIVE_API_KEY = "hive-key";
    process.env.AIORNOT_BASE_URL = "https://api.aiornot.com";
    process.env.AIORNOT_API_KEY = "aiornot-key";
    process.env.AIORNOT_MIN_WORDS = "0";
  });

  it("uses GPTZero /v2/predict/text schema", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          documents: [
            {
              average_generated_prob: 0.82,
              sentences: [{ sentence: "sample", generated_prob: 0.82 }],
            },
          ],
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const provider = new GptZeroTextScannerProvider();
    const result = await provider.scanText("This is enough text for scanning.", "req-1");
    const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.gptzero.me/v2/predict/text");
    expect(result.ai_detected).toBe(true);
    expect(result.ai_confidence).toBe(0.82);
  });

  it("uses Hive /v2/task/sync with image_url payload", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          id: "task-1",
          created_on: "2026-04-29T12:00:00Z",
          status: {
            status: { message: "SUCCESS" },
            response: {
              output: [
                {
                  time: 0,
                  classes: [
                    { class: "ai_generated", score: 0.91 },
                    { class: "not_ai_generated", score: 0.09 },
                  ],
                },
              ],
            },
          },
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const provider = new HiveAiDetector();
    const result = await provider.scanImage("https://example.com/image.png", "req-hive");

    const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.thehive.ai/api/v2/task/sync");
    expect(result.ai_detected).toBe(true);
    expect(result.ai_confidence).toBe(0.91);
  });

  it("uses AI or Not /v2/text/sync with form-encoded body", async () => {
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
