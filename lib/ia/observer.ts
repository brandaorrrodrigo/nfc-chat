/**
 * CAMADA 1: OBSERVADORA
 *
 * Le todas as mensagens e detecta padroes.
 * NAO responde automaticamente.
 *
 * Detecta:
 * - Duvidas recorrentes
 * - Frustracoes
 * - Temas tecnicos
 * - Conflitos
 * - Boas contribuicoes humanas
 */

// ========================================
// TIPOS
// ========================================

export interface MensagemObservada {
  id: string;
  texto: string;
  autorId: string;
  autorNome: string;
  timestamp: Date;
  comunidadeSlug: string;
}

export interface PadraoDetectado {
  tipo: 'duvida_recorrente' | 'frustracao' | 'tema_tecnico' | 'conflito' | 'contribuicao_valiosa' | 'empate_discussao';
  frequencia: number;
  mensagensRelacionadas: string[]; // IDs
  palavrasChave: string[];
  ultimaOcorrencia: Date;
}

export interface UsuarioDestaque {
  autorId: string;
  autorNome: string;
  motivo: 'explicacao_clara' | 'ponto_importante' | 'sintese' | 'experiencia_relevante';
  mensagemId: string;
  texto: string;
  score: number; // 0-100
}

export interface ObservacaoComunidade {
  slug: string;
  totalMensagens: number;
  padroes: PadraoDetectado[];
  usuariosDestaque: UsuarioDestaque[];
  temasAtivos: string[];
  sentimentoGeral: 'positivo' | 'neutro' | 'frustrado' | 'confuso';
  ultimaAtualizacao: Date;
}

// ========================================
// DETECTORES DE PADRAO
// ========================================

const INDICADORES_FRUSTRACAO = [
  'nao consigo',
  'desisti',
  'cansado',
  'nada funciona',
  'ja tentei de tudo',
  'estou perdido',
  'nao sei o que fazer',
  'dificil demais',
  'impossivel',
  'desanimado',
  'frustrado',
];

const INDICADORES_DUVIDA = [
  'como faco',
  'alguem sabe',
  'duvida',
  'nao entendi',
  'pode explicar',
  'o que significa',
  'qual a diferenca',
  'isso e verdade',
  'funciona mesmo',
];

const INDICADORES_CONFLITO = [
  'voce esta errado',
  'nao concordo',
  'isso e mentira',
  'fonte',
  'prove',
  'absurdo',
  'ridiculo',
];

const INDICADORES_BOA_CONTRIBUICAO = [
  'na minha experiencia',
  'o que funcionou pra mim',
  'descobri que',
  'resumindo',
  'em outras palavras',
  'o ponto principal',
  'importante lembrar',
];

const TEMAS_TECNICOS = [
  'lipedema',
  'deficit calorico',
  'hormonio',
  'tireoide',
  'insulina',
  'metabolismo',
  'macro',
  'proteina',
  'jejum',
  'cetogenica',
  'low carb',
  'ozempic',
  'wegovy',
  'semaglutida',
  'tirzepatida',
];

// ========================================
// FUNCOES DE ANALISE
// ========================================

/**
 * Analisa uma mensagem e retorna padroes detectados
 */
export function analisarMensagem(mensagem: MensagemObservada): {
  padroes: PadraoDetectado['tipo'][];
  score: number;
  palavrasChave: string[];
} {
  const textoLower = mensagem.texto.toLowerCase();
  const padroes: PadraoDetectado['tipo'][] = [];
  const palavrasChave: string[] = [];
  let score = 0;

  // Detectar frustracao
  for (const indicador of INDICADORES_FRUSTRACAO) {
    if (textoLower.includes(indicador)) {
      if (!padroes.includes('frustracao')) {
        padroes.push('frustracao');
      }
      palavrasChave.push(indicador);
    }
  }

  // Detectar duvida
  for (const indicador of INDICADORES_DUVIDA) {
    if (textoLower.includes(indicador)) {
      if (!padroes.includes('duvida_recorrente')) {
        padroes.push('duvida_recorrente');
      }
      palavrasChave.push(indicador);
    }
  }

  // Detectar conflito
  for (const indicador of INDICADORES_CONFLITO) {
    if (textoLower.includes(indicador)) {
      if (!padroes.includes('conflito')) {
        padroes.push('conflito');
      }
      palavrasChave.push(indicador);
    }
  }

  // Detectar tema tecnico
  for (const tema of TEMAS_TECNICOS) {
    if (textoLower.includes(tema)) {
      if (!padroes.includes('tema_tecnico')) {
        padroes.push('tema_tecnico');
      }
      palavrasChave.push(tema);
    }
  }

  // Detectar boa contribuicao
  for (const indicador of INDICADORES_BOA_CONTRIBUICAO) {
    if (textoLower.includes(indicador)) {
      if (!padroes.includes('contribuicao_valiosa')) {
        padroes.push('contribuicao_valiosa');
      }
      palavrasChave.push(indicador);
      score += 20;
    }
  }

  // Bonus de score para mensagens mais longas e estruturadas
  if (mensagem.texto.length > 200) score += 10;
  if (mensagem.texto.includes('\n')) score += 5;
  if (mensagem.texto.match(/\d+/)) score += 5; // Contem numeros (dados)

  return { padroes, score: Math.min(score, 100), palavrasChave };
}

/**
 * Detecta se a discussao esta empacada
 */
export function detectarEmpateDiscussao(mensagens: MensagemObservada[]): boolean {
  if (mensagens.length < 5) return false;

  // Ultimas 5 mensagens
  const ultimas = mensagens.slice(-5);

  // Verificar se ha repeticao de palavras-chave
  const todasPalavras: string[] = [];
  for (const msg of ultimas) {
    const palavras = msg.texto.toLowerCase().split(/\s+/);
    todasPalavras.push(...palavras);
  }

  // Contar frequencia
  const frequencia: Record<string, number> = {};
  for (const palavra of todasPalavras) {
    if (palavra.length > 4) {
      frequencia[palavra] = (frequencia[palavra] || 0) + 1;
    }
  }

  // Se alguma palavra aparece em mais de 60% das mensagens
  const limiar = ultimas.length * 0.6;
  for (const count of Object.values(frequencia)) {
    if (count >= limiar) return true;
  }

  return false;
}

/**
 * Identifica usuarios com contribuicoes valiosas
 */
export function identificarUsuariosDestaque(
  mensagens: MensagemObservada[]
): UsuarioDestaque[] {
  const destaques: UsuarioDestaque[] = [];

  for (const msg of mensagens) {
    const analise = analisarMensagem(msg);

    if (analise.padroes.includes('contribuicao_valiosa') && analise.score >= 30) {
      // Determinar motivo
      let motivo: UsuarioDestaque['motivo'] = 'ponto_importante';
      const textoLower = msg.texto.toLowerCase();

      if (textoLower.includes('resumindo') || textoLower.includes('em outras palavras')) {
        motivo = 'sintese';
      } else if (textoLower.includes('na minha experiencia') || textoLower.includes('comigo')) {
        motivo = 'experiencia_relevante';
      } else if (textoLower.includes('explicando') || msg.texto.length > 300) {
        motivo = 'explicacao_clara';
      }

      destaques.push({
        autorId: msg.autorId,
        autorNome: msg.autorNome,
        motivo,
        mensagemId: msg.id,
        texto: msg.texto.slice(0, 200) + (msg.texto.length > 200 ? '...' : ''),
        score: analise.score,
      });
    }
  }

  // Ordenar por score e retornar top 3
  return destaques.sort((a, b) => b.score - a.score).slice(0, 3);
}

/**
 * Calcula sentimento geral da comunidade
 */
export function calcularSentimentoGeral(
  mensagens: MensagemObservada[]
): ObservacaoComunidade['sentimentoGeral'] {
  if (mensagens.length === 0) return 'neutro';

  let frustracoes = 0;
  let positivos = 0;
  let confusos = 0;

  for (const msg of mensagens) {
    const analise = analisarMensagem(msg);

    if (analise.padroes.includes('frustracao')) frustracoes++;
    if (analise.padroes.includes('contribuicao_valiosa')) positivos++;
    if (analise.padroes.includes('duvida_recorrente')) confusos++;
  }

  const total = mensagens.length;
  const taxaFrustracao = frustracoes / total;
  const taxaPositiva = positivos / total;
  const taxaConfusao = confusos / total;

  if (taxaFrustracao > 0.3) return 'frustrado';
  if (taxaConfusao > 0.4) return 'confuso';
  if (taxaPositiva > 0.2) return 'positivo';

  return 'neutro';
}

/**
 * Gera observacao completa de uma comunidade
 */
export function gerarObservacao(
  slug: string,
  mensagens: MensagemObservada[]
): ObservacaoComunidade {
  const padroes: PadraoDetectado[] = [];
  const temasAtivos: Set<string> = new Set();

  // Agrupar padroes por tipo
  const contagemPadroes: Record<string, { freq: number; msgs: string[]; palavras: string[] }> = {};

  for (const msg of mensagens) {
    const analise = analisarMensagem(msg);

    for (const padrao of analise.padroes) {
      if (!contagemPadroes[padrao]) {
        contagemPadroes[padrao] = { freq: 0, msgs: [], palavras: [] };
      }
      contagemPadroes[padrao].freq++;
      contagemPadroes[padrao].msgs.push(msg.id);
      contagemPadroes[padrao].palavras.push(...analise.palavrasChave);
    }

    // Coletar temas
    for (const palavra of analise.palavrasChave) {
      if (TEMAS_TECNICOS.includes(palavra)) {
        temasAtivos.add(palavra);
      }
    }
  }

  // Converter para array de padroes
  for (const [tipo, dados] of Object.entries(contagemPadroes)) {
    padroes.push({
      tipo: tipo as PadraoDetectado['tipo'],
      frequencia: dados.freq,
      mensagensRelacionadas: dados.msgs.slice(-10),
      palavrasChave: [...new Set(dados.palavras)],
      ultimaOcorrencia: new Date(),
    });
  }

  // Verificar empate
  if (detectarEmpateDiscussao(mensagens)) {
    padroes.push({
      tipo: 'empate_discussao',
      frequencia: 1,
      mensagensRelacionadas: mensagens.slice(-5).map((m) => m.id),
      palavrasChave: [],
      ultimaOcorrencia: new Date(),
    });
  }

  return {
    slug,
    totalMensagens: mensagens.length,
    padroes,
    usuariosDestaque: identificarUsuariosDestaque(mensagens),
    temasAtivos: Array.from(temasAtivos),
    sentimentoGeral: calcularSentimentoGeral(mensagens),
    ultimaAtualizacao: new Date(),
  };
}
