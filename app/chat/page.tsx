'use client';

/**
 * Chat IA Page - Premium Experience 💕✨
 * =====================================
 *
 * Página principal do Chat IA NutriFitCoach
 * chat.nutrifitcoach.com.br
 *
 * Design feminino e viciante
 * Com Dra. Sofia, sua nutricionista virtual 🌟
 */

import { useState, useCallback } from 'react';
import {
  ChatSidebar,
  ChatSidebarDrawer,
  ChatHeader,
  ChatMessages,
  ChatInput,
  ChatSidePanel,
  ChatSidePanelSheet,
} from '@/components/chat';
import type { Message } from '@/components/chat';
import type { Conversation } from '@/components/chat';

// Dados iniciais de exemplo
const initialConversations: Conversation[] = [
  {
    id: '1',
    title: 'Plano Nutricional 🥗',
    lastMessage: 'Vamos revisar seus macros?',
    time: '2h atrás',
    unread: 2,
    avatar: '🥗',
    pinned: true,
  },
  {
    id: '2',
    title: 'Treino HIIT 💪',
    lastMessage: 'Parabéns pelo treino de hoje!',
    time: 'Ontem',
    unread: 0,
    avatar: '💪',
    starred: true,
  },
  {
    id: '3',
    title: 'Receitas Low Carb 🍳',
    lastMessage: 'Aqui estão 5 receitas rápidas...',
    time: '2 dias',
    unread: 0,
    avatar: '🍳',
  },
  {
    id: '4',
    title: 'Ciclo Menstrual 🌸',
    lastMessage: 'Na fase folicular, você pode...',
    time: '3 dias',
    unread: 0,
    avatar: '🌸',
  },
  {
    id: '5',
    title: 'Hidratação 💧',
    lastMessage: 'Lembre-se de beber água!',
    time: '1 semana',
    unread: 0,
    avatar: '💧',
  },
];

const initialMessages: Message[] = [
  {
    id: '1',
    sender: 'ai',
    content: 'Olá, Maria! 💕 Bem-vinda de volta! Como você está se sentindo hoje? Vi que você está na fase folicular do seu ciclo - é um ótimo momento para treinos mais intensos! 🔥',
    time: 'Agora',
    reactions: [{ type: 'heart', count: 1 }],
    quickReplies: [
      { text: 'Estou ótima! 😊', emoji: '💪' },
      { text: 'Um pouco cansada 😴', emoji: '💤' },
      { text: 'Preciso de motivação 🌟', emoji: '✨' },
    ],
  },
];

export default function ChatPage() {
  // Estado principal
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [activeConversationId, setActiveConversationId] = useState<string>('1');
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [isPremium] = useState(true);
  const [remainingCredits] = useState(47);

  // Estado mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

  // Dados do usuário
  const user = {
    name: 'Maria',
    photo: undefined,
    level: 12,
    xp: 2340,
    xpToNextLevel: 3000,
  };

  const stats = {
    calories: { current: 1200, target: 1800 },
    water: { current: 1.5, target: 2.5 },
    protein: { current: 65, target: 90 },
    streak: 12,
  };

  const achievements = [
    { icon: '🔥', title: '7 dias seguidos!', unlocked: true },
    { icon: '💪', title: '10 treinos completos', unlocked: true },
    { icon: '🎯', title: 'Meta de proteína 30 dias', unlocked: false, progress: 23, total: 30 },
  ];

  const checklist = [
    { id: '1', text: 'Café da manhã registrado ☀️', checked: true, time: '7h' },
    { id: '2', text: 'Treino matinal 🏃‍♀️', checked: true, time: '8h' },
    { id: '3', text: 'Almoço às 12h 🥗', checked: false, time: '12h' },
    { id: '4', text: 'Treino de força às 18h 💪', checked: false, time: '18h' },
    { id: '5', text: 'Jantar até 20h 🍽️', checked: false, time: '20h' },
    { id: '6', text: 'Beber 2L de água 💧', checked: false },
  ];

  const insights = [
    { type: 'success' as const, emoji: '💪', message: 'Você está 20% acima da meta de proteínas esta semana! Arrasou!' },
    { type: 'warning' as const, emoji: '💧', message: 'Hidratação baixa nos últimos 3 dias. Beba mais água, linda!' },
    { type: 'info' as const, emoji: '🌸', message: 'Fase folicular detectada. Momento perfeito para treinos intensos!' },
  ];

  // Handlers
  const handleSendMessage = useCallback((content: string) => {
    // Adicionar mensagem do usuário
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content,
      time: 'Agora',
    };
    setMessages((prev) => [...prev, userMessage]);

    // Simular resposta da IA
    setIsTyping(true);
    setTimeout(() => {
      const aiResponses = [
        'Que ótimo ouvir isso! 💕 Baseado no seu perfil, tenho algumas sugestões personalizadas para hoje...',
        'Entendi! Vou adaptar suas recomendações considerando isso. 🌟',
        'Perfeito! Vamos trabalhar juntas nisso. Aqui está o que sugiro... ✨',
      ];

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        time: 'Agora',
        quickReplies: [
          { text: 'Adorei! 🥰', emoji: '💕' },
          { text: 'Me conta mais 🤔', emoji: '💬' },
          { text: 'Vamos fazer isso! 💪', emoji: '🔥' },
        ],
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  }, []);

  const handleQuickReply = useCallback((text: string) => {
    handleSendMessage(text);
  }, [handleSendMessage]);

  const handleNewChat = useCallback(() => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'Nova Conversa ✨',
      lastMessage: 'Comece uma nova conversa!',
      time: 'Agora',
      unread: 0,
      avatar: '💬',
    };
    setConversations((prev) => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
    setMessages([]);
    setIsSidebarOpen(false);
  }, []);

  const handleSelectConversation = useCallback((id: string) => {
    setActiveConversationId(id);
    setIsSidebarOpen(false);
  }, []);

  const handleCheckItem = useCallback((id: string) => {
    // Em produção, salvaria no backend
    console.log('Check item:', id);
  }, []);

  const handleReaction = useCallback((messageId: string, type: 'heart' | 'star' | 'thumbs') => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              reactions: [
                ...(msg.reactions || []).filter((r) => r.type !== type),
                { type, count: 1 },
              ],
            }
          : msg
      )
    );
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Main Content Area - altura descontando header de 4rem (64px) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block">
          <ChatSidebar
            conversations={conversations}
            activeId={activeConversationId}
            onSelect={handleSelectConversation}
            onNewChat={handleNewChat}
          />
        </div>

        {/* Sidebar - Mobile Drawer */}
        <ChatSidebarDrawer
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          conversations={conversations}
          activeId={activeConversationId}
          onSelect={handleSelectConversation}
          onNewChat={handleNewChat}
        />

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Chat Header */}
          <ChatHeader
            aiName="Dra. Sofia"
            aiEmoji="✨"
            aiSpecialty="Especialista em Nutrição Feminina"
            isOnline={true}
          />

          {/* Messages Area */}
          <ChatMessages
            messages={messages}
            isTyping={isTyping}
            userName={user.name}
            userPhoto={user.photo}
            onQuickReply={handleQuickReply}
            onReaction={handleReaction}
            showWelcome={messages.length === 0}
          />

          {/* Input Area */}
          <ChatInput
            onSend={handleSendMessage}
            isLoading={isTyping}
            isPremium={isPremium}
            remainingCredits={remainingCredits}
            placeholder="Pergunte qualquer coisa... Dra. Sofia está aqui! 💕"
          />
        </main>

        {/* Side Panel - Desktop */}
        <div className="hidden xl:block">
          <ChatSidePanel
            user={user}
            stats={stats}
            achievements={achievements}
            checklist={checklist}
            insights={insights}
            onCheckItem={handleCheckItem}
          />
        </div>

        {/* Side Panel - Mobile Sheet */}
        <ChatSidePanelSheet
          isOpen={isSidePanelOpen}
          onClose={() => setIsSidePanelOpen(false)}
          user={user}
          stats={stats}
          achievements={achievements}
          checklist={checklist}
          insights={insights}
          onCheckItem={handleCheckItem}
        />
      </div>

      {/* Mobile Bottom Bar (Menu Toggle) */}
      <div className="lg:hidden fixed bottom-20 left-4 z-30 flex gap-2">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-3 bg-white rounded-full shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
          aria-label="Abrir conversas"
        >
          <span className="text-xl">💬</span>
        </button>
      </div>

      <div className="xl:hidden fixed bottom-20 right-4 z-30">
        <button
          onClick={() => setIsSidePanelOpen(true)}
          className="p-3 bg-gradient-to-r from-teal-500 to-purple-500 rounded-full shadow-lg hover:shadow-xl transition-shadow"
          aria-label="Abrir insights"
        >
          <span className="text-xl">✨</span>
        </button>
      </div>
    </div>
  );
}
