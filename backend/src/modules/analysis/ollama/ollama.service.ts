/**
 * Serviço para integração com Ollama (LLM local)
 */

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { OllamaGenerateRequestDto, OllamaGenerateResponseDto } from '../dto/deep-analysis.dto';

@Injectable()
export class OllamaService {
  private readonly logger = new Logger(OllamaService.name);
  private readonly client: AxiosInstance;
  private readonly baseUrl: string;
  private readonly defaultModel: string;
  private readonly maxRetries: number;

  constructor(private configService: ConfigService) {
    this.baseUrl = this.configService.get('OLLAMA_BASE_URL', 'http://localhost:11434');
    this.defaultModel = this.configService.get('OLLAMA_DEFAULT_MODEL', 'llama3.1:8b');
    this.maxRetries = this.configService.get('OLLAMA_MAX_RETRIES', 3);

    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 120000, // 2 minutos (LLM pode ser lento)
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.logger.log(`Ollama service initialized: ${this.baseUrl}`);
  }

  /**
   * Gera texto usando Ollama com retry logic
   */
  async generate(request: OllamaGenerateRequestDto): Promise<OllamaGenerateResponseDto> {
    const startTime = Date.now();

    let lastError: Error;
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        this.logger.debug(
          `Ollama generate attempt ${attempt}/${this.maxRetries} - Model: ${request.model}`,
        );

        const response = await this.client.post('/api/generate', {
          model: request.model || this.defaultModel,
          prompt: request.prompt,
          stream: false, // Não usar streaming para simplificar
          options: {
            temperature: request.options?.temperature ?? 0.3,
            top_p: request.options?.top_p ?? 0.9,
            num_predict: request.options?.max_tokens ?? 1500,
          },
        });

        const processingTime = Date.now() - startTime;
        this.logger.log(
          `Ollama generation completed in ${processingTime}ms (${response.data.response.length} chars)`,
        );

        return {
          text: response.data.response,
          model: response.data.model,
          created_at: response.data.created_at,
          done: response.data.done,
        };
      } catch (error) {
        lastError = error;
        this.logger.warn(
          `Ollama generate attempt ${attempt} failed: ${error.message}`,
        );

        if (attempt < this.maxRetries) {
          // Exponential backoff
          const delay = Math.pow(2, attempt) * 1000;
          this.logger.debug(`Retrying in ${delay}ms...`);
          await this.sleep(delay);
        }
      }
    }

    const totalTime = Date.now() - startTime;
    this.logger.error(
      `Ollama generation failed after ${this.maxRetries} attempts (${totalTime}ms)`,
      lastError.stack,
    );

    throw new Error(
      `Failed to generate text with Ollama after ${this.maxRetries} attempts: ${lastError.message}`,
    );
  }

  /**
   * Gera embeddings usando Ollama
   */
  async generateEmbedding(text: string, model: string = 'nomic-embed-text'): Promise<number[]> {
    try {
      const response = await this.client.post('/api/embeddings', {
        model,
        prompt: text,
      });

      return response.data.embedding;
    } catch (error) {
      this.logger.error(`Failed to generate embedding: ${error.message}`);
      throw error;
    }
  }

  /**
   * Verifica se Ollama está disponível
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get('/api/tags', {
        timeout: 5000,
      });

      const models = response.data.models || [];
      this.logger.log(`Ollama health check OK - ${models.length} models available`);

      return true;
    } catch (error) {
      this.logger.error(`Ollama health check failed: ${error.message}`);
      return false;
    }
  }

  /**
   * Lista modelos disponíveis
   */
  async listModels(): Promise<string[]> {
    try {
      const response = await this.client.get('/api/tags');
      const models = response.data.models || [];

      return models.map((m: any) => m.name);
    } catch (error) {
      this.logger.error(`Failed to list models: ${error.message}`);
      return [];
    }
  }

  /**
   * Puxa modelo se não existir
   */
  async pullModel(modelName: string): Promise<void> {
    this.logger.log(`Pulling model: ${modelName}`);

    try {
      await this.client.post('/api/pull', {
        name: modelName,
        stream: false,
      });

      this.logger.log(`Model ${modelName} pulled successfully`);
    } catch (error) {
      this.logger.error(`Failed to pull model ${modelName}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Sleep helper
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
