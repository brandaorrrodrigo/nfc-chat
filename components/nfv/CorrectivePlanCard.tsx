'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Loader2, RefreshCw, Calendar, Target, Dumbbell, TrendingUp } from 'lucide-react';

// ============================
// Types (match corrective-plan-generator.ts)
// ============================

interface PlannedExercise {
  nome: string;
  objetivo: string;
  series: string;
  frequencia: string;
  execucao: string[];
  progressao: string;
  desvio_alvo: string;
}

interface WeekPlan {
  semana: number;
  foco: string;
  dias_treino: number;
  exercicios: PlannedExercise[];
  objetivo_semanal: string;
}

interface CriterionSummary {
  criterio: string;
  nivel: 'warning' | 'danger';
  valor: string;
  causa_provavel: string;
  rag_fonte: string;
}

interface CorrectivePlan {
  plano_id: string;
  gerado_em: string;
  criterios_alerta: CriterionSummary[];
  semanas: WeekPlan[];
  meta_reteste: string;
  observacoes_gerais: string;
}

// ============================
// Component Props
// ============================

interface CorrectivePlanCardProps {
  plan?: CorrectivePlan | null;
  onGeneratePlan?: () => void;
  loading?: boolean;
  error?: string | null;
}

// ============================
// Sub-components
// ============================

function CriterionBadge({ criterion }: { criterion: CriterionSummary }) {
  const isDanger = criterion.nivel === 'danger';
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs ${
      isDanger
        ? 'bg-red-500/10 border border-red-500/20 text-red-400'
        : 'bg-orange-500/10 border border-orange-500/20 text-orange-400'
    }`}>
      <span>{isDanger ? '\u{1F534}' : '\u{1F7E1}'}</span>
      <span className="font-medium">{criterion.criterio}</span>
      <span className="text-zinc-500">|</span>
      <span>{criterion.valor}</span>
      <span className={`text-[10px] uppercase font-bold ${isDanger ? 'text-red-500' : 'text-orange-500'}`}>
        {isDanger ? 'PERIGO' : 'ALERTA'}
      </span>
    </div>
  );
}

function ExerciseCard({ exercise }: { exercise: PlannedExercise }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-zinc-800/40 rounded-lg p-3 border border-zinc-700/50">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Dumbbell className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
          <span className="text-sm text-zinc-200 font-medium truncate">{exercise.nome}</span>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 ml-2">
          <span className="text-xs text-green-400 font-mono">{exercise.series}</span>
          <span className="text-xs text-purple-400">{exercise.frequencia}</span>
          {expanded
            ? <ChevronUp className="w-3.5 h-3.5 text-zinc-500" />
            : <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
          }
        </div>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-zinc-700/50 space-y-2">
          {exercise.objetivo && (
            <p className="text-xs text-zinc-400">
              <span className="text-zinc-500">Objetivo:</span> {exercise.objetivo}
            </p>
          )}

          {exercise.execucao?.length > 0 && (
            <div>
              <p className="text-xs text-zinc-500 mb-1">Execucao:</p>
              <ol className="space-y-0.5 ml-3">
                {exercise.execucao.map((step, i) => (
                  <li key={i} className="text-xs text-zinc-300 list-decimal">
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {exercise.progressao && (
            <div className="flex items-start gap-1.5 mt-1">
              <TrendingUp className="w-3 h-3 text-yellow-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-yellow-400/80">{exercise.progressao}</p>
            </div>
          )}

          {exercise.desvio_alvo && (
            <p className="text-[10px] text-zinc-600">
              Corrige: {exercise.desvio_alvo}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function WeekSection({ week }: { week: WeekPlan }) {
  const [open, setOpen] = useState(week.exercicios.length > 0);

  const weekColor = week.semana <= 2
    ? 'border-blue-500/30 bg-blue-500/5'
    : 'border-green-500/30 bg-green-500/5';

  const weekBadgeColor = week.semana <= 2
    ? 'bg-blue-500/20 text-blue-400'
    : 'bg-green-500/20 text-green-400';

  return (
    <div className={`rounded-xl border ${weekColor} overflow-hidden`}>
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-zinc-800/30 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-3">
          <span className={`text-xs font-bold px-2 py-0.5 rounded ${weekBadgeColor}`}>
            Sem {week.semana}
          </span>
          <span className="text-sm text-zinc-200 font-medium">{week.foco}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-500">{week.dias_treino}x/sem</span>
          <span className="text-xs text-zinc-500">{week.exercicios.length} exerc.</span>
          {open
            ? <ChevronUp className="w-4 h-4 text-zinc-500" />
            : <ChevronDown className="w-4 h-4 text-zinc-500" />
          }
        </div>
      </div>

      {open && (
        <div className="px-4 pb-4 space-y-2">
          {week.objetivo_semanal && (
            <p className="text-xs text-zinc-400 italic mb-3">
              {week.objetivo_semanal}
            </p>
          )}
          {week.exercicios.map((ex, i) => (
            <ExerciseCard key={i} exercise={ex} />
          ))}
        </div>
      )}
    </div>
  );
}

// ============================
// Main Component
// ============================

export default function CorrectivePlanCard({
  plan,
  onGeneratePlan,
  loading = false,
  error = null,
}: CorrectivePlanCardProps) {
  // Estado: sem plano, mostrar botao para gerar
  if (!plan && !loading) {
    return (
      <div className="bg-zinc-900/50 rounded-xl p-5 border border-zinc-800">
        <div className="flex items-center gap-2 text-sm font-medium text-white mb-3">
          <Calendar className="w-4 h-4 text-indigo-400" />
          Plano Corretivo Personalizado
        </div>

        {error && (
          <p className="text-xs text-red-400 mb-3">{error}</p>
        )}

        <p className="text-xs text-zinc-400 mb-4">
          Gere um plano de 4 semanas com exercicios corretivos baseados nos problemas identificados na analise.
        </p>

        {onGeneratePlan && (
          <button
            onClick={onGeneratePlan}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600/20 border border-indigo-600/30 text-indigo-300 text-sm hover:bg-indigo-600/30 transition-colors"
          >
            <Target className="w-4 h-4" />
            Gerar Plano Corretivo
          </button>
        )}
      </div>
    );
  }

  // Estado: carregando
  if (loading) {
    return (
      <div className="bg-zinc-900/50 rounded-xl p-5 border border-zinc-800">
        <div className="flex items-center gap-2 text-sm font-medium text-white mb-3">
          <Calendar className="w-4 h-4 text-indigo-400" />
          Plano Corretivo Personalizado
        </div>
        <div className="flex items-center gap-3 py-4">
          <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
          <div>
            <p className="text-sm text-zinc-300">Gerando plano corretivo...</p>
            <p className="text-xs text-zinc-500 mt-0.5">Consultando RAG e organizando exercicios (pode levar ate 60s)</p>
          </div>
        </div>
      </div>
    );
  }

  // Estado: plano vazio (sem problemas)
  if (plan && plan.semanas.length === 0) {
    return (
      <div className="bg-zinc-900/50 rounded-xl p-5 border border-zinc-800">
        <div className="flex items-center gap-2 text-sm font-medium text-white mb-3">
          <Calendar className="w-4 h-4 text-green-400" />
          Plano Corretivo
        </div>
        <p className="text-sm text-green-400">{plan.observacoes_gerais}</p>
      </div>
    );
  }

  if (!plan) return null;

  // Estado: plano completo
  return (
    <div className="bg-zinc-900/50 rounded-xl p-5 border border-zinc-800 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-white">
          <Calendar className="w-4 h-4 text-indigo-400" />
          Plano Corretivo Personalizado (4 semanas)
        </div>
        {onGeneratePlan && (
          <button
            onClick={onGeneratePlan}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-indigo-400 hover:bg-zinc-800 transition-colors"
            title="Regenerar plano"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Criterios identificados */}
      {plan.criterios_alerta.length > 0 && (
        <div>
          <p className="text-xs text-zinc-500 mb-2">Problemas identificados:</p>
          <div className="flex flex-wrap gap-2">
            {plan.criterios_alerta.map((c, i) => (
              <CriterionBadge key={i} criterion={c} />
            ))}
          </div>
        </div>
      )}

      {/* Semanas */}
      <div className="space-y-3">
        {plan.semanas.map((week, i) => (
          <WeekSection key={i} week={week} />
        ))}
      </div>

      {/* Meta de reteste + botão Schedule */}
      <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
        <div className="flex items-start gap-2">
          <RefreshCw className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-indigo-300 font-medium">{plan.meta_reteste}</p>
            <p className="text-xs text-zinc-500 mt-1">{plan.observacoes_gerais}</p>
          </div>
        </div>
        <button
          onClick={() => {
            const retestDate = new Date();
            retestDate.setDate(retestDate.getDate() + 28);
            const formatted = retestDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
            if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
              new Notification('Lembrete de Reteste', {
                body: `Hora de reavaliar! Data sugerida: ${formatted}`,
                icon: '/favicon.ico',
              });
            }
            alert(`Reteste agendado para ${formatted} (4 semanas a partir de hoje).\n\nLembre-se de gravar um novo vídeo para comparar a evolução.`);
          }}
          className="mt-3 flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600/20 border border-indigo-600/30 text-indigo-300 text-xs font-medium hover:bg-indigo-600/30 transition-colors w-full justify-center"
        >
          <Calendar className="w-3.5 h-3.5" />
          Agendar Reteste (4 semanas)
        </button>
      </div>

      {/* Metadata */}
      <p className="text-[10px] text-zinc-600 text-right">
        Gerado em {new Date(plan.gerado_em).toLocaleDateString('pt-BR')}
      </p>
    </div>
  );
}
