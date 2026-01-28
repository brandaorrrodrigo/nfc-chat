'use client';

import React from 'react';
import { Crown } from '@/lib/icons';

/**
 * NutriFitCoach Avatar Component
 *
 * Features:
 * - Image or initials fallback
 * - Status indicator (online/offline/busy)
 * - Role badges (premium/founder/admin)
 * - Size variants
 */

export interface AvatarProps {
  src?: string | null;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'busy' | null;
  role?: 'premium' | 'founder' | 'admin' | null;
  showBadge?: boolean;
  className?: string;
}

export default function Avatar({
  src,
  name,
  size = 'md',
  status = null,
  role = null,
  showBadge = true,
  className = '',
}: AvatarProps) {
  const sizeStyles = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const badgeSizes = {
    xs: 'w-2 h-2 -bottom-0 -right-0',
    sm: 'w-2.5 h-2.5 -bottom-0.5 -right-0.5',
    md: 'w-3 h-3 -bottom-0.5 -right-0.5',
    lg: 'w-4 h-4 -bottom-1 -right-1',
    xl: 'w-5 h-5 -bottom-1 -right-1',
  };

  const statusColors = {
    online: 'bg-nfc-emerald-500',
    offline: 'bg-zinc-500',
    busy: 'bg-red-500',
  };

  const roleStyles = {
    founder: {
      ring: 'ring-2 ring-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.4)]',
      bg: 'bg-gradient-to-br from-yellow-400 to-amber-600 text-black',
      badgeBg: 'bg-yellow-500',
    },
    premium: {
      ring: 'ring-2 ring-nfc-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.3)]',
      bg: 'bg-gradient-to-br from-nfc-violet-500 to-pink-500 text-white',
      badgeBg: 'bg-nfc-violet-500',
    },
    admin: {
      ring: 'ring-2 ring-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]',
      bg: 'bg-gradient-to-br from-red-500 to-rose-600 text-white',
      badgeBg: 'bg-red-500',
    },
  };

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const currentRoleStyle = role ? roleStyles[role] : null;

  return (
    <div className={`relative inline-block ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={`
            ${sizeStyles[size]}
            rounded-full object-cover
            ${currentRoleStyle ? currentRoleStyle.ring : 'ring-2 ring-zinc-700'}
          `}
        />
      ) : (
        <div
          className={`
            ${sizeStyles[size]}
            rounded-full flex items-center justify-center font-bold
            ${currentRoleStyle ? currentRoleStyle.bg : 'bg-zinc-800 text-zinc-400'}
            ${currentRoleStyle ? currentRoleStyle.ring : ''}
          `}
        >
          {getInitials(name)}
        </div>
      )}

      {/* Status indicator */}
      {status && (
        <span
          className={`
            absolute ${badgeSizes[size]}
            rounded-full border-2 border-zinc-950
            ${statusColors[status]}
          `}
        />
      )}

      {/* Role badge (only for founder, shown as crown) */}
      {showBadge && role === 'founder' && (
        <span
          className={`
            absolute ${badgeSizes[size]}
            rounded-full flex items-center justify-center
            ${currentRoleStyle?.badgeBg} text-black
          `}
        >
          <Crown className="w-2 h-2" />
        </span>
      )}

      {/* Premium badge (P) */}
      {showBadge && role === 'premium' && (
        <span
          className={`
            absolute ${badgeSizes[size]}
            rounded-full flex items-center justify-center
            ${currentRoleStyle?.badgeBg} text-white
            text-[8px] font-bold
          `}
        >
          P
        </span>
      )}
    </div>
  );
}

// Avatar Group component for showing multiple avatars
export function AvatarGroup({
  avatars,
  max = 4,
  size = 'sm',
}: {
  avatars: Array<{ src?: string; name: string; role?: 'premium' | 'founder' | 'admin' }>;
  max?: number;
  size?: 'xs' | 'sm' | 'md';
}) {
  const displayed = avatars.slice(0, max);
  const remaining = avatars.length - max;

  const overlapStyles = {
    xs: '-ml-2',
    sm: '-ml-3',
    md: '-ml-4',
  };

  return (
    <div className="flex items-center">
      {displayed.map((avatar, index) => (
        <div
          key={index}
          className={index > 0 ? overlapStyles[size] : ''}
          style={{ zIndex: displayed.length - index }}
        >
          <Avatar
            src={avatar.src}
            name={avatar.name}
            size={size}
            role={avatar.role}
            showBadge={false}
          />
        </div>
      ))}
      {remaining > 0 && (
        <div
          className={`
            ${overlapStyles[size]}
            ${size === 'xs' ? 'w-6 h-6 text-[10px]' : size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm'}
            rounded-full bg-zinc-800 border-2 border-zinc-950
            flex items-center justify-center text-zinc-400 font-medium
          `}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}
