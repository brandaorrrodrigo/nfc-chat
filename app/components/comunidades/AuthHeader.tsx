'use client';

/**
 * AuthHeader - Header de Autenticação para Comunidades
 *
 * Exibe estado de autenticação:
 * - Não logado: Botões "Entrar" e "Criar Conta"
 * - Logado: Avatar + Menu dropdown do usuário
 *
 * IMPORTANTE: Contém navegação bidirecional App ↔ Comunidades
 *
 * Estilo: Cyberpunk dark com verde neon
 */

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Eye,
  UserPlus,
  ChevronDown,
  Settings,
  LogOut,
  User,
  Shield,
  Crown,
  Rocket,
  BookOpen,
  Home,
  Users,
  Sparkles,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import { APP_ROUTES, BLOG_ROUTES } from '@/lib/navigation';

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

interface AuthHeaderProps {
  user: AuthUser | null;
  isLoading?: boolean;
  onLogout?: () => void;
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

// ========================================
// COMPONENTE: Menu Dropdown do Usuário
// ========================================

function UserMenu({
  user,
  onLogout,
}: {
  user: AuthUser;
  onLogout?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fechar menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 p-1.5 pr-3
          bg-zinc-900/80 hover:bg-zinc-800
          border border-zinc-800 hover:border-zinc-700
          rounded-full
          transition-all duration-200
          group
        `}
      >
        <UserAvatar user={user} size="sm" />
        <span className="text-sm text-zinc-300 group-hover:text-white transition-colors max-w-[100px] truncate hidden sm:block">
          {user.nome.split(' ')[0]}
        </span>
        <ChevronDown
          className={`
            w-4 h-4 text-zinc-500 transition-transform duration-200
            ${isOpen ? 'rotate-180' : ''}
          `}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={`
            absolute right-0 top-full mt-2
            w-64
            bg-zinc-900 border border-zinc-800
            rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)]
            overflow-hidden
            z-50
            animate-fadeIn
          `}
        >
          {/* Header do menu */}
          <div className="p-4 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <UserAvatar user={user} size="lg" showBadge />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {user.nome}
                </p>
                <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                {user.is_founder && (
                  <span className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 text-[10px] bg-yellow-500/20 text-yellow-400 rounded">
                    <Crown className="w-2.5 h-2.5" />
                    Founder
                  </span>
                )}
                {user.is_premium && !user.is_founder && (
                  <span className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 text-[10px] bg-purple-500/20 text-purple-400 rounded">
                    Premium
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Links do menu */}
          <div className="py-2">
            {/* Link para o App - destaque */}
            <Link
              href={APP_ROUTES.DASHBOARD}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#00ff88] hover:text-[#00ff88]/80 hover:bg-zinc-800/50 transition-colors font-medium"
              onClick={() => setIsOpen(false)}
            >
              <Rocket className="w-4 h-4" />
              Acessar App NFC
            </Link>

            <Link
              href={APP_ROUTES.PERFIL}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <User className="w-4 h-4" />
              Meu Perfil
            </Link>

            <Link
              href={APP_ROUTES.CONFIGURACOES}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="w-4 h-4" />
              Configurações
            </Link>

            {(user.is_admin || user.is_founder) && (
              <Link
                href={APP_ROUTES.ADMIN}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-amber-400 hover:text-amber-300 hover:bg-zinc-800/50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Shield className="w-4 h-4" />
                Painel Admin
              </Link>
            )}
          </div>

          {/* Logout */}
          <div className="border-t border-zinc-800 py-2">
            <button
              onClick={() => {
                setIsOpen(false);
                onLogout?.();
              }}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-zinc-800/50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ========================================
// COMPONENTE PRINCIPAL: AuthHeader
// ========================================

/**
 * @deprecated Usar EcossistemaHeader via providers.tsx
 * Este componente é mantido apenas para referência e exportação de subcomponentes
 */
export default function AuthHeader({ user, isLoading, onLogout }: AuthHeaderProps) {
  return (
    <div className="sticky top-0 z-50 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo / Brand */}
          <Link
            href="/comunidades"
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00ff88] to-emerald-600 flex items-center justify-center shadow-[0_0_15px_rgba(0,255,136,0.3)]">
              <span className="text-black font-black text-sm">N</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-white font-bold group-hover:text-[#00ff88] transition-colors">
                NutriFit
              </span>
              <span className="text-zinc-500 font-light ml-1">Comunidades</span>
            </div>
          </Link>

          {/* Navigation Links - Centro */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href={APP_ROUTES.HOME}
              className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-all"
            >
              <Home className="w-4 h-4" />
              Site
            </Link>
            <Link
              href="/comunidades"
              className="flex items-center gap-2 px-3 py-2 text-sm text-[#00ff88] bg-[#00ff88]/10 rounded-lg transition-all"
            >
              <Users className="w-4 h-4" />
              Comunidades
            </Link>
            <a
              href={BLOG_ROUTES.HOME}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-all"
            >
              <BookOpen className="w-4 h-4" />
              Blog
            </a>
            {/* BOTÃO DESTACADO: Voltar ao App */}
            <Link
              href={APP_ROUTES.DASHBOARD}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-black bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 rounded-lg shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_20px_rgba(168,85,247,0.6)] transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Ir para o App
            </Link>
          </nav>

          {/* Auth Area */}
          <div className="flex items-center gap-2">
            {/* Mobile navigation links */}
            <div className="flex md:hidden items-center gap-1">
              <a
                href={BLOG_ROUTES.HOME}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-all"
                title="Blog"
              >
                <BookOpen className="w-5 h-5" />
              </a>
              {/* Mobile: Botão destacado para App */}
              <Link
                href={APP_ROUTES.DASHBOARD}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-black bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg shadow-[0_0_10px_rgba(168,85,247,0.4)]"
                title="Ir para o App"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                App
              </Link>
            </div>

            {isLoading ? (
              // Carregando sessão - mostrar skeleton
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-zinc-800 animate-pulse" />
                <Loader2 className="w-4 h-4 text-zinc-500 animate-spin" />
              </div>
            ) : user ? (
              // Usuário logado - menu do usuário
              <UserMenu user={user} onLogout={onLogout} />
            ) : (
              // Não logado - Mostrar botões
              // IMPORTANTE: Links RELATIVOS para manter no mesmo domínio (chat.nutrifitcoach.com.br)
              <>
                <Link
                  href="/login"
                  className={`
                    flex items-center gap-2
                    px-3 py-2
                    text-sm font-medium
                    text-zinc-300 hover:text-white
                    border border-zinc-800 hover:border-zinc-700
                    rounded-lg
                    transition-all
                  `}
                >
                  <Eye className="w-4 h-4" />
                  <span className="hidden sm:inline">Visualizar</span>
                </Link>

                <Link
                  href="/registro"
                  className={`
                    flex items-center gap-2
                    px-3 py-2
                    text-sm font-medium
                    bg-[#00ff88] hover:bg-[#00ff88]/90
                    text-black
                    rounded-lg
                    shadow-[0_0_15px_rgba(0,255,136,0.3)]
                    hover:shadow-[0_0_20px_rgba(0,255,136,0.5)]
                    transition-all
                  `}
                >
                  <UserPlus className="w-4 h-4" />
                  <span className="hidden sm:inline">Criar Conta</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Animações CSS */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
