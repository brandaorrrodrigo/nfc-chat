'use client';

/**
 * ComposeBox - Caixa de Composição de Mensagens
 *
 * Input para enviar mensagens no Painel Vivo
 * Suporte a upload de imagens (até 5)
 * Antes/Depois para relatos de progresso
 *
 * Estilo: Premium Cyberpunk - Cyan (#00f5ff) + Magenta (#ff006e) + Purple (#8b5cf6)
 */

import React, { useState, useRef } from 'react';
import { MessageSquare, Send, ImagePlus, X, Loader2 } from 'lucide-react';
import useImageUpload, { ImagePreview } from '@/hooks/useImageUpload';

// ============================================
// TIPOS
// ============================================

interface ComposeBoxProps {
  isAuthenticated: boolean;
  onSubmit?: (message: string, images?: ImagePreview[]) => void;
  onLoginRequired?: () => void;
  placeholder?: string;
  showImageUpload?: boolean;
  disabled?: boolean;
}

// ============================================
// COMPONENTE: Preview Compacto de Imagem
// ============================================

function CompactImagePreview({
  image,
  onRemove,
  disabled,
}: {
  image: ImagePreview;
  onRemove: () => void;
  disabled?: boolean;
}) {
  const isUploading = image.status === 'uploading';
  const hasError = image.status === 'error';

  return (
    <div className="relative group">
      <div
        className={`
          w-12 h-12 rounded-lg overflow-hidden border
          ${hasError ? 'border-red-500' : 'border-zinc-700'}
          ${isUploading ? 'opacity-70' : ''}
        `}
      >
        <img
          src={image.previewUrl}
          alt=""
          className="w-full h-full object-cover"
        />

        {isUploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Loader2 className="w-4 h-4 text-[#00f5ff] animate-spin" />
          </div>
        )}
      </div>

      {!disabled && !isUploading && (
        <button
          onClick={onRemove}
          className={`
            absolute -top-1 -right-1
            w-4 h-4 rounded-full
            bg-red-500 hover:bg-red-400
            text-white
            flex items-center justify-center
            opacity-0 group-hover:opacity-100
            transition-opacity
          `}
        >
          <X className="w-2.5 h-2.5" />
        </button>
      )}
    </div>
  );
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function ComposeBox({
  isAuthenticated,
  onSubmit,
  onLoginRequired,
  placeholder = 'Digite sua mensagem...',
  showImageUpload = true,
  disabled = false,
}: ComposeBoxProps) {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    images,
    isUploading,
    error: uploadError,
    addImages,
    removeImage,
    clearImages,
    canAddMore,
  } = useImageUpload(5);

  // Se não autenticado, mostrar CTA de login
  if (!isAuthenticated) {
    return (
      <div
        className="p-4 border-t backdrop-blur-md"
        style={{
          background: 'linear-gradient(135deg, rgba(26, 31, 58, 0.95) 0%, rgba(10, 14, 39, 0.95) 100%)',
          borderColor: 'rgba(0, 245, 255, 0.1)',
        }}
      >
        <button
          onClick={onLoginRequired}
          className={`
            w-full py-3 px-4
            bg-[#1a1f3a]/80 hover:bg-[#1a1f3a]
            border border-[#00f5ff]/20 hover:border-[#00f5ff]/50
            rounded-xl
            text-zinc-400 hover:text-[#00f5ff]
            text-sm
            transition-all
            flex items-center justify-center gap-2
          `}
        >
          <MessageSquare className="w-4 h-4" />
          Faça login para participar da conversa
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() && images.length === 0) return;

    setIsSubmitting(true);

    try {
      // Chamar callback com mensagem e imagens
      onSubmit?.(message, images.length > 0 ? images : undefined);
      setMessage('');
      clearImages();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addImages(e.target.files);
    }
    // Reset para permitir selecionar o mesmo arquivo novamente
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFilePicker = () => {
    if (canAddMore && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const canSubmit = (message.trim() || images.length > 0) && !isSubmitting && !isUploading;

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t backdrop-blur-md"
      style={{
        background: 'linear-gradient(135deg, rgba(26, 31, 58, 0.95) 0%, rgba(10, 14, 39, 0.95) 100%)',
        borderColor: 'rgba(0, 245, 255, 0.1)',
      }}
    >
      {/* Input oculto para seleção de arquivos */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || !canAddMore}
      />

      {/* Preview de imagens */}
      {images.length > 0 && (
        <div className="px-4 pt-3 flex flex-wrap gap-2">
          {images.map((img) => (
            <CompactImagePreview
              key={img.id}
              image={img}
              onRemove={() => removeImage(img.id)}
              disabled={isSubmitting || isUploading}
            />
          ))}
        </div>
      )}

      {/* Erro de upload */}
      {uploadError && (
        <div className="px-4 pt-2">
          <p className="text-xs text-red-400">{uploadError}</p>
        </div>
      )}

      {/* Input e botões */}
      <div className="p-4 flex items-center gap-3">
        {/* Botão de imagem */}
        {showImageUpload && (
          <button
            type="button"
            onClick={openFilePicker}
            disabled={disabled || !canAddMore}
            className={`
              p-2.5 rounded-lg transition-colors
              ${canAddMore
                ? 'bg-[#1a1f3a]/80 hover:bg-[#1a1f3a] text-zinc-400 hover:text-[#00f5ff] border border-white/5 hover:border-[#00f5ff]/30'
                : 'bg-[#1a1f3a]/50 text-zinc-600 cursor-not-allowed border border-white/5'
              }
            `}
            title={canAddMore ? 'Adicionar imagem' : 'Limite de imagens atingido'}
          >
            <ImagePlus className="w-5 h-5" />
          </button>
        )}

        {/* Input de texto */}
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={placeholder}
          disabled={disabled || isSubmitting}
          className={`
            flex-1
            px-4 py-3
            bg-[#1a1f3a]/80 hover:bg-[#1a1f3a] focus:bg-[#1a1f3a]
            border border-white/10 focus:border-[#00f5ff]/50
            rounded-xl
            text-white placeholder-zinc-500
            text-sm
            outline-none
            transition-all
            disabled:opacity-50
          `}
        />

        {/* Botão enviar */}
        <button
          type="submit"
          disabled={!canSubmit || disabled}
          className={`
            px-5 py-3
            bg-gradient-to-r from-[#00f5ff] to-[#00b8c4]
            disabled:bg-zinc-700 disabled:text-zinc-500 disabled:from-zinc-700 disabled:to-zinc-700
            text-black font-semibold
            rounded-xl
            transition-all
            hover:shadow-[0_0_20px_rgba(0,245,255,0.4)]
            disabled:shadow-none
            disabled:cursor-not-allowed
            flex items-center gap-2
          `}
        >
          {isSubmitting || isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">
            {isUploading ? 'Enviando...' : 'Enviar'}
          </span>
        </button>
      </div>
    </form>
  );
}
