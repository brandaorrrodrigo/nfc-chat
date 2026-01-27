/**
 * useImageUpload - Hook para Upload de Imagens
 *
 * Hook React para gerenciar upload de imagens com:
 * - Preview local
 * - Progresso de upload
 * - Validação
 * - Estado de múltiplas imagens
 */

'use client';

import { useState, useCallback } from 'react';
import {
  UploadedFile,
  validateFile,
  uploadFile,
  TipoArquivo,
  UPLOAD_CONFIG,
} from '@/lib/upload';

// ============================================
// TIPOS
// ============================================

export interface ImagePreview {
  id: string;
  file: File;
  previewUrl: string;
  status: 'pending' | 'uploading' | 'done' | 'error';
  progress: number;
  error?: string;
  result?: UploadedFile;
  metadata?: {
    is_before?: boolean;
    is_after?: boolean;
  };
}

export interface UseImageUploadReturn {
  // Estado
  images: ImagePreview[];
  isUploading: boolean;
  error: string | null;

  // Ações
  addImages: (files: FileList | File[]) => void;
  removeImage: (id: string) => void;
  clearImages: () => void;
  setImageMetadata: (id: string, metadata: ImagePreview['metadata']) => void;

  // Upload
  uploadAll: (tipo: TipoArquivo, referenciaId: string) => Promise<UploadedFile[]>;

  // Helpers
  canAddMore: boolean;
  remainingSlots: number;
}

// ============================================
// HOOK
// ============================================

export function useImageUpload(maxFiles: number = UPLOAD_CONFIG.maxFiles): UseImageUploadReturn {
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helpers
  const canAddMore = images.length < maxFiles;
  const remainingSlots = maxFiles - images.length;

  // Gerar ID único
  const generateId = () => Math.random().toString(36).substring(2, 9);

  // Adicionar imagens
  const addImages = useCallback(
    (files: FileList | File[]) => {
      setError(null);
      const fileArray = Array.from(files);

      // Verificar limite
      if (images.length + fileArray.length > maxFiles) {
        setError(`Máximo de ${maxFiles} imagens. Você pode adicionar mais ${remainingSlots}.`);
        return;
      }

      const newPreviews: ImagePreview[] = [];

      for (const file of fileArray) {
        // Validar arquivo
        const validation = validateFile(file);
        if (!validation.valid) {
          setError(validation.error || 'Arquivo inválido');
          continue;
        }

        // Criar preview
        const previewUrl = URL.createObjectURL(file);
        newPreviews.push({
          id: generateId(),
          file,
          previewUrl,
          status: 'pending',
          progress: 0,
        });
      }

      if (newPreviews.length > 0) {
        setImages((prev) => [...prev, ...newPreviews]);
      }
    },
    [images.length, maxFiles, remainingSlots]
  );

  // Remover imagem
  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const image = prev.find((img) => img.id === id);
      if (image) {
        URL.revokeObjectURL(image.previewUrl);
      }
      return prev.filter((img) => img.id !== id);
    });
    setError(null);
  }, []);

  // Limpar todas
  const clearImages = useCallback(() => {
    images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    setImages([]);
    setError(null);
  }, [images]);

  // Definir metadata (antes/depois)
  const setImageMetadata = useCallback(
    (id: string, metadata: ImagePreview['metadata']) => {
      setImages((prev) =>
        prev.map((img) =>
          img.id === id ? { ...img, metadata } : img
        )
      );
    },
    []
  );

  // Upload de todas as imagens
  const uploadAll = useCallback(
    async (tipo: TipoArquivo, referenciaId: string): Promise<UploadedFile[]> => {
      if (images.length === 0) return [];

      setIsUploading(true);
      setError(null);
      const results: UploadedFile[] = [];

      try {
        for (let i = 0; i < images.length; i++) {
          const image = images[i];

          // Atualizar status para uploading
          setImages((prev) =>
            prev.map((img) =>
              img.id === image.id
                ? { ...img, status: 'uploading' as const }
                : img
            )
          );

          try {
            const result = await uploadFile(
              image.file,
              tipo,
              referenciaId,
              i,
              (progress) => {
                setImages((prev) =>
                  prev.map((img) =>
                    img.id === image.id ? { ...img, progress } : img
                  )
                );
              }
            );

            // Adicionar metadata
            result.metadata = image.metadata;

            results.push(result);

            // Atualizar status para done
            setImages((prev) =>
              prev.map((img) =>
                img.id === image.id
                  ? { ...img, status: 'done' as const, progress: 100, result }
                  : img
              )
            );
          } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro no upload';

            // Atualizar status para error
            setImages((prev) =>
              prev.map((img) =>
                img.id === image.id
                  ? { ...img, status: 'error' as const, error: errorMessage }
                  : img
              )
            );

            setError(errorMessage);
          }
        }

        return results;
      } finally {
        setIsUploading(false);
      }
    },
    [images]
  );

  return {
    images,
    isUploading,
    error,
    addImages,
    removeImage,
    clearImages,
    setImageMetadata,
    uploadAll,
    canAddMore,
    remainingSlots,
  };
}

export default useImageUpload;
