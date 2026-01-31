/**
 * FPExplanation - Componente de explicacao do sistema de FP
 *
 * Explica de forma clara e visual como funciona o sistema de pontos,
 * como ganhar FP e como converter em desconto.
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  HelpCircle,
  Target,
  Flame,
  Gift,
  Clock,
  Shield,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  AlertTriangle,
  Calendar,
  Star,
} from 'lucide-react';
import { FP_CONFIG } from '@/lib/fp/config';
import { FPIcon } from './FPIcon';

// Configuracao das acoes com valores do config
const ACTIONS = [
  {
    id: 'daily',
    icon: Calendar,
    label: 'Acesso Diario',
    description: 'Entre no chat pelo menos uma vez ao dia',
    fp: FP_CONFIG.DAILY_ACCESS,
    frequency: '1x por dia',
    color: 'amber',
  },
  {
    id: 'message',
    icon: MessageSquare,
    label: 'Enviar Mensagem',
    description: 'Participe das discussoes com mensagens relevantes',
    fp: FP_CONFIG.CHAT_MESSAGE,
    frequency: `Max ${FP_CONFIG.MAX_FP_PER_DAY_CHAT} FP/dia`,
    color: 'emerald',
  },
  {
    id: 'question',
    icon: HelpCircle,
    label: 'Fazer Pergunta',
    description: 'Faca perguntas terminadas em "?" para tirar duvidas',
    fp: FP_CONFIG.CHAT_QUESTION,
    frequency: 'Bonus por curiosidade',
    color: 'cyan',
  },
  {
    id: 'long',
    icon: TrendingUp,
    label: 'Mensagem Detalhada',
    description: 'Mensagens com 100+ caracteres ganham bonus extra',
    fp: FP_CONFIG.CHAT_MESSAGE_LONG_BONUS,
    frequency: 'Bonus adicional',
    color: 'purple',
  },
  {
    id: 'arena',
    icon: Target,
    label: 'Criar Arena',
    description: 'Crie uma nova arena de discussao para a comunidade',
    fp: FP_CONFIG.CREATE_ARENA,
    frequency: 'Acao rara e valiosa',
    color: 'pink',
  },
  {
    id: 'streak30',
    icon: Flame,
    label: 'Streak de 30 Dias',
    description: 'Complete 30 dias consecutivos de participacao',
    fp: FP_CONFIG.STREAK_30_DAYS_BONUS,
    frequency: 'Bonus unico',
    color: 'orange',
  },
];

// Regras de conversao
const CONVERSION_RULES = [
  {
    fp: FP_CONFIG.MIN_FP_TO_REDEEM,
    discount: Math.floor(FP_CONFIG.MIN_FP_TO_REDEEM / FP_CONFIG.FP_PER_PERCENT),
  },
  { fp: 200, discount: 10 },
  { fp: 400, discount: 20 },
  { fp: 600, discount: FP_CONFIG.MAX_DISCOUNT_PERCENT },
];

// Regras importantes
const RULES = [
  {
    icon: Clock,
    title: 'Cooldown de mensagens',
    description: `Espere ${FP_CONFIG.MESSAGE_COOLDOWN_MS / 1000} segundos entre mensagens que dao FP`,
  },
  {
    icon: Shield,
    title: 'Limite diario',
    description: `Maximo de ${FP_CONFIG.MAX_FP_PER_DAY_CHAT} FP por dia no chat`,
  },
  {
    icon: AlertTriangle,
    title: 'Inatividade',
    description: `${FP_CONFIG.INACTIVITY_DAYS} dias sem atividade zeram seu saldo`,
  },
];

interface FPExplanationProps {
  currentBalance?: number;
  currentStreak?: number;
}

export function FPExplanation({ currentBalance = 0, currentStreak = 0 }: FPExplanationProps) {
  const currentDiscount = Math.min(
    Math.floor(currentBalance / FP_CONFIG.FP_PER_PERCENT),
    FP_CONFIG.MAX_DISCOUNT_PERCENT
  );

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-orange-500/30">
          <FPIcon size={48} animated glow />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">
          Sistema de <span className="text-amber-400">Fitness Points</span>
        </h1>
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
          Ganhe FP participando da comunidade e converta em <strong className="text-emerald-400">desconto real</strong> na assinatura do app.
        </p>
      </motion.div>

      {/* Status atual */}
      {currentBalance > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20"
        >
          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="text-center">
              <p className="text-sm text-amber-400/70 mb-1">Seu saldo</p>
              <p className="text-3xl font-bold text-white">{currentBalance.toLocaleString()} <span className="text-lg text-amber-400">FP</span></p>
            </div>
            <div className="hidden sm:block w-px h-12 bg-zinc-700" />
            <div className="text-center">
              <p className="text-sm text-orange-400/70 mb-1">Streak atual</p>
              <p className="text-3xl font-bold text-white">{currentStreak} <span className="text-lg text-orange-400">dias</span></p>
            </div>
            <div className="hidden sm:block w-px h-12 bg-zinc-700" />
            <div className="text-center">
              <p className="text-sm text-emerald-400/70 mb-1">Desconto disponivel</p>
              <p className="text-3xl font-bold text-emerald-400">{currentDiscount}%</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Como ganhar FP */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-400" />
          Como Ganhar FP
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ACTIONS.map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="group p-5 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center shrink-0
                  ${action.color === 'amber' ? 'bg-amber-500/10 text-amber-400' : ''}
                  ${action.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400' : ''}
                  ${action.color === 'cyan' ? 'bg-cyan-500/10 text-cyan-400' : ''}
                  ${action.color === 'purple' ? 'bg-purple-500/10 text-purple-400' : ''}
                  ${action.color === 'pink' ? 'bg-pink-500/10 text-pink-400' : ''}
                  ${action.color === 'orange' ? 'bg-orange-500/10 text-orange-400' : ''}
                `}>
                  <action.icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-white truncate">{action.label}</h3>
                    <span className="text-lg font-bold text-amber-400 whitespace-nowrap">+{action.fp}</span>
                  </div>
                  <p className="text-sm text-zinc-400 mb-2">{action.description}</p>
                  <p className="text-xs text-zinc-500">{action.frequency}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Conversao para desconto */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Gift className="w-5 h-5 text-emerald-400" />
          Conversao para Desconto
        </h2>

        <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800">
          {/* Formula */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8 p-4 rounded-xl bg-zinc-800/50">
            <div className="flex items-center gap-2">
              <FPIcon size={24} />
              <span className="text-lg font-bold text-white">{FP_CONFIG.FP_PER_PERCENT} FP</span>
            </div>
            <ArrowRight className="w-5 h-5 text-zinc-500" />
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="text-lg font-bold text-emerald-400">1% de desconto</span>
            </div>
          </div>

          {/* Tabela de conversao */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {CONVERSION_RULES.map((rule, index) => (
              <motion.div
                key={rule.fp}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className={`
                  p-4 rounded-xl text-center
                  ${currentBalance >= rule.fp
                    ? 'bg-emerald-500/10 border border-emerald-500/30'
                    : 'bg-zinc-800/50 border border-zinc-700/50'
                  }
                `}
              >
                <p className="text-2xl font-bold text-white mb-1">{rule.discount}%</p>
                <p className={`text-sm ${currentBalance >= rule.fp ? 'text-emerald-400' : 'text-zinc-500'}`}>
                  {rule.fp} FP
                </p>
                {currentBalance >= rule.fp && (
                  <p className="text-xs text-emerald-400/70 mt-1">Disponivel!</p>
                )}
              </motion.div>
            ))}
          </div>

          {/* Limite maximo */}
          <p className="text-center text-sm text-zinc-500 mt-6">
            Desconto maximo: <strong className="text-amber-400">{FP_CONFIG.MAX_DISCOUNT_PERCENT}%</strong> •
            Minimo para resgatar: <strong className="text-amber-400">{FP_CONFIG.MIN_FP_TO_REDEEM} FP</strong>
          </p>
        </div>
      </motion.section>

      {/* Regras importantes */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Shield className="w-5 h-5 text-cyan-400" />
          Regras Importantes
        </h2>

        <div className="grid gap-4 sm:grid-cols-3">
          {RULES.map((rule, index) => (
            <motion.div
              key={rule.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + index * 0.1 }}
              className="p-5 rounded-xl bg-zinc-900/80 border border-zinc-800"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                  <rule.icon className="w-5 h-5 text-zinc-400" />
                </div>
                <h3 className="font-semibold text-white">{rule.title}</h3>
              </div>
              <p className="text-sm text-zinc-400">{rule.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Fluxo de valor */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-400" />
          O Ciclo de Valor
        </h2>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20">
          <div className="flex flex-wrap items-center justify-center gap-4 text-center">
            {[
              { label: 'Chat', emoji: '💬', color: 'text-emerald-400' },
              { label: 'Conhecimento', emoji: '📚', color: 'text-cyan-400' },
              { label: 'App', emoji: '📱', color: 'text-purple-400' },
              { label: 'Resultados', emoji: '🎯', color: 'text-pink-400' },
              { label: 'Desconto', emoji: '💰', color: 'text-amber-400' },
            ].map((step, index) => (
              <React.Fragment key={step.label}>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-3xl">{step.emoji}</span>
                  <span className={`font-medium ${step.color}`}>{step.label}</span>
                </div>
                {index < 4 && (
                  <ArrowRight className="w-5 h-5 text-zinc-600 hidden sm:block" />
                )}
              </React.Fragment>
            ))}
          </div>
          <p className="text-center text-sm text-zinc-500 mt-6">
            Participe da comunidade, aprenda, aplique no app, veja resultados e ganhe desconto para continuar evoluindo!
          </p>
        </div>
      </motion.section>

      {/* CTA final */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <a
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-orange-500/30"
        >
          <MessageSquare className="w-5 h-5" />
          Comecar a Participar
        </a>
        <p className="text-sm text-zinc-500 mt-4">
          Volte para as comunidades e comece a ganhar FP agora!
        </p>
      </motion.div>
    </div>
  );
}

export default FPExplanation;
