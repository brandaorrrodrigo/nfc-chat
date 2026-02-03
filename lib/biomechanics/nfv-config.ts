/**
 * NFV Config - Configuracao do modulo de Analise Biomecanica
 *
 * ARQUITETURA 3 NIVEIS:
 * 1. Hub Biomecanico (gratuito) - discussao + educacao
 * 2. Categorias (filtros dentro do hub)
 * 3. Arenas Premium (pago - FP ou assinatura) - video habilitado
 */

export interface NFVCategory {
  id: string;
  label: string;
  icon: string;
  movements: string[];
}

export interface NFVPremiumArena {
  slug: string;
  name: string;
  icon: string;
  color: string;
  pattern: string;
  category: string;
  fpCost: number;
}

export const NFV_CONFIG = {
  HUB_SLUG: 'hub-biomecanico',

  CATEGORIES: [
    { id: 'membros-inferiores', label: 'Membros Inferiores', icon: '🦵', movements: ['agachamento', 'terra', 'elevacao-pelvica'] },
    { id: 'membros-superiores', label: 'Membros Superiores', icon: '💪', movements: ['supino', 'puxadas', 'desenvolvimento'] },
    { id: 'core-estabilidade', label: 'Core e Estabilidade', icon: '🧱', movements: [] },
    { id: 'postura-mobilidade', label: 'Postura e Mobilidade', icon: '🧘', movements: [] },
    { id: 'tecnicos-avancados', label: 'Tecnicos Avancados', icon: '🎯', movements: [] },
  ] as NFVCategory[],

  PREMIUM_ARENAS: [
    { slug: 'analise-agachamento', name: 'Analise: Agachamento', icon: '🏋️', color: '#8b5cf6', pattern: 'agachamento', category: 'membros-inferiores', fpCost: 25 },
    { slug: 'analise-terra', name: 'Analise: Levantamento Terra', icon: '💪', color: '#f59e0b', pattern: 'terra', category: 'membros-inferiores', fpCost: 25 },
    { slug: 'analise-supino', name: 'Analise: Supino', icon: '🔱', color: '#ef4444', pattern: 'supino', category: 'membros-superiores', fpCost: 25 },
    { slug: 'analise-puxadas', name: 'Analise: Puxadas', icon: '🔗', color: '#06b6d4', pattern: 'puxadas', category: 'membros-superiores', fpCost: 25 },
    { slug: 'analise-elevacao-pelvica', name: 'Analise: Elevacao Pelvica', icon: '🍑', color: '#ec4899', pattern: 'elevacao-pelvica', category: 'membros-inferiores', fpCost: 25 },
  ] as NFVPremiumArena[],

  VIDEO: {
    maxSizeMB: 100,
    maxDurationSeconds: 60,
    allowedTypes: ['video/mp4', 'video/webm', 'video/quicktime'] as string[],
    bucket: 'nfc-videos',
  },

  NFV_ARENA_SLUGS: [
    'hub-biomecanico',
    'analise-agachamento',
    'analise-terra',
    'analise-supino',
    'analise-puxadas',
    'analise-elevacao-pelvica',
  ],

  // FP Costs & Rewards
  FP_VIDEO_UPLOAD_COST: 25,
  FP_VIDEO_PUBLISHED_REWARD: 10,
  FP_HELPFUL_VOTE_REWARD: 3,
} as const;

/**
 * Verifica se um slug pertence ao sistema NFV
 */
export function isNFVArena(slug: string): boolean {
  return NFV_CONFIG.NFV_ARENA_SLUGS.includes(slug);
}

/**
 * Verifica se e uma arena premium de analise
 */
export function isPremiumNFVArena(slug: string): boolean {
  return NFV_CONFIG.PREMIUM_ARENAS.some(a => a.slug === slug);
}

/**
 * Verifica se e o hub biomecanico
 */
export function isNFVHub(slug: string): boolean {
  return slug === NFV_CONFIG.HUB_SLUG;
}

/**
 * Retorna config da arena premium pelo slug
 */
export function getPremiumArenaConfig(slug: string): NFVPremiumArena | undefined {
  return NFV_CONFIG.PREMIUM_ARENAS.find(a => a.slug === slug);
}

/**
 * Retorna categoria pelo id
 */
export function getCategoryById(categoryId: string): NFVCategory | undefined {
  return NFV_CONFIG.CATEGORIES.find(c => c.id === categoryId);
}

/**
 * Retorna arenas premium de uma categoria
 */
export function getPremiumArenasByCategory(categoryId: string): NFVPremiumArena[] {
  return NFV_CONFIG.PREMIUM_ARENAS.filter(a => a.category === categoryId);
}
