import { beforeEach, describe, expect, it, vi } from "vitest";
import { AIProviderType, GEMINI_MODEL } from "../ai-contract.js";
import { OpenRouterProvider } from "./openrouter.js";

describe("OpenRouterProvider", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    process.env.OPEN_ROUTER_KEY = "test-openrouter-key";
  });

  it("maps /chat/completions response usage", async () => {
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
