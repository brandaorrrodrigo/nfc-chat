'use client';

/**
 * Upload Stub - NFC Comunidades
 *
 * Stub funcional para destravar build.
 * Upload real será implementado posteriormente.
 */

// ============================================
// TIPOS
// ============================================

export type TipoArquivo =
  | 'foto-evolucao'
  | 'foto-refeicao'
  | 'foto-comunidade'
  | 'documento'
  | 'avatar';

export type UploadedFile = {
  url: string;
  name?: string;
  size?: number;
  type?: string;
  path?: string;
  metadata?: {
    is_before?: boolean;
    is_after?: boolean;
  };
};

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

// ============================================
// CONFIGURAÇÃO
// ============================================

export const UPLOAD_CONFIG = {
  maxFiles: 5,
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
};

// ============================================
// FUNÇÕES
// ============================================

/**
 * Valida arquivo antes do upload
 */
export function validateFile(file: File): ValidationResult {
  // Verificar tipo
  if (!UPLOAD_CONFIG.allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Tipo não permitido: ${file.type}. Use: JPG, PNG, WebP ou GIF.`,
    };
  }

  // Verificar tamanho
  if (file.size > UPLOAD_CONFIG.maxSize) {
    const maxMB = UPLOAD_CONFIG.maxSize / (1024 * 1024);
    return {
      valid: false,
      error: `Arquivo muito grande. Máximo: ${maxMB}MB.`,
    };
  }

  return { valid: true };
}

/**
 * Upload de arquivo (STUB)
 * Retorna mock enquanto backend não está pronto
 */
export async function uploadFile(
  file: File,
  _tipo?: TipoArquivo,
  _referenciaId?: string,
  _index?: number,
  onProgress?: (progress: number) => void
): Promise<UploadedFile> {
  // Simular progresso
  if (onProgress) {
    for (let i = 0; i <= 100; i += 20) {
      await new Promise((r) => setTimeout(r, 50));
      onProgress(i);
    }
  }

  console.warn('[Upload Stub] Upload simulado para:', file.name);

  // Retornar mock com URL de preview local
  const previewUrl = URL.createObjectURL(file);

  return {
    url: previewUrl,
    name: file.name,
    size: file.size,
    type: file.type,
    path: `stub/${Date.now()}-${file.name}`,
  };
}

/**
 * Deletar arquivo (STUB)
 */
export async function deleteFile(_path: string): Promise<boolean> {
  console.warn('[Upload Stub] Delete simulado');
  return true;
}
