'use client';

/**
 * HUB DAS COMUNIDADES - Premium Landing Page
 * ==========================================
 *
 * Visual: Premium Cyberpunk com Neon Glow
 * Paleta: Cyan (#00f5ff) + Magenta (#ff006e) + Purple (#8b5cf6)
 * Baseado nos padrões das landing pages NFC
 */

import React from 'react';
import Link from 'next/link';
import {
  Activity,
  Syringe,
  Users,
  Wifi,
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
  MessageCircle,
  ChevronRight,
  Eye,
  LucideIcon,
} from 'lucide-react';
import { getLoginUrl, COMUNIDADES_ROUTES } from '@/lib/navigation';
import { useComunidadesAuth } from '@/app/components/comunidades/ComunidadesAuthContext';

// ========================================
// DADOS: COMUNIDADES
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
    gradient: "from-cyan-500 to-blue-600",
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
    gradient: "from-orange-500 to-red-500",
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
    gradient: "from-pink-500 to-rose-600",
    lastActivity: "há 15s",
    featured: true,
  },
  {
    id: 4,
    title: "Canetas Emagrecedoras",
    description: "Relatos reais sobre uso de Ozempic, Wegovy, Mounjaro: efeitos colaterais, expectativas e adaptações no estilo de vida.",
    members: 1856,
    activeNow: 73,
    slug: "canetas",
    icon: "Syringe",
    gradient: "from-emerald-500 to-teal-600",
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
    gradient: "from-red-500 to-pink-600",
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
    gradient: "from-purple-500 to-violet-600",
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
    gradient: "from-amber-500 to-orange-600",
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
    gradient: "from-teal-500 to-cyan-600",
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
    gradient: "from-lime-500 to-green-600",
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
    gradient: "from-indigo-500 to-purple-600",
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
  community: {
    id: number;
    title: string;
    description: string;
    members: number;
    activeNow: number;
    slug: string;
    icon: string;
    gradient: string;
    lastActivity: string;
    isCore?: boolean;
    featured?: boolean;
  };
}

function CommunityCard({ community }: CommunityCardProps) {
  const IconComponent = ICON_MAP[community.icon] || Activity;

  return (
    <Link href={`/comunidades/${community.slug}`}>
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
        {community.featured && (
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
              <div className="flex items-center gap-3 text-sm">
                <span className="flex items-center gap-1.5 text-gray-400">
                  <Users className="w-4 h-4" />
                  <span className="font-semibold text-white">{community.members.toLocaleString()}</span>
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
// PÁGINA PRINCIPAL
// ========================================

export default function ComunidadesPage() {
  const { isAuthenticated } = useComunidadesAuth();

  // Stats totais
  const totalMembers = COMMUNITIES.reduce((acc, c) => acc + c.members, 0);
  const totalOnline = COMMUNITIES.reduce((acc, c) => acc + c.activeNow, 0);

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
              Conecte-se com <span className="text-[#00f5ff] font-semibold">{totalMembers.toLocaleString()}+ mulheres</span> que
              estão transformando suas vidas. Compartilhe experiências, tire dúvidas e evolua junto.
            </p>

            {/* Stats Cards */}
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              <div className="stats-card px-6 py-4 rounded-2xl">
                <div className="text-3xl font-black text-white mb-1">{COMMUNITIES.length}</div>
                <div className="text-sm text-gray-400">Comunidades</div>
              </div>
              <div className="stats-card px-6 py-4 rounded-2xl">
                <div className="text-3xl font-black gradient-text mb-1">{totalMembers.toLocaleString()}</div>
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

          {/* ===== COMUNIDADES SECTION ===== */}
          <section id="comunidades" className="py-8">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Escolha sua <span className="gradient-text">Comunidade</span>
                </h2>
                <p className="text-gray-400">
                  Leitura livre para todos. Participe ativamente fazendo login.
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {COMMUNITIES.map((community) => (
                <CommunityCard key={community.id} community={community} />
              ))}
            </div>
          </section>

          {/* ===== BENEFITS SECTION ===== */}
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
                  description: "Conecte-se com mulheres que entendem sua jornada",
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
                  description: "Ambiente seguro e acolhedor para todas",
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

          {/* ===== FINAL CTA ===== */}
          {!isAuthenticated && (
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
                    Pronta para fazer parte?
                  </h2>
                  <p className="text-gray-400 max-w-xl mx-auto mb-8">
                    Junte-se a milhares de mulheres que estão transformando suas vidas com apoio, conhecimento e comunidade.
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
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} NutriFitCoach. Todos os direitos reservados.
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}
