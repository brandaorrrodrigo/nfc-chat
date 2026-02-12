'use client';

/**
 * Hook para upload de video com progresso e trigger automatico de analise IA
 *
 * Fluxo completo:
 * 1. Upload do arquivo para Supabase Storage (POST /api/nfv/upload-video)
 * 2. Criar registro no banco + trigger IA (POST /api/nfv/videos)
 * 3. Retorna analysisId para o componente
 */

import { useState, useCallback, useRef } from 'react';
import { NFV_CONFIG } from '@/lib/biomechanics/nfv-config';

interface UploadVideoParams {
  file: File;
  userId: string;
  userName: string;
  arenaSlug: string;
  movementPattern: string;
  userDescription?: string;
  paidWithSubscription?: boolean;
}

interface UploadResult {
  analysisId: string;
}

interface UseVideoUploadReturn {
  uploadVideo: (params: UploadVideoParams) => Promise<UploadResult | null>;
  uploading: boolean;
  progress: number;
  error: string | null;
  reset: () => void;
}

export function useVideoUpload(): UseVideoUploadReturn {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    setUploading(false);
    setProgress(0);
    setError(null);
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
  }, []);

  const uploadVideo = useCallback(async (params: UploadVideoParams): Promise<UploadResult | null> => {
    const { file, userId, userName, arenaSlug, movementPattern, userDescription, paidWithSubscription } = params;

    // Validar tipo
    if (!NFV_CONFIG.VIDEO.allowedTypes.includes(file.type)) {
      const msg = `Tipo nao permitido. Use: ${NFV_CONFIG.VIDEO.allowedTypes.join(', ')}`;
      setError(msg);
      return null;
    }

    // Validar tamanho
    const maxBytes = NFV_CONFIG.VIDEO.maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      setError(`Arquivo muito grande. Maximo: ${NFV_CONFIG.VIDEO.maxSizeMB}MB`);
      return null;
    }

    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      // === ETAPA 1: Upload do arquivo para Storage (com progress) ===
      const formData = new FormData();
      formData.append('file', file);
      formData.append('arenaSlug', arenaSlug);
      formData.append('userId', userId);

      const storageResult = await new Promise<{ videoUrl: string; videoPath: string }>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            // Upload do arquivo = 0-80% do progresso total
            const pct = Math.round((e.loaded / e.total) * 80);
            setProgress(pct);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText);
              resolve({ videoUrl: data.videoUrl, videoPath: data.videoPath });
            } catch {
              reject(new Error('Resposta invalida do servidor'));
            }
          } else {
            let msg = 'Erro no upload do video';
            try {
              const err = JSON.parse(xhr.responseText);
              msg = err.error || msg;
            } catch { /* use default */ }
            reject(new Error(msg));
          }
        });

        xhr.addEventListener('error', () => reject(new Error('Erro de rede no upload')));
        xhr.addEventListener('abort', () => reject(new Error('Upload cancelado')));

        xhr.open('POST', '/api/nfv/upload-video');
        xhr.send(formData);
      });

      setProgress(85);

      // === ETAPA 2: Criar registro no banco + trigger IA ===
      const response = await fetch('/api/nfv/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          userName,
          arenaSlug,
          videoUrl: storageResult.videoUrl,
          videoPath: storageResult.videoPath,
          movementPattern,
          userDescription: userDescription || null,
          paidWithSubscription: paidWithSubscription || false,
        }),
      });

      if (!response.ok) {
        let msg = 'Erro ao registrar video';
        try {
          const err = await response.json();
          msg = err.error || msg;
        } catch { /* use default */ }
        throw new Error(msg);
      }

      const data = await response.json();
      const analysisId = data.analysis?.id;

      if (!analysisId) {
        throw new Error('Registro criado mas ID nao retornado');
      }

      setProgress(100);
      setUploading(false);

      return { analysisId };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro no upload';
      setError(message);
      setUploading(false);
      return null;
    }
  }, []);

  return { uploadVideo, uploading, progress, error, reset };
}
