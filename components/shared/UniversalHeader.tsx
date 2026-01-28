'use client';

/**
 * UniversalHeader - Header Unificado NutriFitCoach
 *
 * Usado em todos os sistemas:
 * - app.nutrifitcoach.com.br (variant="app")
 * - chat.nutrifitcoach.com.br (variant="chat")
 * - www.nutrifitcoach.com.br (variant="landing")
 *
 * ESTRUTURA:
 * [Logo] [Nav: Chat | Blog | App] [User Area]
 *
 * @version 3.0.0 - Design System Unificado
 */

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  Settings,
  Loader2,
  Crown,
  Sparkles,
} from '@/lib/icons';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';

// ========================================
// URLs DO ECOSSISTEMA
// ========================================

const URLS = {
  LANDING: 'https://www.nutrifitcoach.com.br',
  CHAT: 'https://chat.nutrifitcoach.com.br',
  BLOG: 'https://www.nutrifitcoach.com.br', // Blog está na landing
  APP: 'https://app.nutrifitcoach.com.br',
};

// ========================================
// TIPOS
// ========================================

export interface UniversalUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  is_premium?: boolean;
  is_founder?: boolean;
  is_admin?: boolean;
}

export interface UniversalHeaderProps {
  /** Variante visual do header */
  variant: 'app' | 'chat' | 'landing';
  /** Usuário logado */
  user?: UniversalUser | null;
  /** Estado de carregamento da sessão */
  isLoading?: boolean;
  /** Callback de logout */
  onLogout?: () => void;
  /** URL de login (relativa ao sistema atual) */
  loginUrl?: string;
  /** Mostrar logo */
  showLogo?: boolean;
  /** Classe CSS adicional */
  className?: string;
}

// ========================================
// COMPONENTE: Menu do Usuário
// ========================================

function UserMenu({
  user,
  variant,
  onLogout,
}: {
  user: UniversalUser;
  variant: 'app' | 'chat' | 'landing';
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

  const getUserRole = (): 'founder' | 'premium' | 'admin' | null => {
    if (user.is_founder) return 'founder';
    if (user.is_premium) return 'premium';
    if (user.is_admin) return 'admin';
    return null;
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 p-1.5 pr-3 rounded-full transition-all
          ${variant === 'app'
            ? 'bg-white/10 hover:bg-white/20 border border-white/10'
            : 'bg-gray-100 hover:bg-gray-200 border border-gray-200 hover:border-gray-300'
          }
        `}
      >
        <Avatar
          src={user.image}
          name={user.name}
          size="sm"
          role={getUserRole()}
          showBadge={false}
        />
        <span className={`text-sm max-w-[100px] truncate hidden sm:block ${variant === 'app' ? 'text-white/90' : 'text-gray-700'}`}>
          {user.name.split(' ')[0]}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${variant === 'app' ? 'text-white/60' : 'text-gray-500'} ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div
          className={`
            absolute right-0 top-full mt-2 w-64 rounded-xl shadow-lg overflow-hidden z-50
            bg-white border border-gray-200
          `}
        >
          {/* User Info */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Avatar
                src={user.image}
                name={user.name}
                size="md"
                role={getUserRole()}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate text-gray-900">
                  {user.name}
                </p>
                <p className="text-xs truncate text-gray-500">
                  {user.email}
                </p>
                {getUserRole() && (
                  <div className="mt-1">
                    {user.is_founder && <Badge variant="founder" size="sm" icon="crown">Founder</Badge>}
                    {user.is_premium && !user.is_founder && <Badge variant="premium" size="sm" icon="sparkles">Premium</Badge>}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Menu Links */}
          <div className="py-2">
            <Link
              href="/perfil"
              className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-gray-700 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              <User className="w-4 h-4" />
              Perfil
            </Link>
            <Link
              href="/configuracoes"
              className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-gray-700 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="w-4 h-4" />
              Configurações
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t py-2 border-gray-100">
            <button
              onClick={() => {
                setIsOpen(false);
                onLogout?.();
              }}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors text-red-600 hover:bg-red-50"
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
// COMPONENTE PRINCIPAL
// ========================================

export default function UniversalHeader({
  variant,
  user,
  isLoading = false,
  onLogout,
  loginUrl = '/login',
  showLogo = true,
  className = '',
}: UniversalHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Configurações por variante
  const config = {
    app: {
      bg: 'bg-gradient-to-r from-nfc-cyan via-nfc-emerald to-nfc-violet',
      textColor: 'text-white',
      navHover: 'hover:bg-white/10',
      loginBg: 'bg-white text-nfc-emerald-600 hover:bg-white/90',
      border: '',
      useImage: false,
    },
    chat: {
      // 💕 Design feminino - Light backdrop blur
      bg: 'backdrop-blur-xl bg-white/90',
      textColor: 'text-gray-900',
      navHover: 'hover:bg-gray-100',
      loginBg: 'bg-gradient-to-r from-teal-500 via-emerald-500 to-purple-500 text-white hover:shadow-lg',
      border: 'border-b border-gray-200/50',
      useImage: true,
    },
    landing: {
      bg: 'bg-white',
      textColor: 'text-gray-900',
      navHover: 'hover:bg-gray-100',
      loginBg: 'bg-nfc-gradient text-white hover:shadow-nfc-glow',
      border: 'border-b border-gray-100',
      useImage: true,
    },
  };

  const c = config[variant];

  const navItems = [
    { label: 'Chat', href: URLS.CHAT },
    { label: 'Blog', href: URLS.BLOG },
    { label: 'App', href: URLS.APP },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 ${c.bg} ${c.border} ${className}`}
      data-nfc-header={`v3.0.0-${variant}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          {showLogo && (
            <a href={URLS.LANDING} className="flex items-center gap-3 group">
              {c.useImage ? (
                <Image
                  src="/nfc-logo.png"
                  alt="NutriFitCoach"
                  width={40}
                  height={40}
                  className="transition-transform group-hover:scale-105"
                  priority
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-nfc-gradient flex items-center justify-center shadow-nfc-glow">
                  <span className="text-white font-black text-lg">N</span>
                </div>
              )}
              <div className="flex flex-col">
                <span className={`text-xl font-bold ${variant === 'chat' ? 'bg-gradient-to-r from-teal-500 via-emerald-500 to-purple-500 bg-clip-text text-transparent' : c.textColor} group-hover:opacity-80 transition-opacity`}>
                  NutriFitCoach
                </span>
                {variant === 'chat' && (
                  <span className="text-xs text-gray-500 font-medium">
                    Chat com IA 💕
                  </span>
                )}
              </div>
            </a>
          )}

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`
                  px-4 py-2 text-sm font-medium rounded-lg transition-all
                  ${variant === 'app' ? 'text-white/80 hover:text-white' : 'text-gray-600 hover:text-gray-900'}
                  ${c.navHover}
                `}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* User Area */}
          <div className="flex items-center gap-3">
            {/* Desktop */}
            <div className="hidden md:block">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 animate-pulse" />
                  <Loader2 className="w-4 h-4 text-zinc-500 animate-spin" />
                </div>
              ) : user ? (
                <UserMenu user={user} variant={variant} onLogout={onLogout} />
              ) : (
                <Link
                  href={loginUrl}
                  className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all ${c.loginBg}`}
                >
                  Entrar
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg ${c.navHover} ${variant === 'app' ? 'text-white' : 'text-gray-600'}`}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden pb-4 border-t border-gray-100 mt-2 pt-4 ${variant === 'chat' ? 'bg-white/95' : ''}`}>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`
                    block px-4 py-3 text-sm font-medium rounded-lg transition-colors
                    ${variant === 'app' ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}
                  `}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="mt-4 pt-4 border-t border-gray-100">
              {isLoading ? (
                <div className="flex items-center gap-2 px-4">
                  <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
                  <Loader2 className="w-4 h-4 text-gray-500 animate-spin" />
                </div>
              ) : user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-4 py-2">
                    <Avatar
                      src={user.image}
                      name={user.name}
                      size="sm"
                      role={user.is_founder ? 'founder' : user.is_premium ? 'premium' : null}
                    />
                    <div>
                      <p className={`text-sm font-medium ${variant === 'app' ? 'text-white' : 'text-gray-900'}`}>
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/perfil"
                    className={`block px-4 py-2 text-sm ${variant === 'app' ? 'text-white/80 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Perfil
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogout?.();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:text-red-500"
                  >
                    Sair
                  </button>
                </div>
              ) : (
                <Link
                  href={loginUrl}
                  className={`block mx-4 px-4 py-3 text-sm font-semibold text-center rounded-lg ${c.loginBg}`}
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
