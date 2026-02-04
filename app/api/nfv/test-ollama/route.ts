/**
 * API Route: Test Ollama Vision Integration
 * GET - Verifica se Ollama e llama3.2-vision estão funcionando
 */

import { NextResponse } from 'next/server';
import { checkVisionModelAvailable, checkFfmpegAvailable, getBestVisionModel } from '@/lib/vision/video-analysis';
import axios from 'axios';

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';

export async function GET() {
  const results: Record<string, any> = {
    timestamp: new Date().toISOString(),
    ollama_url: OLLAMA_URL,
  };

  // 1. Verificar se Ollama está rodando
  try {
    const ollamaResponse = await axios.get(`${OLLAMA_URL}/api/tags`, { timeout: 5000 });
    results.ollama_running = true;
    results.ollama_models = ollamaResponse.data.models?.map((m: any) => m.name) || [];
  } catch (error: any) {
    results.ollama_running = false;
    results.ollama_error = error.message;
  }

  // 2. Verificar se Vision Model está disponível
  results.vision_model_available = await checkVisionModelAvailable();
  results.best_vision_model = await getBestVisionModel();

  // 3. Verificar se ffmpeg está instalado
  results.ffmpeg_available = await checkFfmpegAvailable();

  // 4. Status geral
  results.ready = results.ollama_running &&
                  results.vision_model_available &&
                  results.ffmpeg_available;

  // Instruções se não estiver pronto
  if (!results.ready) {
    results.instructions = [];

    if (!results.ollama_running) {
      results.instructions.push('Inicie o Ollama: ollama serve');
    }

    if (!results.vision_model_available) {
      results.instructions.push('Baixe o modelo: ollama pull llama3.2-vision');
    }

    if (!results.ffmpeg_available) {
      results.instructions.push('Instale ffmpeg: choco install ffmpeg (Windows) ou brew install ffmpeg (Mac)');
    }
  }

  return NextResponse.json(results);
}
