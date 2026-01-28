'use client';

/**
 * ChatLayout Component - Premium Chat Interface
 * ==============================================
 *
 * Layout principal do chat com header unificado
 * Integra todos os componentes premium
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PanelRightOpen,
  PanelRightClose,
  Sparkles,
  MoreVertical,
  Trash2,
  RefreshCw,
  Settings,
} from 'lucide-react';
import UniversalHeader, { UniversalUser } from '@/components/shared/UniversalHeader';
import ChatMessage, { WelcomeMessage, ChatMessageProps } from './ChatMessage';
import ChatInput from './ChatInput';
import InsightsPanel, { UserStats } from './InsightsPanel';

// ========================================
// TIPOS
// ========================================

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  reactions?: {
    liked?: boolean;
    saved?: boolean;
  };
  fpReward?: number;
  isStreakBonus?: boolean;
}

export interface ChatLayoutProps {
  user?: UniversalUser | null;
  isLoading?: boolean;
  onLogout?: () => void;
}

// ========================================
// MOCK DATA
// ========================================

const mockStats: UserStats = {
  streak: 15,
  totalMessages: 342,
  totalFP: 12580,
  level: 8,
  xpToNextLevel: 5000,
  currentXp: 3250,
  savedMessages: 28,
  likedMessages: 156,
  weeklyGoalProgress: 71,
  badges: [
    { id: '1', name: 'Primeira Conversa', description: 'Iniciou sua jornada', icon: '🌟', unlocked: true, rarity: 'common' },
    { id: '2', name: 'Streak de 7 dias', description: '7 dias consecutivos', icon: '🔥', unlocked: true, rarity: 'rare' },
    { id: '3', name: 'Exploradora', description: '100 mensagens', icon: '🧭', unlocked: true, rarity: 'common' },
    { id: '4', name: 'Streak de 14 dias', description: '14 dias consecutivos', icon: '💎', unlocked: true, rarity: 'epic' },
    { id: '5', name: 'Entusiasta', description: '250 mensagens', icon: '💪', unlocked: true, rarity: 'rare' },
    { id: '6', name: 'Colecionadora', description: '20 msgs salvas', icon: '📚', unlocked: true, rarity: 'common' },
    { id: '7', name: 'Streak de 30 dias', description: '30 dias consecutivos', icon: '👑', unlocked: false, rarity: 'legendary' },
    { id: '8', name: 'Mestre', description: '500 mensagens', icon: '🏆', unlocked: false, rarity: 'legendary' },
  ],
};

// ========================================
// CHAT HEADER
// ========================================

function ChatHeader({
  onTogglePanel,
  isPanelOpen,
}: {
  onTogglePanel: () => void;
  isPanelOpen: boolean;
}) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-10 h-10 rounded-2xl bg-gradient-to-br from-nfc-neon/30 via-nfc-cyan/20 to-nfc-violet/20 border border-nfc-neon/40 flex items-center justify-center"
        >
          <Sparkles className="w-5 h-5 text-nfc-neon" />
        </motion.div>
        <div>
          <h1 className="text-sm font-bold text-white">NutriCoach IA</h1>
          <p className="text-xs text-nfc-neon flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-nfc-neon animate-pulse" />
            Online agora
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Menu Button */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-xl hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-48 py-2 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl z-50"
              >
                <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors">
                  <RefreshCw className="w-4 h-4" />
                  Nova conversa
                </button>
                <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors">
                  <Settings className="w-4 h-4" />
                  Configurações
                </button>
                <hr className="my-2 border-zinc-800" />
                <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-zinc-800 transition-colors">
                  <Trash2 className="w-4 h-4" />
                  Limpar histórico
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Panel Toggle */}
        <button
          onClick={onTogglePanel}
          className="p-2 rounded-xl hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all"
        >
          {isPanelOpen ? (
            <PanelRightClose className="w-5 h-5" />
          ) : (
            <PanelRightOpen className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}

// ========================================
// COMPONENTE PRINCIPAL
// ========================================

export default function ChatLayout({ user, isLoading, onLogout }: ChatLayoutProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Handle send message
  const handleSend = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Simulate AI response
    setIsTyping(true);

    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(content),
        role: 'assistant',
        timestamp: new Date(),
        fpReward: Math.random() > 0.5 ? 10 : undefined,
        isStreakBonus: mockStats.streak >= 7 && Math.random() > 0.7,
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  // Handle reactions
  const handleReaction = (messageId: string, type: 'like' | 'save' | 'copy' | 'share') => {
    if (type === 'like' || type === 'save') {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                reactions: {
                  ...msg.reactions,
                  [type === 'like' ? 'liked' : 'saved']: !msg.reactions?.[type === 'like' ? 'liked' : 'saved'],
                },
              }
            : msg
        )
      );
    }
  };

  return (
    <div className="h-screen flex flex-col bg-zinc-950">
      {/* Universal Header */}
      <UniversalHeader
        variant="chat"
        user={user}
        isLoading={isLoading}
        onLogout={onLogout}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <ChatHeader
            onTogglePanel={() => setIsPanelOpen(!isPanelOpen)}
            isPanelOpen={isPanelOpen}
          />

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700">
            {messages.length === 0 ? (
              <WelcomeMessage userName={user?.name?.split(' ')[0]} />
            ) : (
              <div className="py-4">
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    {...message}
                    onReaction={handleReaction}
                  />
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <ChatMessage
                    id="typing"
                    content=""
                    role="assistant"
                    timestamp={new Date()}
                    isTyping
                  />
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <ChatInput
            onSend={handleSend}
            isLoading={isTyping}
            streak={mockStats.streak}
            dailyMessages={messages.filter((m) => m.role === 'user').length}
            dailyLimit={50}
            fpBalance={mockStats.totalFP}
          />
        </div>

        {/* Desktop Insights Panel */}
        <div className="hidden lg:block">
          <AnimatePresence>
            {isPanelOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 360, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ type: 'spring', damping: 25 }}
                className="h-full border-l border-zinc-800 bg-zinc-950 overflow-hidden"
              >
                <div className="w-[360px] h-full overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700">
                  {/* Stats Content */}
                  <div className="p-4 border-b border-zinc-800">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-5 h-5 text-nfc-neon" />
                      <h2 className="text-lg font-bold text-white">Seu Progresso</h2>
                    </div>
                  </div>
                  <div className="p-4 space-y-4">
                    {/* Re-use the same content from InsightsPanel */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-nfc-violet/20 to-nfc-cyan/10 border border-nfc-violet/20">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-xs text-zinc-500">Seu Nível</p>
                          <p className="text-xl font-bold text-white">Level {mockStats.level}</p>
                        </div>
                        <span className="text-3xl">✨</span>
                      </div>
                      <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-nfc-violet to-nfc-cyan rounded-full"
                          style={{ width: `${(mockStats.currentXp / mockStats.xpToNextLevel) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-zinc-500 mt-2">
                        {mockStats.currentXp.toLocaleString()} / {mockStats.xpToNextLevel.toLocaleString()} XP
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-zinc-400">Streak Atual</p>
                          <p className="text-3xl font-black text-white">{mockStats.streak} <span className="text-sm font-normal text-zinc-400">dias</span></p>
                        </div>
                        <span className="text-4xl">🔥</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                        <p className="text-xs text-zinc-500 mb-1">FitPoints</p>
                        <p className="text-xl font-bold text-nfc-neon">{mockStats.totalFP.toLocaleString()}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                        <p className="text-xs text-zinc-500 mb-1">Mensagens</p>
                        <p className="text-xl font-bold text-white">{mockStats.totalMessages}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Insights Panel */}
      <InsightsPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        stats={mockStats}
      />
    </div>
  );
}

// ========================================
// HELPER: Generate AI Response
// ========================================

function generateAIResponse(userMessage: string): string {
  const responses = [
    `Ótima pergunta! 🌟 Baseado no que você me contou, recomendo focar em uma alimentação balanceada com proteínas de qualidade. Que tal começar incluindo mais ovos e frango grelhado nas suas refeições?

💡 Dica extra: Tente comer a cada 3-4 horas para manter seu metabolismo ativo!`,

    `Entendi sua dúvida! 💪 Para melhorar seus resultados, sugiro:

1. **Hidratação**: Beba pelo menos 2L de água por dia
2. **Proteína**: 1.6g por kg de peso corporal
3. **Descanso**: 7-8 horas de sono

Quer que eu crie um plano personalizado para você? ✨`,

    `Adorei sua motivação! 🎯 Vamos transformar esse objetivo em realidade.

Para começar, que tal acompanhar sua alimentação por uma semana? Isso vai nos ajudar a entender melhor seus padrões e criar estratégias mais eficientes.

📱 Use o app para registrar suas refeições - é super rápido!`,

    `Excelente escolha! 🥗 Aqui vai uma sugestão de cardápio equilibrado:

**Café da manhã:** Ovos mexidos + abacate + pão integral
**Lanche:** Iogurte natural + frutas vermelhas
**Almoço:** Frango grelhado + arroz integral + salada colorida
**Lanche:** Mix de oleaginosas
**Jantar:** Peixe assado + legumes no vapor

Lembre-se: consistência é mais importante que perfeição! 💜`,
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}
