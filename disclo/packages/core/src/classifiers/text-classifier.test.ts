import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  classifyPlainText,
  classifyPlainTextBatch,
  countWords,
  mapAiProbabilityToRiskLevel,
} from "./text-classifier.js";
import { ClassifierError } from "../utils/errors.js";

const longText = "word ".repeat(50).trim();

function jsonResponse(data: unknown, status = 200) {
  return Promise.resolve(
    new Response(JSON.stringify(data), {
      status,
      headers: { "Content-Type": "application/json" },
    }),
  );
}

describe("countWords", () => {
  it("counts whitespace-separated tokens", () => {
    expect(countWords("one two three")).toBe(3);
    expect(countWords("  a  b  c  ")).toBe(3);
  });
});

describe("mapAiProbabilityToRiskLevel", () => {
  it("maps thresholds per REQUIREMENTS 7.1", () => {
    expect(mapAiProbabilityToRiskLevel(0)).toBe("none");
    expect(mapAiProbabilityToRiskLevel(0.49)).toBe("none");
    expect(mapAiProbabilityToRiskLevel(0.5)).toBe("review");
    expect(mapAiProbabilityToRiskLevel(0.74)).toBe("review");
    expect(mapAiProbabilityToRiskLevel(0.75)).toBe("high");
    expect(mapAiProbabilityToRiskLevel(1)).toBe("high");
  });
});

describe("classifyPlainText", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("skips GPTZero when text has fewer than 50 words", async () => {
    const fetchFn = vi.fn();
    const result = await classifyPlainText({
      text: "short text",
      apiKey: "k",
      fetchFn,
    });
    expect(fetchFn).not.toHaveBeenCalled();
    expect(result.insufficientText).toBe(true);
    expect(result.aiProbability).toBeNull();
    expect(result.riskLevel).toBe("review");
    expect(result.provider).toBe("gptzero");
  });

  it("calls predict/text and maps response", async () => {
    const fetchFn = vi.fn().mockImplementation(() =>
      jsonResponse({
        documents: [
          {
            completely_generated_prob: 0.82,
            sentences: [{ generated_prob: 0.9, sentence: "Hello." }],
          },
        ],
      }),
    );
    const result = await classifyPlainText({
      text: longText,
      apiKey: "secret",
      fetchFn,
    });
    expect(fetchFn).toHaveBeenCalledTimes(1);
    const [callUrl, init] = fetchFn.mock.calls[0] as [string, RequestInit];
    expect(callUrl).toBe("https://api.gptzero.me/v2/predict/text");
    expect(init.method).toBe("POST");
    expect(init.headers).toMatchObject({
      "Content-Type": "application/json",
      "x-api-key": "secret",
    });
    expect(result.aiProbability).toBe(0.82);
    expect(result.riskLevel).toBe("high");
    expect(result.sentenceBreakdown?.[0]?.sentence).toBe("Hello.");
    expect(result.provider).toBe("gptzero");
    expect(result.classifiedAt).toBeInstanceOf(Date);
  });

  it("retries once after 5s on HTTP 429", async () => {
    const fetchFn = vi
      .fn()
      .mockImplementationOnce(() => jsonResponse({ error: "rate" }, 429))
      .mockImplementationOnce(() =>
        jsonResponse({
          documents: [{ completely_generated_prob: 0.1 }],
        }),
      );
    const p = classifyPlainText({
      text: longText,
      apiKey: "k",
      fetchFn,
    });
    await vi.advanceTimersByTimeAsync(5000);
    const result = await p;
    expect(fetchFn).toHaveBeenCalledTimes(2);
    expect(result.aiProbability).toBe(0.1);
  });

  it("throws ClassifierError after 429 twice", async () => {
    const fetchFn = vi.fn().mockImplementation(() => jsonResponse({}, 429));
    const p = classifyPlainText({
      text: longText,
      apiKey: "k",
      fetchFn,
    });
    const assertion = expect(p).rejects.toThrow(ClassifierError);
    await vi.advanceTimersByTimeAsync(5000);
    await assertion;
    expect(fetchFn).toHaveBeenCalledTimes(2);
  });

  it("throws ClassifierError on empty documents", async () => {
    const fetchFn = vi.fn().mockImplementation(() =>
      jsonResponse({ documents: [] }),
    );
    await expect(
      classifyPlainText({ text: longText, apiKey: "k", fetchFn }),
    ).rejects.toThrow(ClassifierError);
  });
});

describe("classifyPlainTextBatch", () => {
  it("returns one result per input in order", async () => {
    let n = 0;
    const fetchFn = vi.fn().mockImplementation(() => {
      n += 1;
      return jsonResponse({
        documents: [{ completely_generated_prob: n * 0.1 }],
      });
    });
    const results = await classifyPlainTextBatch({
      texts: [longText, longText],
      apiKey: "k",
      fetchFn,
    });
    expect(results).toHaveLength(2);
    expect(results[0]?.aiProbability).toBe(0.1);
    expect(results[1]?.aiProbability).toBe(0.2);
    expect(fetchFn).toHaveBeenCalledTimes(2);
  });
});
