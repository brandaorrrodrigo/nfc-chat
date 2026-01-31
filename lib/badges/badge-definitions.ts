/**
 * Badge Definitions - Definicao de todas as Badges
 *
 * Sistema de conquistas baseado em acoes reais na comunidade.
 * Badges sao desbloqueadas automaticamente ao atingir criterios.
 */

export type BadgeCategory = 'streak' | 'messages' | 'engagement' | 'nutrition' | 'fitness' | 'special';
export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: BadgeCategory;
  rarity: BadgeRarity;
  fpReward: number;
  // Criterios de desbloqueio
  criteria: {
    type: 'messages' | 'streak' | 'fp' | 'reactions' | 'arenas' | 'investigations' | 'topics' | 'special';
    threshold: number;
    communitySlug?: string; // Se especifico de uma comunidade
  };
}

// ==========================================
// BADGES DE STREAK
// ==========================================

export const STREAK_BADGES: BadgeDefinition[] = [
  {
    id: 'streak_3',
    name: 'Primeiros Passos',
    description: '3 dias seguidos na comunidade',
    icon: '🔥',
    category: 'streak',
    rarity: 'common',
    fpReward: 5,
    criteria: { type: 'streak', threshold: 3 },
  },
  {
    id: 'streak_7',
    name: 'Semana On Fire',
    description: '7 dias seguidos na comunidade',
    icon: '🌟',
    category: 'streak',
    rarity: 'rare',
    fpReward: 15,
    criteria: { type: 'streak', threshold: 7 },
  },
  {
    id: 'streak_14',
    name: 'Duas Semanas',
    description: '14 dias seguidos na comunidade',
    icon: '💎',
    category: 'streak',
    rarity: 'rare',
    fpReward: 25,
    criteria: { type: 'streak', threshold: 14 },
  },
  {
    id: 'streak_30',
    name: 'Mestre da Constancia',
    description: '30 dias seguidos na comunidade',
    icon: '👑',
    category: 'streak',
    rarity: 'epic',
    fpReward: 50,
    criteria: { type: 'streak', threshold: 30 },
  },
  {
    id: 'streak_60',
    name: 'Imparavel',
    description: '60 dias seguidos na comunidade',
    icon: '🏆',
    category: 'streak',
    rarity: 'legendary',
    fpReward: 100,
    criteria: { type: 'streak', threshold: 60 },
  },
  {
    id: 'streak_90',
    name: 'Lenda Viva',
    description: '90 dias seguidos na comunidade',
    icon: '🌈',
    category: 'streak',
    rarity: 'legendary',
    fpReward: 150,
    criteria: { type: 'streak', threshold: 90 },
  },
];

// ==========================================
// BADGES DE MENSAGENS
// ==========================================

export const MESSAGE_BADGES: BadgeDefinition[] = [
  {
    id: 'msg_10',
    name: 'Comecando a Conversa',
    description: 'Envie 10 mensagens na comunidade',
    icon: '💬',
    category: 'messages',
    rarity: 'common',
    fpReward: 5,
    criteria: { type: 'messages', threshold: 10 },
  },
  {
    id: 'msg_50',
    name: 'Comunicadora',
    description: 'Envie 50 mensagens na comunidade',
    icon: '📢',
    category: 'messages',
    rarity: 'common',
    fpReward: 10,
    criteria: { type: 'messages', threshold: 50 },
  },
  {
    id: 'msg_100',
    name: 'Voz Ativa',
    description: 'Envie 100 mensagens na comunidade',
    icon: '🎤',
    category: 'messages',
    rarity: 'rare',
    fpReward: 20,
    criteria: { type: 'messages', threshold: 100 },
  },
  {
    id: 'msg_500',
    name: 'Pilar da Comunidade',
    description: 'Envie 500 mensagens na comunidade',
    icon: '🏛️',
    category: 'messages',
    rarity: 'epic',
    fpReward: 50,
    criteria: { type: 'messages', threshold: 500 },
  },
  {
    id: 'msg_1000',
    name: 'Lider Nata',
    description: 'Envie 1000 mensagens na comunidade',
    icon: '👸',
    category: 'messages',
    rarity: 'legendary',
    fpReward: 100,
    criteria: { type: 'messages', threshold: 1000 },
  },
];

// ==========================================
// BADGES DE ENGAJAMENTO
// ==========================================

export const ENGAGEMENT_BADGES: BadgeDefinition[] = [
  {
    id: 'reactions_10',
    name: 'Apoiadora',
    description: 'Receba 10 reacoes em suas mensagens',
    icon: '❤️',
    category: 'engagement',
    rarity: 'common',
    fpReward: 5,
    criteria: { type: 'reactions', threshold: 10 },
  },
  {
    id: 'reactions_50',
    name: 'Querida',
    description: 'Receba 50 reacoes em suas mensagens',
    icon: '💖',
    category: 'engagement',
    rarity: 'rare',
    fpReward: 15,
    criteria: { type: 'reactions', threshold: 50 },
  },
  {
    id: 'reactions_100',
    name: 'Inspiradora',
    description: 'Receba 100 reacoes em suas mensagens',
    icon: '✨',
    category: 'engagement',
    rarity: 'epic',
    fpReward: 30,
    criteria: { type: 'reactions', threshold: 100 },
  },
  {
    id: 'topics_5',
    name: 'Criadora de Debates',
    description: 'Crie 5 topicos nas arenas',
    icon: '💡',
    category: 'engagement',
    rarity: 'rare',
    fpReward: 20,
    criteria: { type: 'topics', threshold: 5 },
  },
  {
    id: 'arenas_3',
    name: 'Exploradora',
    description: 'Participe de 3 arenas diferentes',
    icon: '🧭',
    category: 'engagement',
    rarity: 'common',
    fpReward: 10,
    criteria: { type: 'arenas', threshold: 3 },
  },
];

// ==========================================
// BADGES DE NUTRICAO
// ==========================================

export const NUTRITION_BADGES: BadgeDefinition[] = [
  {
    id: 'nutrition_curious',
    name: 'Curiosa de Nutricao',
    description: 'Participe de discussoes sobre alimentacao',
    icon: '🥗',
    category: 'nutrition',
    rarity: 'common',
    fpReward: 5,
    criteria: { type: 'messages', threshold: 10, communitySlug: 'emagrecimento-saudavel' },
  },
  {
    id: 'deficit_master',
    name: 'Especialista em Deficit',
    description: 'Complete uma investigacao sobre deficit calorico',
    icon: '📊',
    category: 'nutrition',
    rarity: 'rare',
    fpReward: 15,
    criteria: { type: 'investigations', threshold: 1 },
  },
  {
    id: 'protein_queen',
    name: 'Rainha da Proteina',
    description: 'Participe ativamente no tema proteinas',
    icon: '🍗',
    category: 'nutrition',
    rarity: 'rare',
    fpReward: 15,
    criteria: { type: 'investigations', threshold: 1 },
  },
];

// ==========================================
// BADGES DE FITNESS
// ==========================================

export const FITNESS_BADGES: BadgeDefinition[] = [
  {
    id: 'fitness_starter',
    name: 'Iniciante Fitness',
    description: 'Participe de discussoes sobre treino',
    icon: '💪',
    category: 'fitness',
    rarity: 'common',
    fpReward: 5,
    criteria: { type: 'messages', threshold: 10, communitySlug: 'treino-forca' },
  },
  {
    id: 'glute_builder',
    name: 'Construtora de Gluteo',
    description: 'Complete investigacao sobre treino de gluteo',
    icon: '🍑',
    category: 'fitness',
    rarity: 'rare',
    fpReward: 15,
    criteria: { type: 'investigations', threshold: 1 },
  },
  {
    id: 'hipertrofia_fan',
    name: 'Apaixonada por Hipertrofia',
    description: 'Participe ativamente na arena de hipertrofia',
    icon: '🏋️',
    category: 'fitness',
    rarity: 'rare',
    fpReward: 15,
    criteria: { type: 'messages', threshold: 20, communitySlug: 'hipertrofia' },
  },
];

// ==========================================
// BADGES ESPECIAIS
// ==========================================

export const SPECIAL_BADGES: BadgeDefinition[] = [
  {
    id: 'early_adopter',
    name: 'Early Adopter',
    description: 'Entrou na comunidade nos primeiros 30 dias',
    icon: '🚀',
    category: 'special',
    rarity: 'legendary',
    fpReward: 50,
    criteria: { type: 'special', threshold: 1 },
  },
  {
    id: 'first_investigation',
    name: 'Primeira Consulta',
    description: 'Complete sua primeira investigacao com a IA',
    icon: '🔬',
    category: 'special',
    rarity: 'common',
    fpReward: 10,
    criteria: { type: 'investigations', threshold: 1 },
  },
  {
    id: 'investigation_master',
    name: 'Mestre das Consultas',
    description: 'Complete 10 investigacoes com a IA',
    icon: '🎓',
    category: 'special',
    rarity: 'epic',
    fpReward: 50,
    criteria: { type: 'investigations', threshold: 10 },
  },
  {
    id: 'fp_100',
    name: 'Centenaria',
    description: 'Acumule 100 FP',
    icon: '💯',
    category: 'special',
    rarity: 'common',
    fpReward: 5,
    criteria: { type: 'fp', threshold: 100 },
  },
  {
    id: 'fp_500',
    name: 'Meia Meta',
    description: 'Acumule 500 FP',
    icon: '🏅',
    category: 'special',
    rarity: 'rare',
    fpReward: 15,
    criteria: { type: 'fp', threshold: 500 },
  },
  {
    id: 'fp_1000',
    name: 'Milionaria de FP',
    description: 'Acumule 1000 FP',
    icon: '💰',
    category: 'special',
    rarity: 'epic',
    fpReward: 30,
    criteria: { type: 'fp', threshold: 1000 },
  },
];

// ==========================================
// TODAS AS BADGES
// ==========================================

export const ALL_BADGES: BadgeDefinition[] = [
  ...STREAK_BADGES,
  ...MESSAGE_BADGES,
  ...ENGAGEMENT_BADGES,
  ...NUTRITION_BADGES,
  ...FITNESS_BADGES,
  ...SPECIAL_BADGES,
];

export function getBadgeById(id: string): BadgeDefinition | undefined {
  return ALL_BADGES.find(b => b.id === id);
}

export function getBadgesByCategory(category: BadgeCategory): BadgeDefinition[] {
  return ALL_BADGES.filter(b => b.category === category);
}

export function getBadgesByRarity(rarity: BadgeRarity): BadgeDefinition[] {
  return ALL_BADGES.filter(b => b.rarity === rarity);
}

export default ALL_BADGES;
