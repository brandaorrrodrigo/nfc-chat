'use client';

/**
 * LoginRequiredModal - Modal de Login Necessário
 *
 * Exibido quando usuários não autenticados tentam interagir.
 * Mensagem contextual + CTAs para login/registro.
 *
 * Estilo: Cyberpunk dark com verde neon
 */

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogIn, UserPlus, X, MessageSquare, Shield, Sparkles, Bookmark } from 'lucide-react';

// ========================================
// TIPOS
// ========================================

type InteractionType = 'responder' | 'criar-topico' | 'reagir' | 'favoritar' | 'geral';

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  interactionType?: InteractionType;
}

// ========================================
// CONFIGURAÇÃO POR TIPO DE INTERAÇÃO
// ========================================

const INTERACTION_CONFIG: Record<InteractionType, {
  icon: React.ElementType;
  title: string;
  description: string;
  iconColor: string;
  iconBg: string;
}> = {
  responder: {
    icon: MessageSquare,
    title: 'Faça login para responder',
    description: 'Participe das discussões e compartilhe suas experiências com a comunidade.',
    iconColor: 'text-cyan-400',
    iconBg: 'bg-cyan-500/10 border-cyan-500/30',
  },
  'criar-topico': {
    icon: Sparkles,
    title: 'Faça login para criar tópicos',
    description: 'Inicie novas discussões e conecte-se com outros membros.',
    iconColor: 'text-purple-400',
    iconBg: 'bg-purple-500/10 border-purple-500/30',
  },
  reagir: {
    icon: Sparkles,
    title: 'Faça login para reagir',
    description: 'Mostre apoio às mensagens e participe ativamente da comunidade.',
    iconColor: 'text-pink-400',
    iconBg: 'bg-pink-500/10 border-pink-500/30',
  },
  favoritar: {
    icon: Bookmark,
    title: 'Faça login para salvar',
    description: 'Salve comunidades e tópicos favoritos para acessar rapidamente.',
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-500/10 border-amber-500/30',
  },
  geral: {
    icon: Shield,
    title: 'Login necessário',
    description: 'Para interagir com a comunidade, você precisa estar logado.',
    iconColor: 'text-[#00ff88]',
    iconBg: 'bg-[#00ff88]/10 border-[#00ff88]/30',
  },
};

// ========================================
// COMPONENTE PRINCIPAL
// ========================================

export default function LoginRequiredModal({
  isOpen,
  onClose,
  interactionType = 'geral',
}: LoginRequiredModalProps) {
  const pathname = usePathname();

  // Monta URLs de login/registro com callback para retornar à página atual
  const callbackUrl = encodeURIComponent(pathname || '/comunidades');
  const loginUrl = `/login?callbackUrl=${callbackUrl}`;
  const registerUrl = `/registro?callbackUrl=${callbackUrl}`;

  if (!isOpen) return null;

  const config = INTERACTION_CONFIG[interactionType];
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-zinc-900 border border-zinc-700 rounded-2xl p-6 max-w-sm w-full shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-scaleIn">
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-zinc-500 hover:text-white transition-colors rounded-lg hover:bg-zinc-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Conteúdo */}
        <div className="text-center mb-6">
          {/* Ícone */}
          <div
            className={`
              w-16 h-16 mx-auto mb-4 rounded-2xl
              ${config.iconBg} border
              flex items-center justify-center
            `}
          >
            <Icon className={`w-8 h-8 ${config.iconColor}`} />
          </div>

          {/* Título */}
          <h3 className="text-xl font-bold text-white mb-2">
            {config.title}
          </h3>

          {/* Descrição */}
          <p className="text-sm text-zinc-400 leading-relaxed">
            {config.description}
          </p>
        </div>

        {/* Benefícios */}
        <div className="mb-6 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700">
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3 font-semibold">
            Com uma conta você pode:
          </p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-sm text-zinc-300">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00ff88]" />
              Participar das discussões
            </li>
            <li className="flex items-center gap-2 text-sm text-zinc-300">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00ff88]" />
              Criar tópicos e perguntas
            </li>
            <li className="flex items-center gap-2 text-sm text-zinc-300">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00ff88]" />
              Receber insights da IA
            </li>
          </ul>
        </div>

        {/* CTAs */}
        <div className="space-y-3">
          <Link
            href={loginUrl}
            className={`
              flex items-center justify-center gap-2 w-full
              px-4 py-3
              bg-[#00ff88] hover:bg-[#00ff88]/90
              text-black font-semibold
              rounded-xl
              transition-all
              hover:shadow-[0_0_20px_rgba(0,255,136,0.5)]
            `}
            onClick={onClose}
          >
            <LogIn className="w-5 h-5" />
            Entrar na minha conta
          </Link>

          <Link
            href={registerUrl}
            className={`
              flex items-center justify-center gap-2 w-full
              px-4 py-3
              bg-zinc-800 hover:bg-zinc-700
              text-white font-semibold
              rounded-xl
              border border-zinc-700 hover:border-zinc-600
              transition-all
            `}
            onClick={onClose}
          >
            <UserPlus className="w-5 h-5" />
            Criar conta grátis
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-zinc-600 mt-4">
          A leitura do painel é sempre gratuita
        </p>
      </div>

      {/* Animações */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

// ========================================
// HOOK PARA USO FÁCIL
// ========================================

export function useLoginRequiredModal() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [interactionType, setInteractionType] = React.useState<InteractionType>('geral');

  const openModal = React.useCallback((type: InteractionType = 'geral') => {
    setInteractionType(type);
    setIsOpen(true);
  }, []);

  const closeModal = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    interactionType,
    openModal,
    closeModal,
  };
}
