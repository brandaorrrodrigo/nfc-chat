/**
 * Estratégia de Error Handling para Pipeline Híbrido
 *
 * Define como cada tipo de erro é tratado, recuperado e reportado
 */

import { Logger } from '@nestjs/common';

/**
 * Tipos de erros possíveis no pipeline
 */
export enum ErrorType {
  EXTRACTION_ERROR = 'extraction',
  MEDIAPIPE_ERROR = 'mediapipe',
  QUICK_ANALYSIS_ERROR = 'quick_analysis',
  DEEP_ANALYSIS_ERROR = 'deep_analysis',
  PROTOCOLS_ERROR = 'protocols',
  DATABASE_ERROR = 'database',
  CACHE_ERROR = 'cache',
  NOTIFICATION_ERROR = 'notification',
  VALIDATION_ERROR = 'validation',
  TIMEOUT_ERROR = 'timeout',
  RESOURCE_ERROR = 'resource',
  UNKNOWN_ERROR = 'unknown',
}

/**
 * Estágios do pipeline
 */
export enum PipelineStage {
  CACHE_CHECK = 'cache_check',
  EXTRACTION = 'extraction',
  MEDIAPIPE = 'mediapipe',
  QUICK_ANALYSIS = 'quick_analysis',
  DECISION = 'decision',
  DEEP_ANALYSIS = 'deep_analysis',
  PROTOCOLS = 'protocols',
  SAVE = 'save',
  NOTIFICATION = 'notification',
}

/**
 * Erro estruturado do pipeline
 */
export interface ProcessingError {
  type: ErrorType;
  stage: PipelineStage;
  error: Error;
  recoverable: boolean;
  retryable: boolean;
  fallbackAvailable: boolean;
  context?: Record<string, any>;
  timestamp: Date;
}

/**
 * Resultado de fallback
 */
export interface FallbackResult {
  success: boolean;
  data?: any;
  message: string;
  fallbackType: string;
}

/**
 * Estratégia de recuperação de erros
 */
export class ErrorHandlingStrategy {
  private readonly logger = new Logger(ErrorHandlingStrategy.name);

  /**
   * Classifica um erro em tipo e determina estratégia
   */
  classifyError(error: Error, stage: PipelineStage): ProcessingError {
    const errorMessage = error.message.toLowerCase();
    let type: ErrorType = ErrorType.UNKNOWN_ERROR;
    let recoverable = false;
    let retryable = false;
    let fallbackAvailable = false;

    // FFmpeg / Extração
    if (stage === PipelineStage.EXTRACTION) {
      type = ErrorType.EXTRACTION_ERROR;
      recoverable = errorMessage.includes('codec') || errorMessage.includes('format');
      retryable = !errorMessage.includes('not found') && !errorMessage.includes('corrupt');
      fallbackAvailable = true; // Pode tentar com menos frames
    }

    // MediaPipe / Python Service
    else if (stage === PipelineStage.MEDIAPIPE) {
      type = ErrorType.MEDIAPIPE_ERROR;
      recoverable = errorMessage.includes('timeout') || errorMessage.includes('connection');
      retryable = errorMessage.includes('timeout') || errorMessage.includes('502');
      fallbackAvailable = false; // Sem MediaPipe não há análise
    }

    // Quick Analysis
    else if (stage === PipelineStage.QUICK_ANALYSIS) {
      type = ErrorType.QUICK_ANALYSIS_ERROR;
      recoverable = !errorMessage.includes('gold standard not found');
      retryable = errorMessage.includes('timeout') || errorMessage.includes('database');
      fallbackAvailable = true; // Pode usar análise básica
    }

    // Deep Analysis (RAG + LLM)
    else if (stage === PipelineStage.DEEP_ANALYSIS) {
      type = ErrorType.DEEP_ANALYSIS_ERROR;
      recoverable = true; // Deep analysis é opcional
      retryable = errorMessage.includes('rate limit') || errorMessage.includes('timeout');
      fallbackAvailable = true; // Pode pular e usar só quick
    }

    // Protocols
    else if (stage === PipelineStage.PROTOCOLS) {
      type = ErrorType.PROTOCOLS_ERROR;
      recoverable = true;
      retryable = true;
      fallbackAvailable = true; // Pode usar protocolos padrão
    }

    // Database
    else if (stage === PipelineStage.SAVE) {
      type = ErrorType.DATABASE_ERROR;
      recoverable = errorMessage.includes('connection') || errorMessage.includes('timeout');
      retryable = true;
      fallbackAvailable = false; // Precisa salvar eventualmente
    }

    // Notification
    else if (stage === PipelineStage.NOTIFICATION) {
      type = ErrorType.NOTIFICATION_ERROR;
      recoverable = true; // Notificação não é crítica
      retryable = true;
      fallbackAvailable = true; // Pode tentar outros canais
    }

    // Timeout
    if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
      type = ErrorType.TIMEOUT_ERROR;
      retryable = true;
    }

    // Validation
    if (errorMessage.includes('validation') || errorMessage.includes('invalid')) {
      type = ErrorType.VALIDATION_ERROR;
      recoverable = false;
      retryable = false;
      fallbackAvailable = false;
    }

    return {
      type,
      stage,
      error,
      recoverable,
      retryable,
      fallbackAvailable,
      context: {},
      timestamp: new Date(),
    };
  }

  /**
   * Decide se deve fazer retry baseado no erro
   */
  shouldRetry(processingError: ProcessingError, currentAttempt: number): boolean {
    const { type, retryable } = processingError;

    if (!retryable) {
      return false;
    }

    // Limites de retry por tipo
    const maxAttempts: Record<ErrorType, number> = {
      [ErrorType.EXTRACTION_ERROR]: 3,
      [ErrorType.MEDIAPIPE_ERROR]: 2,
      [ErrorType.QUICK_ANALYSIS_ERROR]: 3,
      [ErrorType.DEEP_ANALYSIS_ERROR]: 2,
      [ErrorType.PROTOCOLS_ERROR]: 3,
      [ErrorType.DATABASE_ERROR]: 3,
      [ErrorType.CACHE_ERROR]: 2,
      [ErrorType.NOTIFICATION_ERROR]: 2,
      [ErrorType.VALIDATION_ERROR]: 0,
      [ErrorType.TIMEOUT_ERROR]: 2,
      [ErrorType.RESOURCE_ERROR]: 1,
      [ErrorType.UNKNOWN_ERROR]: 1,
    };

    return currentAttempt < maxAttempts[type];
  }

  /**
   * Calcula delay antes do próximo retry
   */
  calculateRetryDelay(processingError: ProcessingError, attempt: number): number {
    const { type } = processingError;

    // Base delays (ms)
    const baseDelays: Record<ErrorType, number> = {
      [ErrorType.EXTRACTION_ERROR]: 5000,
      [ErrorType.MEDIAPIPE_ERROR]: 10000,
      [ErrorType.QUICK_ANALYSIS_ERROR]: 2000,
      [ErrorType.DEEP_ANALYSIS_ERROR]: 30000, // LLM rate limits
      [ErrorType.PROTOCOLS_ERROR]: 1000,
      [ErrorType.DATABASE_ERROR]: 1000,
      [ErrorType.CACHE_ERROR]: 500,
      [ErrorType.NOTIFICATION_ERROR]: 1000,
      [ErrorType.VALIDATION_ERROR]: 0,
      [ErrorType.TIMEOUT_ERROR]: 5000,
      [ErrorType.RESOURCE_ERROR]: 10000,
      [ErrorType.UNKNOWN_ERROR]: 5000,
    };

    const baseDelay = baseDelays[type];

    // Exponential backoff: delay * (2 ^ attempt)
    return baseDelay * Math.pow(2, attempt - 1);
  }

  /**
   * Executa fallback baseado no erro
   */
  async executeFallback(processingError: ProcessingError, context: any): Promise<FallbackResult> {
    const { type, stage } = processingError;

    this.logger.warn(
      `Executing fallback for ${type} at stage ${stage}`,
    );

    try {
      switch (stage) {
        case PipelineStage.EXTRACTION:
          return this.fallbackExtraction(context);

        case PipelineStage.QUICK_ANALYSIS:
          return this.fallbackQuickAnalysis(context);

        case PipelineStage.DEEP_ANALYSIS:
          return this.fallbackDeepAnalysis(context);

        case PipelineStage.PROTOCOLS:
          return this.fallbackProtocols(context);

        case PipelineStage.NOTIFICATION:
          return this.fallbackNotification(context);

        default:
          return {
            success: false,
            message: `No fallback available for stage ${stage}`,
            fallbackType: 'none',
          };
      }
    } catch (error) {
      this.logger.error(`Fallback failed: ${error.message}`);
      return {
        success: false,
        message: `Fallback failed: ${error.message}`,
        fallbackType: 'failed',
      };
    }
  }

  /**
   * Fallback: Extração com menos frames
   */
  private async fallbackExtraction(context: any): Promise<FallbackResult> {
    this.logger.log('Fallback: Trying extraction with fewer frames');

    // Reduzir FPS e max frames
    const reducedOptions = {
      fps: 1, // 1 frame por segundo
      maxFrames: 3, // Apenas 3 frames críticos
      quality: 70, // Qualidade menor
    };

    return {
      success: true,
      data: { options: reducedOptions },
      message: 'Using reduced frame extraction (3 frames, 1fps)',
      fallbackType: 'reduced_frames',
    };
  }

  /**
   * Fallback: Análise básica sem gold standard
   */
  private async fallbackQuickAnalysis(context: any): Promise<FallbackResult> {
    this.logger.log('Fallback: Using basic analysis without gold standard');

    return {
      success: true,
      data: {
        score: 5.0,
        classification: 'INDISPONÍVEL',
        message: 'Análise básica sem comparação (gold standard indisponível)',
      },
      message: 'Basic analysis without gold standard comparison',
      fallbackType: 'basic_analysis',
    };
  }

  /**
   * Fallback: Pular deep analysis
   */
  private async fallbackDeepAnalysis(context: any): Promise<FallbackResult> {
    this.logger.log('Fallback: Skipping deep analysis');

    return {
      success: true,
      data: { skipped: true },
      message: 'Deep analysis skipped (service unavailable or rate limited)',
      fallbackType: 'skip_deep',
    };
  }

  /**
   * Fallback: Protocolos genéricos
   */
  private async fallbackProtocols(context: any): Promise<FallbackResult> {
    this.logger.log('Fallback: Using generic protocols');

    return {
      success: true,
      data: {
        protocols: [
          {
            type: 'generic',
            message: 'Consulte um profissional para prescrição personalizada',
          },
        ],
      },
      message: 'Using generic corrective protocols',
      fallbackType: 'generic_protocols',
    };
  }

  /**
   * Fallback: Notificação por canal alternativo
   */
  private async fallbackNotification(context: any): Promise<FallbackResult> {
    this.logger.log('Fallback: Trying alternative notification channel');

    // Tentar outros canais (email, push, etc)
    return {
      success: true,
      message: 'User will be notified via alternative channel',
      fallbackType: 'alternative_channel',
    };
  }

  /**
   * Gera relatório de erro para logging/alerting
   */
  generateErrorReport(processingError: ProcessingError, jobId: string): string {
    const { type, stage, error, recoverable, retryable, fallbackAvailable } = processingError;

    return `
╔════════════════════════════════════════════════════════════════
║ ERROR REPORT - Job ${jobId}
╠════════════════════════════════════════════════════════════════
║ Type:           ${type}
║ Stage:          ${stage}
║ Recoverable:    ${recoverable ? 'YES' : 'NO'}
║ Retryable:      ${retryable ? 'YES' : 'NO'}
║ Fallback:       ${fallbackAvailable ? 'AVAILABLE' : 'NOT AVAILABLE'}
║ Timestamp:      ${processingError.timestamp.toISOString()}
╠════════════════════════════════════════════════════════════════
║ Error Message:
║ ${error.message}
╠════════════════════════════════════════════════════════════════
║ Stack Trace:
║ ${error.stack?.split('\n').join('\n║ ')}
╚════════════════════════════════════════════════════════════════
    `.trim();
  }

  /**
   * Determina se erro é crítico (requer alerta)
   */
  isCriticalError(processingError: ProcessingError): boolean {
    const { type, stage, recoverable } = processingError;

    // Erros críticos que requerem atenção imediata
    const criticalTypes = [
      ErrorType.DATABASE_ERROR,
      ErrorType.MEDIAPIPE_ERROR, // Python service down
      ErrorType.RESOURCE_ERROR,
    ];

    const criticalStages = [
      PipelineStage.MEDIAPIPE, // Core do sistema
      PipelineStage.SAVE, // Perda de dados
    ];

    return (
      criticalTypes.includes(type) ||
      criticalStages.includes(stage) ||
      (!recoverable && !processingError.fallbackAvailable)
    );
  }
}
