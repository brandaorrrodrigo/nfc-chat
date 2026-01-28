'use client';

/**
 * ChatSidebar - Lista de Conversas
 * =================================
 *
 * Sidebar com histórico de conversas
 * Design feminino e organizado 💕✨
 */

import React, { useState } from 'react';
import { Plus, Search, MoreVertical, Trash2, Pin, Archive, Star } from 'lucide-react';

export interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  pinned?: boolean;
  starred?: boolean;
}

export interface ChatSidebarProps {
  conversations: Conversation[];
  activeId?: string;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onDelete?: (id: string) => void;
  onPin?: (id: string) => void;
  onArchive?: (id: string) => void;
  className?: string;
}

const defaultConversations: Conversation[] = [
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

export default function ChatSidebar({
  conversations = defaultConversations,
  activeId,
  onSelect,
  onNewChat,
  onDelete,
  onPin,
  onArchive,
  className = '',
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const filteredConversations = conversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedConversations = filteredConversations.filter((c) => c.pinned);
  const regularConversations = filteredConversations.filter((c) => !c.pinned);

  return (
    <aside className={`w-80 border-r border-gray-200 bg-white flex flex-col ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            💬 Conversas
          </h2>
          <span className="text-xs px-2 py-1 bg-purple-100 text-purple-600 rounded-full font-medium">
            {conversations.length}
          </span>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar conversas... 🔍"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
          />
        </div>

        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-500 via-emerald-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-5 h-5" />
          Nova Conversa ✨
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {/* Pinned Section */}
        {pinnedConversations.length > 0 && (
          <div className="p-2">
            <p className="px-3 py-2 text-xs font-medium text-gray-500 uppercase flex items-center gap-1">
              <Pin className="w-3 h-3" />
              Fixadas
            </p>
            {pinnedConversations.map((conv) => (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                isActive={activeId === conv.id}
                onSelect={() => onSelect(conv.id)}
                menuOpen={menuOpen === conv.id}
                onMenuToggle={() => setMenuOpen(menuOpen === conv.id ? null : conv.id)}
                onDelete={() => onDelete?.(conv.id)}
                onPin={() => onPin?.(conv.id)}
                onArchive={() => onArchive?.(conv.id)}
              />
            ))}
          </div>
        )}

        {/* Regular Conversations */}
        <div className="p-2">
          {pinnedConversations.length > 0 && regularConversations.length > 0 && (
            <p className="px-3 py-2 text-xs font-medium text-gray-500 uppercase">
              Recentes 📅
            </p>
          )}
          {regularConversations.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              isActive={activeId === conv.id}
              onSelect={() => onSelect(conv.id)}
              menuOpen={menuOpen === conv.id}
              onMenuToggle={() => setMenuOpen(menuOpen === conv.id ? null : conv.id)}
              onDelete={() => onDelete?.(conv.id)}
              onPin={() => onPin?.(conv.id)}
              onArchive={() => onArchive?.(conv.id)}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredConversations.length === 0 && (
          <div className="p-8 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-gray-500 text-sm">
              Nenhuma conversa encontrada
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-pink-50 to-purple-50">
        <div className="flex items-center gap-3">
          <div className="text-2xl">💎</div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Plano Premium</p>
            <p className="text-xs text-gray-500">Mensagens ilimitadas</p>
          </div>
          <button className="text-xs font-medium text-teal-600 hover:text-teal-700">
            Upgrade →
          </button>
        </div>
      </div>
    </aside>
  );
}

// Conversation Item Component
function ConversationItem({
  conversation,
  isActive,
  onSelect,
  menuOpen,
  onMenuToggle,
  onDelete,
  onPin,
  onArchive,
}: {
  conversation: Conversation;
  isActive: boolean;
  onSelect: () => void;
  menuOpen: boolean;
  onMenuToggle: () => void;
  onDelete?: () => void;
  onPin?: () => void;
  onArchive?: () => void;
}) {
  return (
    <div className="relative">
      <button
        onClick={onSelect}
        className={`
          w-full p-3 rounded-xl transition-all text-left mb-1 group
          ${isActive
            ? 'bg-gradient-to-r from-teal-50 to-purple-50 border border-teal-200 shadow-sm'
            : 'hover:bg-gray-50 border border-transparent'
          }
        `}
      >
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className={`
            w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0
            ${isActive
              ? 'bg-gradient-to-br from-teal-100 to-purple-100'
              : 'bg-gradient-to-br from-gray-100 to-gray-50'
            }
          `}>
            {conversation.avatar}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className={`font-medium truncate ${isActive ? 'text-teal-700' : 'text-gray-900'}`}>
                {conversation.title}
                {conversation.starred && <Star className="w-3 h-3 inline ml-1 text-amber-400 fill-current" />}
              </h3>
              {conversation.unread > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-gradient-to-r from-teal-500 to-purple-500 text-white text-xs font-semibold rounded-full">
                  {conversation.unread}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 truncate">
              {conversation.lastMessage}
            </p>
            <span className="text-xs text-gray-400 mt-1 block">
              {conversation.time}
            </span>
          </div>

          {/* Menu Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMenuToggle();
            }}
            className="p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-200 rounded-lg transition-all"
          >
            <MoreVertical className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </button>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div className="absolute right-2 top-12 z-10 w-40 bg-white rounded-xl shadow-lg border border-gray-200 py-1 animate-fadeIn">
          <button
            onClick={() => { onPin?.(); onMenuToggle(); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Pin className="w-4 h-4" />
            {conversation.pinned ? 'Desafixar' : 'Fixar'} 📌
          </button>
          <button
            onClick={() => { onArchive?.(); onMenuToggle(); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Archive className="w-4 h-4" />
            Arquivar 📦
          </button>
          <hr className="my-1" />
          <button
            onClick={() => { onDelete?.(); onMenuToggle(); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
            Excluir 🗑️
          </button>
        </div>
      )}
    </div>
  );
}

// Mobile Drawer Version
export function ChatSidebarDrawer({
  isOpen,
  onClose,
  ...props
}: ChatSidebarProps & { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 z-50 lg:hidden animate-slideInLeft">
        <ChatSidebar {...props} />
      </div>
    </>
  );
}
