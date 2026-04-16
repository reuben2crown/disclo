import { describe, expect, it, vi } from "vitest";
import {
  classifyImageUrl,
  HIVE_DEFAULT_SYNC_URL,
  mapHiveScoreToRiskLevel,
} from "./image-classifier.js";

function jsonResponse(data: unknown, status = 200) {
  return Promise.resolve(
    new Response(JSON.stringify(data), {
      status,
      headers: { "Content-Type": "application/json" },
    }),
  );
}

const hiveOkBody = {
  id: "t1",
  status: [
    {
      status: { code: 0, message: "SUCCESS" },
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
  ],
};

describe("mapHiveScoreToRiskLevel", () => {
  it("matches text classifier bands", () => {
    expect(mapHiveScoreToRiskLevel(0.49)).toBe("none");
    expect(mapHiveScoreToRiskLevel(0.5)).toBe("review");
    expect(mapHiveScoreToRiskLevel(0.75)).toBe("high");
  });
});

describe("classifyImageUrl", () => {
  it("POSTs image_url and maps ai_generated score", async () => {
    const fetchFn = vi.fn().mockImplementation(() => jsonResponse(hiveOkBody));
    const result = await classifyImageUrl({
      imageUrl: "https://cdn.example.com/a.jpg",
      apiKey: "hive-key",
      fetchFn,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.aiProbability).toBe(0.91);
      expect(result.riskLevel).toBe("high");
    }
    expect(fetchFn).toHaveBeenCalledTimes(1);
    const [url, init] = fetchFn.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(HIVE_DEFAULT_SYNC_URL);
    expect(init.headers).toMatchObject({
      Authorization: "Token hive-key",
      "Content-Type": "application/json",
    });
    const body = JSON.parse((init.body as string) ?? "{}");
    expect(body.image_url).toBe("https://cdn.example.com/a.jpg");
  });

  it("returns not-clean result on HTTP failure (never marks clean)", async () => {
    const fetchFn = vi.fn().mockImplementation(() => jsonResponse({}, 503));
    const result = await classifyImageUrl({
      imageUrl: "https://cdn.example.com/x.jpg",
      apiKey: "k",
      fetchFn,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.riskLevel).toBe("review");
      expect(result.aiProbability).toBeNull();
      expect(result.retryable).toBe(true);
    }
  });

  it("returns not-clean result when ai_generated missing", async () => {
    const fetchFn = vi.fn().mockImplementation(() =>
      jsonResponse({
        status: [
          {
            status: { code: 0, message: "SUCCESS" },
            response: {
              output: [{ time: 0, classes: [{ class: "other", score: 1 }] }],
            },
          },
        ],
      }),
    );
    const result = await classifyImageUrl({
      imageUrl: "https://cdn.example.com/y.jpg",
      apiKey: "k",
      fetchFn,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.aiProbability).toBe(0);
      expect(result.riskLevel).toBe("none");
    }
  });
});
