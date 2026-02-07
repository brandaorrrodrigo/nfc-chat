/**
 * Utilitários para o sistema de Arenas (Índice + Busca)
 * Mapeamentos de categoria, gradientes, ícones e conversão de dados.
 */

import type { ArenaCategoria, ArenaWithTags, CommunityCardData, ArenaStatus } from '@/types/arena';

export const CATEGORIA_LABELS: Record<ArenaCategoria, string> = {
  NUTRICAO_DIETAS: 'Nutrição & Dietas',
  TREINO_EXERCICIOS: 'Treino & Exercícios',
  BIOMECANICA_NFV: 'Biomecânica & NFV',
  AVALIACAO_BIOMECANICA_NFV: '⚡ Avaliação Biomecânica (NFV)',
  AVALIACAO_BIOMETRICA_NFV: '👤 Avaliação Biométrica (NFV)',
  SAUDE_CONDICOES_CLINICAS: 'Saúde & Condições Clínicas',
  RECEITAS_ALIMENTACAO: 'Receitas & Alimentação',
  COMUNIDADES_LIVRES: 'Comunidades Livres',
};

export const CATEGORIA_ORDER: ArenaCategoria[] = [
  'NUTRICAO_DIETAS',
  'TREINO_EXERCICIOS',
  'AVALIACAO_BIOMECANICA_NFV',
  'AVALIACAO_BIOMETRICA_NFV',
  'BIOMECANICA_NFV',
  'SAUDE_CONDICOES_CLINICAS',
  'RECEITAS_ALIMENTACAO',
  'COMUNIDADES_LIVRES',
];

export const CATEGORIA_ICONS: Record<ArenaCategoria, string> = {
  NUTRICAO_DIETAS: 'Utensils',
  TREINO_EXERCICIOS: 'Dumbbell',
  BIOMECANICA_NFV: 'Activity',
  AVALIACAO_BIOMECANICA_NFV: 'Zap',
  AVALIACAO_BIOMETRICA_NFV: 'User',
  SAUDE_CONDICOES_CLINICAS: 'Heart',
  RECEITAS_ALIMENTACAO: 'ChefHat',
  COMUNIDADES_LIVRES: 'Users',
};

export const CATEGORIA_GRADIENTS: Record<ArenaCategoria, string> = {
  NUTRICAO_DIETAS: 'from-orange-500 to-red-500',
  TREINO_EXERCICIOS: 'from-blue-500 to-indigo-600',
  BIOMECANICA_NFV: 'from-cyan-500 to-blue-600',
  AVALIACAO_BIOMECANICA_NFV: 'from-yellow-500 to-amber-600',
  AVALIACAO_BIOMETRICA_NFV: 'from-sky-500 to-cyan-600',
  SAUDE_CONDICOES_CLINICAS: 'from-purple-500 to-violet-600',
  RECEITAS_ALIMENTACAO: 'from-green-500 to-emerald-600',
  COMUNIDADES_LIVRES: 'from-pink-500 to-rose-600',
};

export const STATUS_CONFIG: Record<ArenaStatus, { label: string; color: string; dotColor: string }> = {
  HOT: { label: 'Ativa hoje', color: 'text-orange-400', dotColor: 'bg-orange-400' },
  WARM: { label: 'Ativa', color: 'text-emerald-400', dotColor: 'bg-emerald-400' },
  COLD: { label: 'Pouca atividade', color: 'text-zinc-500', dotColor: 'bg-zinc-500' },
  ARCHIVED: { label: 'Arquivada', color: 'text-zinc-600', dotColor: 'bg-zinc-600' },
};

export const FILTER_OPTIONS = [
  { key: null, label: 'Todas' },
  { key: 'NUTRICAO_DIETAS' as ArenaCategoria, label: 'Nutrição' },
  { key: 'TREINO_EXERCICIOS' as ArenaCategoria, label: 'Treino' },
  { key: 'AVALIACAO_BIOMECANICA_NFV' as ArenaCategoria, label: 'Biomecânica' },
  { key: 'AVALIACAO_BIOMETRICA_NFV' as ArenaCategoria, label: 'Biometria' },
  { key: 'RECEITAS_ALIMENTACAO' as ArenaCategoria, label: 'Receitas' },
  { key: 'SAUDE_CONDICOES_CLINICAS' as ArenaCategoria, label: 'Saúde' },
  { key: 'COMUNIDADES_LIVRES' as ArenaCategoria, label: 'Livres' },
];

function getRelativeActivity(status: ArenaStatus): string {
  switch (status) {
    case 'HOT': return 'há poucos minutos';
    case 'WARM': return 'há algumas horas';
    case 'COLD': return 'há dias';
    case 'ARCHIVED': return 'arquivada';
    default: return '';
  }
}

export function arenaToDisplayFormat(arena: ArenaWithTags): CommunityCardData {
  return {
    id: arena.id,
    title: arena.name,
    description: arena.description,
    members: arena.dailyActiveUsers, // ✅ REAL: usuários únicos que postaram
    activeNow: 0, // ✅ Será buscado via useArenaStats hook (online últimos 15min)
    slug: arena.slug,
    icon: arena.icon,
    gradient: CATEGORIA_GRADIENTS[arena.categoria] || 'from-zinc-500 to-zinc-600',
    lastActivity: getRelativeActivity(arena.status),
    isCore: arena.arenaType === 'NFV_PREMIUM',
    featured: arena.status === 'HOT',
    categoria: arena.categoria,
    arenaType: arena.arenaType,
    totalPosts: arena.totalPosts,
    status: arena.status,
  };
}

export function groupArenasByCategory(arenas: ArenaWithTags[]): Record<ArenaCategoria, ArenaWithTags[]> {
  const groups = {} as Record<ArenaCategoria, ArenaWithTags[]>;
  for (const cat of CATEGORIA_ORDER) {
    groups[cat] = [];
  }
  for (const arena of arenas) {
    const cat = arena.categoria || 'COMUNIDADES_LIVRES';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(arena);
  }
  return groups;
}
