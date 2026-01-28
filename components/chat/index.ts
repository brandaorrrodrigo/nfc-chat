/**
 * Chat Components Index
 * ======================
 *
 * Exporta todos os componentes do Chat IA Premium
 * Design feminino e viciante 💕✨
 */

// Core Components
export { default as ChatSidebar, ChatSidebarDrawer } from './ChatSidebar';
export { default as ChatHeader, ChatHeaderCompact } from './ChatHeader';
export { default as ChatMessages, EmptyMessages } from './ChatMessages';
export { default as ChatInput } from './ChatInput';
export { default as ChatSidePanel, ChatSidePanelSheet } from './ChatSidePanel';

// Message Components
export { default as MessageBubble, DateSeparator, SystemMessage } from './MessageBubble';
export { default as TypingIndicator } from './TypingIndicator';
export { default as QuickReply, QuickReplyGroup } from './QuickReply';

// UI Components
export { default as SuggestionCard, SuggestionChip } from './SuggestionCard';
export { default as AchievementBadge, StreakBadge, MiniAchievement } from './AchievementBadge';
export { default as ContextChip } from './ContextChip';

// Types
export type { Conversation } from './ChatSidebar';
export type { Message } from './MessageBubble';
export type { UserContext } from './ChatHeader';
export type { UserStats, Achievement, ChecklistItem, Insight } from './ChatSidePanel';
export type { ChipColor } from './ContextChip';
