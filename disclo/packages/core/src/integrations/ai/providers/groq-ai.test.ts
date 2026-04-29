import { beforeEach, describe, expect, it, vi } from "vitest";
import { AIProviderType, GROQ_MODEL } from "../ai-contract.js";
import { GroqProvider } from "./groq-ai.js";

describe("GroqProvider", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    process.env.GROQ_API_KEY = "test-groq-key";
  });

  it("maps OpenAI-compatible chat completion response", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          choices: [{ message: { content: "Groq answer" } }],
          usage: { prompt_tokens: 21, completion_tokens: 9 },
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const provider = new GroqProvider();
    const result = await provider.generateText("hello", {
      provider: { provider: AIProviderType.GROQ, model: GROQ_MODEL.GROQ_LLAMA_3_70B },
      maxTokens: 256,
    });

    const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.groq.com/openai/v1/chat/completions");
    expect(result.text).toBe("Groq answer");
    expect(result.tokensIn).toBe(21);
    expect(result.tokensOut).toBe(9);
  });
});
