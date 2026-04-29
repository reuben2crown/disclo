import { beforeEach, describe, expect, it, vi } from "vitest";
import { ANTHROPIC_MODEL, AIProviderType, GEMINI_MODEL, GROQ_MODEL } from "../ai-contract.js";
import { AnthropicProvider } from "./anthropic-ai.js";
import { GroqProvider } from "./groq-ai.js";
import { OpenRouterProvider } from "./openrouter.js";

describe("AI providers contract mapping", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    process.env.ANTHROPIC_API_KEY = "test-anthropic-key";
    process.env.GROQ_API_KEY = "test-groq-key";
    process.env.OPEN_ROUTER_KEY = "test-openrouter-key";
  });

  it("maps Anthropic /v1/messages response", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          content: [{ type: "text", text: "Anthropic answer" }],
          usage: { input_tokens: 11, output_tokens: 7 },
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const provider = new AnthropicProvider();
    const result = await provider.generateText("hi", {
      provider: { provider: AIProviderType.ANTHROPIC, model: ANTHROPIC_MODEL.CLAUDE_OPUS_4_6 },
      maxTokens: 128,
    });

    const [url, request] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.anthropic.com/v1/messages");
    expect((request.headers as Headers).get("anthropic-version")).toBe("2023-06-01");
    expect(result.text).toBe("Anthropic answer");
    expect(result.tokensIn).toBe(11);
    expect(result.tokensOut).toBe(7);
  });

  it("maps Groq OpenAI-compatible chat completion response", async () => {
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

  it("maps OpenRouter /chat/completions response usage", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          choices: [{ message: { content: "OpenRouter answer" } }],
          usage: { prompt_tokens: 12, completion_tokens: 5 },
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const provider = new OpenRouterProvider();
    const result = await provider.generateText("ping", {
      provider: { provider: AIProviderType.OPENROUTER, model: GEMINI_MODEL.GEMINI_2_0_FLASH },
    });

    const [url, request] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://openrouter.ai/api/v1/chat/completions");
    expect((request.headers as Record<string, string>)["X-OpenRouter-Title"]).toBeDefined();
    expect(result.text).toBe("OpenRouter answer");
    expect(result.tokensIn).toBe(12);
    expect(result.tokensOut).toBe(5);
  });
});
