export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface CompletionResult {
  content: string;
  reasoning?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  durationMs: number;
  model: string;
}

export class LlmService {
  private baseUrl: string;
  private apiKey: string;
  private defaultModel: string;

  constructor() {
    this.baseUrl = (import.meta.env.VITE_LLM_BASE_URL as string) || "https://tokenrhythm.studio/v1";
    this.apiKey =
      localStorage.getItem("reverselab_api_key") ||
      (import.meta.env.VITE_LLM_API_KEY as string) ||
      "";
    this.defaultModel = (import.meta.env.VITE_LLM_MODEL as string) || "qwen3.8-flash";
  }

  public getApiKey(): string {
    return this.apiKey;
  }

  public setApiKey(key: string): void {
    this.apiKey = key;
    localStorage.setItem("reverselab_api_key", key);
  }

  public getModel(): string {
    return this.defaultModel;
  }

  public setModel(model: string): void {
    this.defaultModel = model;
    localStorage.setItem("reverselab_model", model);
  }

  public async checkHealth(): Promise<{ ok: boolean; latencyMs: number; error?: string }> {
    const start = performance.now();
    try {
      const res = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.defaultModel,
          messages: [{ role: "user", content: "ping" }],
          max_tokens: 5,
        }),
      });

      const latencyMs = Math.round(performance.now() - start);
      if (!res.ok) {
        const text = await res.text();
        return { ok: false, latencyMs, error: `HTTP ${res.status}: ${text}` };
      }
      return { ok: true, latencyMs };
    } catch (err: any) {
      return { ok: false, latencyMs: Math.round(performance.now() - start), error: err.message || String(err) };
    }
  }

  public async complete(
    messages: ChatMessage[],
    options?: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
    }
  ): Promise<CompletionResult> {
    const start = performance.now();
    const model = options?.model || this.defaultModel;

    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: options?.temperature ?? 0.3,
        max_tokens: options?.maxTokens ?? 2048,
      }),
    });

    const durationMs = Math.round(performance.now() - start);

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`LLM Error ${res.status}: ${errText}`);
    }

    const data = await res.json();
    const choice = data.choices?.[0];
    const message = choice?.message || {};

    return {
      content: message.content || "",
      reasoning: message.reasoning_content || undefined,
      usage: data.usage
        ? {
            promptTokens: data.usage.prompt_tokens || 0,
            completionTokens: data.usage.completion_tokens || 0,
            totalTokens: data.usage.total_tokens || 0,
          }
        : undefined,
      durationMs,
      model,
    };
  }
}

export const llmService = new LlmService();
