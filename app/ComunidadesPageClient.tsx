'use client';

/**
 * HUB DAS COMUNIDADES - Premium Landing Page (Client Component)
 *
 * Este é o componente cliente que usa os hooks de autenticação.
 * Será envolvido pelo ComunidadesAuthProvider em page.tsx
 */

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Activity,
  Syringe,
  Users,
  Dumbbell,
  Heart,
  Brain,
  Sparkles,
  Camera,
  Utensils,
  TrendingDown,
  Home,
  Crown,
  Star,
  Zap,
  Video,
  MessageCircle,
  Eye,
  LucideIcon,
  Loader2,
} from 'lucide-react';
import { getLoginUrl, COMUNIDADES_ROUTES } from '@/lib/navigation';
import { useComunidadesAuth } from '@/app/components/comunidades/ComunidadesAuthContext';
import ArenaSearchBar from '@/app/components/comunidades/ArenaSearchBar';
import ArenaIndex from '@/app/components/comunidades/ArenaIndex';
import QuickFilters from '@/app/components/comunidades/QuickFilters';
import type { ArenaWithTags, ArenaCategoria, CommunityCardData } from '@/types/arena';
import { arenaToDisplayFormat, CATEGORIA_GRADIENTS } from '@/lib/arena-utils';
import { useCommunityStats } from '@/app/hooks/useCommunityStats';

// Formatação de número sem toLocaleString (evita hydration mismatch)
function formatNumber(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// ========================================
// ✅ DADOS REAIS - Sempre busca da API
// FALLBACK REMOVIDO - Sem números hardcoded
// ========================================

// ========================================
// MAPEAMENTOS
// ========================================

const ICON_MAP: Record<string, LucideIcon> = {
  Activity,
  Syringe,
  TrendingDown,
  Dumbbell,
  Heart,
  Brain,
  Sparkles,
  Camera,
  Utensils,
  Home,
  Zap,
  Video,
  MessageCircle,
};

// ========================================
// ESTILOS CSS CUSTOMIZADOS
// ========================================

const customStyles = `
  @keyframes heroGlow {
    0%, 100% { opacity: 0.5; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.1); }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }

  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }

  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 20px rgba(0, 245, 255, 0.3); }
    50% { box-shadow: 0 0 40px rgba(0, 245, 255, 0.6); }
  }

  .hero-glow {
    animation: heroGlow 4s ease-in-out infinite;
  }

  .float-animation {
    animation: float 3s ease-in-out infinite;
  }

  .shimmer-text {
    background: linear-gradient(
      90deg,
      #00f5ff 0%,
      #ff006e 25%,
      #8b5cf6 50%,
      #ff006e 75%,
      #00f5ff 100%
    );
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 3s linear infinite;
  }

  .gradient-text {
    background: linear-gradient(135deg, #00f5ff 0%, #8b5cf6 50%, #ff006e 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .card-premium {
    background: linear-gradient(135deg, rgba(26, 31, 58, 0.8) 0%, rgba(10, 14, 39, 0.9) 100%);
    border: 1px solid rgba(0, 245, 255, 0.1);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .card-premium:hover {
    border-color: rgba(0, 245, 255, 0.5);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(0, 245, 255, 0.15);
    transform: translateY(-8px);
  }

  .cta-button {
    background: linear-gradient(135deg, #00f5ff 0%, #00b8c4 100%);
    box-shadow: 0 4px 20px rgba(0, 245, 255, 0.4);
    transition: all 0.3s ease;
  }

  .cta-button:hover {
    box-shadow: 0 6px 30px rgba(0, 245, 255, 0.6);
    transform: translateY(-2px);
  }

  .stats-card {
    background: rgba(26, 31, 58, 0.6);
    border: 1px solid rgba(139, 92, 246, 0.2);
    backdrop-filter: blur(10px);
  }
`;

// ========================================
// COMPONENTE: Card da Comunidade Premium
// ========================================

interface CommunityCardProps {
  community: CommunityCardData;
}

function CommunityCard({ community }: CommunityCardProps) {
  const IconComponent = ICON_MAP[community.icon] || Activity;

  // Se a arena é um HUB, redireciona para a página de grid do HUB
  const href = community.arenaType === 'NFV_HUB'
    ? `/comunidades/hub/${community.slug}`
    : `/comunidades/${community.slug}`;

  return (
    <Link href={href}>
      <div className="card-premium group relative overflow-hidden rounded-2xl p-6 cursor-pointer">
        {/* Glow de fundo no hover */}
        <div
          className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br ${community.gradient}`}
        />

        {/* Badge Core */}
        {community.isCore && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 rounded-full">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Core</span>
          </div>
        )}

        {/* Badge Featured */}
        {community.featured && !community.isCore && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-pink-500/20 to-rose-500/20 border border-pink-500/40 rounded-full">
            <Star className="w-3.5 h-3.5 text-pink-400" />
            <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">Popular</span>
          </div>
        )}

        {/* Conteúdo */}
        <div className="relative z-10">
          {/* Header com ícone */}
          <div className="flex items-start gap-4 mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${community.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <IconComponent className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#00f5ff] transition-colors duration-300 line-clamp-1">
                {community.title}
              </h3>
              <div className="flex items-center gap-3 text-sm flex-wrap">
                <span className="flex items-center gap-1.5 text-gray-400">
                  <Users className="w-4 h-4" />
                  <span className="font-semibold text-white">{formatNumber(community.totalMembers || 0)}</span>
                  <span className="text-gray-500 text-xs">pessoas</span>
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <div className="relative">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-75" />
                  </div>
                  <span className="font-semibold">{community.activeNow}</span>
                  <span className="text-emerald-400/70">online</span>
                </span>
              </div>
            </div>
          </div>

          {/* Descrição */}
          <p className="text-sm text-gray-400 leading-relaxed mb-4 line-clamp-2">
            {community.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-500">
                Atividade {community.lastActivity}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[#00f5ff] font-semibold text-sm group-hover:gap-2 transition-all duration-300">
              <Eye className="w-4 h-4" />
              <span>Visualizar</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ========================================
// SKELETON LOADER
// ========================================

function SkeletonCard() {
  return (
    <div className="card-premium rounded-2xl p-6 animate-pulse">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-zinc-800" />
        <div className="flex-1">
          <div className="h-5 bg-zinc-800 rounded w-3/4 mb-2" />
          <div className="h-4 bg-zinc-800 rounded w-1/2" />
        </div>
      </div>
      <div className="h-4 bg-zinc-800 rounded w-full mb-2" />
      <div className="h-4 bg-zinc-800 rounded w-2/3" />
    </div>
  );
}

// ========================================
// PÁGINA PRINCIPAL
// ========================================

export default function ComunidadesPageClient() {
  const { isAuthenticated } = useComunidadesAuth();

  // ✅ Hook de stats globais REAIS
  const { stats: communityStats, loading: statsLoading } = useCommunityStats();

  // State for API data
  const [apiArenas, setApiArenas] = useState<ArenaWithTags[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<ArenaCategoria | null>(null);

  // Fetch arenas from API
  useEffect(() => {
    async function fetchArenas() {
      try {
        const res = await fetch('/api/arenas');
        if (res.ok) {
          const data = await res.json();
          // Handle both array response and grouped response
          const arenas = Array.isArray(data) ? data : data.arenas || [];
          setApiArenas(arenas);
        } else {
          // Se API falha, usa fallback (não deixa vazio)
          setApiArenas([]);
        }
      } catch (err) {
        console.error('Failed to fetch arenas:', err);
        // Fallback quando erro: continua com array vazio
        setApiArenas([]);
      } finally {
        setLoading(false);
      }
    }
    fetchArenas();
  }, []);

  // ✅ SEMPRE usa dados REAIS da API - Sem fallback hardcoded
  // Filtra arenas filhas (parentArenaSlug) — só aparecem dentro do hub
  const communities = useMemo<CommunityCardData[]>(() => {
    if (apiArenas && apiArenas.length > 0) {
      return apiArenas
        .filter(a => !a.parentArenaSlug)
        .map(arenaToDisplayFormat);
    }
    return [];
  }, [apiArenas]);

  // ArenaIndex data: também sem arenas filhas
  const indexArenas = useMemo<ArenaWithTags[]>(() => {
    return (apiArenas || []).filter(a => !a.parentArenaSlug);
  }, [apiArenas]);

  // Apply category filter
  const filteredCommunities = useMemo(() => {
    if (!activeFilter) return communities;
    return communities.filter((c) => c.categoria === activeFilter);
  }, [communities, activeFilter]);

  // ✅ Stats REAIS do hook (não calculados localmente)
  const totalMembers = communityStats?.totalUsers || 0;
  const totalOnline = communityStats?.onlineNow || 0;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />

      <div
        className="min-h-screen relative"
        style={{
          background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #1a0a27 100%)'
        }}
      >
        {/* Background Effects */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {/* Grid Pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0, 245, 255, 0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 245, 255, 0.5) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
            }}
          />

          {/* Glow orbs */}
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#00f5ff] rounded-full filter blur-[150px] opacity-10 hero-glow" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#ff006e] rounded-full filter blur-[150px] opacity-10 hero-glow" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#8b5cf6] rounded-full filter blur-[150px] opacity-5 hero-glow" style={{ animationDelay: '1s' }} />
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-8">

          {/* ===== HERO SECTION ===== */}
          <section className="text-center">
            {/* Título Principal */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black mb-6 leading-tight">
              <span className="text-white">Hub das</span>
              <br />
              <span className="shimmer-text">Comunidades</span>
            </h1>

            {/* Subtítulo */}
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Conecte-se com <span className="text-[#00f5ff] font-semibold">{formatNumber(totalMembers)}+ pessoas</span> que
              estão transformando suas vidas. Compartilhe experiências, tire dúvidas e evolua junto.
            </p>

            {/* Stats Cards */}
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              <div className="stats-card px-6 py-4 rounded-2xl">
                <div className="text-3xl font-black text-white mb-1">{communities.length}</div>
                <div className="text-sm text-gray-400">Comunidades</div>
              </div>
              <div className="stats-card px-6 py-4 rounded-2xl">
                <div className="text-3xl font-black gradient-text mb-1">{formatNumber(totalMembers)}</div>
                <div className="text-sm text-gray-400">Membros</div>
              </div>
              <div className="stats-card px-6 py-4 rounded-2xl">
                <div className="flex items-center gap-2 text-3xl font-black text-emerald-400 mb-1">
                  <div className="relative">
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    <div className="absolute inset-0 w-3 h-3 rounded-full bg-emerald-400 animate-ping opacity-75" />
                  </div>
                  {totalOnline}
                </div>
                <div className="text-sm text-gray-400">Online agora</div>
              </div>
            </div>

            {/* CTA Buttons */}
            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={getLoginUrl(COMUNIDADES_ROUTES.HOME)}
                  className="cta-button px-8 py-4 rounded-xl text-black font-bold text-lg flex items-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Entrar na Comunidade
                </a>
                <Link
                  href="#comunidades"
                  className="px-8 py-4 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/5 transition-all"
                >
                  Ver Comunidades
                </Link>
              </div>
            )}
          </section>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-[#00f5ff]/30 to-transparent my-8" />

          {/* ===== BUSCA DE ARENAS ===== */}
          <section className="mb-6">
            <ArenaSearchBar className="max-w-2xl mx-auto" />
          </section>

          {/* ===== ÍNDICE DE ARENAS ===== */}
          {!loading && (
            <section className="mb-8">
              <ArenaIndex arenas={indexArenas} />
            </section>
          )}

          {/* ===== FILTROS RÁPIDOS ===== */}
          <section className="mb-8">
            <QuickFilters
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          </section>

          {/* ===== DESTAQUES TÉCNICOS - CONTEÚDO UNDERGROUND ===== */}
          {!activeFilter && (
            <section className="py-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full mb-4">
                  <Zap className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-bold text-purple-300 uppercase tracking-wider">Underground Científico</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Destaques <span className="gradient-text">Técnicos</span>
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  Conteúdo de alta densidade para quem quer ir além do básico. Fisiologia aplicada sem filtro.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Destaque 1: Lipedema e o Paradoxo do Cardio */}
                <Link
                  href="/comunidades/lipedema-paradoxo"
                  className="card-premium p-6 rounded-2xl group hover:border-cyan-500/50 block cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30">
                          <Activity className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Lipedema</span>
                      </div>
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-1 rounded-full border border-amber-400/30">PRO</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                      Lipedema e o "Paradoxo do Cardio"
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed mb-4">
                      Você faz HIIT achando que vai "derreter" a gordura das pernas? Você está inflamando o tecido doente. Macrófagos M1, HIF-1α e a ciência do AEJ + Compressão.
                    </p>
                    <div className="flex items-center gap-1 text-cyan-400 font-semibold text-sm group-hover:gap-2 transition-all duration-300">
                      <Eye className="w-4 h-4" />
                      <span>Visualizar</span>
                    </div>
                  </div>
                </Link>

                {/* Destaque 2: Trembolona e a Oxidação Lipídica */}
                <Link
                  href="/comunidades/performance-biohacking"
                  className="card-premium p-6 rounded-2xl group hover:border-purple-500/50 block cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 shadow-lg shadow-purple-500/30">
                          <Zap className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xs font-mono text-purple-400 uppercase tracking-wider">Performance</span>
                      </div>
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-1 rounded-full border border-amber-400/30">PRO</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                      Trembolona e a Verdade sobre o Reparticionamento
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed mb-4">
                      Como queimar gordura em superávit calórico? Antagonismo do Receptor de Glicocorticoide, inibição da lipogênese via IGF-1 local e ativação de ARs no adipócito.
                    </p>
                    <div className="flex items-center gap-1 text-purple-400 font-semibold text-sm group-hover:gap-2 transition-all duration-300">
                      <Eye className="w-4 h-4" />
                      <span>Visualizar</span>
                    </div>
                  </div>
                </Link>

                {/* Destaque 3: Fragment 176-191 + AEJ */}
                <Link
                  href="/comunidades/peptideos-research"
                  className="card-premium p-6 rounded-2xl group hover:border-pink-500/50 block cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg shadow-pink-500/30">
                          <Syringe className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xs font-mono text-pink-400 uppercase tracking-wider">Peptídeos</span>
                      </div>
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-1 rounded-full border border-amber-400/30">PRO</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3 group-hover:text-pink-400 transition-colors">
                      Fragment 176-191 + AEJ
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed mb-4">
                      Aplicou após o café da manhã? Você jogou dinheiro fora. O Fragment mobiliza, mas NÃO oxida. Sem cardio em jejum = injeção que não fez nada.
                    </p>
                    <div className="flex items-center gap-1 text-pink-400 font-semibold text-sm group-hover:gap-2 transition-all duration-300">
                      <Eye className="w-4 h-4" />
                      <span>Visualizar</span>
                    </div>
                  </div>
                </Link>
              </div>
            </section>
          )}

          {/* Divider */}
          {!activeFilter && (
            <div className="h-px bg-gradient-to-r from-transparent via-[#ff006e]/30 to-transparent my-8" />
          )}

          {/* ===== COMUNIDADES SECTION ===== */}
          <section id="comunidades" className="py-8">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  {activeFilter ? (
                    <>Arenas de <span className="gradient-text">{
                      activeFilter.split('_')[0]
                    }</span></>
                  ) : (
                    <>Escolha sua <span className="gradient-text">Comunidade</span></>
                  )}
                </h2>
                <p className="text-gray-400">
                  {activeFilter
                    ? `${filteredCommunities.length} arenas nesta categoria`
                    : 'Leitura livre para todos. Participe ativamente fazendo login.'
                  }
                </p>
              </div>

              {/* Login prompt */}
              {!isAuthenticated && (
                <a
                  href={getLoginUrl(COMUNIDADES_ROUTES.HOME)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white font-medium transition-all"
                >
                  <Users className="w-4 h-4 text-[#00f5ff]" />
                  Fazer login para participar
                </a>
              )}
            </div>

            {/* Communities Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCommunities.map((community) => (
                  <CommunityCard key={community.id} community={community} />
                ))}
              </div>
            )}

            {filteredCommunities.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-zinc-500">Nenhuma arena encontrada nesta categoria.</p>
                <button
                  onClick={() => setActiveFilter(null)}
                  className="mt-4 text-[#00f5ff] hover:underline text-sm"
                >
                  Ver todas as arenas
                </button>
              </div>
            )}
          </section>

          {/* ===== BENEFITS SECTION ===== */}
          {!activeFilter && (
            <section className="py-16">
              <div className="text-center mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  Por que participar das <span className="gradient-text">Comunidades NFC?</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    icon: Users,
                    title: "Apoio Real",
                    description: "Conecte-se com pessoas que entendem sua jornada",
                    gradient: "from-cyan-500 to-blue-600",
                  },
                  {
                    icon: MessageCircle,
                    title: "Troca de Experiências",
                    description: "Compartilhe e aprenda com histórias reais",
                    gradient: "from-purple-500 to-violet-600",
                  },
                  {
                    icon: Zap,
                    title: "Conteúdo Exclusivo",
                    description: "Dicas e insights direto das especialistas NFC",
                    gradient: "from-pink-500 to-rose-600",
                  },
                  {
                    icon: Heart,
                    title: "Sem Julgamento",
                    description: "Ambiente seguro e acolhedor para todos",
                    gradient: "from-emerald-500 to-teal-600",
                  },
                ].map((benefit, index) => (
                  <div
                    key={index}
                    className="card-premium p-6 rounded-2xl text-center group"
                  >
                    <div className={`w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <benefit.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{benefit.title}</h3>
                    <p className="text-sm text-gray-400">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ===== FINAL CTA ===== */}
          {!isAuthenticated && !activeFilter && (
            <section className="py-16">
              <div
                className="relative overflow-hidden rounded-3xl p-8 sm:p-12 text-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.1) 0%, rgba(139, 92, 246, 0.1) 50%, rgba(255, 0, 110, 0.1) 100%)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                }}
              >
                {/* Glow effect */}
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-[#8b5cf6] rounded-full filter blur-[100px]" />
                </div>

                <div className="relative z-10">
                  <Crown className="w-12 h-12 text-amber-400 mx-auto mb-6" />
                  <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
                    Quer fazer parte?
                  </h2>
                  <p className="text-gray-400 max-w-xl mx-auto mb-8">
                    Junte-se a milhares de pessoas que estão transformando suas vidas com apoio, conhecimento e comunidade.
                  </p>
                  <a
                    href={getLoginUrl(COMUNIDADES_ROUTES.HOME)}
                    className="cta-button inline-flex items-center gap-2 px-8 py-4 rounded-xl text-black font-bold text-lg"
                  >
                    <Sparkles className="w-5 h-5" />
                    Começar Agora
                  </a>
                </div>
              </div>
            </section>
          )}

          {/* Footer */}
          <footer className="py-8 text-center border-t border-white/5">
            <p className="text-sm text-gray-500" suppressHydrationWarning>
              &copy; {new Date().getFullYear()} NutriFitCoach. Todos os direitos reservados.
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}
