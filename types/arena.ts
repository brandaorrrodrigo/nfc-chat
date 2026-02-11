/**
 * Tipos para o sistema de Arenas (Índice + Busca)
 */

export type ArenaCategoria =
  | 'NUTRICAO_DIETAS'
  | 'TREINO_EXERCICIOS'
  | 'BIOMECANICA_NFV'
  | 'SAUDE_CONDICOES_CLINICAS'
  | 'RECEITAS_ALIMENTACAO'
  | 'COMUNIDADES_LIVRES';

export type ArenaType = 'GENERAL' | 'NFV_HUB' | 'NFV_PREMIUM';
export type CreatedBy = 'USER' | 'ADMIN';
export type ArenaStatus = 'HOT' | 'WARM' | 'COLD' | 'ARCHIVED';

export interface ArenaTag {
  id: string;
  tag: string;
}

export interface ArenaWithTags {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  categoria: ArenaCategoria;
  arenaType: ArenaType;
  criadaPor: CreatedBy;
  isActive: boolean;
  isPaused: boolean;
  allowImages: boolean;
  allowLinks: boolean;
  allowVideos: boolean;
  totalPosts: number;
  totalComments: number;
  dailyActiveUsers: number;
  totalUsers?: number;
  status: ArenaStatus;
  tags: ArenaTag[];
  parentArenaSlug?: string | null;
  hub_slug?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ArenaGrouped {
  groups: Record<ArenaCategoria, ArenaWithTags[]>;
  total: number;
}

export interface CommunityCardData {
  id: string | number;
  title: string;
  description: string;
  members: number;
  totalMembers?: number;
  activeNow: number;
  slug: string;
  icon: string;
  gradient: string;
  lastActivity: string;
  isCore?: boolean;
  featured?: boolean;
  categoria?: ArenaCategoria;
  arenaType?: ArenaType;
  totalPosts?: number;
  status?: ArenaStatus;
  hub_slug?: string | null;
}
