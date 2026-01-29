/**
 * FPEarnedToast - Toast animado quando ganha FP
 */

'use client';

import React, { useEffect, useState } from 'react';

interface FPEarnedToastProps {
  amount: number;
  action?: string;
  onComplete?: () => void;
}

export function FPEarnedToast({ amount, action, onComplete }: FPEarnedToastProps) {
  const [visible, setVisible] = useState(true);
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    // Inicia saída após 2s
    const hideTimer = setTimeout(() => {
      setAnimating(false);
    }, 2000);

    // Remove completamente após animação
    const removeTimer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 2500);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, [onComplete]);

  if (!visible || amount <= 0) return null;

  const getActionEmoji = (act?: string) => {
    switch (act) {
      case 'message':
      case 'message_long':
        return '💬';
      case 'daily_access':
        return '☀️';
      case 'streak_bonus':
        return '🔥';
      default:
        return '⚡';
    }
  };

  return (
    <div
      className={`
        fixed top-20 right-4 z-50
        flex items-center gap-2
        px-4 py-2 rounded-full
        bg-gradient-to-r from-amber-500 to-orange-500
        text-white font-bold text-lg
        shadow-lg shadow-orange-500/30
        transition-all duration-500
        ${animating
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 -translate-y-4 scale-95'
        }
      `}
      style={{
        animation: animating ? 'fpBounce 0.5s ease-out' : undefined,
      }}
    >
      <span className="text-xl">{getActionEmoji(action)}</span>
      <span>+{amount} FP</span>

      <style jsx>{`
        @keyframes fpBounce {
          0% {
            transform: scale(0.5) translateY(-20px);
            opacity: 0;
          }
          50% {
            transform: scale(1.1) translateY(0);
          }
          100% {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Container para múltiplos toasts
 */
interface FPToastManagerProps {
  lastEarned: { amount: number; action: string; timestamp: number } | null;
  onClear: () => void;
}

export function FPToastManager({ lastEarned, onClear }: FPToastManagerProps) {
  if (!lastEarned) return null;

  return (
    <FPEarnedToast
      key={lastEarned.timestamp}
      amount={lastEarned.amount}
      action={lastEarned.action}
      onComplete={onClear}
    />
  );
}
