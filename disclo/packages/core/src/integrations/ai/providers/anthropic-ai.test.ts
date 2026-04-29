import { beforeEach, describe, expect, it, vi } from "vitest";
import { ANTHROPIC_MODEL, AIProviderType } from "../ai-contract.js";
import { AnthropicProvider } from "./anthropic-ai.js";

describe("AnthropicProvider", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    process.env.ANTHROPIC_API_KEY = "test-anthropic-key";
  });

  it("maps /v1/messages response", async () => {
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
});
