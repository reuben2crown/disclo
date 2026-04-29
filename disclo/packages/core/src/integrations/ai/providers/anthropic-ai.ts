import { AIModelError } from "../../../utils/errors.js";
import { AIProvider, AIGenerationOptions, AIGenerationResponse, AIProviderType } from '../ai-contract.js';
import { httpService } from '../../../utils/http-service.js';

type AnthropicMessageResponse = {
  content?: Array<{ type?: string; text?: string }>;
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
  };
  error?: { message?: string };
};

export class AnthropicProvider implements AIProvider {
  private apiKey: string;
  private baseUrl = 'https://api.anthropic.com/v1';

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY environment variable is missing.');
    }
    this.apiKey = apiKey;
  }

  async generateText(prompt: string, options: AIGenerationOptions): Promise<AIGenerationResponse> {
    const startTime = Date.now();
    
    const modelName = options.provider!.model ?? "claude-sonnet-4-20250514";

    const req = {
      baseUrl: this.baseUrl,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: modelName,
        max_tokens: options.maxTokens,
        messages: [{ role: "user", content: prompt }],
      }),
    }

    try {
      const res = await httpService.post<AnthropicMessageResponse>('/messages', req);

      if (!res.ok) {
        const message = res.data?.error?.message || `HTTP ${res.status}`;
        const error: any = new AIModelError(`anthropic: ${message}`);
        error.status = res.status;
        throw error;
      }

      if (!res.data) {
        throw new AIModelError("anthropic: missing data");
      }

      const text = res.data.content?.find((part) => part.type === "text")?.text || "";
      if (!text) {
        throw new AIModelError("anthropic: missing content text");
      }

      return {
        text,
        provider: AIProviderType.ANTHROPIC,
        model: modelName,
        tokensIn: res.data.usage?.input_tokens || 0,
        tokensOut: res.data.usage?.output_tokens || 0,
        latencyMs: Date.now() - startTime,
      };
    } catch (error) {
      throw new AIModelError(`anthropic: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
