'use client';

/**
 * ChatInput Component - Game-Changing Premium Design
 * ===================================================
 *
 * Input de chat com design premium e gamificação
 * UX viciante com micro-interações e feedback visual
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Mic,
  Image,
  Sparkles,
  Zap,
  Flame,
  Star,
  Crown,
  Gift,
  Target,
  TrendingUp,
} from 'lucide-react';

// ========================================
// TIPOS
// ========================================

export interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
  streak?: number;
  dailyMessages?: number;
  dailyLimit?: number;
  fpBalance?: number;
  placeholder?: string;
  disabled?: boolean;
}

// ========================================
// STREAK BADGE
// ========================================

function StreakBadge({ streak }: { streak: number }) {
  if (streak < 2) return null;

  const getStreakLevel = () => {
    if (streak >= 30) return { color: 'from-amber-400 to-orange-500', icon: Crown, label: 'Lendário' };
    if (streak >= 14) return { color: 'from-purple-500 to-pink-500', icon: Star, label: 'Épico' };
    if (streak >= 7) return { color: 'from-nfc-cyan to-nfc-violet', icon: Zap, label: 'Incrível' };
    return { color: 'from-nfc-neon to-nfc-emerald', icon: Flame, label: 'Em fogo' };
  };

  const { color, icon: Icon, label } = getStreakLevel();

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
        bg-gradient-to-r ${color} text-white text-xs font-bold
        shadow-lg
      `}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{streak} dias</span>
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        🔥
      </motion.div>
    </motion.div>
  );
}

// ========================================
// FP BALANCE DISPLAY
// ========================================

function FPBalance({ balance }: { balance: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800/80 border border-zinc-700"
    >
      <div className="w-5 h-5 rounded-full bg-nfc-neon/20 flex items-center justify-center">
        <Zap className="w-3 h-3 text-nfc-neon" />
      </div>
      <span className="text-sm font-bold text-white">{balance.toLocaleString()}</span>
      <span className="text-xs text-zinc-500">FP</span>
    </motion.div>
  );
}

// ========================================
// DAILY PROGRESS
// ========================================

function DailyProgress({ current, total }: { current: number; total: number }) {
  const percentage = Math.min((current / total) * 100, 100);
  const remaining = total - current;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <Target className="w-4 h-4 text-zinc-500" />
        <div className="w-24 h-2 bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="h-full bg-gradient-to-r from-nfc-cyan to-nfc-violet rounded-full"
          />
        </div>
      </div>
      <span className="text-xs text-zinc-500">
        {remaining > 0 ? `${remaining} restantes` : 'Meta atingida! 🎉'}
      </span>
    </div>
  );
}

// ========================================
// QUICK ACTIONS
// ========================================

function QuickActions({ onSelect }: { onSelect: (text: string) => void }) {
  const actions = [
    { icon: '🍎', label: 'O que comer?' },
    { icon: '💪', label: 'Treino de hoje' },
    { icon: '💧', label: 'Meta de água' },
    { icon: '😴', label: 'Dicas de sono' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="flex items-center gap-2 pb-3 overflow-x-auto scrollbar-hide"
    >
      {actions.map((action) => (
        <motion.button
          key={action.label}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(action.label)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 transition-all whitespace-nowrap"
        >
          <span className="text-lg">{action.icon}</span>
          <span className="text-sm text-zinc-300">{action.label}</span>
        </motion.button>
      ))}
    </motion.div>
  );
}

// ========================================
// COMPONENTE PRINCIPAL
// ========================================

export default function ChatInput({
  onSend,
  isLoading = false,
  streak = 0,
  dailyMessages = 0,
  dailyLimit = 50,
  fpBalance = 0,
  placeholder = 'Pergunte algo à sua NutriCoach IA...',
  disabled = false,
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [message]);

  const handleSend = () => {
    if (!message.trim() || isLoading || disabled) return;
    onSend(message.trim());
    setMessage('');
    setShowQuickActions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = (text: string) => {
    setMessage(text);
    textareaRef.current?.focus();
  };

  const canSend = message.trim().length > 0 && !isLoading && !disabled;

  return (
    <div className="border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-xl">
      {/* Top Bar - Stats */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/50">
        <div className="flex items-center gap-4">
          <StreakBadge streak={streak} />
          <DailyProgress current={dailyMessages} total={dailyLimit} />
        </div>
        <FPBalance balance={fpBalance} />
      </div>

      {/* Quick Actions */}
      <AnimatePresence>
        {showQuickActions && dailyMessages === 0 && (
          <div className="px-4 pt-3">
            <QuickActions onSelect={handleQuickAction} />
          </div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="p-4">
        <motion.div
          animate={{
            boxShadow: isFocused
              ? '0 0 0 2px rgba(0, 255, 136, 0.3), 0 0 30px rgba(0, 255, 136, 0.1)'
              : 'none',
          }}
          className={`
            relative flex items-end gap-3 p-3 rounded-2xl
            bg-zinc-900 border transition-all duration-200
            ${isFocused ? 'border-nfc-neon/50' : 'border-zinc-800'}
          `}
        >
          {/* Attachment Button */}
          <button
            className="p-2 rounded-xl text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-all"
            title="Adicionar imagem"
          >
            <Image className="w-5 h-5" />
          </button>

          {/* Text Input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              disabled={disabled || isLoading}
              rows={1}
              className="
                w-full bg-transparent text-white placeholder-zinc-600
                resize-none outline-none text-sm leading-relaxed
                max-h-[150px] scrollbar-thin scrollbar-thumb-zinc-700
              "
            />

            {/* Character counter for long messages */}
            {message.length > 200 && (
              <span className="absolute bottom-0 right-0 text-xs text-zinc-600">
                {message.length}/500
              </span>
            )}
          </div>

          {/* Voice Button */}
          <button
            className="p-2 rounded-xl text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-all"
            title="Mensagem de voz"
          >
            <Mic className="w-5 h-5" />
          </button>

          {/* Send Button */}
          <motion.button
            whileHover={{ scale: canSend ? 1.05 : 1 }}
            whileTap={{ scale: canSend ? 0.95 : 1 }}
            onClick={handleSend}
            disabled={!canSend}
            className={`
              relative p-3 rounded-xl transition-all duration-200
              ${canSend
                ? 'bg-nfc-neon text-black shadow-nfc-neon hover:bg-nfc-neon-400'
                : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
              }
            `}
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-5 h-5" />
              </motion.div>
            ) : (
              <Send className="w-5 h-5" />
            )}

            {/* Pulse effect when ready to send */}
            {canSend && !isLoading && (
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 rounded-xl bg-nfc-neon"
              />
            )}
          </motion.button>
        </motion.div>

        {/* Helper Text */}
        <div className="flex items-center justify-between mt-2 px-1">
          <p className="text-xs text-zinc-600">
            Pressione Enter para enviar, Shift+Enter para nova linha
          </p>
          {streak >= 7 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-nfc-neon flex items-center gap-1"
            >
              <Gift className="w-3 h-3" />
              Bônus de streak ativo!
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
}
