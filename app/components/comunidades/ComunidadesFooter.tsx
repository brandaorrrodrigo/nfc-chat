'use client';

/**
 * ComunidadesFooter - Footer para a seção de Comunidades
 *
 * Fornece navegação bidirecional App ↔ Comunidades
 * com links consistentes para todas as seções do NutriFitCoach.
 *
 * Estilo: Cyberpunk dark combinando com AuthHeader
 */

import React from 'react';
import Link from 'next/link';
import {
  Home,
  Users,
  BookOpen,
  Sparkles,
  MessageCircle,
  Heart,
  ArrowRight,
} from 'lucide-react';
import { APP_ROUTES, COMUNIDADES_ROUTES } from '@/lib/navigation';

export default function ComunidadesFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-950 border-t border-zinc-800">
      {/* CTA para voltar ao App */}
      <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-semibold text-white">
                Quer mais do NutriFitCoach?
              </h3>
              <p className="text-sm text-zinc-400 mt-1">
                Acesse o App completo com IA, planos personalizados e muito mais.
              </p>
            </div>
            <Link
              href={APP_ROUTES.DASHBOARD}
              className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-black bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 rounded-lg shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] transition-all group"
            >
              <Sparkles className="w-5 h-5" />
              Ir para o App
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Links de navegação */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Navegação Principal */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Navegação</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href={APP_ROUTES.HOME}
                  className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  <Home className="w-4 h-4" />
                  Início
                </Link>
              </li>
              <li>
                <Link
                  href={COMUNIDADES_ROUTES.HOME}
                  className="flex items-center gap-2 text-sm text-[#00ff88] hover:text-[#00ff88]/80 transition-colors"
                >
                  <Users className="w-4 h-4" />
                  Comunidades
                </Link>
              </li>
              <li>
                <Link
                  href={APP_ROUTES.BLOG}
                  className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href={APP_ROUTES.DASHBOARD}
                  className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  App NFC
                </Link>
              </li>
            </ul>
          </div>

          {/* App */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">App NutriFitCoach</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href={APP_ROUTES.DASHBOARD}
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href={APP_ROUTES.PERFIL}
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Meu Perfil
                </Link>
              </li>
              <li>
                <Link
                  href={APP_ROUTES.CONFIGURACOES}
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Configurações
                </Link>
              </li>
            </ul>
          </div>

          {/* Comunidades */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Comunidades</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href={COMUNIDADES_ROUTES.HOME}
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Explorar
                </Link>
              </li>
              <li>
                <Link
                  href={COMUNIDADES_ROUTES.CRIAR}
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Criar Comunidade
                </Link>
              </li>
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Suporte</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:suporte@nutrifitcoach.com.br"
                  className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Contato
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-zinc-500">
              © {currentYear} NutriFitCoach. Todos os direitos reservados.
            </p>
            <p className="flex items-center gap-1 text-xs text-zinc-500">
              Feito com <Heart className="w-3 h-3 text-red-500" /> para sua saúde
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
