'use client';

/**
 * PÁGINA: HUB DAS ARENAS (Comunidades)
 *
 * Visual: Cyberpunk/Sci-Fi - Arena Digital
 * Estética: Fundo escuro + Verde Neon (#00ff88)
 *
 * IMPORTANTE: Header e Footer são renderizados GLOBALMENTE via providers.tsx
 * Esta página contém APENAS o conteúdo específico.
 */

import React from 'react';
import Link from 'next/link';
import {
  Activity,
  Syringe,
  Users,
  Eye,
  Wifi,
  Dumbbell,
  Heart,
  Brain,
  Sparkles,
  Camera,
  Utensils,
  TrendingDown,
  Home,
  LucideIcon,
} from 'lucide-react';
import { getLoginUrl, COMUNIDADES_ROUTES } from '@/lib/navigation';
import { useComunidadesAuth } from '@/app/components/comunidades/ComunidadesAuthContext';

// ========================================
// DADOS: 9 COMUNIDADES INICIAIS (FASE 1)
// ========================================

const COMMUNITIES = [
  {
    id: 1,
    title: "Protocolo Lipedema",
    description: "Espaço para mulheres que convivem com lipedema compartilharem sintomas, estratégias, frustrações e avanços reais no dia a dia.",
    members: 1247,
    activeNow: 47,
    slug: "lipedema",
    icon: "Activity",
    color: "cyan",
    lastActivity: "há 2 min",
  },
  {
    id: 2,
    title: "Déficit Calórico na Vida Real",
    description: "Nem sempre o déficit funciona como nos cálculos. Aqui falamos do que acontece na prática, no corpo e na rotina.",
    members: 2341,
    activeNow: 89,
    slug: "deficit-calorico",
    icon: "TrendingDown",
    color: "orange",
    lastActivity: "há 30s",
  },
  {
    id: 3,
    title: "Treino de Glúteo Feminino",
    description: "Treino de glúteo com olhar feminino: genética, dor, carga, repetição, constância e resultado real.",
    members: 3156,
    activeNow: 124,
    slug: "treino-gluteo",
    icon: "Dumbbell",
    color: "pink",
    lastActivity: "há 15s",
  },
  {
    id: 4,
    title: "Canetas Emagrecedoras",
    description: "Relatos reais sobre uso de Ozempic, Wegovy, Mounjaro: efeitos colaterais, expectativas e adaptações no estilo de vida.",
    members: 1856,
    activeNow: 73,
    slug: "canetas",
    icon: "Syringe",
    color: "emerald",
    lastActivity: "há 1 min",
  },
  {
    id: 5,
    title: "Exercício para Quem Odeia Treinar",
    description: "Para quem quer resultado, mas não se identifica com academia tradicional.",
    members: 1432,
    activeNow: 56,
    slug: "odeia-treinar",
    icon: "Heart",
    color: "red",
    lastActivity: "há 3 min",
  },
  {
    id: 6,
    title: "Ansiedade, Compulsão e Alimentação",
    description: "Discussões abertas sobre relação emocional com a comida, sem julgamento.",
    members: 2087,
    activeNow: 91,
    slug: "ansiedade-alimentacao",
    icon: "Brain",
    color: "purple",
    lastActivity: "há 45s",
  },
  {
    id: 7,
    title: "Emagrecimento Feminino 35+",
    description: "Mudanças hormonais, metabolismo e a realidade do corpo após os 30–40 anos.",
    members: 1678,
    activeNow: 62,
    slug: "emagrecimento-35-mais",
    icon: "Sparkles",
    color: "amber",
    lastActivity: "há 2 min",
  },
  {
    id: 8,
    title: "Antes e Depois — Processo Real",
    description: "Mais do que fotos, histórias. O foco é o processo, não só o resultado.",
    members: 2934,
    activeNow: 108,
    slug: "antes-depois",
    icon: "Camera",
    color: "teal",
    lastActivity: "há 20s",
  },
  {
    id: 9,
    title: "Dieta na Vida Real",
    description: "Espaço para falar da dificuldade real de seguir dietas, mesmo quando elas são bem elaboradas.",
    members: 4521,
    activeNow: 187,
    slug: "dieta-vida-real",
    icon: "Utensils",
    color: "lime",
    lastActivity: "há 10s",
    isCore: true,
  },
  {
    id: 10,
    title: "Treino em Casa",
    description: "Exercícios livres e com poucos acessórios. Baseado na metodologia Bret: ~100% dos exercícios podem ser feitos em casa.",
    members: 2156,
    activeNow: 78,
    slug: "treino-casa",
    icon: "Home",
    color: "indigo",
    lastActivity: "há 1 min",
  },
];

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
};

const COLOR_SCHEMES: Record<string, { accent: string; border: string; glow: string; iconColor: string; iconBg: string }> = {
  cyan: {
    accent: 'from-cyan-500/20 to-blue-500/20',
    border: 'hover:border-cyan-400',
    glow: 'hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]',
    iconColor: 'text-cyan-400',
    iconBg: 'group-hover:bg-cyan-400/10',
  },
  orange: {
    accent: 'from-orange-500/20 to-amber-500/20',
    border: 'hover:border-orange-400',
    glow: 'hover:shadow-[0_0_20px_rgba(251,146,60,0.3)]',
    iconColor: 'text-orange-400',
    iconBg: 'group-hover:bg-orange-400/10',
  },
  pink: {
    accent: 'from-pink-500/20 to-rose-500/20',
    border: 'hover:border-pink-400',
    glow: 'hover:shadow-[0_0_20px_rgba(244,114,182,0.3)]',
    iconColor: 'text-pink-400',
    iconBg: 'group-hover:bg-pink-400/10',
  },
  emerald: {
    accent: 'from-emerald-500/20 to-green-500/20',
    border: 'hover:border-[#00ff88]',
    glow: 'hover:shadow-[0_0_20px_rgba(0,255,136,0.3)]',
    iconColor: 'text-[#00ff88]',
    iconBg: 'group-hover:bg-[#00ff88]/10',
  },
  red: {
    accent: 'from-red-500/20 to-rose-500/20',
    border: 'hover:border-red-400',
    glow: 'hover:shadow-[0_0_20px_rgba(248,113,113,0.3)]',
    iconColor: 'text-red-400',
    iconBg: 'group-hover:bg-red-400/10',
  },
  purple: {
    accent: 'from-purple-500/20 to-violet-500/20',
    border: 'hover:border-purple-400',
    glow: 'hover:shadow-[0_0_20px_rgba(192,132,252,0.3)]',
    iconColor: 'text-purple-400',
    iconBg: 'group-hover:bg-purple-400/10',
  },
  amber: {
    accent: 'from-amber-500/20 to-yellow-500/20',
    border: 'hover:border-amber-400',
    glow: 'hover:shadow-[0_0_20px_rgba(251,191,36,0.3)]',
    iconColor: 'text-amber-400',
    iconBg: 'group-hover:bg-amber-400/10',
  },
  teal: {
    accent: 'from-teal-500/20 to-cyan-500/20',
    border: 'hover:border-teal-400',
    glow: 'hover:shadow-[0_0_20px_rgba(45,212,191,0.3)]',
    iconColor: 'text-teal-400',
    iconBg: 'group-hover:bg-teal-400/10',
  },
  lime: {
    accent: 'from-lime-500/20 to-green-500/20',
    border: 'hover:border-lime-400',
    glow: 'hover:shadow-[0_0_20px_rgba(163,230,53,0.3)]',
    iconColor: 'text-lime-400',
    iconBg: 'group-hover:bg-lime-400/10',
  },
  indigo: {
    accent: 'from-indigo-500/20 to-blue-500/20',
    border: 'hover:border-indigo-400',
    glow: 'hover:shadow-[0_0_20px_rgba(129,140,248,0.3)]',
    iconColor: 'text-indigo-400',
    iconBg: 'group-hover:bg-indigo-400/10',
  },
};

// ========================================
// COMPONENTE: Card da Arena
// ========================================

interface ArenaCardProps {
  comunidade: {
    id: number;
    title: string;
    description: string;
    members: number;
    activeNow: number;
    slug: string;
    icon: string;
    color: string;
    lastActivity: string;
    isCore?: boolean;
  };
}

function ArenaCard({ comunidade }: ArenaCardProps) {
  const IconComponent = ICON_MAP[comunidade.icon] || Activity;
  const colorScheme = COLOR_SCHEMES[comunidade.color] || COLOR_SCHEMES.emerald;

  return (
    <Link href={`/comunidades/${comunidade.slug}`}>
      <div
        className={`
          group relative overflow-hidden
          bg-zinc-900/50 backdrop-blur-sm
          border border-zinc-800
          rounded-xl p-6
          transition-all duration-300
          ${colorScheme.border}
          ${colorScheme.glow}
          hover:scale-[1.02]
          cursor-pointer
          ${comunidade.isCore ? 'ring-1 ring-[#00ff88]/30' : ''}
        `}
      >
        {/* Core Badge */}
        {comunidade.isCore && (
          <div className="absolute top-3 right-3 px-2 py-0.5 bg-[#00ff88]/10 border border-[#00ff88]/30 rounded text-[10px] font-mono text-[#00ff88] uppercase tracking-wider">
            NFC Core
          </div>
        )}

        {/* Background Gradient */}
        <div
          className={`
            absolute inset-0 opacity-0 group-hover:opacity-100
            bg-gradient-to-br ${colorScheme.accent}
            transition-opacity duration-300
          `}
        />

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-start gap-4 mb-4">
            <div className={`p-3 rounded-lg bg-zinc-800/50 ${colorScheme.iconBg} transition-colors duration-300`}>
              <IconComponent className={`w-6 h-6 ${colorScheme.iconColor}`} strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#00ff88] transition-colors duration-300">
                {comunidade.title}
              </h3>

              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-zinc-400">
                  <Users className="w-3.5 h-3.5" />
                  <span className="font-mono font-bold">{comunidade.members.toLocaleString()}</span>
                  <span className="text-zinc-600">membros</span>
                </span>
                <span className="w-1 h-1 rounded-full bg-zinc-700" />
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <div className="relative">
                    <Wifi className="w-3.5 h-3.5" />
                    <div className="absolute inset-0 animate-ping opacity-50">
                      <Wifi className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <span className="font-mono font-bold">{comunidade.activeNow}</span>
                  <span className="text-emerald-400/70">online</span>
                </span>
              </div>
            </div>
          </div>

          <p className="text-sm text-zinc-400 leading-relaxed mb-4">
            {comunidade.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-zinc-600 uppercase tracking-wider">
                Última atividade:
              </span>
              <span className="text-xs font-mono text-[#00ff88]">
                {comunidade.lastActivity}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-[#00ff88]">
              <Eye className="w-4 h-4" />
              <span className="font-semibold">Ver Arena</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ========================================
// PÁGINA PRINCIPAL
// ========================================

export default function ComunidadesPage() {
  const { isAuthenticated } = useComunidadesAuth();

  return (
    <div className="relative bg-black">
      {/* Background Grid Pattern */}
      <div
        className="fixed inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(#00ff88 1px, transparent 1px),
            linear-gradient(90deg, #00ff88 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Container Principal */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
              Sistema / Comunidades
            </span>
          </div>

          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-3 tracking-tight"
            style={{ textShadow: '0 0 30px rgba(0, 255, 136, 0.3)' }}
          >
            ARENAS DISPONÍVEIS
          </h1>

          <p className="text-base sm:text-lg text-zinc-400 font-light max-w-2xl">
            Selecione seu protocolo de operação. Conecte-se com outros agentes, compartilhe estratégias e
            maximize seus resultados.
          </p>

          {/* Banner de Login */}
          <div className="mt-6 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#00ff88]/10 border border-[#00ff88]/30 flex items-center justify-center">
                <Users className="w-5 h-5 text-[#00ff88]" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Leitura livre, participação exclusiva</p>
                <p className="text-xs text-zinc-500">Faça login para interagir nas comunidades</p>
              </div>
            </div>
            <a
              href={getLoginUrl(COMUNIDADES_ROUTES.HOME)}
              className="px-4 py-2 bg-[#00ff88] hover:bg-[#00ff88]/90 text-black font-semibold text-sm rounded-lg transition-all hover:shadow-[0_0_15px_rgba(0,255,136,0.4)]"
            >
              Entrar agora
            </a>
          </div>

          <div className="mt-6 h-[1px] bg-gradient-to-r from-transparent via-[#00ff88]/30 to-transparent" />
        </div>

        {/* Arenas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {COMMUNITIES.map((comunidade) => (
            <ArenaCard key={comunidade.id} comunidade={comunidade} />
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <p className="text-xs text-zinc-600 font-mono">
            &gt; NOVOS PROTOCOLOS SERÃO ATIVADOS CONFORME DEMANDA DE AGENTES
          </p>
        </div>
      </div>
    </div>
  );
}
