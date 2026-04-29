import { AIModelError } from '../../../utils/errors.js';
import { httpService } from '../../../utils/http-service.js';
import { AIProvider, AIGenerationOptions, AIGenerationResponse, AIProviderType, GROQ_MODEL } from '../ai-contract.js';

type GroqChatResponse = {
  choices?: Array<{ message?: { content?: string } }>;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
  };
  error?: { message?: string };
};

export class GroqProvider implements AIProvider {
  private apiKey: string;
  private baseUrl = 'https://api.groq.com/openai/v1';

  constructor() {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error('GROQ_API_KEY environment variable is missing.');
    }
    this.apiKey = apiKey;
  }

  async generateText(prompt: string, options: AIGenerationOptions): Promise<AIGenerationResponse> {
    const startTime = Date.now();
    
    const modelName = options.provider!.model === GROQ_MODEL.GROQ_LLAMA_3_70B 
      ? 'llama-3.3-70b-versatile' 
      : (options.provider!.model || GROQ_MODEL.GROQ_LLAMA_3_70B);

    const res = await httpService.post<GroqChatResponse>('/chat/completions', {
      baseUrl: this.baseUrl,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          ...(options.systemInstruction ? [{ role: 'system', content: options.systemInstruction }] : []),
          { role: 'user', content: prompt }
        ],
        temperature: options.temperature,
        max_tokens: options.maxTokens,
        // Groq also supports json_mode
        response_format: options.jsonMode ? { type: 'json_object' } : undefined,
      }),
    });

    if (!res.ok) {
      const errorText = res.data?.error?.message || res.statusText || 'unknown Groq error';
      const status = res.status;
      const error: any = new Error(`Groq Error (${status}): ${errorText}`);
      error.status = status;
      throw error;
    }

    if (!res.data) {
      throw new AIModelError("groq: missing data");
    }

    const text = res.data.choices?.[0]?.message?.content || '';
    const usage = res.data.usage;

    return {
      text,
      provider: AIProviderType.GROQ,
      model: options.provider!.model,
      tokensIn: usage?.prompt_tokens || 0,
      tokensOut: usage?.completion_tokens || 0,
      latencyMs: Date.now() - startTime,
    };
  }
}
