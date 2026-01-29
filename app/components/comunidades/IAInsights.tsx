'use client';

/**
 * Componentes de UI para Intervencoes da IA
 *
 * TIPOS DE INTERVENCAO:
 * - Resumo: Sintese da discussao
 * - Destaque: Valoriza contribuicao humana
 * - Pergunta: Desempata discussao
 * - PonteBlog: Direciona para artigo
 * - PonteApp: Menciona app (sem CTA agressivo)
 *
 * A IA NAO e protagonista.
 * A IA VALORIZA humanos.
 */

import React from 'react';
import Link from 'next/link';
import {
  Bot,
  Sparkles,
  MessageSquare,
  User,
  HelpCircle,
  BookOpen,
  Smartphone,
  TrendingUp,
  Quote,
} from 'lucide-react';
import type { TipoIntervencao, IntervencaoIA, UsuarioDestaque } from '@/lib/ia';

// ========================================
// COMPONENTE BASE: AVATAR IA
// ========================================

function IAAvatarMini({ className = '' }: { className?: string }) {
  return (
    <div
      className={`
        w-8 h-8 rounded-lg
        bg-gradient-to-br from-[#00f5ff]/20 to-transparent
        border border-[#00f5ff]/20
        flex items-center justify-center
        ${className}
      `}
    >
      <Bot className="w-4 h-4 text-[#00f5ff]/70" />
    </div>
  );
}

// ========================================
// COMPONENTE: RESUMO DA DISCUSSAO
// ========================================

interface ResumoProps {
  texto: string;
  totalMensagens?: number;
  temasAtivos?: string[];
  className?: string;
}

export function IAResumo({ texto, totalMensagens, temasAtivos, className = '' }: ResumoProps) {
  return (
    <div
      className={`
        relative p-4 rounded-xl
        bg-zinc-900/50 border border-zinc-800/50
        ${className}
      `}
    >
      {/* Header discreto */}
      <div className="flex items-center gap-2 mb-3">
        <IAAvatarMini />
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500 font-medium">Resumo do painel</span>
          {totalMensagens && (
            <span className="text-[10px] text-zinc-600 bg-zinc-800 px-2 py-0.5 rounded-full">
              {totalMensagens} mensagens
            </span>
          )}
        </div>
      </div>

      {/* Conteudo */}
      <p className="text-sm text-zinc-400 leading-relaxed pl-10">
        {texto}
      </p>

      {/* Temas ativos */}
      {temasAtivos && temasAtivos.length > 0 && (
        <div className="flex items-center gap-2 mt-3 pl-10">
          <TrendingUp className="w-3 h-3 text-zinc-600" />
          <div className="flex flex-wrap gap-1">
            {temasAtivos.slice(0, 3).map((tema) => (
              <span
                key={tema}
                className="text-[10px] text-zinc-500 bg-zinc-800/50 px-2 py-0.5 rounded"
              >
                {tema}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ========================================
// COMPONENTE: DESTAQUE DE USUARIO
// ========================================

interface DestaqueUsuarioProps {
  usuario: UsuarioDestaque;
  className?: string;
}

export function IADestaqueUsuario({ usuario, className = '' }: DestaqueUsuarioProps) {
  const motivoTexto: Record<UsuarioDestaque['motivo'], string> = {
    explicacao_clara: 'Explicacao clara',
    ponto_importante: 'Ponto importante',
    sintese: 'Boa sintese',
    experiencia_relevante: 'Experiencia relevante',
  };

  return (
    <div
      className={`
        relative p-4 rounded-xl
        bg-gradient-to-r from-amber-500/5 to-transparent
        border border-amber-500/20
        ${className}
      `}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <IAAvatarMini />
        <span className="text-xs text-zinc-500">Destaque da comunidade</span>
      </div>

      {/* Quote do usuario */}
      <div className="pl-10">
        <div className="flex items-start gap-3 p-3 bg-zinc-900/50 rounded-lg border border-zinc-800/50">
          <Quote className="w-4 h-4 text-amber-500/50 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <User className="w-3 h-3 text-zinc-500" />
              <span className="text-sm font-medium text-white">{usuario.autorNome}</span>
              <span className="text-[10px] text-amber-500/70 bg-amber-500/10 px-2 py-0.5 rounded-full">
                {motivoTexto[usuario.motivo]}
              </span>
            </div>
            <p className="text-sm text-zinc-400 italic line-clamp-3">
              "{usuario.texto}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ========================================
// COMPONENTE: PERGUNTA ABERTA
// ========================================

interface PerguntaAbertaProps {
  texto: string;
  className?: string;
}

export function IAPerguntaAberta({ texto, className = '' }: PerguntaAbertaProps) {
  return (
    <div
      className={`
        relative p-4 rounded-xl
        bg-gradient-to-r from-cyan-500/5 to-transparent
        border border-cyan-500/20
        ${className}
      `}
    >
      <div className="flex items-start gap-3">
        <IAAvatarMini />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-cyan-500/70" />
            <span className="text-xs text-zinc-500">Pergunta para a comunidade</span>
          </div>
          <p className="text-sm text-zinc-300 font-medium">
            {texto}
          </p>
        </div>
      </div>
    </div>
  );
}

// ========================================
// COMPONENTE: PONTE PARA BLOG
// ========================================

interface PonteBlogProps {
  texto: string;
  linkBlog?: string;
  tema?: string;
  className?: string;
}

export function IAPonteBlog({ texto, linkBlog, tema, className = '' }: PonteBlogProps) {
  return (
    <div
      className={`
        relative p-4 rounded-xl
        bg-gradient-to-r from-purple-500/5 to-transparent
        border border-purple-500/20
        ${className}
      `}
    >
      <div className="flex items-start gap-3">
        <IAAvatarMini />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-3.5 h-3.5 text-purple-500/70" />
            <span className="text-xs text-zinc-500">Artigo relacionado</span>
            {tema && (
              <span className="text-[10px] text-purple-400/70 bg-purple-500/10 px-2 py-0.5 rounded">
                {tema}
              </span>
            )}
          </div>
          <p className="text-sm text-zinc-400 mb-2">
            {texto.split(linkBlog || '')[0]}
          </p>
          {linkBlog && (
            <Link
              href={linkBlog}
              className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
            >
              <span>Ler artigo completo</span>
              <span className="text-purple-500/50">→</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

// ========================================
// COMPONENTE: PONTE PARA APP
// ========================================

interface PonteAppProps {
  texto: string;
  className?: string;
}

export function IAPonteApp({ texto, className = '' }: PonteAppProps) {
  return (
    <div
      className={`
        relative p-4 rounded-xl
        bg-zinc-900/30 border border-zinc-800/30
        ${className}
      `}
    >
      <div className="flex items-start gap-3">
        <IAAvatarMini />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Smartphone className="w-3.5 h-3.5 text-zinc-500" />
            <span className="text-xs text-zinc-600">Dica</span>
          </div>
          <p className="text-sm text-zinc-500">
            {texto}
          </p>
        </div>
      </div>
    </div>
  );
}

// ========================================
// COMPONENTE: RENDERIZADOR GENERICO
// ========================================

interface IAInsightProps {
  intervencao: IntervencaoIA;
  usuarioDestaque?: UsuarioDestaque;
  totalMensagens?: number;
  temasAtivos?: string[];
  className?: string;
}

export default function IAInsight({
  intervencao,
  usuarioDestaque,
  totalMensagens,
  temasAtivos,
  className = '',
}: IAInsightProps) {
  switch (intervencao.tipo) {
    case 'resumo':
      return (
        <IAResumo
          texto={intervencao.texto}
          totalMensagens={totalMensagens}
          temasAtivos={temasAtivos}
          className={className}
        />
      );

    case 'destaque_usuario':
      if (!usuarioDestaque) return null;
      return <IADestaqueUsuario usuario={usuarioDestaque} className={className} />;

    case 'pergunta_aberta':
      return <IAPerguntaAberta texto={intervencao.texto} className={className} />;

    case 'ponte_blog':
      return (
        <IAPonteBlog
          texto={intervencao.texto}
          linkBlog={intervencao.metadados.linkBlog}
          tema={intervencao.metadados.temaRelacionado}
          className={className}
        />
      );

    case 'ponte_app':
      return <IAPonteApp texto={intervencao.texto} className={className} />;

    default:
      return null;
  }
}

// ========================================
// COMPONENTE: PERGUNTA DO DIA
// ========================================

interface PerguntaDoDiaProps {
  pergunta: string;
  fase?: string;
  className?: string;
}

export function IAPerguntaDoDia({ pergunta, fase, className = '' }: PerguntaDoDiaProps) {
  return (
    <div
      className={`
        relative overflow-hidden p-5 rounded-2xl
        bg-gradient-to-br from-[#8b5cf6]/10 via-[#00f5ff]/5 to-transparent
        border border-[#8b5cf6]/30
        ${className}
      `}
      style={{
        boxShadow: '0 0 30px rgba(139, 92, 246, 0.1)',
      }}
    >
      {/* Decoracao */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#8b5cf6]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#00f5ff]/5 rounded-full blur-3xl" />

      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8b5cf6]/30 to-[#00f5ff]/20 border border-[#8b5cf6]/40 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#00f5ff]" />
          </div>
          <div>
            <span className="text-xs text-[#00f5ff] font-medium">Pergunta do dia</span>
            {fase && (
              <span className="text-[10px] text-zinc-500 ml-2">Fase: {fase}</span>
            )}
          </div>
        </div>

        <p className="text-white font-medium leading-relaxed">
          {pergunta}
        </p>

        <p className="text-xs text-zinc-500 mt-3">
          Compartilhe sua experiencia com a comunidade
        </p>
      </div>
    </div>
  );
}
