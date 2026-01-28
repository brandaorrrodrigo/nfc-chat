'use client';

/**
 * ChatMessage Component - Premium Design
 * ======================================
 *
 * Mensagens de chat com design premium e animações
 * UX viciante para público feminino
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  Bot,
  Sparkles,
  Heart,
  Bookmark,
  Copy,
  Check,
  Share2,
  ThumbsUp,
  ThumbsDown,
  Zap,
  Crown,
} from 'lucide-react';

// ========================================
// TIPOS
// ========================================

export interface ChatMessageProps {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isTyping?: boolean;
  reactions?: {
    liked?: boolean;
    saved?: boolean;
  };
  fpReward?: number;
  isStreakBonus?: boolean;
  onReaction?: (messageId: string, type: 'like' | 'save' | 'copy' | 'share') => void;
}

// ========================================
// AVATAR IA PREMIUM
// ========================================

function AIAvatar() {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="relative flex-shrink-0"
    >
      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-nfc-neon/30 via-nfc-cyan/20 to-nfc-violet/20 border border-nfc-neon/40 flex items-center justify-center shadow-nfc-neon">
        <Bot className="w-5 h-5 text-nfc-neon" />
      </div>
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute -top-1 -right-1 w-4 h-4 bg-nfc-neon rounded-full flex items-center justify-center shadow-nfc-neon"
      >
        <Sparkles className="w-2.5 h-2.5 text-black" />
      </motion.div>
    </motion.div>
  );
}

// ========================================
// USER AVATAR
// ========================================

function UserAvatar({ name }: { name?: string }) {
  const initial = name?.charAt(0)?.toUpperCase() || 'U';

  return (
    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-nfc-violet to-nfc-cyan flex items-center justify-center flex-shrink-0">
      <span className="text-white font-bold text-sm">{initial}</span>
    </div>
  );
}

// ========================================
// TYPING INDICATOR
// ========================================

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -6, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.15,
          }}
          className="w-2 h-2 rounded-full bg-nfc-neon/60"
        />
      ))}
    </div>
  );
}

// ========================================
// FP REWARD BADGE
// ========================================

function FPRewardBadge({ amount, isBonus }: { amount: number; isBonus?: boolean }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', delay: 0.5 }}
      className={`
        inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold
        ${isBonus
          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
          : 'bg-nfc-neon/20 text-nfc-neon border border-nfc-neon/30'
        }
      `}
    >
      {isBonus ? <Crown className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
      +{amount} FP
      {isBonus && <Sparkles className="w-3 h-3" />}
    </motion.div>
  );
}

// ========================================
// MESSAGE ACTIONS
// ========================================

function MessageActions({
  messageId,
  reactions,
  onReaction
}: {
  messageId: string;
  reactions?: { liked?: boolean; saved?: boolean };
  onReaction?: (messageId: string, type: 'like' | 'save' | 'copy' | 'share') => void;
}) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    setCopied(true);
    onReaction?.(messageId, 'copy');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex items-center gap-1 mt-3"
    >
      <button
        onClick={() => onReaction?.(messageId, 'like')}
        className={`
          p-2 rounded-xl transition-all duration-200
          ${reactions?.liked
            ? 'bg-pink-500/20 text-pink-400'
            : 'hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300'
          }
        `}
      >
        <Heart className={`w-4 h-4 ${reactions?.liked ? 'fill-current' : ''}`} />
      </button>

      <button
        onClick={() => onReaction?.(messageId, 'save')}
        className={`
          p-2 rounded-xl transition-all duration-200
          ${reactions?.saved
            ? 'bg-nfc-cyan/20 text-nfc-cyan'
            : 'hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300'
          }
        `}
      >
        <Bookmark className={`w-4 h-4 ${reactions?.saved ? 'fill-current' : ''}`} />
      </button>

      <button
        onClick={handleCopy}
        className="p-2 rounded-xl hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-all"
      >
        {copied ? <Check className="w-4 h-4 text-nfc-neon" /> : <Copy className="w-4 h-4" />}
      </button>

      <button
        onClick={() => onReaction?.(messageId, 'share')}
        className="p-2 rounded-xl hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-all"
      >
        <Share2 className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

// ========================================
// COMPONENTE PRINCIPAL
// ========================================

export default function ChatMessage({
  id,
  content,
  role,
  timestamp,
  isTyping,
  reactions,
  fpReward,
  isStreakBonus,
  onReaction,
}: ChatMessageProps) {
  const isAssistant = role === 'assistant';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', damping: 25 }}
      className={`
        flex gap-3 py-4 px-4
        ${isAssistant ? 'bg-zinc-900/30' : ''}
      `}
    >
      {/* Avatar */}
      {isAssistant ? <AIAvatar /> : <UserAvatar />}

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <span className={`
            font-semibold text-sm
            ${isAssistant ? 'text-nfc-neon' : 'text-white'}
          `}>
            {isAssistant ? 'NutriCoach IA' : 'Você'}
          </span>

          <span className="text-xs text-zinc-600">
            {timestamp.toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>

          {fpReward && (
            <FPRewardBadge amount={fpReward} isBonus={isStreakBonus} />
          )}
        </div>

        {/* Message Content */}
        {isTyping ? (
          <TypingIndicator />
        ) : (
          <div className={`
            relative rounded-2xl p-4
            ${isAssistant
              ? 'bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 border border-nfc-neon/10'
              : 'bg-gradient-to-br from-nfc-violet/20 to-nfc-cyan/10 border border-nfc-violet/20'
            }
          `}>
            {/* Glow effect for assistant */}
            {isAssistant && (
              <div className="absolute inset-0 rounded-2xl bg-nfc-neon/5 blur-xl -z-10" />
            )}

            <p className="text-zinc-200 text-sm leading-relaxed whitespace-pre-wrap">
              {content}
            </p>
          </div>
        )}

        {/* Actions - only for assistant messages */}
        {isAssistant && !isTyping && (
          <MessageActions
            messageId={id}
            reactions={reactions}
            onReaction={onReaction}
          />
        )}
      </div>
    </motion.div>
  );
}

// ========================================
// WELCOME MESSAGE
// ========================================

export function WelcomeMessage({ userName }: { userName?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', delay: 0.2 }}
      className="text-center py-12 px-6"
    >
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          rotate: [0, 2, -2, 0]
        }}
        transition={{ duration: 3, repeat: Infinity }}
        className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-nfc-neon/30 via-nfc-cyan/20 to-nfc-violet/20 border border-nfc-neon/40 flex items-center justify-center shadow-nfc-neon"
      >
        <Bot className="w-10 h-10 text-nfc-neon" />
      </motion.div>

      <h2 className="text-2xl font-bold text-white mb-2">
        Olá{userName ? `, ${userName}` : ''}! ✨
      </h2>

      <p className="text-zinc-400 max-w-md mx-auto mb-6">
        Sou sua NutriCoach IA, pronta para ajudar você a alcançar seus objetivos
        de saúde e bem-estar. Pergunte qualquer coisa!
      </p>

      <div className="flex flex-wrap justify-center gap-2">
        {['💪 Treino', '🥗 Nutrição', '😴 Sono', '🧘 Bem-estar'].map((topic) => (
          <motion.button
            key={topic}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm border border-zinc-700 hover:border-zinc-600 transition-all"
          >
            {topic}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
