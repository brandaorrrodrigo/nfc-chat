'use client';

/**
 * EcossistemaFooter - Footer Unificado do Ecossistema NutriFitCoach
 *
 * COMPONENTE IDENTICO em todos os sistemas:
 * - chat.nutrifitcoach.com.br
 * - app.nutrifitcoach.com.br
 * - blog.nutrifitcoach.com.br
 *
 * ESTRUTURA FIXA:
 * 1. Logo NutriFitCoach
 * 2. Frase: "NutriFitCoach — conhecimento, comunidade e execucao no mesmo ecossistema."
 * 3. Links: Comunidades, Blog, App (nessa ordem exata)
 * 4. Legal: © NutriFitCoach — Todos os direitos reservados
 *
 * NAO ALTERAR ESTE COMPONENTE SEM ATUALIZAR TODOS OS SISTEMAS
 */

import React from 'react';

// ========================================
// URLS ABSOLUTAS DO ECOSSISTEMA
// ========================================

const ECOSSISTEMA_URLS = {
  LANDING: 'https://nutrifitcoach.com.br',
  COMUNIDADES: 'https://chat.nutrifitcoach.com.br',
  BLOG: 'https://blog.nutrifitcoach.com.br',
  APP: 'https://app.nutrifitcoach.com.br',
};

// ========================================
// COMPONENTE PRINCIPAL: EcossistemaFooter
// ========================================

export default function EcossistemaFooter() {
  const currentYear = new Date().getFullYear();

  const menuItems = [
    { label: 'Comunidades', href: ECOSSISTEMA_URLS.COMUNIDADES },
    { label: 'Blog', href: ECOSSISTEMA_URLS.BLOG },
    { label: 'App', href: ECOSSISTEMA_URLS.APP },
  ];

  return (
    <footer className="bg-zinc-950 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Logo e Frase */}
        <div className="flex flex-col items-center text-center mb-8">
          {/* Logo */}
          <a
            href={ECOSSISTEMA_URLS.LANDING}
            className="flex items-center gap-2 mb-4 group"
          >
            <div className="w-10 h-10 rounded-lg bg-[#00ff88] flex items-center justify-center">
              <span className="text-black font-black text-lg">N</span>
            </div>
            <span className="text-white font-bold text-xl group-hover:text-[#00ff88] transition-colors">
              NutriFitCoach
            </span>
          </a>

          {/* Frase Fixa */}
          <p className="text-zinc-400 text-sm max-w-md">
            NutriFitCoach — conhecimento, comunidade e execucao no mesmo ecossistema.
          </p>
        </div>

        {/* Links */}
        <div className="flex items-center justify-center gap-8 mb-8">
          {menuItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Linha Separadora */}
        <div className="border-t border-zinc-800 pt-6">
          {/* Copyright */}
          <p className="text-center text-xs text-zinc-600">
            © {currentYear} NutriFitCoach — Todos os direitos reservados
          </p>
        </div>
      </div>
    </footer>
  );
}
