'use client';

/**
 * COMPONENTE: LiveActivityTicker - Painel de Atividade ao Vivo
 *
 * Visual: Painel de Aeroporto (chegadas/partidas)
 * Estilo: Scroll vertical automático, loop infinito
 * Estética: Cyberpunk HUD + Fonte monoespaçada + Neon discreto
 *
 * Eventos:
 * - Usuário entrou na arena
 * - Novo relato publicado
 * - IA lançou pergunta
 * - Tópico reativado
 *
 * Uso: /comunidades e /comunidades/[slug]
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  UserPlus,
  MessageSquare,
  Bot,
  RefreshCw,
  Zap,
  Eye,
  Heart,
  TrendingUp,
  Clock,
} from 'lucide-react';

// ========================================
// TIPOS
// ========================================

type EventoTipo =
  | 'usuario_entrou'
  | 'novo_topico'
  | 'nova_resposta'
  | 'ia_pergunta'
  | 'ia_insight'
  | 'topico_reativado'
  | 'usuario_online'
  | 'reacao';

interface AtividadeEvento {
  id: string;
  tipo: EventoTipo;
  mensagem: string;
  comunidade?: string;
  timestamp: string;
  usuario?: string;
}

// ========================================
// DADOS MOCK - EVENTOS DE ATIVIDADE (10 COMUNIDADES)
// ========================================

const EVENTOS_MOCK: AtividadeEvento[] = [
  // Lipedema
  {
    id: '1',
    tipo: 'usuario_entrou',
    mensagem: 'Maria Silva entrou na arena Lipedema',
    comunidade: 'lipedema',
    timestamp: 'agora',
    usuario: 'Maria Silva',
  },
  {
    id: '2',
    tipo: 'nova_resposta',
    mensagem: 'Carla M. compartilhou sobre dor noturna nas pernas',
    comunidade: 'lipedema',
    timestamp: 'há 15s',
    usuario: 'Carla M.',
  },
  // Treino Casa
  {
    id: '3',
    tipo: 'novo_topico',
    mensagem: 'Fernanda postou sobre hip thrust em casa',
    comunidade: 'treino-casa',
    timestamp: 'há 30s',
  },
  {
    id: '4',
    tipo: 'ia_insight',
    mensagem: 'IA: "Tempo sob tensão é chave para progressão"',
    comunidade: 'treino-casa',
    timestamp: 'há 45s',
  },
  // Déficit Calórico
  {
    id: '5',
    tipo: 'novo_topico',
    mensagem: 'Novo relato sobre déficit nos finais de semana',
    comunidade: 'deficit-calorico',
    timestamp: 'há 1 min',
  },
  {
    id: '6',
    tipo: 'ia_pergunta',
    mensagem: 'IA: "Em que momento do dia a fome é mais difícil?"',
    comunidade: 'deficit-calorico',
    timestamp: 'há 1 min',
  },
  // Treino Glúteo
  {
    id: '7',
    tipo: 'ia_pergunta',
    mensagem: 'IA: "Carga alta ou mais repetições?"',
    comunidade: 'treino-gluteo',
    timestamp: 'há 2 min',
  },
  {
    id: '8',
    tipo: 'usuario_entrou',
    mensagem: 'Patricia Alves (Founder) entrou',
    comunidade: 'treino-gluteo',
    timestamp: 'há 2 min',
    usuario: 'Patricia Alves',
  },
  // Canetas
  {
    id: '9',
    tipo: 'nova_resposta',
    mensagem: 'Renata compartilhou adaptação ao Ozempic',
    comunidade: 'canetas',
    timestamp: 'há 3 min',
    usuario: 'Renata S.',
  },
  {
    id: '10',
    tipo: 'nova_resposta',
    mensagem: 'Dr. Ricardo alertou sobre uso seguro',
    comunidade: 'canetas',
    timestamp: 'há 3 min',
    usuario: 'Dr. Ricardo',
  },
  // Odeia Treinar
  {
    id: '11',
    tipo: 'usuario_entrou',
    mensagem: 'Beatriz Costa entrou na arena',
    comunidade: 'odeia-treinar',
    timestamp: 'há 4 min',
    usuario: 'Beatriz Costa',
  },
  {
    id: '12',
    tipo: 'ia_pergunta',
    mensagem: 'IA: "Qual atividade você descobriu que não odeia?"',
    comunidade: 'odeia-treinar',
    timestamp: 'há 4 min',
  },
  // Ansiedade e Alimentação
  {
    id: '13',
    tipo: 'ia_insight',
    mensagem: 'IA detectou padrão: estresse noturno e compulsão',
    comunidade: 'ansiedade-alimentacao',
    timestamp: 'há 5 min',
  },
  {
    id: '14',
    tipo: 'nova_resposta',
    mensagem: 'Dra. Lucia comentou sobre gatilhos emocionais',
    comunidade: 'ansiedade-alimentacao',
    timestamp: 'há 5 min',
    usuario: 'Dra. Lucia',
  },
  // 35+
  {
    id: '15',
    tipo: 'reacao',
    mensagem: 'Sandra reagiu a relato sobre metabolismo após 40',
    comunidade: 'emagrecimento-35-mais',
    timestamp: 'há 6 min',
    usuario: 'Sandra Lima',
  },
  {
    id: '16',
    tipo: 'novo_topico',
    mensagem: 'Márcia compartilhou sobre mudanças hormonais',
    comunidade: 'emagrecimento-35-mais',
    timestamp: 'há 6 min',
  },
  // Antes e Depois
  {
    id: '17',
    tipo: 'novo_topico',
    mensagem: 'Tatiana compartilhou transformação de 8 meses',
    comunidade: 'antes-depois',
    timestamp: 'há 7 min',
  },
  {
    id: '18',
    tipo: 'reacao',
    mensagem: '23 pessoas reagiram à foto de Juliana',
    comunidade: 'antes-depois',
    timestamp: 'há 8 min',
  },
  // Dieta Vida Real
  {
    id: '19',
    tipo: 'usuario_online',
    mensagem: '5 agentes ativos em Dieta na Vida Real',
    comunidade: 'dieta-vida-real',
    timestamp: 'há 9 min',
  },
  {
    id: '20',
    tipo: 'ia_pergunta',
    mensagem: 'IA: "O que mais te desmotiva a seguir a dieta?"',
    comunidade: 'dieta-vida-real',
    timestamp: 'há 9 min',
  },
  // Eventos de sistema
  {
    id: '21',
    tipo: 'topico_reativado',
    mensagem: 'Discussão sobre drenagem linfática reativada',
    comunidade: 'lipedema',
    timestamp: 'há 10 min',
  },
  {
    id: '22',
    tipo: 'usuario_entrou',
    mensagem: 'Coach Bret (Founder) entrou',
    comunidade: 'treino-casa',
    timestamp: 'há 11 min',
    usuario: 'Coach Bret',
  },
  {
    id: '23',
    tipo: 'usuario_online',
    mensagem: '4 agentes ativos em Treino de Glúteo',
    comunidade: 'treino-gluteo',
    timestamp: 'há 12 min',
  },
  {
    id: '24',
    tipo: 'nova_resposta',
    mensagem: 'Amanda contou rotina de exercícios em casa',
    comunidade: 'treino-casa',
    timestamp: 'há 13 min',
    usuario: 'Amanda R.',
  },
  {
    id: '25',
    tipo: 'reacao',
    mensagem: 'Camila apoiou relato sobre compulsão noturna',
    comunidade: 'ansiedade-alimentacao',
    timestamp: 'há 14 min',
    usuario: 'Camila F.',
  },
  {
    id: '26',
    tipo: 'ia_insight',
    mensagem: 'IA: Resumo do painel - 15 membros discutindo canetas',
    comunidade: 'canetas',
    timestamp: 'há 15 min',
  },
  {
    id: '27',
    tipo: 'novo_topico',
    mensagem: 'Luciana perguntou sobre glúteo médio',
    comunidade: 'treino-gluteo',
    timestamp: 'há 16 min',
  },
  {
    id: '28',
    tipo: 'usuario_entrou',
    mensagem: 'Dra. Helena (Premium) entrou',
    comunidade: 'emagrecimento-35-mais',
    timestamp: 'há 17 min',
    usuario: 'Dra. Helena',
  },
  {
    id: '29',
    tipo: 'nova_resposta',
    mensagem: 'Priscila compartilhou dica de marmita',
    comunidade: 'dieta-vida-real',
    timestamp: 'há 18 min',
    usuario: 'Priscila M.',
  },
  {
    id: '30',
    tipo: 'topico_reativado',
    mensagem: 'Discussão sobre caminhada vs corrida reativada',
    comunidade: 'odeia-treinar',
    timestamp: 'há 20 min',
  },
];

// ========================================
// CONFIGURAÇÃO DE ÍCONES E CORES
// ========================================

const EVENTO_CONFIG: Record<EventoTipo, { icon: React.ElementType; color: string; bg: string }> = {
  usuario_entrou: { icon: UserPlus, color: 'text-[#00ff88]', bg: 'bg-[#00ff88]/10' },
  novo_topico: { icon: MessageSquare, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  nova_resposta: { icon: MessageSquare, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  ia_pergunta: { icon: Bot, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ia_insight: { icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  topico_reativado: { icon: RefreshCw, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  usuario_online: { icon: Eye, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  reacao: { icon: Heart, color: 'text-pink-400', bg: 'bg-pink-500/10' },
};

// ========================================
// COMPONENTE: Linha de Evento
// ========================================

function EventoLinha({ evento }: { evento: AtividadeEvento }) {
  const config = EVENTO_CONFIG[evento.tipo];
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-3 py-2.5 px-3 border-b border-zinc-800/50 hover:bg-zinc-900/30 transition-colors">
      {/* Timestamp */}
      <div className="flex-shrink-0 w-16 text-right">
        <span className="text-[10px] font-mono text-zinc-600 uppercase">
          {evento.timestamp}
        </span>
      </div>

      {/* Indicador de Status */}
      <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" />

      {/* Ícone */}
      <div className={`flex-shrink-0 p-1.5 rounded ${config.bg}`}>
        <Icon className={`w-3 h-3 ${config.color}`} />
      </div>

      {/* Mensagem */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-mono text-zinc-300 truncate">
          {evento.mensagem}
        </p>
      </div>

      {/* Badge Comunidade */}
      {evento.comunidade && (
        <div className="flex-shrink-0">
          <span className="text-[9px] font-mono text-zinc-600 uppercase px-1.5 py-0.5 bg-zinc-800/50 rounded">
            {evento.comunidade}
          </span>
        </div>
      )}
    </div>
  );
}

// ========================================
// COMPONENTE PRINCIPAL: LiveActivityTicker
// ========================================

interface LiveActivityTickerProps {
  comunidadeSlug?: string; // Se definido, filtra eventos desta comunidade
  maxItems?: number;
  altura?: 'sm' | 'md' | 'lg';
  titulo?: string;
}

export default function LiveActivityTicker({
  comunidadeSlug,
  maxItems = 8,
  altura = 'md',
  titulo = 'ATIVIDADE AO VIVO',
}: LiveActivityTickerProps) {
  const [eventos, setEventos] = useState<AtividadeEvento[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Altura baseada na prop
  const alturaConfig = {
    sm: 'max-h-[180px]',
    md: 'max-h-[280px]',
    lg: 'max-h-[400px]',
  };

  useEffect(() => {
    // Filtrar eventos se comunidadeSlug estiver definido
    let eventosFiltrados = EVENTOS_MOCK;
    if (comunidadeSlug) {
      eventosFiltrados = EVENTOS_MOCK.filter(
        (e) => e.comunidade === comunidadeSlug || !e.comunidade
      );
    }
    setEventos(eventosFiltrados.slice(0, maxItems));
  }, [comunidadeSlug, maxItems]);

  // Auto-scroll effect
  useEffect(() => {
    if (isPaused || !scrollRef.current) return;

    const scrollElement = scrollRef.current;
    let animationId: number;
    let scrollPosition = 0;

    const scroll = () => {
      if (!scrollElement) return;

      scrollPosition += 0.5;
      if (scrollPosition >= scrollElement.scrollHeight - scrollElement.clientHeight) {
        scrollPosition = 0;
      }
      scrollElement.scrollTop = scrollPosition;
      animationId = requestAnimationFrame(scroll);
    };

    // Iniciar após 2s de delay
    const timeoutId = setTimeout(() => {
      animationId = requestAnimationFrame(scroll);
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [isPaused, eventos]);

  return (
    <div className="bg-zinc-900/70 backdrop-blur-sm border border-zinc-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-2 h-2 rounded-full bg-[#00ff88]" />
            <div className="absolute inset-0 w-2 h-2 rounded-full bg-[#00ff88] animate-ping" />
          </div>
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
            {titulo}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-3 h-3 text-zinc-600" />
          <span className="text-[10px] font-mono text-zinc-600">
            ATUALIZAÇÃO AUTOMÁTICA
          </span>
        </div>
      </div>

      {/* Feed de Eventos */}
      <div
        ref={scrollRef}
        className={`${alturaConfig[altura]} overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Duplicar eventos para efeito de loop */}
        {[...eventos, ...eventos].map((evento, index) => (
          <EventoLinha key={`${evento.id}-${index}`} evento={evento} />
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-zinc-800 bg-zinc-900/50 flex items-center justify-center gap-2">
        <TrendingUp className="w-3 h-3 text-[#00ff88]" />
        <span className="text-[10px] font-mono text-zinc-600 uppercase">
          {eventos.length} eventos recentes
        </span>
      </div>
    </div>
  );
}
