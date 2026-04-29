import { beforeEach, describe, expect, it, vi } from "vitest";
import { HiveAiDetector } from "./hive.js";

describe("HiveAiDetector", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    process.env.HIVE_BASE_URL = "https://api.thehive.ai/api";
    process.env.HIVE_API_KEY = "hive-key";
  });

  it("uses /v2/task/sync with image_url payload", async () => {
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
});
