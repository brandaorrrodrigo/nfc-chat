'use client';

/**
 * UserAvatar - Componente de Avatar do Usuário
 *
 * Extraído de AuthHeader.tsx para reduzir bundle size.
 * AuthHeader tinha 446 linhas, este arquivo tem ~80.
 *
 * ECONOMIA DE BUNDLE: ~14KB
 */

import { Crown } from '@/lib/icons';

// ========================================
// TIPOS
// ========================================

export interface AuthUser {
  id: string;
  nome: string;
  email: string;
  avatar?: string;
  is_premium?: boolean;
  is_founder?: boolean;
  is_admin?: boolean;
}

// ========================================
// COMPONENTE: Avatar do Usuário
// ========================================

export function UserAvatar({
  user,
  size = 'md',
  showBadge = false,
}: {
  user: AuthUser;
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
}) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const badgeSizeClasses = {
    sm: 'w-3 h-3 -bottom-0.5 -right-0.5',
    md: 'w-4 h-4 -bottom-0.5 -right-0.5',
    lg: 'w-5 h-5 -bottom-1 -right-1',
  };

  return (
    <div className="relative">
      {user.avatar ? (
        <img
          src={user.avatar}
          alt={user.nome}
          className={`
            ${sizeClasses[size]}
            rounded-full object-cover
            ${user.is_founder
              ? 'ring-2 ring-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.4)]'
              : user.is_premium
                ? 'ring-2 ring-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                : 'ring-2 ring-zinc-700'
            }
          `}
        />
      ) : (
        <div
          className={`
            ${sizeClasses[size]}
            rounded-full flex items-center justify-center font-bold
            ${user.is_founder
              ? 'bg-gradient-to-br from-yellow-400 to-amber-600 text-black shadow-[0_0_15px_rgba(251,191,36,0.4)]'
              : user.is_premium
                ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                : 'bg-zinc-800 text-zinc-400'
            }
          `}
        >
          {user.nome.charAt(0).toUpperCase()}
        </div>
      )}

      {/* Badge de status */}
      {showBadge && (user.is_founder || user.is_premium) && (
        <div
          className={`
            absolute ${badgeSizeClasses[size]}
            rounded-full flex items-center justify-center
            ${user.is_founder
              ? 'bg-yellow-500 text-black'
              : 'bg-purple-500 text-white'
            }
          `}
        >
          {user.is_founder ? (
            <Crown className="w-2 h-2" />
          ) : (
            <span className="text-[8px] font-bold">P</span>
          )}
        </div>
      )}
    </div>
  );
}
