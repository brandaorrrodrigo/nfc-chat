'use client';

/**
 * EcossistemaHeader - Header Unificado do Ecossistema NutriFitCoach
 *
 * COMPONENTE IDENTICO em todos os sistemas:
 * - chat.nutrifitcoach.com.br
 * - app.nutrifitcoach.com.br
 * - blog.nutrifitcoach.com.br
 *
 * ESTRUTURA FIXA (esquerda para direita):
 * 1. Logo NutriFitCoach -> https://nutrifitcoach.com.br
 * 2. Menu: Comunidades, Blog, App (nessa ordem exata)
 * 3. Area de usuario: "Entrar" ou Nome + Avatar + Dropdown
 *
 * NAO ALTERAR ESTE COMPONENTE SEM ATUALIZAR TODOS OS SISTEMAS
 */

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  Settings,
  Loader2,
} from 'lucide-react';

// ========================================
// URLS ABSOLUTAS DO ECOSSISTEMA
// ========================================

const ECOSSISTEMA_URLS = {
  LANDING: 'https://nutrifitcoach.com.br',
  COMUNIDADES: 'https://chat.nutrifitcoach.com.br',
  BLOG: 'https://blog.nutrifitcoach.com.br',
  APP: 'https://app.nutrifitcoach.com.br',
  LOGIN_HUB: '/login', // Relativo - cada sistema tem seu hub
};

// ========================================
// TIPOS
// ========================================

export interface EcossistemaUser {
  id: string;
  nome: string;
  email: string;
  avatar?: string;
}

interface EcossistemaHeaderProps {
  user: EcossistemaUser | null;
  isLoading?: boolean;
  onLogout?: () => void;
}

// ========================================
// COMPONENTE: Avatar do Usuario
// ========================================

function UserAvatar({ user, size = 'md' }: { user: EcossistemaUser; size?: 'sm' | 'md' }) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
  };

  if (user.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.nome}
        className={`${sizeClasses[size]} rounded-full object-cover ring-2 ring-zinc-700`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold bg-[#00ff88] text-black`}
    >
      {user.nome.charAt(0).toUpperCase()}
    </div>
  );
}

// ========================================
// COMPONENTE: Menu Dropdown do Usuario
// ========================================

function UserMenu({
  user,
  onLogout,
}: {
  user: EcossistemaUser;
  onLogout?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 pr-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-full transition-all"
      >
        <UserAvatar user={user} size="sm" />
        <span className="text-sm text-zinc-300 max-w-[100px] truncate hidden sm:block">
          {user.nome.split(' ')[0]}
        </span>
        <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-xl shadow-lg overflow-hidden z-50">
          {/* Header do menu */}
          <div className="p-4 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <UserAvatar user={user} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user.nome}</p>
                <p className="text-xs text-zinc-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Links do menu */}
          <div className="py-2">
            <Link
              href="/perfil"
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <User className="w-4 h-4" />
              Perfil
            </Link>
            <Link
              href="/configuracoes"
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="w-4 h-4" />
              Configuracoes
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-zinc-800 py-2">
            <button
              onClick={() => {
                setIsOpen(false);
                onLogout?.();
              }}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-zinc-800 transition-colors"
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
// COMPONENTE PRINCIPAL: EcossistemaHeader
// ========================================

export default function EcossistemaHeader({ user, isLoading, onLogout }: EcossistemaHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { label: 'Comunidades', href: ECOSSISTEMA_URLS.COMUNIDADES },
    { label: 'Blog', href: ECOSSISTEMA_URLS.BLOG },
    { label: 'App', href: ECOSSISTEMA_URLS.APP },
  ];

  return (
    <header className="sticky top-0 z-50 bg-zinc-950 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 1. LOGO - sempre leva para landing raiz */}
          <a
            href={ECOSSISTEMA_URLS.LANDING}
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#00ff88] flex items-center justify-center">
              <span className="text-black font-black text-sm">N</span>
            </div>
            <span className="text-white font-bold text-lg group-hover:text-[#00ff88] transition-colors">
              NutriFitCoach
            </span>
          </a>

          {/* 2. MENU PRINCIPAL - Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* 3. AREA DE USUARIO */}
          <div className="flex items-center gap-3">
            {/* Desktop */}
            <div className="hidden md:block">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 animate-pulse" />
                  <Loader2 className="w-4 h-4 text-zinc-500 animate-spin" />
                </div>
              ) : user ? (
                <UserMenu user={user} onLogout={onLogout} />
              ) : (
                <Link
                  href={ECOSSISTEMA_URLS.LOGIN_HUB}
                  className="px-5 py-2 text-sm font-medium text-black bg-[#00ff88] hover:bg-[#00ff88]/90 rounded-lg transition-colors"
                >
                  Entrar
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-zinc-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-zinc-800 mt-2 pt-4">
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block px-4 py-3 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="mt-4 pt-4 border-t border-zinc-800">
              {isLoading ? (
                <div className="flex items-center gap-2 px-4">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 animate-pulse" />
                  <Loader2 className="w-4 h-4 text-zinc-500 animate-spin" />
                </div>
              ) : user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-4 py-2">
                    <UserAvatar user={user} size="sm" />
                    <div>
                      <p className="text-sm font-medium text-white">{user.nome}</p>
                      <p className="text-xs text-zinc-500">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/perfil"
                    className="block px-4 py-2 text-sm text-zinc-300 hover:text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Perfil
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogout?.();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300"
                  >
                    Sair
                  </button>
                </div>
              ) : (
                <Link
                  href={ECOSSISTEMA_URLS.LOGIN_HUB}
                  className="block mx-4 px-4 py-3 text-sm font-medium text-center text-black bg-[#00ff88] rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Entrar
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
