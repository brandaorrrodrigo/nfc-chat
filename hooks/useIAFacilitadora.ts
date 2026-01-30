/**
 * Hook: useIAFacilitadora
 *
 * Gerencia interacoes com a IA nas comunidades.
 * Controla quando e como a IA deve responder.
 */

'use client';

import { useState, useCallback, useRef } from 'react';

// ========================================
// TIPOS
// ========================================

interface Mensagem {
  id: string;
  texto: string;
  autorId: string;
  autorNome: string;
  isIA: boolean;
  timestamp: string;
}

interface RespostaIA {
  texto: string;
  tipo: 'facilitacao' | 'blog' | 'app' | 'correcao';
  temLink: boolean;
  linkTipo?: 'blog' | 'app';
  followUpQuestion?: string;
}

interface AnalisarConversaResult {
  resposta: RespostaIA | null;
  interventionId?: string;
  antiSpamStats?: {
    adjustedProbability?: number;
    canIntervene?: boolean;
    reason?: string;
  };
}

interface StatusIA {
  status: 'ativa' | 'inativa';
  fase: string;
  diasAtiva: number;
  perguntaDoDia: string;
}

interface UseIAFacilitadoraReturn {
  // Estado
  isLoading: boolean;
  error: string | null;
  ultimaResposta: RespostaIA | null;
  statusIA: StatusIA | null;
  ultimaInterventionId: string | null;

  // Acoes
  analisarConversa: (
    mensagens: Mensagem[],
    topicoTitulo: string,
    comunidadeSlug: string,
    userId: string
  ) => Promise<AnalisarConversaResult>;
  obterStatus: () => Promise<StatusIA | null>;
  obterRespostaContextual: (categoria: string, userId: string) => Promise<string | null>;
  notificarRespostaUsuario: (
    userId: string,
    comunidadeSlug: string,
    mensagem: string,
    messageId: string
  ) => Promise<boolean>;

  // Controle
  limparResposta: () => void;
  linksEnviadosHoje: number;
  incrementarLinks: () => void;
}

// ========================================
// HOOK
// ========================================

export function useIAFacilitadora(): UseIAFacilitadoraReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ultimaResposta, setUltimaResposta] = useState<RespostaIA | null>(null);
  const [statusIA, setStatusIA] = useState<StatusIA | null>(null);
  const [linksEnviadosHoje, setLinksEnviadosHoje] = useState(0);
  const [ultimaInterventionId, setUltimaInterventionId] = useState<string | null>(null);

  // Ref para controlar ultima intervencao
  const ultimaIntervencaoRef = useRef<Date | null>(null);

  /**
   * Analisa conversa e obtem resposta da IA se necessario
   * Agora com suporte a anti-spam e tracking de intervencoes
   */
  const analisarConversa = useCallback(
    async (
      mensagens: Mensagem[],
      topicoTitulo: string,
      comunidadeSlug: string,
      userId: string
    ): Promise<AnalisarConversaResult> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/comunidades/ia', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mensagens,
            topicoTitulo,
            comunidadeSlug,
            ultimaIntervencaoIA: ultimaIntervencaoRef.current?.toISOString(),
            linksEnviadosHoje,
            userId,
          }),
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Erro desconhecido');
        }

        if (data.deveResponder && data.resposta) {
          setUltimaResposta(data.resposta);
          ultimaIntervencaoRef.current = new Date();

          // Salvar ID da intervencao para tracking
          if (data.interventionId) {
            setUltimaInterventionId(data.interventionId);
          }

          // Incrementar contador de links se resposta tem link
          if (data.resposta.temLink) {
            setLinksEnviadosHoje((prev) => prev + 1);
          }

          return {
            resposta: data.resposta,
            interventionId: data.interventionId,
            antiSpamStats: data.antiSpam,
          };
        }

        return {
          resposta: null,
          antiSpamStats: data.antiSpam,
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao analisar conversa';
        setError(message);
        return { resposta: null };
      } finally {
        setIsLoading(false);
      }
    },
    [linksEnviadosHoje]
  );

  /**
   * Obtem status atual da IA
   */
  const obterStatus = useCallback(async (): Promise<StatusIA | null> => {
    try {
      const response = await fetch('/api/comunidades/ia');
      const data = await response.json();

      if (data.success && data.ia) {
        setStatusIA(data.ia);
        return data.ia;
      }

      return null;
    } catch (err) {
      console.error('[useIAFacilitadora] Erro ao obter status:', err);
      return null;
    }
  }, []);

  /**
   * Obtem resposta contextual por categoria
   */
  const obterRespostaContextual = useCallback(
    async (categoria: string, userId: string): Promise<string | null> => {
      try {
        const response = await fetch('/api/comunidades/ia', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mensagens: [],
            topicoTitulo: '',
            comunidadeSlug: '',
            categoria,
            userId,
          }),
        });

        const data = await response.json();

        if (data.success && data.deveResponder && data.resposta) {
          return data.resposta.texto;
        }

        return null;
      } catch (err) {
        console.error('[useIAFacilitadora] Erro ao obter resposta contextual:', err);
        return null;
      }
    },
    []
  );

  /**
   * Notifica o sistema quando o usuario responde a uma intervencao da IA
   * Usado para marcar perguntas como respondidas e atualizar probabilidades
   */
  const notificarRespostaUsuario = useCallback(
    async (
      userId: string,
      comunidadeSlug: string,
      mensagem: string,
      messageId: string
    ): Promise<boolean> => {
      try {
        const response = await fetch('/api/comunidades/ia/resposta', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            comunidadeSlug,
            mensagem,
            messageId,
          }),
        });

        const data = await response.json();
        return data.success && data.wasResponse;
      } catch (err) {
        console.error('[useIAFacilitadora] Erro ao notificar resposta:', err);
        return false;
      }
    },
    []
  );

  /**
   * Limpa ultima resposta
   */
  const limparResposta = useCallback(() => {
    setUltimaResposta(null);
    setError(null);
  }, []);

  /**
   * Incrementa contador de links manualmente
   */
  const incrementarLinks = useCallback(() => {
    setLinksEnviadosHoje((prev) => prev + 1);
  }, []);

  return {
    // Estado
    isLoading,
    error,
    ultimaResposta,
    statusIA,
    ultimaInterventionId,

    // Acoes
    analisarConversa,
    obterStatus,
    obterRespostaContextual,
    notificarRespostaUsuario,

    // Controle
    limparResposta,
    linksEnviadosHoje,
    incrementarLinks,
  };
}

// ========================================
// COMPONENTE DE RESPOSTA IA
// ========================================

export interface IAResponseProps {
  resposta: RespostaIA;
  onDismiss?: () => void;
}

/**
 * Helper para renderizar resposta da IA formatada
 */
export function formatarRespostaIA(resposta: RespostaIA): string {
  // O texto ja vem formatado do backend com Markdown
  return resposta.texto;
}
