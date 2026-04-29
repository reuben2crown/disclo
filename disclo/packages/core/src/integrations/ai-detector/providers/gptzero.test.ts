import { beforeEach, describe, expect, it, vi } from "vitest";
import { GptZeroTextScannerProvider } from "./gptzero.js";

describe("GptZeroTextScannerProvider", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    process.env.GPTZERO_BASE_URL = "https://api.gptzero.me";
    process.env.GPTZERO_API_KEY = "gptzero-key";
  });

  it("uses /v2/predict/text schema", async () => {
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
});
