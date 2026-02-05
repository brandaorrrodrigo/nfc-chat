'use client';

/**
 * AvatarUpload - Componente para upload de avatar
 *
 * Permite ao usuário:
 * - Fazer upload de uma foto de perfil
 * - Remover a foto e voltar para as iniciais
 * - Preview da imagem antes do upload
 */

import React, { useState, useRef } from 'react';
import { Camera, X, Upload, Loader2 } from 'lucide-react';
import { uploadFile, validateFile } from '@/lib/upload';

interface AvatarUploadProps {
  currentAvatar?: string;
  userName: string;
  onAvatarChange: (newAvatarUrl: string | null) => Promise<void>;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function AvatarUpload({
  currentAvatar,
  userName,
  onAvatarChange,
  size = 'xl',
}: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatar || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-16 h-16 text-xl',
    md: 'w-20 h-20 text-2xl',
    lg: 'w-24 h-24 text-3xl',
    xl: 'w-32 h-32 text-4xl',
  };

  const getInitials = (name: string): string => {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validar arquivo
    const validation = validateFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Arquivo inválido');
      return;
    }

    setIsUploading(true);

    try {
      // Upload do arquivo
      const uploaded = await uploadFile(file, 'avatar', 'user-avatar');

      // Atualizar preview localmente
      setPreviewUrl(uploaded.url);

      // Chamar callback para salvar no backend
      await onAvatarChange(uploaded.url);
    } catch (err) {
      console.error('Erro ao fazer upload:', err);
      setError('Erro ao fazer upload. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setIsUploading(true);
    try {
      setPreviewUrl(null);
      await onAvatarChange(null);
    } catch (err) {
      console.error('Erro ao remover avatar:', err);
      setError('Erro ao remover avatar. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Avatar Preview */}
      <div className="relative group">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={userName}
            className={`
              ${sizeClasses[size]}
              rounded-full object-cover
              ring-4 ring-emerald-500/30
              transition-all duration-200
              group-hover:ring-emerald-500/50
            `}
          />
        ) : (
          <div
            className={`
              ${sizeClasses[size]}
              rounded-full
              bg-gradient-to-br from-emerald-400 to-cyan-500
              flex items-center justify-center
              text-black font-bold
              ring-4 ring-emerald-500/30
              transition-all duration-200
              group-hover:ring-emerald-500/50
            `}
          >
            {getInitials(userName)}
          </div>
        )}

        {/* Overlay de ações ao hover */}
        <div
          className="
            absolute inset-0 rounded-full
            bg-black/60 backdrop-blur-sm
            flex items-center justify-center
            opacity-0 group-hover:opacity-100
            transition-opacity duration-200
            cursor-pointer
          "
          onClick={handleClick}
        >
          {isUploading ? (
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          ) : (
            <Camera className="w-8 h-8 text-white" />
          )}
        </div>

        {/* Botão de remover (se tem avatar) */}
        {previewUrl && !isUploading && (
          <button
            onClick={handleRemoveAvatar}
            className="
              absolute -top-2 -right-2
              w-8 h-8 rounded-full
              bg-red-500 hover:bg-red-600
              flex items-center justify-center
              shadow-lg
              transition-colors
              z-10
            "
            title="Remover foto"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        )}
      </div>

      {/* Botões de ação */}
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={handleClick}
          disabled={isUploading}
          className="
            px-4 py-2 rounded-lg
            bg-emerald-500 hover:bg-emerald-600
            disabled:bg-zinc-700 disabled:text-zinc-500
            text-white font-medium
            flex items-center gap-2
            transition-colors
          "
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              {previewUrl ? 'Trocar foto' : 'Adicionar foto'}
            </>
          )}
        </button>

        <p className="text-xs text-zinc-500 text-center">
          JPG, PNG ou WebP até 5MB
        </p>
      </div>

      {/* Mensagem de erro */}
      {error && (
        <div className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Input de arquivo (hidden) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
