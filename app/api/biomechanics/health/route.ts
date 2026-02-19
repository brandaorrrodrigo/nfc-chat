/**
 * Health Check para Análise Biomecânica
 * GET /api/biomechanics/health
 *
 * Verifica se todas as dependências necessárias estão disponíveis
 */

import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface DependencyCheck {
  name: string;
  required: boolean;
  available: boolean;
  version?: string;
  error?: string;
}

async function checkCommand(command: string, versionFlag: string = '--version'): Promise<{ available: boolean; version?: string; error?: string }> {
  try {
    const { stdout } = await execAsync(`${command} ${versionFlag}`, { timeout: 5000 });
    return {
      available: true,
      version: stdout.trim().split('\n')[0].substring(0, 100),
    };
  } catch (error: any) {
    return {
      available: false,
      error: error.message?.substring(0, 100) || 'Command not found',
    };
  }
}

export async function GET() {
  const checks: DependencyCheck[] = [];

  // 1. FFmpeg (extração de frames)
  const ffmpegCheck = await checkCommand('ffmpeg', '-version');
  checks.push({
    name: 'FFmpeg',
    required: true,
    available: ffmpegCheck.available,
    version: ffmpegCheck.version,
    error: ffmpegCheck.error,
  });

  // 2. FFprobe (metadata de vídeo)
  const ffprobeCheck = await checkCommand('ffprobe', '-version');
  checks.push({
    name: 'FFprobe',
    required: true,
    available: ffprobeCheck.available,
    version: ffprobeCheck.version,
    error: ffprobeCheck.error,
  });

  // 3. Python (MediaPipe)
  const pythonCheck = await checkCommand('python', '--version');
  checks.push({
    name: 'Python',
    required: true,
    available: pythonCheck.available,
    version: pythonCheck.version,
    error: pythonCheck.error,
  });

  // 4. MediaPipe (verificar se instalado)
  let mediapipeCheck: { available: boolean; version: string | undefined; error: string | undefined } = { available: false, version: undefined, error: 'Not checked' };
  if (pythonCheck.available) {
    try {
      const { stdout } = await execAsync('python -c "import mediapipe; print(mediapipe.__version__)"', { timeout: 5000 });
      mediapipeCheck = {
        available: true,
        version: `mediapipe ${stdout.trim()}`,
        error: undefined,
      };
    } catch (error: any) {
      mediapipeCheck = {
        available: false,
        version: undefined,
        error: 'MediaPipe not installed or import failed',
      };
    }
  }
  checks.push({
    name: 'MediaPipe',
    required: true,
    available: mediapipeCheck.available,
    version: mediapipeCheck.version,
    error: mediapipeCheck.error,
  });

  // 5. Ollama (geração de relatório)
  let ollamaCheck: { available: boolean; version: string | undefined; error: string | undefined } = { available: false, version: undefined, error: 'Not checked' };
  try {
    const response = await fetch('http://localhost:11434/api/version', {
      signal: AbortSignal.timeout(5000)
    });
    if (response.ok) {
      const data = await response.json();
      ollamaCheck = {
        available: true,
        version: `Ollama ${data.version || 'unknown'}`,
        error: undefined,
      };
    } else {
      ollamaCheck = {
        available: false,
        version: undefined,
        error: `HTTP ${response.status}`,
      };
    }
  } catch (error: any) {
    ollamaCheck = {
      available: false,
      version: undefined,
      error: error.message?.substring(0, 100) || 'Connection failed',
    };
  }
  checks.push({
    name: 'Ollama',
    required: false, // Análise funciona sem Ollama, só não gera relatório
    available: ollamaCheck.available,
    version: ollamaCheck.version,
    error: ollamaCheck.error,
  });

  // 6. Modelo llama3.1 (se Ollama disponível)
  if (ollamaCheck.available) {
    try {
      const response = await fetch('http://localhost:11434/api/tags', {
        signal: AbortSignal.timeout(5000)
      });
      if (response.ok) {
        const data = await response.json();
        const hasLlama = data.models?.some((m: any) => m.name.includes('llama3.1'));
        checks.push({
          name: 'Ollama Model (llama3.1)',
          required: false,
          available: hasLlama,
          version: hasLlama ? 'Installed' : undefined,
          error: hasLlama ? undefined : 'llama3.1 not found. Run: ollama pull llama3.1',
        });
      }
    } catch (error: any) {
      checks.push({
        name: 'Ollama Model (llama3.1)',
        required: false,
        available: false,
        error: 'Could not check models',
      });
    }
  }

  // Determinar status geral
  const allRequired = checks.filter(c => c.required);
  const allRequiredAvailable = allRequired.every(c => c.available);
  const missingRequired = allRequired.filter(c => !c.available);

  const status = allRequiredAvailable ? 'healthy' : 'unhealthy';
  const canAnalyze = allRequiredAvailable;

  return NextResponse.json({
    status,
    canAnalyze,
    message: canAnalyze
      ? 'Todas as dependências necessárias estão disponíveis'
      : `Dependências faltando: ${missingRequired.map(c => c.name).join(', ')}`,
    environment: process.env.VERCEL ? 'vercel' : 'local',
    checks,
    recommendations: !canAnalyze ? [
      'Análise biomecânica requer ambiente local com:',
      '  1. FFmpeg instalado (https://ffmpeg.org/download.html)',
      '  2. Python 3.11+ instalado',
      '  3. MediaPipe instalado: pip install mediapipe==0.10.31',
      '  4. (Opcional) Ollama rodando com llama3.1',
      '',
      'Para ambiente de produção, use Docker:',
      '  cd docker && make start',
    ] : undefined,
  }, {
    status: canAnalyze ? 200 : 503,
  });
}
