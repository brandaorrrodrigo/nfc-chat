/**
 * EXEMPLO DE USO DO SISTEMA DE NATURALIZAÇÃO
 *
 * Este arquivo demonstra como usar o sistema de linguagem natural
 * em diferentes contextos da aplicação.
 */

import {
  naturalizarTexto,
  validarNaturalidade,
  naturalizarEValidar,
  variarResposta,
  selecionarPerfilAleatorio,
  obterPerfilNaturalizacao,
} from './language-naturalizer';

// ============================================
// EXEMPLO 1: USO NA API DE MENSAGENS
// ============================================

/**
 * Simula geração de resposta da IA em /api/comunidades/ia
 */
export async function exemploAPIResposta() {
  // Resposta gerada pela IA (ainda formal)
  const respostaIAFormal = `
    A hipertrofia muscular depende de três fatores principais:
    treinamento de resistência progressivo, ingestão proteica adequada,
    e recuperação suficiente. É fundamental manter a consistência
    ao longo do tempo para obter resultados significativos.
  `.trim();

  // OPÇÃO A: Uso simplificado (recomendado)
  const { textoNaturalizado, validacao, perfil } = naturalizarEValidar(
    respostaIAFormal
  );

  console.log('Perfil selecionado:', perfil);
  console.log('Score de naturalidade:', validacao.score);
  console.log('Resposta final:', textoNaturalizado);

  return {
    resposta: textoNaturalizado,
    validacao: {
      score: validacao.score,
      pareceHumano: validacao.pareceHumano,
    },
  };
}

// ============================================
// EXEMPLO 2: USO COM CONTROLE MANUAL DE PERFIL
// ============================================

/**
 * Quando você quer controlar o perfil baseado no contexto
 */
export function exemploPerfilContextual(contexto: {
  nivelUsuario: 'iniciante' | 'intermediario' | 'avancado';
  topicoTecnico: boolean;
}) {
  const { nivelUsuario, topicoTecnico } = contexto;

  // Decidir perfil baseado no contexto
  let perfil: 'emocional' | 'pratico' | 'tecnico' | 'avancado';

  if (nivelUsuario === 'iniciante') {
    perfil = 'emocional'; // Mais acolhedor
  } else if (topicoTecnico) {
    perfil = 'tecnico'; // Mais formal para temas técnicos
  } else if (nivelUsuario === 'avancado') {
    perfil = 'avancado'; // Usuário experiente
  } else {
    perfil = 'pratico'; // Default
  }

  const respostaIA = 'Você precisa aumentar a ingestão de proteína para 2g/kg.';

  // Naturalizar com perfil específico
  const resultado = naturalizarEValidar(respostaIA, perfil);

  return resultado.textoNaturalizado;
}

// ============================================
// EXEMPLO 3: VALIDAÇÃO MANUAL (DEBUG)
// ============================================

/**
 * Validar texto antes de enviar em modo debug
 */
export function exemploValidacaoManual(texto: string) {
  const validacao = validarNaturalidade(texto);

  if (!validacao.pareceHumano) {
    console.warn('⚠️  AVISO: Texto não parece humano!');
    console.warn('Score:', validacao.score);
    console.warn('Problemas:', validacao.problemas);
    console.warn('Sugestões:', validacao.sugestoes);

    // Tentar re-naturalizar com nível mais forte
    const textoRefeito = naturalizarTexto(texto, {
      nivel: 'forte',
      perfil: 'emocional',
      aplicarErros: true,
      usarGirias: true,
    });

    const novaValidacao = validarNaturalidade(textoRefeito);
    console.log('✅ Nova tentativa - Score:', novaValidacao.score);

    return textoRefeito;
  }

  console.log('✅ Texto aprovado - Score:', validacao.score);
  return texto;
}

// ============================================
// EXEMPLO 4: VARIAR RESPOSTAS PRÉ-DEFINIDAS
// ============================================

/**
 * Templates de resposta que variam automaticamente
 */
export function exemploTemplatesVariados() {
  // Respostas sobre proteína
  const respostasProteina = [
    'Proteína é importante, mas não precisa se matar tentando bater a meta todo dia.',
    'O ideal são 1.6-2.2g/kg, mas se ficar em 1.5g já está ótimo.',
    'Prefira proteína de qualidade: carne, frango, peixe, ovos, whey.',
    'Mais importante que a quantidade exata é a consistência ao longo da semana.',
  ];

  // Respostas sobre treino
  const respostasTreino = [
    'Consistência > intensidade. Melhor treinar 3x bem do que 6x mal.',
    'Progressão de carga é o que faz diferença no longo prazo.',
    'Descanso é tão importante quanto o treino em si.',
    'Treino perfeito não existe, o melhor é aquele que você consegue manter.',
  ];

  // Selecionar e naturalizar automaticamente
  const respostaProteina = variarResposta(respostasProteina);
  const respostaTreino = variarResposta(respostasTreino);

  return {
    proteina: respostaProteina,
    treino: respostaTreino,
  };
}

// ============================================
// EXEMPLO 5: NATURALIZAR FOLLOW-UP QUESTIONS
// ============================================

/**
 * Naturalizar perguntas de follow-up também
 */
export function exemploFollowUpNaturalizado() {
  const perguntasFormal = [
    'Qual é a sua ingestão proteica atual em gramas por quilograma?',
    'Você já tentou implementar o jejum intermitente anteriormente?',
    'Como você avalia o seu nível de energia durante os treinos?',
  ];

  // Naturalizar cada pergunta
  const perguntasNaturais = perguntasFormal.map((pergunta) => {
    const opcoes = obterPerfilNaturalizacao('pratico');
    return naturalizarTexto(pergunta, opcoes);
  });

  return perguntasNaturais;
}

// ============================================
// EXEMPLO 6: INTEGRAÇÃO COM DECISION ENGINE
// ============================================

/**
 * Como seria usado no fluxo real da decision-engine.ts
 * (já está implementado no arquivo real)
 */
export async function exemploDecisionEngineIntegration() {
  // Simular resposta gerada
  const respostaBase = {
    texto: 'O deficit calórico é fundamental para emagrecimento.',
    tipo: 'facilitacao' as const,
    temLink: false,
  };

  const followUpQuestion = 'Você já tentou controlar suas calorias?';

  // Combinar resposta + follow-up
  const respostaCompleta = `${respostaBase.texto}\n\n${followUpQuestion}`;

  // Naturalizar tudo junto
  const perfil = selecionarPerfilAleatorio();
  const opcoes = obterPerfilNaturalizacao(perfil);
  const respostaFinal = naturalizarTexto(respostaCompleta, opcoes);

  // Validar em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    const validacao = validarNaturalidade(respostaFinal);
    if (!validacao.pareceHumano) {
      console.warn('[IA] Score baixo:', {
        score: validacao.score,
        perfil,
        problemas: validacao.problemas,
      });
    }
  }

  return {
    resposta: respostaFinal,
    perfil,
  };
}

// ============================================
// EXEMPLO 7: TESTES A/B
// ============================================

/**
 * Comparar versão formal vs naturalizada
 */
export function exemploTestesAB() {
  const textos = [
    'A hipertrofia muscular requer consistência e progressão de carga.',
    'Você deve consumir proteína adequada para otimizar os resultados.',
    'O jejum intermitente é uma estratégia nutricional válida.',
  ];

  const comparacoes = textos.map((texto) => {
    const resultado = naturalizarEValidar(texto);

    return {
      original: texto,
      naturalizado: resultado.textoNaturalizado,
      scoreOriginal: validarNaturalidade(texto).score,
      scoreNaturalizado: resultado.validacao.score,
      melhoria: resultado.validacao.score - validarNaturalidade(texto).score,
      perfil: resultado.perfil,
    };
  });

  return comparacoes;
}

// ============================================
// EXEMPLO 8: NATURALIZAR POSTS COMPLETOS
// ============================================

/**
 * Naturalizar posts inteiros da comunidade (simulados)
 */
export function exemploPostCompleto() {
  const postSimulado = {
    titulo: 'Dúvida sobre proteína',
    conteudo: `
      Pessoal, estou com dúvida sobre a quantidade de proteína.
      Eu peso 70kg e estou consumindo 100g de proteína por dia.
      Será que isso é suficiente para ganhar massa muscular?
      Alguém tem experiência com isso?
    `.trim(),
  };

  // IA vai responder
  const respostaIA = `
    Para ganho de massa muscular, o recomendado é entre 1.6 a 2.2g de proteína
    por quilograma de peso corporal. No seu caso, seria entre 112g e 154g.
    Você está um pouco abaixo do ideal. Tente aumentar gradualmente.
  `.trim();

  // Naturalizar resposta
  const resultado = naturalizarEValidar(respostaIA, 'pratico');

  return {
    post: postSimulado,
    respostaOriginal: respostaIA,
    respostaNaturalizada: resultado.textoNaturalizado,
    score: resultado.validacao.score,
  };
}

// ============================================
// EXEMPLO 9: BATCH NATURALIZAÇÃO
// ============================================

/**
 * Naturalizar múltiplas mensagens de uma vez
 */
export function exemploBatchNaturalizacao(mensagens: string[]) {
  return mensagens.map((msg) => {
    const resultado = naturalizarEValidar(msg);
    return {
      original: msg,
      naturalizada: resultado.textoNaturalizado,
      score: resultado.validacao.score,
      aprovada: resultado.validacao.pareceHumano,
      perfil: resultado.perfil,
    };
  });
}

// ============================================
// EXEMPLO 10: ESTATÍSTICAS DE NATURALIZAÇÃO
// ============================================

/**
 * Coletar estatísticas sobre naturalização
 */
export function exemploEstatisticas(amostras: number = 100) {
  const perfis = { emocional: 0, pratico: 0, tecnico: 0, avancado: 0 };
  const scores: number[] = [];

  for (let i = 0; i < amostras; i++) {
    const perfil = selecionarPerfilAleatorio();
    perfis[perfil]++;

    const texto = 'Texto de exemplo para teste.';
    const opcoes = obterPerfilNaturalizacao(perfil);
    const naturalizado = naturalizarTexto(texto, opcoes);
    const validacao = validarNaturalidade(naturalizado);

    scores.push(validacao.score);
  }

  const scoresMedio = scores.reduce((a, b) => a + b, 0) / scores.length;
  const scoresAprovados = scores.filter((s) => s >= 60).length;

  return {
    amostras,
    distribuicaoPerfis: {
      emocional: `${perfis.emocional}% (meta: 60%)`,
      pratico: `${perfis.pratico}% (meta: 25%)`,
      tecnico: `${perfis.tecnico}% (meta: 10%)`,
      avancado: `${perfis.avancado}% (meta: 5%)`,
    },
    scoreMedio: scoresMedio.toFixed(1),
    taxaAprovacao: `${((scoresAprovados / amostras) * 100).toFixed(1)}%`,
  };
}

// ============================================
// EXPORTAR TUDO
// ============================================

export default {
  exemploAPIResposta,
  exemploPerfilContextual,
  exemploValidacaoManual,
  exemploTemplatesVariados,
  exemploFollowUpNaturalizado,
  exemploDecisionEngineIntegration,
  exemploTestesAB,
  exemploPostCompleto,
  exemploBatchNaturalizacao,
  exemploEstatisticas,
};
