/**
 * Chat Components Index
 * =====================
 *
 * Exporta todos os componentes do Chat IA Premium
 */

export { default as ChatMessage, WelcomeMessage } from './ChatMessage';
export { default as ChatInput } from './ChatInput';
export { default as InsightsPanel } from './InsightsPanel';
export { default as ChatLayout } from './ChatLayout';
export { default as GamificationBadges } from './GamificationBadges';

export type { ChatMessageProps } from './ChatMessage';
export type { ChatInputProps } from './ChatInput';
export type { InsightsPanelProps, UserStats, Badge } from './InsightsPanel';
export type { ChatLayoutProps, Message } from './ChatLayout';
export type { GamificationBadgesProps, Badge as GamificationBadge, BadgeRarity } from './GamificationBadges';
