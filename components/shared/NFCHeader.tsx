'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import {
  Eye,
  UserPlus,
  LogOut,
  ChevronDown,
  User,
  Loader2,
} from 'lucide-react';

interface NFCHeaderProps {
  currentPage?: 'app' | 'blog' | 'chat';
  showNavigation?: boolean;
  className?: string;
}

export default function NFCHeader({
  currentPage = 'chat',
  showNavigation = true,
  className = ''
}: NFCHeaderProps) {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';
  const user = session?.user;

  const navItems = [
    { label: 'APP', href: 'https://app.nutrifitcoach.com.br/', id: 'app' as const, color: 'green' },
    { label: 'BLOG', href: 'https://nutrifitcoach.com.br/', id: 'blog' as const, color: 'cyan' },
    { label: 'CHAT', href: '/', id: 'chat' as const, color: 'purple' },
  ];

  return (
    <header className={`relative z-50 ${className}`}>
      <div className="bg-[#0a0a14]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Auth area - canto superior direito */}
          <div className="flex justify-end mb-2">
            <AuthArea user={user} isLoading={isLoading} />
          </div>

          <div className="flex flex-col items-center">
            <div className="w-[70%] max-w-5xl flex flex-col items-center">

              {/* Texto NutriFitCoach com efeito holograma */}
              <h1 className="w-full mb-2 relative px-[5%]">
                <span className="relative block w-full text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black">
                  <span className="relative z-10 flex justify-between w-full">
                    {'NutriFitCoach'.split('').map((letter, i) => (
                      <span
                        key={i}
                        className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent bg-[length:1300%_100%] animate-gradient-x"
                        style={{ backgroundPosition: `${i * 100}% 0` }}
                      >
                        {letter}
                      </span>
                    ))}
                  </span>
                  <span className="absolute inset-0 flex justify-between w-full pointer-events-none">
                    {'NutriFitCoach'.split('').map((letter, i) => (
                      <span
                        key={i}
                        className="bg-gradient-to-r from-transparent via-white/30 to-transparent bg-[length:50%_100%] animate-shimmer bg-clip-text text-transparent"
                      >
                        {letter}
                      </span>
                    ))}
                  </span>
                </span>
              </h1>

              {/* Logo NFC com efeito holográfico */}
              <div className="relative w-full mb-1 px-[5%]">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-purple-500/20 rounded-2xl blur-2xl scale-110 animate-pulse" />
                <div className="relative w-full h-[120px] sm:h-[160px] md:h-[200px] lg:h-[250px] overflow-hidden">
                  <img src="/assets/nfc-logo-only.png" alt="NFC" className="absolute inset-0 w-full h-full object-fill" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent bg-[length:200%_100%] animate-shimmer mix-blend-overlay pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/15 via-cyan-400/15 to-purple-500/15 bg-[length:200%_100%] animate-gradient-x mix-blend-screen pointer-events-none" />
                </div>
              </div>

              {/* Navegação */}
              {showNavigation && (
                <nav className="w-full px-[5%]">
                  <div className="flex items-start justify-between">
                    {navItems.map((item) => {
                      const isActive = currentPage === item.id;
                      const isExternal = item.href.startsWith('http');
                      const colorClasses = {
                        green: { text: 'text-emerald-400', hover: 'hover:text-emerald-300', indicator: 'bg-emerald-400', glow: 'shadow-emerald-400/50' },
                        cyan: { text: 'text-cyan-400', hover: 'hover:text-cyan-300', indicator: 'bg-cyan-400', glow: 'shadow-cyan-400/50' },
                        purple: { text: 'text-purple-400', hover: 'hover:text-purple-300', indicator: 'bg-purple-400', glow: 'shadow-purple-400/50' }
                      };
                      const colors = colorClasses[item.color as keyof typeof colorClasses];
                      return (
                        <Link
                          key={item.id}
                          href={item.href}
                          target={isExternal ? '_blank' : undefined}
                          rel={isExternal ? 'noopener noreferrer' : undefined}
                          className={`group flex flex-col items-center transition-all duration-300 ${isActive ? 'scale-110' : 'hover:scale-105'}`}
                        >
                          <span className={`text-sm sm:text-base md:text-lg lg:text-xl font-bold uppercase tracking-wider transition-all duration-300 ${isActive ? colors.text : `text-gray-500 ${colors.hover}`}`}>
                            {item.label}
                          </span>
                          <div className={`w-full h-0.5 mt-1 rounded-full transition-all duration-300 ${isActive ? `${colors.indicator} shadow-lg ${colors.glow}` : 'bg-transparent group-hover:bg-white/20'}`} />
                        </Link>
                      );
                    })}
                  </div>
                </nav>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Linha Separadora com Raios de Luz */}
      <div className="relative h-[3px] overflow-hidden">
        <div className="absolute inset-0 bg-white/5" />
        <div className="absolute inset-0">
          <div className="absolute left-0 w-1/3 h-full">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500 to-transparent animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent blur-sm" />
          </div>
          <div className="absolute left-1/3 w-1/3 h-full">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse" style={{ animationDelay: '0.3s' }} />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent blur-sm" />
          </div>
          <div className="absolute right-0 w-1/3 h-full">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse" style={{ animationDelay: '0.6s' }} />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/60 to-transparent blur-sm" />
          </div>
        </div>
        <div className="absolute top-full left-0 right-0 h-6 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
      </div>
    </header>
  );
}

// ========================================
// Auth Area - Login/Logout no canto superior direito
// ========================================

function AuthArea({ user, isLoading }: { user: any; isLoading: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-zinc-800 animate-pulse" />
        <Loader2 className="w-4 h-4 text-zinc-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 rounded-lg transition-all"
        >
          <Eye className="w-4 h-4" />
          <span className="hidden sm:inline">Visualizar</span>
        </Link>
        <Link
          href="/registro"
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-[#00ff88] hover:bg-[#00ff88]/90 text-black rounded-lg shadow-[0_0_15px_rgba(0,255,136,0.3)] hover:shadow-[0_0_20px_rgba(0,255,136,0.5)] transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span className="hidden sm:inline">Criar Conta</span>
        </Link>
      </div>
    );
  }

  // Usuário logado - dropdown
  const firstName = user.name?.split(' ')[0] || user.email?.split('@')[0] || 'User';

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center gap-2 p-1.5 pr-3 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-full transition-all duration-200 group"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold">
          {firstName.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm text-zinc-300 group-hover:text-white transition-colors max-w-[100px] truncate hidden sm:block">
          {firstName}
        </span>
        <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`} />
      </button>

      {menuOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden z-50">
          <div className="p-3 border-b border-zinc-800">
            <p className="text-sm font-semibold text-white truncate">{user.name || firstName}</p>
            <p className="text-xs text-zinc-500 truncate">{user.email}</p>
          </div>
          <div className="py-1">
            <Link
              href="https://app.nutrifitcoach.com.br/"
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#00ff88] hover:bg-zinc-800/50 transition-colors font-medium"
              onClick={() => setMenuOpen(false)}
            >
              <User className="w-4 h-4" />
              Acessar App NFC
            </Link>
          </div>
          <div className="border-t border-zinc-800 py-1">
            <button
              onClick={() => {
                setMenuOpen(false);
                signOut({ callbackUrl: '/' });
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
