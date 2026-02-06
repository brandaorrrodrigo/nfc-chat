'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface AvatarDisplayProps {
  /** ID do avatar no catálogo (ex: "avatar_f_02") */
  avatarId?: string;

  /** URL da imagem do avatar */
  avatarImg?: string;

  /** Nome do usuário (usado para gerar iniciais) */
  userName: string;

  /** Cor das iniciais (fallback quando não há imagem) */
  initialsColor?: string;

  /** Tamanho do avatar */
  size?: 'sm' | 'md' | 'lg' | 'xl';

  /** Classe CSS adicional */
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-16 h-16 text-base',
  xl: 'w-24 h-24 text-xl'
};

/**
 * Componente de Avatar com fallback inteligente
 *
 * Ordem de prioridade:
 * 1. Se tem avatarImg válido → renderiza imagem
 * 2. Se imagem falhar → fallback para iniciais coloridas
 * 3. Se não tem avatarImg → iniciais coloridas direto
 *
 * IMPORTANTE: Avatares são atribuídos pelo BACKEND, não pelo LLM
 */
export function AvatarDisplay({
  avatarId,
  avatarImg,
  userName,
  initialsColor,
  size = 'md',
  className = ''
}: AvatarDisplayProps) {
  const [imageError, setImageError] = useState(false);

  /**
   * Extrai iniciais do nome (2 letras)
   * - Nome único: primeiras 2 letras
   * - Nome completo: primeira do primeiro + primeira do último
   */
  const getInitials = (name: string): string => {
    const parts = name.trim().split(/\s+/);

    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }

    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  /**
   * Gera cor determinística baseada no nome
   * Sempre retorna a mesma cor para o mesmo nome
   */
  const getColorFromName = (name: string): string => {
    const colors = [
      '#FF6B9D', '#9D50BB', '#F59E0B', '#6366F1', '#3B82F6',
      '#10B981', '#EF4444', '#8B5CF6', '#06B6D4', '#F97316',
      '#EC4899', '#8B5A3C', '#64748B', '#14B8A6', '#A855F7',
      '#D946EF', '#0EA5E9', '#84CC16', '#7C3AED', '#DC2626'
    ];

    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const initials = getInitials(userName);
  const bgColor = initialsColor || getColorFromName(userName);

  // Renderizar INICIAIS (fallback ou primário)
  const renderInitials = () => (
    <div
      className={`flex items-center justify-center rounded-full font-semibold text-white flex-shrink-0 ${sizeClasses[size]} ${className}`}
      style={{ backgroundColor: bgColor }}
      title={userName}
      aria-label={`Avatar de ${userName}`}
    >
      {initials}
    </div>
  );

  // Se não tem imagem OU houve erro, renderizar iniciais direto
  if (!avatarImg || imageError || avatarImg === '/avatars/default.png') {
    return renderInitials();
  }

  // Renderizar IMAGEM com fallback
  return (
    <div
      className={`relative rounded-full overflow-hidden ${sizeClasses[size]} flex-shrink-0 ${className}`}
      title={userName}
      aria-label={`Avatar de ${userName}`}
    >
      <Image
        src={avatarImg}
        alt={`Avatar de ${userName}`}
        fill
        className="object-cover"
        sizes={size === 'xl' ? '96px' : size === 'lg' ? '64px' : size === 'md' ? '48px' : '32px'}
        onError={() => {
          console.warn(`[AvatarDisplay] Erro ao carregar imagem: ${avatarImg}. Usando fallback de iniciais.`);
          setImageError(true);
        }}
      />
    </div>
  );
}

/**
 * Componente de Avatar com Badge (premium, founder, etc.)
 */
interface AvatarWithBadgeProps extends AvatarDisplayProps {
  isPremium?: boolean;
  isFounder?: boolean;
  badgeSize?: 'sm' | 'md' | 'lg';
}

export function AvatarWithBadge({
  isPremium,
  isFounder,
  badgeSize = 'md',
  ...avatarProps
}: AvatarWithBadgeProps) {
  const badgeSizeClasses = {
    sm: 'w-4 h-4 text-[8px]',
    md: 'w-5 h-5 text-[10px]',
    lg: 'w-6 h-6 text-xs'
  };

  return (
    <div className="relative">
      <AvatarDisplay {...avatarProps} />

      {/* Badge Premium */}
      {isPremium && (
        <div
          className={`absolute -bottom-0.5 -right-0.5 ${badgeSizeClasses[badgeSize]} rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center border-2 border-white shadow-sm`}
          title="Usuário Premium"
        >
          <span className="font-bold text-white">⭐</span>
        </div>
      )}

      {/* Badge Founder */}
      {isFounder && (
        <div
          className={`absolute -bottom-0.5 -right-0.5 ${badgeSizeClasses[badgeSize]} rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center border-2 border-white shadow-sm`}
          title="Fundador da Arena"
        >
          <span className="font-bold text-white">👑</span>
        </div>
      )}
    </div>
  );
}
