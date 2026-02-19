'use client';

/**
 * PAINEL VIVO - Dashboard de Atividade em Tempo Real
 *
 * Componente central para criar sensação de "vida" nas comunidades.
 * Estilo: Painel de aeroporto (chegadas/partidas)
 *
 * SEÇÕES:
 * 1. AgoraAcontecendo - Feed rotativo de últimas atividades
 * 2. ComunidadesMaisAtivas - Ranking 24h
 * 3. DestaquesSemana - Curadoria
 * 4. PerguntaDoDia - Rotativa por comunidade
 */

import React, { useState, useEffect } from 'react';
import {
  Activity,
  Users,
  TrendingUp,
  MessageSquare,
  Star,
  Zap,
  HelpCircle,
  Clock,
  ArrowRight,
  Flame,
  Bot,
  UserPlus,
  Heart,
  RefreshCw,
  Crown,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { getPerguntaDoDia, diasDesdelancamento, getFaseAtual } from '@/app/comunidades/config/ia-facilitadora';

// ========================================
// TIPOS
// ========================================

interface AtividadeRecente {
  id: string;
  tipo: 'novo_topico' | 'resposta' | 'usuario_entrou' | 'ia_pergunta' | 'destaque' | 'reacao';
  texto: string;
  comunidade: string;
  comunidadeSlug: string;
  timestamp: string;
  usuario?: string;
  isPremium?: boolean;
  isFounder?: boolean;
}

interface ComunidadeRanking {
  slug: string;
  nome: string;
  atividadesHoje: number;
  membrosOnline: number;
  tendencia: 'up' | 'down' | 'stable';
  cor: string;
}

interface DestaqueSemana {
  id: string;
  tipo: 'topico_popular' | 'membro_ativo' | 'discussao_quente';
  titulo: string;
  descricao: string;
  comunidade: string;
  comunidadeSlug: string;
  autor?: string;
  engajamento?: number;
}

// ========================================
// DADOS MOCK - Atividades Recentes
// ========================================

const ATIVIDADES_MOCK: AtividadeRecente[] = [
  {
    id: '1',
    tipo: 'novo_topico',
    texto: 'Nova discussão sobre dor nas pernas à noite',
    comunidade: 'Lipedema',
    comunidadeSlug: 'lipedema',
    timestamp: 'agora',
    usuario: 'Juliana M.',
  },
  {
    id: '2',
    tipo: 'resposta',
    texto: 'Compartilhou experiência com treino em casa',
    comunidade: 'Treino Casa',
    comunidadeSlug: 'treino-casa',
    timestamp: 'há 30s',
    usuario: 'Fernanda R.',
    isPremium: true,
  },
  {
    id: '3',
    tipo: 'ia_pergunta',
    texto: 'IA: "O que mais dificulta seu déficit hoje?"',
    comunidade: 'Déficit Calórico',
    comunidadeSlug: 'deficit-calorico',
    timestamp: 'há 1 min',
  },
  {
    id: '4',
    tipo: 'usuario_entrou',
    texto: 'Coach Patricia entrou na arena',
    comunidade: 'Treino Glúteo',
    comunidadeSlug: 'treino-gluteo',
    timestamp: 'há 2 min',
    usuario: 'Patricia A.',
    isFounder: true,
  },
  {
    id: '5',
    tipo: 'destaque',
    texto: 'IA destacou relato sobre adaptação às canetas',
    comunidade: 'Canetas',
    comunidadeSlug: 'canetas',
    timestamp: 'há 3 min',
  },
  {
    id: '6',
    tipo: 'reacao',
    texto: '12 pessoas reagiram à transformação de 6 meses',
    comunidade: 'Antes e Depois',
    comunidadeSlug: 'antes-depois',
    timestamp: 'há 4 min',
  },
  {
    id: '7',
    tipo: 'resposta',
    texto: 'Dra. Lucia comentou sobre gatilhos emocionais',
    comunidade: 'Ansiedade',
    comunidadeSlug: 'ansiedade-alimentacao',
    timestamp: 'há 5 min',
    usuario: 'Dra. Lucia',
    isFounder: true,
  },
  {
    id: '8',
    tipo: 'novo_topico',
    texto: 'Novo relato sobre desafios após os 40',
    comunidade: '35+',
    comunidadeSlug: 'emagrecimento-35-mais',
    timestamp: 'há 6 min',
    usuario: 'Sandra L.',
  },
];

// ========================================
// DADOS MOCK - Ranking de Comunidades
// ========================================

const RANKING_MOCK: ComunidadeRanking[] = [
  { slug: 'dieta-vida-real', nome: 'Dieta na Vida Real', atividadesHoje: 47, membrosOnline: 187, tendencia: 'up', cor: 'lime' },
  { slug: 'treino-gluteo', nome: 'Treino de Glúteo', atividadesHoje: 38, membrosOnline: 124, tendencia: 'up', cor: 'pink' },
  { slug: 'antes-depois', nome: 'Antes e Depois', atividadesHoje: 31, membrosOnline: 108, tendencia: 'stable', cor: 'teal' },
  { slug: 'ansiedade-alimentacao', nome: 'Ansiedade e Alimentação', atividadesHoje: 28, membrosOnline: 91, tendencia: 'up', cor: 'purple' },
  { slug: 'deficit-calorico', nome: 'Déficit Calórico', atividadesHoje: 24, membrosOnline: 89, tendencia: 'down', cor: 'orange' },
];

// ========================================
// DADOS MOCK - Destaques da Semana
// ========================================

const DESTAQUES_MOCK: DestaqueSemana[] = [
  {
    id: '1',
    tipo: 'topico_popular',
    titulo: 'Como descobri que não era gordura',
    descricao: 'Relato emocionante sobre diagnóstico de lipedema',
    comunidade: 'Lipedema',
    comunidadeSlug: 'lipedema',
    autor: 'Carla M.',
    engajamento: 89,
  },
  {
    id: '2',
    tipo: 'membro_ativo',
    titulo: 'Dra. Lucia - Top Contribuidora',
    descricao: '23 respostas úteis esta semana',
    comunidade: 'Ansiedade',
    comunidadeSlug: 'ansiedade-alimentacao',
    autor: 'Dra. Lucia',
  },
  {
    id: '3',
    tipo: 'discussao_quente',
    titulo: 'Ozempic vs Mounjaro - Experiências Reais',
    descricao: '45 membros participando ativamente',
    comunidade: 'Canetas',
    comunidadeSlug: 'canetas',
    engajamento: 45,
  },
];

// ========================================
// COMPONENTE: Ícone por tipo de atividade
// ========================================

const TIPO_CONFIG: Record<string, { icon: React.ElementType; cor: string; bg: string }> = {
  novo_topico: { icon: MessageSquare, cor: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  resposta: { icon: MessageSquare, cor: 'text-blue-400', bg: 'bg-blue-500/10' },
  usuario_entrou: { icon: UserPlus, cor: 'text-[#00ff88]', bg: 'bg-[#00ff88]/10' },
  ia_pergunta: { icon: Bot, cor: 'text-purple-400', bg: 'bg-purple-500/10' },
  destaque: { icon: Star, cor: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  reacao: { icon: Heart, cor: 'text-pink-400', bg: 'bg-pink-500/10' },
};

// ========================================
// SEÇÃO 1: AGORA ACONTECENDO
// ========================================

function AgoraAcontecendo() {
  const [atividades, setAtividades] = useState<AtividadeRecente[]>(ATIVIDADES_MOCK);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Rotação automática a cada 4s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % atividades.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [atividades.length]);

  // Pegar 5 atividades a partir do índice atual
  const atividadesVisiveis = [...atividades, ...atividades].slice(currentIndex, currentIndex + 5);

  return (
    <div className="bg-zinc-900/70 backdrop-blur-sm border border-zinc-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-2 h-2 rounded-full bg-[#00ff88]" />
            <div className="absolute inset-0 w-2 h-2 rounded-full bg-[#00ff88] animate-ping" />
          </div>
          <span className="text-xs font-mono text-[#00ff88] uppercase tracking-widest font-bold">
            AGORA ACONTECENDO
          </span>
        </div>
        <div className="flex items-center gap-2">
          <RefreshCw className="w-3 h-3 text-zinc-600 animate-spin" style={{ animationDuration: '3s' }} />
          <span className="text-[10px] font-mono text-zinc-600">AO VIVO</span>
        </div>
      </div>

      {/* Feed */}
      <div className="divide-y divide-zinc-800/50">
        {atividadesVisiveis.map((atividade, idx) => {
          const config = TIPO_CONFIG[atividade.tipo];
          const Icon = config.icon;

          return (
            <Link
              key={`${atividade.id}-${idx}`}
              href={`/comunidades/${atividade.comunidadeSlug}`}
              className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-800/30 transition-colors group"
            >
              {/* Timestamp */}
              <span className="text-[10px] font-mono text-zinc-600 w-14 text-right flex-shrink-0">
                {atividade.timestamp}
              </span>

              {/* Indicador */}
              <div className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse flex-shrink-0" />

              {/* Ícone */}
              <div className={`p-1.5 rounded ${config.bg} flex-shrink-0`}>
                <Icon className={`w-3 h-3 ${config.cor}`} />
              </div>

              {/* Conteúdo */}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-zinc-300 truncate">
                  {atividade.usuario && (
                    <span className="font-semibold">
                      {atividade.usuario}
                      {atividade.isFounder && (
                        <Crown className="inline w-3 h-3 ml-1 text-yellow-400" />
                      )}
                      {atividade.isPremium && !atividade.isFounder && (
                        <Sparkles className="inline w-3 h-3 ml-1 text-purple-400" />
                      )}
                      {' - '}
                    </span>
                  )}
                  {atividade.texto}
                </p>
              </div>

              {/* Badge Comunidade */}
              <span className="text-[9px] font-mono text-zinc-600 uppercase px-2 py-0.5 bg-zinc-800/50 rounded flex-shrink-0 group-hover:bg-zinc-700/50 transition-colors">
                {atividade.comunidade}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// ========================================
// SEÇÃO 2: COMUNIDADES MAIS ATIVAS
// ========================================

function ComunidadesMaisAtivas() {
  const cores: Record<string, string> = {
    lime: 'text-lime-400',
    pink: 'text-pink-400',
    teal: 'text-teal-400',
    purple: 'text-purple-400',
    orange: 'text-orange-400',
  };

  return (
    <div className="bg-zinc-900/70 backdrop-blur-sm border border-zinc-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-400" />
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
            MAIS ATIVAS 24H
          </span>
        </div>
        <TrendingUp className="w-4 h-4 text-[#00ff88]" />
      </div>

      {/* Ranking */}
      <div className="divide-y divide-zinc-800/50">
        {RANKING_MOCK.map((comunidade, index) => (
          <Link
            key={comunidade.slug}
            href={`/comunidades/${comunidade.slug}`}
            className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-800/30 transition-colors group"
          >
            {/* Posição */}
            <span className={`text-lg font-bold w-6 text-center ${index < 3 ? 'text-[#00ff88]' : 'text-zinc-600'}`}>
              {index + 1}
            </span>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold truncate ${cores[comunidade.cor] || 'text-white'} group-hover:text-white transition-colors`}>
                {comunidade.nome}
              </p>
              <div className="flex items-center gap-3 text-[10px] text-zinc-500">
                <span>{comunidade.atividadesHoje} atividades</span>
                <span className="w-1 h-1 rounded-full bg-zinc-700" />
                <span className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {comunidade.membrosOnline} online
                </span>
              </div>
            </div>

            {/* Tendência */}
            <div className="flex-shrink-0">
              {comunidade.tendencia === 'up' && (
                <TrendingUp className="w-4 h-4 text-[#00ff88]" />
              )}
              {comunidade.tendencia === 'down' && (
                <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />
              )}
              {comunidade.tendencia === 'stable' && (
                <div className="w-4 h-0.5 bg-zinc-600 rounded" />
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ========================================
// SEÇÃO 3: DESTAQUES DA SEMANA
// ========================================

function DestaquesSemana() {
  const tipoConfig: Record<string, { label: string; cor: string }> = {
    topico_popular: { label: 'Tópico Popular', cor: 'text-cyan-400' },
    membro_ativo: { label: 'Top Contribuidor', cor: 'text-yellow-400' },
    discussao_quente: { label: 'Discussão Quente', cor: 'text-orange-400' },
  };

  return (
    <div className="bg-zinc-900/70 backdrop-blur-sm border border-zinc-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-400" />
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
            DESTAQUES DA SEMANA
          </span>
        </div>
      </div>

      {/* Destaques */}
      <div className="divide-y divide-zinc-800/50">
        {DESTAQUES_MOCK.map((destaque) => {
          const config = tipoConfig[destaque.tipo];

          return (
            <Link
              key={destaque.id}
              href={`/comunidades/${destaque.comunidadeSlug}`}
              className="block px-4 py-3 hover:bg-zinc-800/30 transition-colors group"
            >
              {/* Badge Tipo */}
              <span className={`text-[10px] font-mono uppercase tracking-wider ${config.cor}`}>
                {config.label}
              </span>

              {/* Título */}
              <h4 className="text-sm font-semibold text-white mt-1 group-hover:text-[#00ff88] transition-colors">
                {destaque.titulo}
              </h4>

              {/* Descrição */}
              <p className="text-xs text-zinc-500 mt-0.5">
                {destaque.descricao}
              </p>

              {/* Meta */}
              <div className="flex items-center gap-2 mt-2 text-[10px] text-zinc-600">
                <span className="px-1.5 py-0.5 bg-zinc-800/50 rounded">
                  {destaque.comunidade}
                </span>
                {destaque.engajamento && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-zinc-700" />
                    <span className="text-[#00ff88]">{destaque.engajamento} interações</span>
                  </>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// ========================================
// SEÇÃO 4: PERGUNTA DO DIA
// ========================================

function PerguntaDoDia({ comunidadeSlug }: { comunidadeSlug?: string }) {
  const [perguntaAtual, setPerguntaAtual] = useState('');
  const [comunidadeDaPergunta, setComunidadeDaPergunta] = useState('');

  // Lista de comunidades para rotação
  const comunidades = [
    { slug: 'lipedema', nome: 'Lipedema' },
    { slug: 'deficit-calorico', nome: 'Déficit Calórico' },
    { slug: 'treino-gluteo', nome: 'Treino Glúteo' },
    { slug: 'canetas', nome: 'Canetas' },
    { slug: 'odeia-treinar', nome: 'Odeia Treinar' },
    { slug: 'ansiedade-alimentacao', nome: 'Ansiedade' },
    { slug: 'emagrecimento-35-mais', nome: '35+' },
    { slug: 'antes-depois', nome: 'Antes e Depois' },
    { slug: 'dieta-vida-real', nome: 'Dieta Vida Real' },
    { slug: 'treino-casa', nome: 'Treino Casa' },
  ];

  useEffect(() => {
    // Se temos uma comunidade específica, usar ela
    // Senão, escolher uma comunidade baseada no dia
    const hoje = new Date().getDate();
    const comunidadeIndex = hoje % comunidades.length;
    const comunidadeEscolhida = comunidadeSlug || comunidades[comunidadeIndex].slug;

    const pergunta = getPerguntaDoDia();
    setPerguntaAtual(pergunta);

    // Encontrar nome da comunidade
    const comunidadeInfo = comunidades.find(c => c.slug === comunidadeEscolhida);
    setComunidadeDaPergunta(comunidadeInfo?.nome || comunidadeEscolhida);
  }, [comunidadeSlug]);

  // Usar estado para evitar hydration mismatch (new Date() difere entre server/client)
  const [slugParaLink, setSlugParaLink] = useState(comunidadeSlug || '');

  useEffect(() => {
    if (!comunidadeSlug) {
      const hoje = new Date().getDate();
      setSlugParaLink(comunidades[hoje % comunidades.length].slug);
    }
  }, [comunidadeSlug]);

  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-zinc-900/70 backdrop-blur-sm border border-purple-500/30 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-purple-500/20">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-mono text-purple-300 uppercase tracking-widest">
            PERGUNTA DO DIA
          </span>
        </div>
        <span className="text-[10px] font-mono text-purple-400/60 uppercase">
          {comunidadeDaPergunta}
        </span>
      </div>

      {/* Pergunta */}
      <div className="p-4">
        <p className="text-lg font-medium text-white leading-relaxed">
          "{perguntaAtual}"
        </p>

        {/* CTA */}
        <Link
          href={`/comunidades/${slugParaLink}`}
          className="inline-flex items-center gap-2 mt-4 text-sm text-purple-400 hover:text-purple-300 transition-colors group"
        >
          <span>Participar da discussão</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Footer com IA */}
      <div className="px-4 py-2 border-t border-purple-500/20 bg-purple-900/20 flex items-center gap-2">
        <Bot className="w-3 h-3 text-purple-400" />
        <span className="text-[10px] font-mono text-purple-400/60">
          Gerada pela IA Facilitadora
        </span>
      </div>
    </div>
  );
}

// ========================================
// COMPONENTE PRINCIPAL: PAINEL VIVO
// ========================================

interface PainelVivoProps {
  comunidadeSlug?: string; // Se definido, filtra para uma comunidade
  layout?: 'hub' | 'comunidade'; // Layout do hub ou dentro de uma comunidade
}

export default function PainelVivo({ comunidadeSlug, layout = 'hub' }: PainelVivoProps) {
  const fase = getFaseAtual();

  if (layout === 'comunidade') {
    // Layout simplificado para páginas de comunidade
    return (
      <div className="space-y-4">
        <PerguntaDoDia comunidadeSlug={comunidadeSlug} />
        <AgoraAcontecendo />
      </div>
    );
  }

  // Layout completo para o hub
  return (
    <div className="space-y-6">
      {/* Header do Painel */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-[#00ff88]" />
          <h2 className="text-lg font-bold text-white">Painel Vivo</h2>
          <span className="text-[10px] font-mono text-zinc-600 uppercase px-2 py-0.5 bg-zinc-800 rounded">
            Fase: {fase}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <Clock className="w-3 h-3" />
          <span className="font-mono">Atualização automática</span>
        </div>
      </div>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Coluna 1 */}
        <div className="space-y-4">
          <PerguntaDoDia comunidadeSlug={comunidadeSlug} />
          <ComunidadesMaisAtivas />
        </div>

        {/* Coluna 2 */}
        <div className="space-y-4">
          <AgoraAcontecendo />
          <DestaquesSemana />
        </div>
      </div>
    </div>
  );
}

// Exports nomeados para uso individual
export { AgoraAcontecendo, ComunidadesMaisAtivas, DestaquesSemana, PerguntaDoDia };
