'use client';

import React, { forwardRef } from 'react';
import { Loader2 } from '@/lib/icons';

/**
 * NutriFitCoach Button Component
 *
 * Variantes:
 * - primary: Gradiente da marca (cyan -> emerald -> violet)
 * - secondary: Fundo escuro com borda
 * - ghost: Transparente com hover
 * - neon: Verde neon (estilo chat)
 * - danger: Vermelho para ações destrutivas
 *
 * Tamanhos: sm, md, lg
 */

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'neon' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      inline-flex items-center justify-center gap-2
      font-semibold rounded-xl
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-950
      disabled:opacity-50 disabled:cursor-not-allowed
    `;

    const variantStyles = {
      primary: `
        bg-nfc-gradient text-white
        hover:shadow-nfc-glow hover:scale-[1.02]
        focus:ring-nfc-emerald
        active:scale-[0.98]
      `,
      secondary: `
        bg-zinc-900 text-white border border-zinc-700
        hover:bg-zinc-800 hover:border-zinc-600
        focus:ring-zinc-500
      `,
      ghost: `
        bg-transparent text-zinc-300
        hover:bg-zinc-800 hover:text-white
        focus:ring-zinc-500
      `,
      neon: `
        bg-nfc-neon text-black font-bold
        hover:bg-nfc-neon-400 hover:shadow-nfc-neon
        focus:ring-nfc-neon
        active:scale-[0.98]
      `,
      danger: `
        bg-red-600 text-white
        hover:bg-red-500
        focus:ring-red-500
      `,
    };

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-5 py-2.5 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    return (
      <button
        ref={ref}
        className={`
          ${baseStyles}
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Carregando...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
