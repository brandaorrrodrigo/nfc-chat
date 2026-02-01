import { NextResponse } from 'next/server';

/**
 * Endpoint de verificação de versão
 * Retorna a versão atual do deploy para confirmar que o código mais recente está ativo
 */
export async function GET() {
  return NextResponse.json({
    version: '1.0-DEBUG',
    buildDate: new Date().toISOString(),
    commit: '0e5b7bd',
    message: 'Versão com logs de debug e detecção aprimorada de exercícios/receitas',
    features: [
      'ReactMarkdown com importação dinâmica (fix hidratação)',
      'Detecção aprimorada de receitas (panqueca, etc)',
      'Detecção aprimorada de exercícios (avanço, afundo, etc)',
      'Logs de debug com indicador 🚀 [VERSÃO DEBUG v1.0]',
      'Templates com gênero neutro (bem-vindo(a))',
      'Suporte a nutrition_analysis, biomechanics_analysis, etc',
    ],
  });
}
