'use client';

/**
 * ImageUploader - Componente de Upload de Imagens
 *
 * Botão + área de drop para adicionar imagens
 * Preview inline com opção de remover
 * Suporte a antes/depois
 *
 * Estilo: Cyberpunk dark com neon verde
 */

import React, { useRef, useState, useCallback } from 'react';
import {
  ImagePlus,
  X,
  Loader2,
  AlertCircle,
  Check,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { ImagePreview } from '@/hooks/useImageUpload';
import { UPLOAD_CONFIG } from '@/lib/upload';

// ============================================
// TIPOS
// ============================================

interface ImageUploaderProps {
  images: ImagePreview[];
  onAddImages: (files: FileList | File[]) => void;
  onRemoveImage: (id: string) => void;
  onSetMetadata?: (id: string, metadata: ImagePreview['metadata']) => void;
  error?: string | null;
  canAddMore: boolean;
  remainingSlots: number;
  disabled?: boolean;
  showBeforeAfter?: boolean;
  compact?: boolean;
}

// ============================================
// COMPONENTE: Preview Individual
// ============================================

function ImagePreviewItem({
  image,
  onRemove,
  onSetMetadata,
  showBeforeAfter,
  disabled,
}: {
  image: ImagePreview;
  onRemove: () => void;
  onSetMetadata?: (metadata: ImagePreview['metadata']) => void;
  showBeforeAfter?: boolean;
  disabled?: boolean;
}) {
  const isUploading = image.status === 'uploading';
  const isDone = image.status === 'done';
  const hasError = image.status === 'error';

  return (
    <div className="relative group">
      {/* Container da imagem */}
      <div
        className={`
          relative w-20 h-20 rounded-lg overflow-hidden
          border-2 transition-all duration-200
          ${hasError ? 'border-red-500' : isDone ? 'border-[#00ff88]' : 'border-zinc-700'}
          ${isUploading ? 'opacity-70' : ''}
        `}
      >
        {/* Imagem */}
        <img
          src={image.previewUrl}
          alt={image.file.name}
          className="w-full h-full object-cover"
        />

        {/* Overlay de progresso */}
        {isUploading && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-5 h-5 text-[#00ff88] animate-spin mx-auto mb-1" />
              <span className="text-xs text-white font-mono">{image.progress}%</span>
            </div>
          </div>
        )}

        {/* Overlay de sucesso */}
        {isDone && (
          <div className="absolute inset-0 bg-[#00ff88]/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Check className="w-6 h-6 text-[#00ff88]" />
          </div>
        )}

        {/* Overlay de erro */}
        {hasError && (
          <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
        )}

        {/* Badge Antes/Depois */}
        {showBeforeAfter && image.metadata && (
          <div
            className={`
              absolute top-1 left-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase
              ${image.metadata.is_before
                ? 'bg-orange-500 text-white'
                : image.metadata.is_after
                  ? 'bg-[#00ff88] text-black'
                  : ''
              }
            `}
          >
            {image.metadata.is_before ? 'Antes' : image.metadata.is_after ? 'Depois' : ''}
          </div>
        )}

        {/* Botão remover */}
        {!disabled && !isUploading && (
          <button
            onClick={onRemove}
            className={`
              absolute -top-2 -right-2 z-10
              w-5 h-5 rounded-full
              bg-red-500 hover:bg-red-400
              text-white
              flex items-center justify-center
              opacity-0 group-hover:opacity-100
              transition-all duration-200
              shadow-lg
            `}
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Controles Antes/Depois */}
      {showBeforeAfter && !disabled && onSetMetadata && (
        <div className="flex justify-center mt-1 gap-1">
          <button
            onClick={() =>
              onSetMetadata(
                image.metadata?.is_before
                  ? undefined
                  : { is_before: true }
              )
            }
            className={`
              px-1.5 py-0.5 rounded text-[9px] font-bold uppercase
              transition-colors
              ${image.metadata?.is_before
                ? 'bg-orange-500 text-white'
                : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700'
              }
            `}
          >
            A
          </button>
          <button
            onClick={() =>
              onSetMetadata(
                image.metadata?.is_after
                  ? undefined
                  : { is_after: true }
              )
            }
            className={`
              px-1.5 py-0.5 rounded text-[9px] font-bold uppercase
              transition-colors
              ${image.metadata?.is_after
                ? 'bg-[#00ff88] text-black'
                : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700'
              }
            `}
          >
            D
          </button>
        </div>
      )}

      {/* Tooltip de erro */}
      {hasError && image.error && (
        <div className="absolute top-full left-0 mt-1 z-20 w-32">
          <div className="bg-red-900/90 text-red-200 text-[10px] px-2 py-1 rounded">
            {image.error}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function ImageUploader({
  images,
  onAddImages,
  onRemoveImage,
  onSetMetadata,
  error,
  canAddMore,
  remainingSlots,
  disabled = false,
  showBeforeAfter = false,
  compact = false,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Handlers de drag & drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && canAddMore) {
      setIsDragging(true);
    }
  }, [disabled, canAddMore]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (disabled || !canAddMore) return;

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        onAddImages(files);
      }
    },
    [disabled, canAddMore, onAddImages]
  );

  // Handler de click no input
  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        onAddImages(files);
      }
      // Reset input para permitir selecionar o mesmo arquivo
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [onAddImages]
  );

  const openFilePicker = () => {
    if (!disabled && canAddMore && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Formato de arquivo aceito
  const acceptTypes = UPLOAD_CONFIG.allowedTypes.join(',');

  return (
    <div className="space-y-3">
      {/* Input oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptTypes}
        multiple
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || !canAddMore}
      />

      {/* Área de drop / Botão adicionar */}
      {canAddMore && !compact && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFilePicker}
          className={`
            relative cursor-pointer
            border-2 border-dashed rounded-xl
            p-4 transition-all duration-200
            flex items-center justify-center gap-3
            ${disabled
              ? 'opacity-50 cursor-not-allowed border-zinc-800'
              : isDragging
                ? 'border-[#00ff88] bg-[#00ff88]/5'
                : 'border-zinc-700 hover:border-zinc-600 hover:bg-zinc-900/50'
            }
          `}
        >
          <div
            className={`
              p-2 rounded-lg
              ${isDragging ? 'bg-[#00ff88]/20' : 'bg-zinc-800'}
            `}
          >
            <ImagePlus
              className={`w-5 h-5 ${isDragging ? 'text-[#00ff88]' : 'text-zinc-400'}`}
            />
          </div>
          <div className="text-left">
            <p className={`text-sm font-medium ${isDragging ? 'text-[#00ff88]' : 'text-zinc-300'}`}>
              {isDragging ? 'Solte para adicionar' : 'Adicionar imagens'}
            </p>
            <p className="text-xs text-zinc-500">
              Arraste ou clique • Máx {UPLOAD_CONFIG.maxFileSize / (1024 * 1024)}MB •{' '}
              {remainingSlots} restante{remainingSlots !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      )}

      {/* Botão compacto */}
      {canAddMore && compact && (
        <button
          onClick={openFilePicker}
          disabled={disabled}
          className={`
            flex items-center gap-2 px-3 py-2
            rounded-lg transition-colors
            ${disabled
              ? 'opacity-50 cursor-not-allowed bg-zinc-800'
              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
            }
          `}
        >
          <ImagePlus className="w-4 h-4" />
          <span className="text-sm">Imagem</span>
        </button>
      )}

      {/* Previews */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {images.map((image) => (
            <ImagePreviewItem
              key={image.id}
              image={image}
              onRemove={() => onRemoveImage(image.id)}
              onSetMetadata={
                onSetMetadata
                  ? (metadata) => onSetMetadata(image.id, metadata)
                  : undefined
              }
              showBeforeAfter={showBeforeAfter}
              disabled={disabled}
            />
          ))}

          {/* Botão adicionar mais (quando há imagens) */}
          {canAddMore && images.length > 0 && (
            <button
              onClick={openFilePicker}
              disabled={disabled}
              className={`
                w-20 h-20 rounded-lg
                border-2 border-dashed border-zinc-700
                flex items-center justify-center
                transition-all duration-200
                ${disabled
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:border-[#00ff88] hover:bg-[#00ff88]/5'
                }
              `}
            >
              <ImagePlus className="w-6 h-6 text-zinc-500" />
            </button>
          )}
        </div>
      )}

      {/* Erro */}
      {error && (
        <div className="flex items-center gap-2 px-3 py-2 bg-red-900/20 border border-red-500/30 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {/* Dica Antes/Depois */}
      {showBeforeAfter && images.length >= 2 && (
        <div className="flex items-center gap-2 px-3 py-2 bg-zinc-800/50 rounded-lg">
          <div className="flex items-center gap-1">
            <span className="px-1.5 py-0.5 bg-orange-500 text-white text-[9px] font-bold rounded">A</span>
            <span className="text-zinc-500 text-xs">=</span>
            <span className="text-zinc-400 text-xs">Antes</span>
          </div>
          <span className="text-zinc-700">|</span>
          <div className="flex items-center gap-1">
            <span className="px-1.5 py-0.5 bg-[#00ff88] text-black text-[9px] font-bold rounded">D</span>
            <span className="text-zinc-500 text-xs">=</span>
            <span className="text-zinc-400 text-xs">Depois</span>
          </div>
        </div>
      )}
    </div>
  );
}
