'use client';

/**
 * ImageGallery - Galeria de Imagens para Feed
 *
 * Exibe imagens de tópicos/respostas
 * Layout especial para Antes/Depois (lado a lado)
 * Lightbox para visualização em tela cheia
 *
 * Estilo: Cyberpunk dark com neon verde
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Download,
  Maximize2,
} from 'lucide-react';

// ============================================
// TIPOS
// ============================================

export interface GalleryImage {
  url: string;
  largura?: number;
  altura?: number;
  metadata?: {
    is_before?: boolean;
    is_after?: boolean;
  };
}

interface ImageGalleryProps {
  images: GalleryImage[];
  maxHeight?: number;
  className?: string;
}

interface LightboxProps {
  images: GalleryImage[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

// ============================================
// COMPONENTE: Lightbox
// ============================================

function Lightbox({ images, currentIndex, onClose, onNavigate }: LightboxProps) {
  const current = images[currentIndex];
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  // Navegação por teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onNavigate(currentIndex - 1);
      if (e.key === 'ArrowRight' && hasNext) onNavigate(currentIndex + 1);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [currentIndex, hasPrev, hasNext, onClose, onNavigate]);

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Controles */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        {/* Contador */}
        <span className="px-3 py-1.5 bg-zinc-900/80 rounded-lg text-sm text-zinc-400 font-mono">
          {currentIndex + 1} / {images.length}
        </span>

        {/* Download */}
        <a
          href={current.url}
          download
          onClick={(e) => e.stopPropagation()}
          className="p-2 bg-zinc-900/80 hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <Download className="w-5 h-5 text-zinc-400" />
        </a>

        {/* Fechar */}
        <button
          onClick={onClose}
          className="p-2 bg-zinc-900/80 hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-zinc-400" />
        </button>
      </div>

      {/* Navegação Anterior */}
      {hasPrev && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(currentIndex - 1);
          }}
          className={`
            absolute left-4 top-1/2 -translate-y-1/2
            p-3 bg-zinc-900/80 hover:bg-zinc-800
            rounded-full transition-colors
          `}
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Imagem */}
      <div
        className="relative max-w-[90vw] max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={current.url}
          alt=""
          className="max-w-full max-h-[90vh] object-contain rounded-lg"
        />

        {/* Badge Antes/Depois */}
        {current.metadata && (current.metadata.is_before || current.metadata.is_after) && (
          <div
            className={`
              absolute top-4 left-4 px-3 py-1.5 rounded-lg
              text-sm font-bold uppercase tracking-wider
              ${current.metadata.is_before
                ? 'bg-orange-500 text-white'
                : 'bg-[#00ff88] text-black'
              }
            `}
          >
            {current.metadata.is_before ? 'Antes' : 'Depois'}
          </div>
        )}
      </div>

      {/* Navegação Próximo */}
      {hasNext && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(currentIndex + 1);
          }}
          className={`
            absolute right-4 top-1/2 -translate-y-1/2
            p-3 bg-zinc-900/80 hover:bg-zinc-800
            rounded-full transition-colors
          `}
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                onNavigate(idx);
              }}
              className={`
                w-12 h-12 rounded-lg overflow-hidden border-2 transition-all
                ${idx === currentIndex
                  ? 'border-[#00ff88] scale-110'
                  : 'border-transparent opacity-60 hover:opacity-100'
                }
              `}
            >
              <img src={img.url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// COMPONENTE: Layout Antes/Depois
// ============================================

function BeforeAfterLayout({
  before,
  after,
  onImageClick,
}: {
  before: GalleryImage;
  after: GalleryImage;
  onImageClick: (index: number) => void;
}) {
  return (
    <div className="relative">
      {/* Container lado a lado */}
      <div className="flex gap-2 rounded-xl overflow-hidden">
        {/* Antes */}
        <div className="relative flex-1 group cursor-pointer" onClick={() => onImageClick(0)}>
          <img
            src={before.url}
            alt="Antes"
            className="w-full h-48 object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <span className="absolute bottom-2 left-2 px-2 py-1 bg-orange-500 text-white text-xs font-bold uppercase rounded">
            Antes
          </span>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Maximize2 className="w-6 h-6 text-white drop-shadow-lg" />
          </div>
        </div>

        {/* Divisor */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-[#00ff88] z-10 shadow-[0_0_10px_rgba(0,255,136,0.5)]" />

        {/* Depois */}
        <div className="relative flex-1 group cursor-pointer" onClick={() => onImageClick(1)}>
          <img
            src={after.url}
            alt="Depois"
            className="w-full h-48 object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <span className="absolute bottom-2 right-2 px-2 py-1 bg-[#00ff88] text-black text-xs font-bold uppercase rounded">
            Depois
          </span>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Maximize2 className="w-6 h-6 text-white drop-shadow-lg" />
          </div>
        </div>
      </div>

      {/* Ícone central */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <div className="w-8 h-8 rounded-full bg-[#00ff88] flex items-center justify-center shadow-lg">
          <ChevronLeft className="w-3 h-3 text-black" />
          <ChevronRight className="w-3 h-3 text-black -ml-1" />
        </div>
      </div>
    </div>
  );
}

// ============================================
// COMPONENTE: Grid de Imagens
// ============================================

function ImageGrid({
  images,
  onImageClick,
}: {
  images: GalleryImage[];
  onImageClick: (index: number) => void;
}) {
  const count = images.length;

  // Layout baseado na quantidade
  if (count === 1) {
    return (
      <div
        className="relative rounded-xl overflow-hidden cursor-pointer group"
        onClick={() => onImageClick(0)}
      >
        <img
          src={images[0].url}
          alt=""
          className="w-full max-h-80 object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
          <ZoomIn className="w-8 h-8 text-white drop-shadow-lg" />
        </div>
      </div>
    );
  }

  if (count === 2) {
    return (
      <div className="grid grid-cols-2 gap-2 rounded-xl overflow-hidden">
        {images.map((img, idx) => (
          <div
            key={idx}
            className="relative cursor-pointer group"
            onClick={() => onImageClick(idx)}
          >
            <img
              src={img.url}
              alt=""
              className="w-full h-48 object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
              <ZoomIn className="w-6 h-6 text-white drop-shadow-lg" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (count === 3) {
    return (
      <div className="grid grid-cols-2 gap-2 rounded-xl overflow-hidden">
        <div
          className="relative row-span-2 cursor-pointer group"
          onClick={() => onImageClick(0)}
        >
          <img
            src={images[0].url}
            alt=""
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            style={{ minHeight: '200px' }}
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
            <ZoomIn className="w-6 h-6 text-white drop-shadow-lg" />
          </div>
        </div>
        {images.slice(1).map((img, idx) => (
          <div
            key={idx}
            className="relative cursor-pointer group"
            onClick={() => onImageClick(idx + 1)}
          >
            <img
              src={img.url}
              alt=""
              className="w-full h-24 object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
              <ZoomIn className="w-5 h-5 text-white drop-shadow-lg" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 4+ imagens
  return (
    <div className="grid grid-cols-2 gap-2 rounded-xl overflow-hidden">
      {images.slice(0, 4).map((img, idx) => (
        <div
          key={idx}
          className="relative cursor-pointer group"
          onClick={() => onImageClick(idx)}
        >
          <img
            src={img.url}
            alt=""
            className="w-full h-32 object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
            <ZoomIn className="w-5 h-5 text-white drop-shadow-lg" />
          </div>

          {/* Contador de imagens extras */}
          {idx === 3 && count > 4 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">+{count - 4}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function ImageGallery({
  images,
  maxHeight = 320,
  className = '',
}: ImageGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Verifica se é layout antes/depois
  const beforeImage = images.find((img) => img.metadata?.is_before);
  const afterImage = images.find((img) => img.metadata?.is_after);
  const isBeforeAfter = beforeImage && afterImage && images.length === 2;

  const handleImageClick = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  if (images.length === 0) return null;

  return (
    <>
      <div className={`mt-3 ${className}`}>
        {isBeforeAfter ? (
          <BeforeAfterLayout
            before={beforeImage}
            after={afterImage}
            onImageClick={handleImageClick}
          />
        ) : (
          <ImageGrid images={images} onImageClick={handleImageClick} />
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onNavigate={setLightboxIndex}
        />
      )}
    </>
  );
}
