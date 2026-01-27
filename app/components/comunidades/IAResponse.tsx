'use client';

/**
 * Componente: IAResponse
 *
 * Renderiza respostas da IA Facilitadora nas conversas.
 * Visual distintivo para diferenciar de usuarios humanos.
 *
 * REGRAS DE EXIBICAO:
 * - Sempre mostra avatar da IA
 * - Links sao formatados como Markdown
 * - Nunca mistura blog e app na mesma resposta
 */

import React from 'react';
import Link from 'next/link';
import {
  Bot,
  Sparkles,
  BookOpen,
  Smartphone,
  AlertCircle,
  MessageSquare,
  ExternalLink,
} from 'lucide-react';

// ========================================
// TIPOS
// ========================================

export type TipoRespostaIA = 'facilitacao' | 'blog' | 'app' | 'correcao';

export interface IAResponseProps {
  texto: string;
  tipo: TipoRespostaIA;
  temLink?: boolean;
  linkTipo?: 'blog' | 'app';
  timestamp?: Date;
  className?: string;
}

// ========================================
// CONFIGURACAO VISUAL POR TIPO
// ========================================

const CONFIG_VISUAL: Record<
  TipoRespostaIA,
  {
    icon: React.ElementType;
    label: string;
    borderColor: string;
    bgGradient: string;
    iconColor: string;
  }
> = {
  facilitacao: {
    icon: MessageSquare,
    label: 'IA Facilitadora',
    borderColor: 'border-[#00ff88]/30',
    bgGradient: 'from-[#00ff88]/5 to-transparent',
    iconColor: 'text-[#00ff88]',
  },
  blog: {
    icon: BookOpen,
    label: 'IA Facilitadora',
    borderColor: 'border-cyan-500/30',
    bgGradient: 'from-cyan-500/5 to-transparent',
    iconColor: 'text-cyan-400',
  },
  app: {
    icon: Smartphone,
    label: 'IA Facilitadora',
    borderColor: 'border-purple-500/30',
    bgGradient: 'from-purple-500/5 to-transparent',
    iconColor: 'text-purple-400',
  },
  correcao: {
    icon: AlertCircle,
    label: 'IA Facilitadora',
    borderColor: 'border-amber-500/30',
    bgGradient: 'from-amber-500/5 to-transparent',
    iconColor: 'text-amber-400',
  },
};

// ========================================
// COMPONENTE AVATAR IA
// ========================================

export function IAAvatarBadge({ className = '' }: { className?: string }) {
  return (
    <div
      className={`
        relative w-10 h-10 rounded-xl
        bg-gradient-to-br from-[#00ff88]/20 to-[#00ff88]/5
        border border-[#00ff88]/30
        flex items-center justify-center
        ${className}
      `}
    >
      <Bot className="w-5 h-5 text-[#00ff88]" />
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#00ff88] rounded-full flex items-center justify-center">
        <Sparkles className="w-2.5 h-2.5 text-black" />
      </div>
    </div>
  );
}

// ========================================
// PARSER DE TEXTO COM LINKS
// ========================================

function parseTextoComLinks(texto: string): React.ReactNode[] {
  // Regex para detectar links Markdown: [texto](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const partes: React.ReactNode[] = [];
  let ultimoIndice = 0;
  let match;

  while ((match = linkRegex.exec(texto)) !== null) {
    // Texto antes do link
    if (match.index > ultimoIndice) {
      partes.push(texto.slice(ultimoIndice, match.index));
    }

    // O link
    const [, linkText, linkUrl] = match;
    const isExternal = linkUrl.startsWith('http');

    partes.push(
      <Link
        key={match.index}
        href={linkUrl}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className="inline-flex items-center gap-1 text-[#00ff88] hover:text-[#00ff88]/80 underline underline-offset-2 transition-colors"
      >
        {linkText}
        {isExternal && <ExternalLink className="w-3 h-3" />}
      </Link>
    );

    ultimoIndice = match.index + match[0].length;
  }

  // Texto restante
  if (ultimoIndice < texto.length) {
    partes.push(texto.slice(ultimoIndice));
  }

  return partes;
}

// ========================================
// COMPONENTE PRINCIPAL
// ========================================

export default function IAResponse({
  texto,
  tipo,
  temLink,
  linkTipo,
  timestamp,
  className = '',
}: IAResponseProps) {
  const config = CONFIG_VISUAL[tipo];
  const Icon = config.icon;

  // Parse do texto para renderizar links
  const conteudoFormatado = parseTextoComLinks(texto);

  return (
    <div
      className={`
        relative p-4 rounded-xl
        border ${config.borderColor}
        bg-gradient-to-r ${config.bgGradient}
        ${className}
      `}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <IAAvatarBadge />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white text-sm">
              {config.label}
            </span>
            <span
              className={`
                px-2 py-0.5 rounded-full text-[10px] font-medium uppercase
                ${config.iconColor} bg-current/10
              `}
            >
              {tipo === 'correcao' ? 'Correcao' : tipo === 'blog' ? 'Artigo' : tipo === 'app' ? 'Dica' : 'Insight'}
            </span>
          </div>

          {timestamp && (
            <span className="text-xs text-zinc-500">
              {timestamp.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          )}
        </div>
      </div>

      {/* Conteudo */}
      <div className="pl-13 ml-0">
        <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line">
          {conteudoFormatado}
        </p>
      </div>

      {/* Indicador de link */}
      {temLink && linkTipo && (
        <div className="mt-3 pt-3 border-t border-zinc-800/50">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            {linkTipo === 'blog' ? (
              <>
                <BookOpen className="w-3.5 h-3.5" />
                <span>Artigo do Blog para aprofundar</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5" />
                <span>Disponivel no App Premium</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Decoracao */}
      <div
        className="absolute top-0 left-0 w-1 h-full rounded-l-xl"
        style={{
          background: `linear-gradient(to bottom, ${
            tipo === 'blog'
              ? '#22d3ee'
              : tipo === 'app'
              ? '#a855f7'
              : tipo === 'correcao'
              ? '#f59e0b'
              : '#00ff88'
          }40, transparent)`,
        }}
      />
    </div>
  );
}

// ========================================
// COMPONENTE COMPACTO (PARA FEED)
// ========================================

export function IAResponseCompact({
  texto,
  tipo,
}: Pick<IAResponseProps, 'texto' | 'tipo'>) {
  const config = CONFIG_VISUAL[tipo];

  return (
    <div
      className={`
        flex items-start gap-2 p-3 rounded-lg
        border ${config.borderColor}
        bg-gradient-to-r ${config.bgGradient}
      `}
    >
      <Bot className={`w-4 h-4 ${config.iconColor} flex-shrink-0 mt-0.5`} />
      <p className="text-sm text-zinc-400 line-clamp-2">{texto}</p>
    </div>
  );
}
