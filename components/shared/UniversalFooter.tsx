'use client';

/**
 * UniversalFooter - Footer Unificado NutriFitCoach
 *
 * Usado em todos os sistemas:
 * - app.nutrifitcoach.com.br (variant="app")
 * - chat.nutrifitcoach.com.br (variant="chat")
 * - www.nutrifitcoach.com.br (variant="landing")
 *
 * @version 3.0.0 - Design System Unificado
 */

import React from 'react';
import Link from 'next/link';
import { Heart, ExternalLink } from '@/lib/icons';

// ========================================
// URLs DO ECOSSISTEMA
// ========================================

const URLS = {
  LANDING: 'https://www.nutrifitcoach.com.br',
  CHAT: 'https://chat.nutrifitcoach.com.br',
  BLOG: 'https://www.nutrifitcoach.com.br',
  APP: 'https://app.nutrifitcoach.com.br',
  PRIVACY: 'https://www.nutrifitcoach.com.br/privacidade',
  TERMS: 'https://www.nutrifitcoach.com.br/termos',
};

// ========================================
// TIPOS
// ========================================

export interface UniversalFooterProps {
  /** Variante visual do footer */
  variant: 'app' | 'chat' | 'landing';
  /** Mostrar seção de links do ecossistema */
  showEcosystem?: boolean;
  /** Mostrar links legais (privacidade, termos) */
  showLegal?: boolean;
  /** Classe CSS adicional */
  className?: string;
}

// ========================================
// COMPONENTE PRINCIPAL
// ========================================

export default function UniversalFooter({
  variant,
  showEcosystem = true,
  showLegal = true,
  className = '',
}: UniversalFooterProps) {
  const currentYear = new Date().getFullYear();

  // Configurações por variante
  const config = {
    app: {
      bg: 'bg-gray-50',
      textColor: 'text-gray-600',
      textMuted: 'text-gray-400',
      linkHover: 'hover:text-gray-900',
      border: 'border-t border-gray-200',
      logoText: 'text-gray-900',
    },
    chat: {
      bg: 'bg-zinc-950',
      textColor: 'text-zinc-400',
      textMuted: 'text-zinc-600',
      linkHover: 'hover:text-white',
      border: 'border-t border-zinc-800',
      logoText: 'text-white',
    },
    landing: {
      bg: 'bg-gray-900',
      textColor: 'text-gray-400',
      textMuted: 'text-gray-500',
      linkHover: 'hover:text-white',
      border: '',
      logoText: 'text-white',
    },
  };

  const c = config[variant];

  const ecosystemLinks = [
    { label: 'Comunidades', href: URLS.CHAT, description: 'Chat gratuito' },
    { label: 'Blog', href: URLS.BLOG, description: 'Artigos e dicas' },
    { label: 'App Premium', href: URLS.APP, description: 'IA + Cardápios' },
  ];

  const legalLinks = [
    { label: 'Privacidade', href: URLS.PRIVACY },
    { label: 'Termos de Uso', href: URLS.TERMS },
  ];

  return (
    <footer
      className={`${c.bg} ${c.border} ${className}`}
      data-nfc-footer={`v3.0.0-${variant}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <a href={URLS.LANDING} className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-nfc-gradient flex items-center justify-center shadow-nfc-glow">
                <span className="text-white font-black text-sm">N</span>
              </div>
              <span className={`font-bold text-lg ${c.logoText}`}>
                NutriFitCoach
              </span>
            </a>
            <p className={`text-sm ${c.textColor} max-w-xs`}>
              Transformando sua jornada de saúde com tecnologia inteligente e comunidade ativa.
            </p>
          </div>

          {/* Ecosystem Links */}
          {showEcosystem && (
            <div className="md:col-span-1">
              <h3 className={`font-semibold mb-4 ${c.logoText}`}>
                Ecossistema
              </h3>
              <ul className="space-y-3">
                {ecosystemLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className={`
                        group flex items-center gap-2 text-sm ${c.textColor} ${c.linkHover}
                        transition-colors
                      `}
                    >
                      <span className="font-medium">{link.label}</span>
                      <span className={`text-xs ${c.textMuted}`}>
                        {link.description}
                      </span>
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Legal Links */}
          {showLegal && (
            <div className="md:col-span-1">
              <h3 className={`font-semibold mb-4 ${c.logoText}`}>
                Legal
              </h3>
              <ul className="space-y-3">
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className={`text-sm ${c.textColor} ${c.linkHover} transition-colors`}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className={`pt-8 border-t ${variant === 'app' ? 'border-gray-200' : 'border-zinc-800'}`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className={`text-sm ${c.textMuted}`}>
              © {currentYear} NutriFitCoach. Todos os direitos reservados.
            </p>

            {/* Made with love */}
            <p className={`flex items-center gap-1.5 text-sm ${c.textMuted}`}>
              Feito com
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              no Brasil
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ========================================
// FOOTER COMPACTO (para páginas internas)
// ========================================

export function CompactFooter({
  variant = 'chat',
  className = '',
}: {
  variant?: 'app' | 'chat' | 'landing';
  className?: string;
}) {
  const currentYear = new Date().getFullYear();

  const config = {
    app: {
      bg: 'bg-gray-50',
      text: 'text-gray-500',
      border: 'border-t border-gray-200',
    },
    chat: {
      bg: 'bg-zinc-950',
      text: 'text-zinc-600',
      border: 'border-t border-zinc-800',
    },
    landing: {
      bg: 'bg-gray-900',
      text: 'text-gray-500',
      border: '',
    },
  };

  const c = config[variant];

  return (
    <footer className={`${c.bg} ${c.border} py-4 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <p className={c.text}>
            © {currentYear} NutriFitCoach
          </p>
          <div className={`flex items-center gap-4 ${c.text}`}>
            <a href={URLS.PRIVACY} className="hover:underline">Privacidade</a>
            <a href={URLS.TERMS} className="hover:underline">Termos</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
