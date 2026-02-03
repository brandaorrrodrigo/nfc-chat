export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

/**
 * Endpoint de verificação de versão
 * Retorna a versão atual do deploy para confirmar que o código mais recente está ativo
 */
export async function GET() {
  return NextResponse.json({
    version: '1.1-ANTI-EXPLOIT',
    buildDate: new Date().toISOString(),
    commit: '0b63d66',
    message: 'Sistema anti-exploit de FP + detecção aprimorada',
    features: [
      '🔒 ANTI-EXPLOIT: Deletar mensagem remove FP ganho',
      '🔒 Rastreamento de FP por messageId',
      'ReactMarkdown com importação dinâmica (fix hidratação)',
      'Detecção aprimorada de receitas (panqueca, etc)',
      'Detecção aprimorada de exercícios (avanço, afundo, etc)',
      'Logs de debug com indicador 🚀 [VERSÃO DEBUG v1.0]',
      'Templates com gênero neutro (bem-vindo(a))',
      'Suporte a nutrition_analysis, biomechanics_analysis, etc',
    ],
    antiExploit: {
      enabled: true,
      features: [
        'FP removido ao deletar mensagem',
        'Cooldown 1min entre mensagens',
        'Limite 30 FP/dia',
        'Mensagem mínima 5 chars',
      ],
    },
  });
}
