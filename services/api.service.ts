import { BiomechanicalAnalysis } from '@/types/biomechanical.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export class BiomechanicalApiService {

  /**
   * Fazer upload de vídeo para análise
   */
  static async uploadVideo(
    file: File,
    userId: string,
    exerciseName: string,
    captureMode: 'ESSENTIAL' | 'ADVANCED' | 'PRO'
  ): Promise<{ analysisId: string; jobId: string }> {
    const formData = new FormData();
    formData.append('video', file);
    formData.append('userId', userId);
    formData.append('exerciseName', exerciseName);
    formData.append('captureMode', captureMode);
    formData.append('generateThumbnail', 'true');
    formData.append('validateMetadata', 'true');

    const response = await fetch(`${API_BASE_URL}/api/v1/upload/video`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao fazer upload');
    }

    const data = await response.json();
    return data.data;
  }

  /**
   * Obter status da análise
   */
  static async getAnalysisStatus(analysisId: string): Promise<{
    id: string;
    status: 'queued' | 'processing' | 'completed' | 'failed';
    progress?: { stage: string; progress: number };
    result?: BiomechanicalAnalysis;
    error?: string;
  }> {
    const response = await fetch(`${API_BASE_URL}/api/v1/biomechanical/analysis/${analysisId}`);

    if (!response.ok) {
      throw new Error('Erro ao obter status');
    }

    const data = await response.json();
    return data.data;
  }

  /**
   * Polling de análise até completar
   */
  static async waitForAnalysis(
    analysisId: string,
    onProgress?: (progress: number) => void
  ): Promise<BiomechanicalAnalysis> {
    return new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        try {
          const status = await BiomechanicalApiService.getAnalysisStatus(analysisId);

          if (status.progress) {
            onProgress?.(status.progress.progress);
          }

          if (status.status === 'completed' && status.result) {
            clearInterval(interval);
            resolve(status.result);
          } else if (status.status === 'failed') {
            clearInterval(interval);
            reject(new Error(status.error || 'Análise falhou'));
          }
        } catch (error) {
          clearInterval(interval);
          reject(error);
        }
      }, 2000);

      // Timeout após 10 minutos
      setTimeout(() => {
        clearInterval(interval);
        reject(new Error('Timeout: análise demorou muito'));
      }, 600000);
    });
  }

  /**
   * Listar análises do usuário
   */
  static async listUserAnalyses(
    userId: string,
    limit = 10,
    offset = 0
  ): Promise<{
    items: BiomechanicalAnalysis[];
    total: number;
  }> {
    const params = new URLSearchParams({
      userId,
      limit: limit.toString(),
      offset: offset.toString(),
    });

    const response = await fetch(
      `${API_BASE_URL}/api/v1/biomechanical/analyses?${params}`
    );

    if (!response.ok) {
      throw new Error('Erro ao listar análises');
    }

    const data = await response.json();
    return data.data;
  }
}
