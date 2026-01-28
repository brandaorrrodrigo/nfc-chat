'use client';

/**
 * ChatMessages - Área de Mensagens
 * =================================
 *
 * Área principal de exibição de mensagens
 * Com scroll automático e animações suaves 💕✨
 */

import React, { useRef, useEffect } from 'react';
import MessageBubble, { Message, DateSeparator, SystemMessage } from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import SuggestionCard from './SuggestionCard';

export interface ChatMessagesProps {
  messages: Message[];
  isTyping?: boolean;
  userName?: string;
  userPhoto?: string;
  onQuickReply?: (text: string) => void;
  onReaction?: (messageId: string, type: 'heart' | 'star' | 'thumbs') => void;
  showWelcome?: boolean;
  suggestion?: {
    icon: string;
    title: string;
    description: string;
    cta?: string;
    onClick?: () => void;
  };
}

// Mensagem de boas-vindas
function WelcomeMessage({ userName }: { userName?: string }) {
  return (
    <div className="text-center py-12 px-6 animate-fadeIn">
      {/* Avatar grande */}
      <div className="relative inline-block mb-6">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-400 to-purple-500 animate-pulse blur-xl opacity-40" />
        <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-teal-400 via-emerald-500 to-purple-500 flex items-center justify-center text-4xl shadow-xl">
          ✨
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Olá{userName ? `, ${userName}` : ''}! 💕
      </h2>

      <p className="text-gray-600 max-w-md mx-auto mb-6 leading-relaxed">
        Sou a <strong className="text-teal-600">Dra. Sofia</strong>, sua nutricionista virtual.
        Estou aqui para te ajudar a alcançar seus objetivos de saúde e bem-estar! 🌟
      </p>

      {/* Quick Start Topics */}
      <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
        {[
          { emoji: '🥗', text: 'Plano alimentar' },
          { emoji: '💪', text: 'Treino de hoje' },
          { emoji: '🌸', text: 'Meu ciclo' },
          { emoji: '💧', text: 'Hidratação' },
          { emoji: '😴', text: 'Dicas de sono' },
          { emoji: '🍫', text: 'Receitas fit' },
        ].map((topic, idx) => (
          <button
            key={idx}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 rounded-full text-sm font-medium text-gray-700 border border-gray-200 hover:border-teal-300 hover:shadow-sm transition-all"
          >
            <span className="text-lg">{topic.emoji}</span>
            {topic.text}
          </button>
        ))}
      </div>

      {/* Tips */}
      <div className="mt-8 p-4 bg-gradient-to-r from-pink-50 via-purple-50 to-teal-50 rounded-2xl max-w-md mx-auto border border-pink-100">
        <p className="text-sm text-gray-600">
          <span className="font-medium text-purple-600">💡 Dica:</span> Quanto mais você conversa comigo,
          mais personalizada fica a sua experiência! Conte-me sobre seus objetivos e rotina.
        </p>
      </div>
    </div>
  );
}

export default function ChatMessages({
  messages,
  isTyping = false,
  userName,
  userPhoto,
  onQuickReply,
  onReaction,
  showWelcome = true,
  suggestion,
}: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Group messages by date
  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 md:px-6 py-8 bg-gradient-to-b from-gray-50/50 to-white"
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Welcome Message */}
        {showWelcome && messages.length === 0 && (
          <WelcomeMessage userName={userName} />
        )}

        {/* Messages */}
        {Object.entries(groupedMessages).map(([date, msgs]) => (
          <div key={date}>
            <DateSeparator date={date} />
            <div className="space-y-6">
              {msgs.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  userName={userName}
                  userPhoto={userPhoto}
                  onQuickReply={onQuickReply}
                  onReaction={onReaction}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="animate-fadeIn">
            <TypingIndicator />
          </div>
        )}

        {/* Contextual Suggestion Card */}
        {suggestion && !isTyping && (
          <div className="mt-6 animate-slideIn">
            <SuggestionCard
              icon={suggestion.icon}
              title={suggestion.title}
              description={suggestion.description}
              cta={suggestion.cta}
              onClick={suggestion.onClick}
              variant="premium"
            />
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

// Helper function to group messages by date
function groupMessagesByDate(messages: Message[]): Record<string, Message[]> {
  const groups: Record<string, Message[]> = {};

  messages.forEach((message) => {
    // Parse the time string to get a date
    // In a real app, you'd use actual Date objects
    const date = getDateFromTimeString(message.time);

    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
  });

  return groups;
}

function getDateFromTimeString(time: string): string {
  // Simple parsing for demo - in production, use actual timestamps
  if (time.includes('Agora') || time.includes('min') || time.includes('hora')) {
    return 'Hoje 📅';
  }
  if (time.includes('Ontem')) {
    return 'Ontem 📅';
  }
  if (time.includes('dias') || time.includes('semana')) {
    return 'Esta semana 📅';
  }
  return 'Anteriores 📅';
}

// Empty state component
export function EmptyMessages() {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center">
        <div className="text-6xl mb-4">💬</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Nenhuma mensagem ainda
        </h3>
        <p className="text-gray-500 text-sm max-w-sm">
          Comece uma conversa com a Dra. Sofia! Ela está pronta para te ajudar 💕
        </p>
      </div>
    </div>
  );
}
