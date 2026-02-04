/**
 * Sistema de Naturalização de Linguagem
 * Baseado em: DICIONARIO_LINGUAGEM_HUMANA.md
 *
 * Converte texto formal/perfeito em texto natural e humano
 */

// ============================================
// 1) BANCO DE DADOS DE PADRÕES NATURAIS
// ============================================

const GIRIAS_TREINO = [
  'pump', 'shape', 'travado', 'pesado demais', 'falhando',
  'queimou tudo', 'senti pegar', 'pegou errado', 'roubando no movimento',
  'forçando a lombar', 'jogando peso', 'tá estranho', 'não desce legal',
  'não sobe redondo'
];

const GIRIAS_DOR = [
  'lombar gritando', 'ombro reclamando', 'joelho esquisito',
  'sensação ruim', 'puxando errado', 'dor chata', 'fisgada',
  'pressão estranha'
];

const GIRIAS_OPINIAO = [
  'acho que', 'pra mim foi assim', 'no meu caso', 'posso estar errado',
  'comigo funcionou', 'fiquei com medo', 'confesso que', 'fiquei na dúvida'
];

const INICIOS_RESPOSTA = [
  'Cara, comigo foi assim',
  'No meu caso',
  'Já passei por isso',
  'Eu achava que era frescura, mas',
  'Não sou especialista, mas'
];

const DISCORDANCIA_LEVE = [
  'Nem sempre é isso',
  'Depende muito da pessoa',
  'Já vi funcionar diferente',
  'Acho que não é só isso'
];

const RELATO_ERRO = [
  'eu fazia tudo errado',
  'treinei assim por anos',
  'ignorei e deu ruim',
  'forcei e me ferrei'
];

// Substituições de palavras formais → informais
const SUBSTITUICOES_INFORMAIS: Record<string, string[]> = {
  'muito': ['muiito', 'muito'],
  'também': ['tb', 'também'],
  'porque': ['pq', 'porque'],
  'você': ['vc', 'você'],
  'quando': ['qdo', 'quando'],
  'agachamento': ['agachamento', 'agachaemto'],
  'lombar': ['lombar', 'lombra'],
  'mobilidade': ['mobilidade', 'mobilidde'],
  'encurtado': ['encurtado', 'encurtado msm'],
  'não': ['não', 'nao'],
  'alguém': ['alguém', 'alguem'],
};

// ============================================
// 2) FUNÇÃO DE NATURALIZAÇÃO
// ============================================

export interface NaturalizacaoOptions {
  nivel?: 'leve' | 'medio' | 'forte'; // Intensidade da naturalização
  perfil?: 'emocional' | 'pratico' | 'tecnico' | 'avancado'; // Perfil do usuário
  aplicarErros?: boolean; // Aplicar erros ortográficos propositais
  usarGirias?: boolean; // Usar gírias do contexto
}

/**
 * Naturaliza texto formal/perfeito para parecer humano
 */
export function naturalizarTexto(
  texto: string,
  options: NaturalizacaoOptions = {}
): string {
  const {
    nivel = 'medio',
    perfil = 'pratico',
    aplicarErros = true,
    usarGirias = true
  } = options;

  let resultado = texto;

  // 1. Adicionar início natural se não tiver
  if (perfil === 'emocional' && Math.random() < 0.4) {
    const inicio = INICIOS_RESPOSTA[Math.floor(Math.random() * INICIOS_RESPOSTA.length)];
    resultado = `${inicio}… ${resultado}`;
  }

  // 2. Aplicar substituições informais
  if (aplicarErros) {
    const intensidade = nivel === 'leve' ? 0.2 : nivel === 'medio' ? 0.4 : 0.6;

    Object.entries(SUBSTITUICOES_INFORMAIS).forEach(([formal, opcoes]) => {
      const regex = new RegExp(`\\b${formal}\\b`, 'gi');
      resultado = resultado.replace(regex, (match) => {
        if (Math.random() < intensidade) {
          return opcoes[Math.floor(Math.random() * opcoes.length)];
        }
        return match;
      });
    });
  }

  // 3. Quebrar frases muito longas
  resultado = quebrarFrasesLongas(resultado, perfil);

  // 4. Remover pontuação excessivamente formal
  if (nivel !== 'leve') {
    resultado = simplificarPontuacao(resultado);
  }

  // 5. Adicionar reticências ocasionais (naturalidade)
  if (Math.random() < 0.3) {
    resultado = resultado.replace(/\. /g, (match) => {
      return Math.random() < 0.3 ? '... ' : match;
    });
  }

  return resultado.trim();
}

/**
 * Quebra frases muito longas em pedaços menores e naturais
 */
function quebrarFrasesLongas(texto: string, perfil: string): string {
  const frases = texto.split(/\.\s+/);

  return frases.map(frase => {
    // Usuários técnicos/avançados podem ter frases mais longas
    const limiteCaracteres = perfil === 'avancado' ? 200 : 120;

    if (frase.length > limiteCaracteres) {
      // Quebra em vírgulas
      return frase.replace(/,\s+/g, '. ');
    }
    return frase;
  }).join('. ');
}

/**
 * Simplifica pontuação para parecer mais casual
 */
function simplificarPontuacao(texto: string): string {
  let resultado = texto;

  // Às vezes remove ponto final
  if (Math.random() < 0.2) {
    resultado = resultado.replace(/\.$/, '');
  }

  // Às vezes remove interrogação
  if (Math.random() < 0.15) {
    resultado = resultado.replace(/\?$/, '');
  }

  return resultado;
}

// ============================================
// 3) FUNÇÃO DE VALIDAÇÃO DE NATURALIDADE
// ============================================

export interface ValidacaoNaturalidade {
  score: number; // 0-100 (0 = muito formal, 100 = muito natural)
  pareceHumano: boolean; // true se score >= 60
  problemas: string[];
  sugestoes: string[];
}

/**
 * Valida se um texto parece natural/humano ou muito formal/IA
 */
export function validarNaturalidade(texto: string): ValidacaoNaturalidade {
  const problemas: string[] = [];
  const sugestoes: string[] = [];
  let score = 100; // Começa perfeito e vai descontando

  // 1. Texto muito longo (usuários comuns não escrevem muito)
  if (texto.length > 500) {
    problemas.push('Texto muito longo para usuário comum');
    sugestoes.push('Reduza para < 500 caracteres ou quebre em múltiplas mensagens');
    score -= 20;
  }

  // 2. Pontuação perfeita demais
  const frasesComPontoFinal = (texto.match(/\.\s+[A-Z]/g) || []).length;
  const frasesTotal = texto.split(/[.!?]+/).length;
  if (frasesComPontoFinal === frasesTotal - 1 && frasesTotal > 2) {
    problemas.push('Pontuação perfeita demais');
    sugestoes.push('Remova alguns pontos finais ou substitua por reticências');
    score -= 15;
  }

  // 3. Sem gírias ou expressões informais
  const temGirias = GIRIAS_TREINO.some(g => texto.toLowerCase().includes(g)) ||
                    GIRIAS_DOR.some(g => texto.toLowerCase().includes(g)) ||
                    GIRIAS_OPINIAO.some(g => texto.toLowerCase().includes(g));

  if (!temGirias && texto.length > 100) {
    problemas.push('Sem gírias ou expressões informais');
    sugestoes.push('Adicione expressões como "acho que", "no meu caso", "pra mim"');
    score -= 15;
  }

  // 4. Palavras muito técnicas/formais
  const palavrasTecnicas = [
    'hipertrofia', 'catabolismo', 'anabolismo', 'biomecânica',
    'periodização', 'metabolismo basal', 'termorregulação'
  ];
  const temMuitoTecnico = palavrasTecnicas.filter(p =>
    texto.toLowerCase().includes(p)
  ).length;

  if (temMuitoTecnico >= 3) {
    problemas.push('Linguagem muito técnica');
    sugestoes.push('Use termos mais simples ou explique os técnicos');
    score -= 10;
  }

  // 5. Estrutura muito perfeita (sem erros)
  const temErrosPropositais =
    /\b(tb|pq|vc|qdo|nao|alguem|muiito)\b/.test(texto);

  if (!temErrosPropositais && texto.length > 150) {
    problemas.push('Texto perfeito demais (sem erros naturais)');
    sugestoes.push('Adicione erros leves: "tb", "pq", "vc", "nao"');
    score -= 10;
  }

  // 6. Uso excessivo de emojis
  const emojis = texto.match(/[\u{1F300}-\u{1F9FF}]/gu) || [];
  if (emojis.length > 1) {
    problemas.push('Muitos emojis (máximo 1)');
    sugestoes.push('Remova emojis extras');
    score -= 5;
  }

  // 7. Frases muito curtas e diretas (estilo marketing)
  const frasesArray = texto.split(/[.!?]+/).filter(f => f.trim());
  const frasesRealmenteCurtas = frasesArray.filter(f => f.trim().length < 20);
  if (frasesRealmenteCurtas.length >= 3 && frasesArray.length >= 4) {
    problemas.push('Muitas frases curtas (estilo marketing)');
    sugestoes.push('Varie o tamanho das frases');
    score -= 10;
  }

  // 8. Sem opiniões pessoais
  const temOpiniaoPessoal =
    /\b(acho|acredito|pra mim|no meu caso|comigo|na minha)\b/i.test(texto);

  if (!temOpiniaoPessoal && texto.length > 100) {
    problemas.push('Sem opiniões pessoais');
    sugestoes.push('Adicione "acho que", "no meu caso", "pra mim"');
    score -= 10;
  }

  // Garantir que score não seja negativo
  score = Math.max(0, score);

  return {
    score,
    pareceHumano: score >= 60,
    problemas,
    sugestoes
  };
}

// ============================================
// 4) PERFIS DE USUÁRIO
// ============================================

/**
 * Gera configurações de naturalização baseadas no perfil do usuário
 * Baseado na proporção ideal: 60% emocional, 25% prático, 10% técnico, 5% avançado
 */
export function obterPerfilNaturalizacao(tipo: 'emocional' | 'pratico' | 'tecnico' | 'avancado'): NaturalizacaoOptions {
  switch (tipo) {
    case 'emocional': // 60% das respostas
      return {
        nivel: 'forte',
        perfil: 'emocional',
        aplicarErros: true,
        usarGirias: true
      };

    case 'pratico': // 25% das respostas
      return {
        nivel: 'medio',
        perfil: 'pratico',
        aplicarErros: true,
        usarGirias: true
      };

    case 'tecnico': // 10% das respostas
      return {
        nivel: 'leve',
        perfil: 'tecnico',
        aplicarErros: false,
        usarGirias: false
      };

    case 'avancado': // 5% das respostas
      return {
        nivel: 'leve',
        perfil: 'avancado',
        aplicarErros: false,
        usarGirias: false
      };
  }
}

/**
 * Seleciona um perfil aleatório baseado na distribuição ideal
 */
export function selecionarPerfilAleatorio(): 'emocional' | 'pratico' | 'tecnico' | 'avancado' {
  const random = Math.random();

  if (random < 0.60) return 'emocional';  // 60%
  if (random < 0.85) return 'pratico';    // 25%
  if (random < 0.95) return 'tecnico';    // 10%
  return 'avancado';                       // 5%
}

// ============================================
// 5) UTILITÁRIOS
// ============================================

/**
 * Aplica naturalização completa com validação
 */
export function naturalizarEValidar(texto: string, perfil?: 'emocional' | 'pratico' | 'tecnico' | 'avancado') {
  const perfilSelecionado = perfil || selecionarPerfilAleatorio();
  const opcoes = obterPerfilNaturalizacao(perfilSelecionado);

  let textoNaturalizado = naturalizarTexto(texto, opcoes);
  let validacao = validarNaturalidade(textoNaturalizado);

  // Se não passou na validação, tenta novamente com nível mais forte
  if (!validacao.pareceHumano && opcoes.nivel !== 'forte') {
    textoNaturalizado = naturalizarTexto(texto, {
      ...opcoes,
      nivel: 'forte',
      aplicarErros: true
    });
    validacao = validarNaturalidade(textoNaturalizado);
  }

  return {
    textoOriginal: texto,
    textoNaturalizado,
    validacao,
    perfil: perfilSelecionado
  };
}

/**
 * Adiciona variação humana a respostas repetidas
 */
export function variarResposta(respostas: string[]): string {
  if (respostas.length === 0) return '';

  const escolhida = respostas[Math.floor(Math.random() * respostas.length)];
  return naturalizarTexto(escolhida, {
    nivel: 'medio',
    aplicarErros: true,
    usarGirias: true
  });
}

export default {
  naturalizarTexto,
  validarNaturalidade,
  obterPerfilNaturalizacao,
  selecionarPerfilAleatorio,
  naturalizarEValidar,
  variarResposta
};
