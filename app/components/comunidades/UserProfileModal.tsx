'use client';

/**
 * COMPONENTE: UserProfileModal - Perfil Social Mínimo
 *
 * Exibe ao clicar no avatar:
 * - Foto / avatar
 * - Nome
 * - Comunidades que participa
 * - Contadores: Tópicos criados, Respostas, Tempo no sistema
 *
 * Sem feed pessoal, sem timeline individual.
 * Visual: Card flutuante cyberpunk
 */

import React from 'react';
import {
  X,
  Users,
  MessageSquare,
  FileText,
  Clock,
  Award,
  Zap,
  Calendar,
} from 'lucide-react';

// ========================================
// TIPOS
// ========================================

interface UserProfile {
  id: string;
  nome: string;
  avatar?: string;
  is_premium?: boolean;
  is_founder?: boolean;
  comunidades: string[];
  stats: {
    topicos_criados: number;
    respostas: number;
    tempo_no_sistema: string;
    membro_desde: string;
  };
}

interface UserProfileModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  position?: { top: number; left: number };
}

// ========================================
// DADOS MOCK DE USUÁRIOS
// ========================================

export const USUARIOS_MOCK: Record<string, UserProfile> = {
  'maria-silva': {
    id: 'maria-silva',
    nome: 'Maria Silva',
    is_premium: true,
    comunidades: ['Protocolo Lipedema', 'Nutrição Funcional'],
    stats: {
      topicos_criados: 12,
      respostas: 87,
      tempo_no_sistema: '4 meses',
      membro_desde: 'Set 2024',
    },
  },
  'dr-ricardo': {
    id: 'dr-ricardo',
    nome: 'Dr. Ricardo',
    is_founder: true,
    comunidades: ['Peptídeos & Canetas', 'Endocrinologia Avançada'],
    stats: {
      topicos_criados: 34,
      respostas: 156,
      tempo_no_sistema: '8 meses',
      membro_desde: 'Mai 2024',
    },
  },
  'ana-costa': {
    id: 'ana-costa',
    nome: 'Ana Costa',
    comunidades: ['Protocolo Lipedema'],
    stats: {
      topicos_criados: 5,
      respostas: 42,
      tempo_no_sistema: '2 meses',
      membro_desde: 'Nov 2024',
    },
  },
  'joao-pedro': {
    id: 'joao-pedro',
    nome: 'João Pedro',
    is_premium: true,
    comunidades: ['Peptídeos & Canetas', 'Emagrecimento'],
    stats: {
      topicos_criados: 8,
      respostas: 63,
      tempo_no_sistema: '3 meses',
      membro_desde: 'Out 2024',
    },
  },
};

// ========================================
// COMPONENTE: Stat Counter
// ========================================

function StatCounter({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ElementType;
  value: number | string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center p-3 bg-zinc-800/50 rounded-lg">
      <Icon className="w-4 h-4 text-zinc-500 mb-1.5" />
      <span className="text-lg font-bold text-white font-mono">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </span>
      <span className="text-[10px] text-zinc-500 uppercase tracking-wider text-center">
        {label}
      </span>
    </div>
  );
}

// ========================================
// COMPONENTE PRINCIPAL
// ========================================

export default function UserProfileModal({
  user,
  isOpen,
  onClose,
}: UserProfileModalProps) {
  if (!isOpen) return null;

  // Obter inicial para avatar
  const inicial = user.nome.charAt(0).toUpperCase();

  // Definir cor do avatar baseado no tipo de usuário
  const avatarClass = user.is_founder
    ? 'bg-gradient-to-br from-yellow-500 to-amber-600 text-black'
    : user.is_premium
    ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
    : 'bg-zinc-700 text-zinc-300';

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm mx-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
          {/* Header com background decorativo */}
          <div className="relative h-20 bg-gradient-to-br from-zinc-800 to-zinc-900 overflow-hidden">
            {/* Padrão de grid */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `
                  linear-gradient(#00ff88 1px, transparent 1px),
                  linear-gradient(90deg, #00ff88 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px',
              }}
            />

            {/* Botão fechar */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1.5 bg-zinc-900/50 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-zinc-400" />
            </button>
          </div>

          {/* Avatar - Sobreposto ao header */}
          <div className="relative -mt-10 px-6">
            <div
              className={`
                w-20 h-20 rounded-2xl flex items-center justify-center
                text-2xl font-bold
                border-4 border-zinc-900
                shadow-lg
                ${avatarClass}
              `}
            >
              {inicial}
            </div>
          </div>

          {/* Content */}
          <div className="px-6 pb-6 pt-3">
            {/* Nome e badges */}
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-white">{user.nome}</h2>
              {user.is_founder && (
                <span className="px-2 py-0.5 text-[10px] font-mono bg-yellow-500/20 text-yellow-400 rounded-full flex items-center gap-1">
                  <Award className="w-2.5 h-2.5" />
                  Founder
                </span>
              )}
              {user.is_premium && !user.is_founder && (
                <span className="px-2 py-0.5 text-[10px] font-mono bg-purple-500/20 text-purple-400 rounded-full flex items-center gap-1">
                  <Zap className="w-2.5 h-2.5" />
                  Premium
                </span>
              )}
            </div>

            {/* Membro desde */}
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-4">
              <Calendar className="w-3 h-3" />
              <span>Membro desde {user.stats.membro_desde}</span>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <StatCounter
                icon={FileText}
                value={user.stats.topicos_criados}
                label="Tópicos"
              />
              <StatCounter
                icon={MessageSquare}
                value={user.stats.respostas}
                label="Respostas"
              />
              <StatCounter
                icon={Clock}
                value={user.stats.tempo_no_sistema}
                label="No Sistema"
              />
            </div>

            {/* Comunidades */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-zinc-500" />
                <span className="text-xs text-zinc-500 uppercase tracking-wider">
                  Comunidades
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {user.comunidades.map((comunidade, index) => (
                  <span
                    key={index}
                    className="px-2.5 py-1 text-xs bg-zinc-800 text-zinc-300 rounded-lg border border-zinc-700"
                  >
                    {comunidade}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer info */}
            <div className="pt-4 border-t border-zinc-800">
              <p className="text-[10px] text-zinc-600 text-center font-mono">
                PERFIL PÚBLICO • SOMENTE LEITURA
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ========================================
// HOOK HELPER
// ========================================

export function useUserProfileModal() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<UserProfile | null>(null);

  const openProfile = (userId: string) => {
    const user = USUARIOS_MOCK[userId];
    if (user) {
      setSelectedUser(user);
      setIsOpen(true);
    }
  };

  const closeProfile = () => {
    setIsOpen(false);
    setSelectedUser(null);
  };

  return {
    isOpen,
    selectedUser,
    openProfile,
    closeProfile,
  };
}
