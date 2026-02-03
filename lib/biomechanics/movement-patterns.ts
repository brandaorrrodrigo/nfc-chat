/**
 * Movement Patterns - Definicoes de padroes de movimento, falhas comuns, angulos referencia
 * Usado pela IA para pre-analise de videos
 */

export interface MovementPattern {
  id: string;
  name: string;
  category: string;
  muscles: string[];
  joints: string[];
  commonFaults: CommonFault[];
  referenceAngles: ReferenceAngle[];
  checkpoints: string[];
  redFlags: string[];
}

export interface CommonFault {
  id: string;
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  correction: string;
}

export interface ReferenceAngle {
  joint: string;
  phase: string;
  idealRange: [number, number];
  unit: string;
}

// ============================================
// PADROES DE MOVIMENTO
// ============================================

export const MOVEMENT_PATTERNS: Record<string, MovementPattern> = {
  agachamento: {
    id: 'agachamento',
    name: 'Agachamento',
    category: 'membros-inferiores',
    muscles: ['quadriceps', 'gluteos', 'isquiotibiais', 'eretores da espinha', 'core'],
    joints: ['tornozelo', 'joelho', 'quadril', 'coluna lombar'],
    commonFaults: [
      {
        id: 'valgismo-joelho',
        name: 'Valgismo de Joelho',
        description: 'Joelhos colapsam para dentro durante a descida ou subida',
        severity: 'high',
        correction: 'Fortalecer gluteo medio, trabalhar ativacao com mini-band, cue "empurre os joelhos para fora"',
      },
      {
        id: 'butt-wink',
        name: 'Butt Wink',
        description: 'Retroversao pelvica no final da descida, perda de lordose lombar',
        severity: 'medium',
        correction: 'Trabalhar mobilidade de tornozelo e quadril, limitar profundidade ate ganhar mobilidade',
      },
      {
        id: 'inclinacao-excessiva',
        name: 'Inclinacao Excessiva do Tronco',
        description: 'Tronco inclina demais para frente, sobrecarregando lombar',
        severity: 'medium',
        correction: 'Fortalecer eretores, trabalhar mobilidade toracica, verificar proporção femur/tronco',
      },
      {
        id: 'calcanhar-sobe',
        name: 'Calcanhar Levanta',
        description: 'Calcanhares saem do chao durante a descida',
        severity: 'medium',
        correction: 'Trabalhar mobilidade de dorsiflexao, usar calcanheira temporariamente',
      },
      {
        id: 'shift-lateral',
        name: 'Shift Lateral',
        description: 'Peso migra para um lado durante o movimento',
        severity: 'high',
        correction: 'Verificar assimetrias de forca e mobilidade, trabalhar unilateral',
      },
    ],
    referenceAngles: [
      { joint: 'joelho', phase: 'base', idealRange: [80, 100], unit: 'graus' },
      { joint: 'quadril', phase: 'base', idealRange: [70, 100], unit: 'graus' },
      { joint: 'tornozelo', phase: 'base', idealRange: [25, 40], unit: 'graus dorsiflexao' },
      { joint: 'tronco', phase: 'descida', idealRange: [30, 55], unit: 'graus inclinacao' },
    ],
    checkpoints: [
      'Posicao dos pes (largura e angulo)',
      'Alinhamento joelho-pe durante descida',
      'Manutencao da curva lombar',
      'Profundidade atingida',
      'Distribuicao de peso (calcanhar vs ponta)',
      'Simetria bilateral',
      'Controle na fase excentrica',
      'Posicao da barra (se aplicavel)',
    ],
    redFlags: [
      'Dor aguda no joelho',
      'Estalido com dor',
      'Perda de equilibrio frequente',
      'Travamento articular',
    ],
  },

  terra: {
    id: 'terra',
    name: 'Levantamento Terra',
    category: 'membros-inferiores',
    muscles: ['gluteos', 'isquiotibiais', 'eretores da espinha', 'trapezio', 'core', 'antebraco'],
    joints: ['tornozelo', 'joelho', 'quadril', 'coluna lombar', 'coluna toracica'],
    commonFaults: [
      {
        id: 'costas-arredondadas',
        name: 'Arredondamento da Lombar',
        description: 'Perda da lordose lombar, coluna flexiona durante a puxada',
        severity: 'high',
        correction: 'Trabalhar hinge pattern com peso leve, fortalecer eretores, cue "peito para cima"',
      },
      {
        id: 'barra-afasta',
        name: 'Barra Afasta do Corpo',
        description: 'Barra se distancia das canelas/coxas, aumentando braco de momento',
        severity: 'medium',
        correction: 'Manter barra proxima ao corpo, cue "raspe as canelas", engajar dorsais',
      },
      {
        id: 'quadril-sobe-primeiro',
        name: 'Quadril Sobe Antes',
        description: 'Quadril sobe antes dos ombros, transformando em stiff',
        severity: 'medium',
        correction: 'Manter angulo de tronco constante no inicio, empurrar o chao com os pes',
      },
      {
        id: 'hiperextensao-lombar',
        name: 'Hiperextensao no Topo',
        description: 'Extensao excessiva da lombar no lockout',
        severity: 'medium',
        correction: 'Terminar com gluteos contraidos e quadril neutro, nao inclinar para tras',
      },
    ],
    referenceAngles: [
      { joint: 'quadril', phase: 'inicio', idealRange: [60, 80], unit: 'graus' },
      { joint: 'joelho', phase: 'inicio', idealRange: [130, 155], unit: 'graus' },
      { joint: 'tronco', phase: 'inicio', idealRange: [40, 60], unit: 'graus inclinacao' },
    ],
    checkpoints: [
      'Posicao inicial dos pes',
      'Posicao da barra em relacao ao pe',
      'Manutencao da coluna neutra',
      'Sequencia de extensao (joelho + quadril simultaneos)',
      'Proximidade da barra ao corpo',
      'Lockout completo sem hiperextensao',
      'Controle na fase excentrica',
      'Pegada e posicao dos ombros',
    ],
    redFlags: [
      'Dor lombar aguda',
      'Formigamento nas pernas',
      'Perda de sensibilidade',
      'Dor irradiada para gluteo/perna',
    ],
  },

  supino: {
    id: 'supino',
    name: 'Supino',
    category: 'membros-superiores',
    muscles: ['peitoral maior', 'deltoide anterior', 'triceps', 'serrátil anterior'],
    joints: ['ombro', 'cotovelo', 'escapula', 'punho'],
    commonFaults: [
      {
        id: 'escapulas-nao-retraidas',
        name: 'Escapulas Nao Retraidas',
        description: 'Escapulas nao estao retraidas e deprimidas, base instavel',
        severity: 'high',
        correction: 'Retrair e deprimir escapulas antes de deitar, manter arco toracico',
      },
      {
        id: 'barra-quica-peito',
        name: 'Barra Quica no Peito',
        description: 'Barra bate no peito sem controle, usando bounce',
        severity: 'medium',
        correction: 'Pausa controlada no peito, manter tensao nos dorsais',
      },
      {
        id: 'cotovelos-muito-abertos',
        name: 'Flare Excessivo de Cotovelos',
        description: 'Cotovelos a 90 graus do tronco, sobrecarga no ombro',
        severity: 'high',
        correction: 'Manter cotovelos a 45-75 graus do tronco, cue "dobrar a barra"',
      },
      {
        id: 'pe-sai-chao',
        name: 'Pes Saem do Chao',
        description: 'Pes levantam durante a execucao, perda de leg drive',
        severity: 'low',
        correction: 'Plantar pes firmemente, usar leg drive para estabilidade',
      },
    ],
    referenceAngles: [
      { joint: 'cotovelo', phase: 'base', idealRange: [85, 100], unit: 'graus' },
      { joint: 'ombro-abducao', phase: 'descida', idealRange: [45, 75], unit: 'graus do tronco' },
    ],
    checkpoints: [
      'Retracao e depressao escapular',
      'Arco toracico',
      'Posicao dos pes',
      'Pegada na barra (largura e punho)',
      'Angulo dos cotovelos',
      'Ponto de toque no peito',
      'Trajetoria da barra',
      'Lockout completo',
    ],
    redFlags: [
      'Dor no ombro anterior',
      'Estalido com dor na articulacao',
      'Dormencia nos bracos',
      'Dor no esterno',
    ],
  },

  puxadas: {
    id: 'puxadas',
    name: 'Puxadas (Barra Fixa / Pulley)',
    category: 'membros-superiores',
    muscles: ['grande dorsal', 'biceps', 'romboides', 'trapezio inferior', 'braquial'],
    joints: ['ombro', 'cotovelo', 'escapula'],
    commonFaults: [
      {
        id: 'sem-depressao-escapular',
        name: 'Sem Depressao Escapular',
        description: 'Inicia o movimento sem deprimir as escapulas',
        severity: 'medium',
        correction: 'Iniciar com depressao escapular antes de flexionar cotovelos',
      },
      {
        id: 'kipping-excessivo',
        name: 'Kipping Excessivo',
        description: 'Uso excessivo de balanco/momentum para subir',
        severity: 'medium',
        correction: 'Trabalhar negativos controlados, reduzir carga, foco em contracao dorsal',
      },
      {
        id: 'amplitude-parcial',
        name: 'Amplitude Parcial',
        description: 'Nao completa a amplitude total (queixo na barra / extensao total)',
        severity: 'low',
        correction: 'Reduzir carga para completar ROM, trabalhar com banda elastica',
      },
      {
        id: 'dominancia-biceps',
        name: 'Dominancia de Biceps',
        description: 'Puxa mais com biceps do que com dorsais',
        severity: 'medium',
        correction: 'Foco em puxar com cotovelos, cue "cotovelos para o bolso", pegada mais larga',
      },
    ],
    referenceAngles: [
      { joint: 'ombro', phase: 'topo', idealRange: [0, 20], unit: 'graus extensao' },
      { joint: 'cotovelo', phase: 'base', idealRange: [170, 180], unit: 'graus extensao' },
    ],
    checkpoints: [
      'Posicao inicial (dead hang completo)',
      'Depressao escapular no inicio',
      'Trajetoria dos cotovelos',
      'Ativacao dorsal vs biceps',
      'Posicao no topo (queixo acima da barra)',
      'Controle na fase excentrica',
      'Estabilidade do core (sem balanco)',
      'Tipo de pegada e largura',
    ],
    redFlags: [
      'Dor no ombro durante o movimento',
      'Formigamento nas maos',
      'Dor no cotovelo medial',
    ],
  },

  'elevacao-pelvica': {
    id: 'elevacao-pelvica',
    name: 'Elevacao Pelvica (Hip Thrust)',
    category: 'membros-inferiores',
    muscles: ['gluteo maximo', 'gluteo medio', 'isquiotibiais', 'core'],
    joints: ['quadril', 'joelho', 'coluna lombar'],
    commonFaults: [
      {
        id: 'hiperextensao-lombar',
        name: 'Hiperextensao Lombar',
        description: 'Excessiva extensao lombar no topo ao inves de extensao de quadril',
        severity: 'high',
        correction: 'Manter retroversao pelvica no topo (PPT), olhar para frente nao para cima',
      },
      {
        id: 'posicao-pe-incorreta',
        name: 'Posicao de Pes Incorreta',
        description: 'Pes muito perto ou longe demais, alterando ativacao muscular',
        severity: 'medium',
        correction: 'Canelas verticais no topo do movimento, angulo de joelho ~90 graus',
      },
      {
        id: 'assimetria-extensao',
        name: 'Assimetria na Extensao',
        description: 'Um lado do quadril sobe antes do outro',
        severity: 'medium',
        correction: 'Trabalhar unilateral (single leg), verificar discrepancias de forca',
      },
      {
        id: 'apoio-banco-incorreto',
        name: 'Apoio no Banco Incorreto',
        description: 'Escapulas nao ficam corretamente apoiadas no banco',
        severity: 'medium',
        correction: 'Borda do banco na linha inferior das escapulas, nao nos ombros',
      },
    ],
    referenceAngles: [
      { joint: 'quadril', phase: 'topo', idealRange: [170, 190], unit: 'graus extensao' },
      { joint: 'joelho', phase: 'topo', idealRange: [85, 100], unit: 'graus' },
    ],
    checkpoints: [
      'Posicao de apoio no banco',
      'Posicao e largura dos pes',
      'Angulo do joelho no topo',
      'Extensao completa do quadril',
      'Controle pelvico (sem hiperextensao)',
      'Simetria bilateral',
      'Posicao da barra/carga no quadril',
      'Controle excentrico',
    ],
    redFlags: [
      'Dor lombar durante o movimento',
      'Caibra nos isquiotibiais',
      'Dor no quadril anterior',
    ],
  },
};

// ============================================
// FUNCOES AUXILIARES
// ============================================

export function getMovementPattern(id: string): MovementPattern | undefined {
  return MOVEMENT_PATTERNS[id];
}

export function getMovementsByCategory(category: string): MovementPattern[] {
  return Object.values(MOVEMENT_PATTERNS).filter(m => m.category === category);
}

export function getAllMovementPatterns(): MovementPattern[] {
  return Object.values(MOVEMENT_PATTERNS);
}

/**
 * Gera prompt para IA analisar video baseado no padrao de movimento
 */
export function getMovementAnalysisPrompt(patternId: string, userDescription: string): string {
  const pattern = MOVEMENT_PATTERNS[patternId];

  if (!pattern) {
    return `Analise este video de exercicio. O usuario descreveu: "${userDescription}".
Foque em: postura, alinhamento articular, controle de movimento, e possíveis compensacoes.`;
  }

  const faultsText = pattern.commonFaults
    .map(f => `- ${f.name}: ${f.description}`)
    .join('\n');

  const checkpointsText = pattern.checkpoints.map(c => `- ${c}`).join('\n');

  const anglesText = pattern.referenceAngles
    .map(a => `- ${a.joint} (${a.phase}): ${a.idealRange[0]}-${a.idealRange[1]} ${a.unit}`)
    .join('\n');

  return `Voce e um especialista em biomecanica analisando um video de ${pattern.name}.

DESCRICAO DO USUARIO: "${userDescription}"

MUSCULOS ENVOLVIDOS: ${pattern.muscles.join(', ')}
ARTICULACOES PRINCIPAIS: ${pattern.joints.join(', ')}

CHECKPOINTS A AVALIAR:
${checkpointsText}

FALHAS COMUNS A VERIFICAR:
${faultsText}

ANGULOS DE REFERENCIA:
${anglesText}

INSTRUCOES:
1. Analise cada checkpoint listado
2. Identifique quais falhas comuns estao presentes
3. Compare angulos articulares com os valores de referencia
4. Classifique severidade de cada problema encontrado (baixa/media/alta)
5. Sugira correcoes especificas e exercicios complementares
6. Se identificar red flags (${pattern.redFlags.join(', ')}), sinalize imediatamente

FORMATO DA RESPOSTA:
- Resumo geral (2-3 frases)
- Pontos positivos observados
- Problemas identificados (com severidade)
- Correcoes sugeridas
- Exercicios complementares recomendados
- Red flags (se houver)
- Confianca da analise (0-1)`;
}

/**
 * Gera checklist simplificado para revisao admin
 */
export function getAdminReviewChecklist(patternId: string): string[] {
  const pattern = MOVEMENT_PATTERNS[patternId];
  if (!pattern) {
    return ['Verificar qualidade do video', 'Avaliar analise da IA', 'Confirmar ou editar sugestoes'];
  }

  return [
    `Verificar identificacao correta do ${pattern.name}`,
    ...pattern.checkpoints.map(c => `Checkpoint: ${c}`),
    ...pattern.commonFaults.map(f => `Falha "${f.name}" presente?`),
    'Avaliar precisao da analise da IA',
    'Editar/complementar sugestoes se necessario',
    'Verificar red flags nao detectados',
  ];
}
