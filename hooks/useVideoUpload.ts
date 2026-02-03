'use client';

/**
 * Hook para upload de video com progresso e validacao
 */

import { useState, useCallback } from 'react';
import { NFV_CONFIG } from '@/lib/biomechanics/nfv-config';

export interface VideoUploadState {
  file: File | null;
  preview: string | null;
  progress: number;
  isUploading: boolean;
  error: string | null;
  videoUrl: string | null;
  videoPath: string | null;
}

interface UseVideoUploadReturn {
  state: VideoUploadState;
  selectFile: (file: File) => string | null;
  upload: (userId: string, arenaSlug: string) => Promise<{ url: string; path: string } | null>;
  reset: () => void;
}

const initialState: VideoUploadState = {
  file: null,
  preview: null,
  progress: 0,
  isUploading: false,
  error: null,
  videoUrl: null,
  videoPath: null,
};

export function useVideoUpload(): UseVideoUploadReturn {
  const [state, setState] = useState<VideoUploadState>(initialState);

  const selectFile = useCallback((file: File): string | null => {
    // Validar tipo
    if (!NFV_CONFIG.VIDEO.allowedTypes.includes(file.type)) {
      const error = `Tipo nao permitido. Use: ${NFV_CONFIG.VIDEO.allowedTypes.join(', ')}`;
      setState(prev => ({ ...prev, error }));
      return error;
    }

    // Validar tamanho
    const maxBytes = NFV_CONFIG.VIDEO.maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      const error = `Arquivo muito grande. Maximo: ${NFV_CONFIG.VIDEO.maxSizeMB}MB`;
      setState(prev => ({ ...prev, error }));
      return error;
    }

    // Criar preview URL
    const preview = URL.createObjectURL(file);

    setState({
      ...initialState,
      file,
      preview,
    });

    return null;
  }, []);

  const upload = useCallback(async (
    userId: string,
    arenaSlug: string
  ): Promise<{ url: string; path: string } | null> => {
    if (!state.file) return null;

    setState(prev => ({ ...prev, isUploading: true, error: null, progress: 0 }));

    try {
      const formData = new FormData();
      formData.append('video', state.file);
      formData.append('userId', userId);
      formData.append('arenaSlug', arenaSlug);

      // Simular progresso com XMLHttpRequest para tracking real
      const result = await new Promise<{ url: string; path: string }>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100);
            setState(prev => ({ ...prev, progress }));
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const data = JSON.parse(xhr.responseText);
            resolve({ url: data.videoUrl, path: data.videoPath });
          } else {
            reject(new Error(xhr.responseText || 'Erro no upload'));
          }
        });

        xhr.addEventListener('error', () => reject(new Error('Erro de rede')));

        xhr.open('POST', '/api/nfv/videos/upload');
        xhr.send(formData);
      });

      setState(prev => ({
        ...prev,
        isUploading: false,
        progress: 100,
        videoUrl: result.url,
        videoPath: result.path,
      }));

      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro no upload';
      setState(prev => ({ ...prev, isUploading: false, error: message }));
      return null;
    }
  }, [state.file]);

  const reset = useCallback(() => {
    if (state.preview) {
      URL.revokeObjectURL(state.preview);
    }
    setState(initialState);
  }, [state.preview]);

  return { state, selectFile, upload, reset };
}
