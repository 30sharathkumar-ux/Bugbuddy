import { GoogleGenerativeAI } from '@google/generative-ai';
import logger from '../utils/logger';

const GEMINI_TIMEOUT_MS = 25000;

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Gemini timeout after ${ms}ms (${label})`)), ms)
    ),
  ]);
}

export class GeminiService {
  private readonly genAI: GoogleGenerativeAI;
  private readonly preferredModel: string;
  private readonly fallbackModels = ['gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-3.5-flash-lite'];

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY ?? '';
    if (!apiKey) {
      logger.warn('GEMINI_API_KEY is not set');
    }
    this.preferredModel = process.env.GEMINI_MODEL ?? 'gemini-3.1-flash-lite';
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generateText(prompt: string, label = 'generate'): Promise<string> {
    const candidateModels = Array.from(new Set([this.preferredModel, ...this.fallbackModels]));
    let lastError: unknown;

    for (const modelName of candidateModels) {
      try {
        const model = this.genAI.getGenerativeModel({ model: modelName });
        const result = await withTimeout(
          model.generateContent(prompt),
          GEMINI_TIMEOUT_MS,
          `${label}:${modelName}`
        );
        return result.response.text();
      } catch (err: unknown) {
        lastError = err;
        const msg = err instanceof Error ? err.message : String(err);
        logger.warn(`Model ${modelName} failed for ${label}: ${msg.slice(0, 120)}. Trying fallback...`);
      }
    }

    logger.error('All Gemini model candidates failed', { label, error: lastError });
    throw lastError;
  }

  async generateJSON<T>(prompt: string, label = 'generateJSON'): Promise<T> {
    const candidateModels = Array.from(new Set([this.preferredModel, ...this.fallbackModels]));
    let lastError: unknown;

    for (const modelName of candidateModels) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: modelName,
          generationConfig: { responseMimeType: 'application/json' },
        });
        const result = await withTimeout(
          model.generateContent(prompt),
          GEMINI_TIMEOUT_MS,
          `${label}:${modelName}`
        );
        const text = result.response.text();
        const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();
        return JSON.parse(cleaned) as T;
      } catch (err: unknown) {
        lastError = err;
        const msg = err instanceof Error ? err.message : String(err);
        logger.warn(`Model ${modelName} JSON failed for ${label}: ${msg.slice(0, 120)}. Trying fallback...`);
      }
    }

    logger.error('All Gemini model candidates failed for generateJSON', { label, error: lastError });
    throw lastError;
  }
}

export const geminiService = new GeminiService();
