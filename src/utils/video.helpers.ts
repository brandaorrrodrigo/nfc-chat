/**
 * Utilitários para Manipulação de Vídeo
 *
 * Funções auxiliares para trabalhar com vídeos e metadados.
 */

import type { VideoMetadata } from '../services/video-extraction.service';
import { videoExtractionService } from '../services/video-extraction.service';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Obtém duração de um vídeo em segundos
 * @param videoPath - Caminho do vídeo
 * @returns Duração em segundos
 */
export async function getVideoDuration(videoPath: string): Promise<number> {
  const metadata = await videoExtractionService.getVideoMetadata(videoPath);
  return metadata.duration;
}

/**
 * Extrai thumbnail de um vídeo
 * @param videoPath - Caminho do vídeo
 * @param timestamp - Timestamp em segundos (default: meio do vídeo)
 * @param outputPath - Caminho de saída (opcional)
 * @returns Caminho do thumbnail gerado
 */
export async function extractThumbnail(
  videoPath: string,
  timestamp?: number,
  outputPath?: string
): Promise<string> {
  return videoExtractionService.generateThumbnail(
    videoPath,
    timestamp,
    outputPath
  );
}

/**
 * Formata tempo de processamento em string legível
 * @param ms - Tempo em milissegundos
 * @returns String formatada
 */
export function formatProcessingTime(ms: number): string {
  if (ms < 1000) {
    return `${Math.round(ms)}ms`;
  }

  const seconds = ms / 1000;

  if (seconds < 60) {
    return `${seconds.toFixed(1)}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);

  return `${minutes}min ${remainingSeconds}s`;
}

/**
 * Calcula qualidade de vídeo baseado em metadados
 * @param metadata - Metadados do vídeo
 * @returns Classificação de qualidade
 */
export function calculateVideoQuality(
  metadata: VideoMetadata
): 'baixa' | 'média' | 'alta' | 'excelente' {
  // Critérios de qualidade
  const hasGoodResolution = metadata.width >= 1920 && metadata.height >= 1080;
  const hasGoodFps = metadata.fps >= 60;
  const hasDecentResolution = metadata.width >= 1280 && metadata.height >= 720;
  const hasDecentFps = metadata.fps >= 30;

  // Classificação
  if (hasGoodResolution && hasGoodFps) {
    return 'excelente';
  }

  if (hasGoodResolution || hasGoodFps) {
    return 'alta';
  }

  if (hasDecentResolution && hasDecentFps) {
    return 'média';
  }

  return 'baixa';
}

/**
 * Verifica se vídeo atende requisitos mínimos
 * @param videoPath - Caminho do vídeo
 * @returns true se atende requisitos
 */
export async function meetsMinimumRequirements(
  videoPath: string
): Promise<boolean> {
  try {
    const metadata = await videoExtractionService.getVideoMetadata(videoPath);

    // Requisitos mínimos
    const minWidth = 640;
    const minHeight = 480;
    const minFps = 15;
    const minDuration = 1; // segundos

    return (
      metadata.width >= minWidth &&
      metadata.height >= minHeight &&
      metadata.fps >= minFps &&
      metadata.duration >= minDuration
    );
  } catch {
    return false;
  }
}

/**
 * Obtém informações formatadas do vídeo
 * @param videoPath - Caminho do vídeo
 * @returns Objeto com informações formatadas
 */
export async function getVideoInfo(videoPath: string): Promise<{
  path: string;
  name: string;
  size: string;
  duration: string;
  resolution: string;
  fps: number;
  quality: string;
  codec?: string;
}> {
  const metadata = await videoExtractionService.getVideoMetadata(videoPath);
  const fileSize = await videoExtractionService.getFileSize(videoPath);
  const quality = calculateVideoQuality(metadata);

  return {
    path: videoPath,
    name: path.basename(videoPath),
    size: formatFileSize(fileSize),
    duration: formatDuration(metadata.duration),
    resolution: `${metadata.width}x${metadata.height}`,
    fps: Math.round(metadata.fps),
    quality,
    codec: metadata.codec
  };
}

/**
 * Formata tamanho de arquivo
 * @param sizeMB - Tamanho em MB
 * @returns String formatada
 */
function formatFileSize(sizeMB: number): string {
  if (sizeMB < 1) {
    return `${Math.round(sizeMB * 1024)}KB`;
  }

  if (sizeMB < 1024) {
    return `${sizeMB.toFixed(1)}MB`;
  }

  return `${(sizeMB / 1024).toFixed(2)}GB`;
}

/**
 * Formata duração em string legível
 * @param seconds - Duração em segundos
 * @returns String formatada (MM:SS)
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);

  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Valida formato de vídeo suportado
 * @param filePath - Caminho do arquivo
 * @returns true se formato suportado
 */
export function isSupportedVideoFormat(filePath: string): boolean {
  const supportedExtensions = ['.mp4', '.webm', '.avi', '.mov', '.mkv'];
  const ext = path.extname(filePath).toLowerCase();
  return supportedExtensions.includes(ext);
}

/**
 * Obtém formato/extensão do vídeo
 * @param filePath - Caminho do arquivo
 * @returns Extensão (sem ponto)
 */
export function getVideoFormat(filePath: string): string {
  return path.extname(filePath).toLowerCase().substring(1);
}

/**
 * Calcula bitrate ideal para um vídeo
 * @param width - Largura do vídeo
 * @param height - Altura do vídeo
 * @param fps - Frames por segundo
 * @returns Bitrate ideal em kbps
 */
export function calculateIdealBitrate(
  width: number,
  height: number,
  fps: number
): number {
  // Fórmula aproximada: (width * height * fps * 0.07) / 1000
  const pixels = width * height;
  const bitrateKbps = (pixels * fps * 0.07) / 1000;

  return Math.round(bitrateKbps);
}

/**
 * Verifica se vídeo precisa de conversão
 * @param metadata - Metadados do vídeo
 * @returns true se conversão recomendada
 */
export function needsConversion(metadata: VideoMetadata): boolean {
  // Critérios para conversão
  const hasOddResolution = metadata.width % 2 !== 0 || metadata.height % 2 !== 0;
  const hasLowFps = metadata.fps < 30;
  const hasHighFps = metadata.fps > 120;
  const unsupportedCodec = metadata.codec && !['h264', 'vp9'].includes(metadata.codec);

  return hasOddResolution || hasLowFps || hasHighFps || !!unsupportedCodec;
}

/**
 * Gera nome de arquivo único para frames
 * @param exerciseName - Nome do exercício
 * @param timestamp - Timestamp (opcional)
 * @returns Nome de diretório
 */
export function generateFramesDir(
  exerciseName: string,
  timestamp?: number
): string {
  const ts = timestamp || Date.now();
  const safeName = exerciseName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  return `nfv-${safeName}-${ts}`;
}

/**
 * Limpa nome de exercício para uso em paths
 * @param exerciseName - Nome do exercício
 * @returns Nome limpo
 */
export function sanitizeExerciseName(exerciseName: string): string {
  return exerciseName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Espaços para hífens
    .replace(/-+/g, '-') // Múltiplos hífens para um
    .replace(/^-|-$/g, ''); // Remove hífens nas pontas
}

/**
 * Verifica se arquivo existe
 * @param filePath - Caminho do arquivo
 * @returns true se existe
 */
export function fileExists(filePath: string): boolean {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

/**
 * Obtém timestamp do meio do vídeo
 * @param duration - Duração total em segundos
 * @returns Timestamp do meio
 */
export function getMiddleTimestamp(duration: number): number {
  return Math.floor(duration / 2);
}

/**
 * Calcula número de frames em um vídeo
 * @param duration - Duração em segundos
 * @param fps - Frames por segundo
 * @returns Número total de frames
 */
export function calculateTotalFrames(duration: number, fps: number): number {
  return Math.floor(duration * fps);
}

/**
 * Calcula tempo de processamento estimado
 * @param frameCount - Número de frames
 * @param avgTimePerFrame - Tempo médio por frame em ms
 * @returns Tempo estimado em ms
 */
export function estimateProcessingTime(
  frameCount: number,
  avgTimePerFrame: number = 50
): number {
  return frameCount * avgTimePerFrame;
}

/**
 * Formata taxa de sucesso em porcentagem
 * @param processed - Frames processados
 * @param total - Total de frames
 * @returns String formatada
 */
export function formatSuccessRate(processed: number, total: number): string {
  if (total === 0) return '0%';
  const rate = (processed / total) * 100;
  return `${rate.toFixed(1)}%`;
}

/**
 * Cria objeto de progresso padronizado
 * @param current - Progresso atual
 * @param total - Total
 * @returns Objeto de progresso
 */
export function createProgress(
  current: number,
  total: number
): {
  current: number;
  total: number;
  percent: number;
  remaining: number;
} {
  const percent = total > 0 ? (current / total) * 100 : 0;
  const remaining = total - current;

  return {
    current,
    total,
    percent: Math.round(percent * 100) / 100,
    remaining
  };
}

/**
 * Valida range de timestamp
 * @param timestamp - Timestamp a validar
 * @param duration - Duração total do vídeo
 * @returns Timestamp validado (limitado ao range válido)
 */
export function validateTimestamp(timestamp: number, duration: number): number {
  return Math.max(0, Math.min(timestamp, duration));
}
