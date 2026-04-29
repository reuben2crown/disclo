import { AIProvider, AIGenerationOptions, AIGenerationResponse, AIProviderType, GEMINI_MODEL } from '../ai-contract.js';

type OpenRouterResponse = {
  choices?: Array<{ message?: { content?: string } }>;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
  };
};

export class OpenRouterProvider implements AIProvider {
  private apiKey: string;
  private baseUrl = 'https://openrouter.ai/api/v1';

  constructor() {
    const apiKey = process.env.OPEN_ROUTER_KEY;
    if (!apiKey) {
      throw new Error('OPEN_ROUTER_KEY environment variable is missing.');
    }
    this.apiKey = apiKey;
  }

  async generateText(prompt: string, options: AIGenerationOptions): Promise<AIGenerationResponse> {
    const startTime = Date.now();

    // Map internal models to OpenRouter identifiers if necessary
    // For now, we'll assume the string is passed correctly or default to a cheap model
    const fullModelName = options.provider!.model === GEMINI_MODEL.GEMINI_2_0_FLASH
      ? 'google/gemini-2.0-flash-001'
      : (options.provider!.model || GEMINI_MODEL.GEMINI_2_0_FLASH);

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'HTTP-Referer': process.env.OPENROUTER_HTTP_REFERER || 'https://disclo.com',
        'X-OpenRouter-Title': process.env.OPENROUTER_APP_TITLE || 'Disclo',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: fullModelName,
        messages: [
          ...(options.systemInstruction ? [{ role: 'system', content: options.systemInstruction }] : []),
          { role: 'user', content: prompt }
        ],
        temperature: options.temperature,
        max_tokens: options.maxTokens,
        response_format: options.jsonMode ? { type: 'json_object' } : undefined,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      const status = response.status;
      const error: any = new Error(`OpenRouter Error (${status}): ${errorText}`);
      error.status = status;
      throw error;
    }

    const data = (await response.json()) as OpenRouterResponse;
    const text = data.choices?.[0]?.message?.content || '';
    const usage = data.usage;

    return {
      text,
      provider: AIProviderType.OPENROUTER,
      model: options.provider!.model,
      tokensIn: usage?.prompt_tokens || 0,
      tokensOut: usage?.completion_tokens || 0,
      latencyMs: Date.now() - startTime,
    };
  }
}
