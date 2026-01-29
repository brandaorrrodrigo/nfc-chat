'use client';

import Link from 'next/link';

interface NFCHeaderProps {
  currentPage?: 'app' | 'blog' | 'chat';
  showNavigation?: boolean;
  className?: string;
}

export default function NFCHeader({
  currentPage = 'chat',  // IMPORTANTE: default para 'chat' neste projeto
  showNavigation = true,
  className = ''
}: NFCHeaderProps) {
  const navItems = [
    { label: 'APP', href: 'https://app.nutrifitcoach.com.br/', id: 'app' as const, color: 'green' },
    { label: 'BLOG', href: 'https://nutrifitcoach.com.br/', id: 'blog' as const, color: 'cyan' },
    { label: 'CHAT', href: '/', id: 'chat' as const, color: 'purple' },  // CHAT é local neste projeto
  ];

  return (
    <header className={`relative z-50 ${className}`}>
      <div className="bg-[#0a0a14]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-6">
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
