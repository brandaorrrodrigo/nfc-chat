/**
 * Banco de Exercícios Corretivos para Análise Biomecânica
 * Mapeamento: Desvio → Exercícios + Ajustes Técnicos
 */

export interface Exercicio {
  nome: string;
  objetivo: string;
  execucao: string[];
  volume: string;
  frequencia: string;
  progressao: string;
}

export interface RecomendacaoCorretiva {
  severidade: 'CRITICA' | 'MODERADA' | 'LEVE';
  exercicios: Exercicio[];
  ajustes_tecnicos: string[];
  tempo_correcao: string;
}

export const EXERCISE_DATABASE: Record<string, RecomendacaoCorretiva> = {
  'valgo': {
    severidade: 'CRITICA',
    exercicios: [
      {
        nome: 'Clamshell com Banda Elástica',
        objetivo: 'Fortalecer glúteo médio e estabilizar pelve',
        execucao: [
          'Deitar de lado com joelhos flexionados 90°',
          'Banda elástica acima dos joelhos',
          'Manter pés unidos e abduzir joelho superior',
          'Controlar descida (2s subida, 2s descida)'
        ],
        volume: '3 séries x 15 repetições',
        frequencia: '5x/semana (antes do treino)',
        progressao: 'Aumentar resistência da banda semanalmente'
      },
      {
        nome: 'Side Plank com Abdução',
        objetivo: 'Fortalecer glúteo médio + core lateral',
        execucao: [
          'Prancha lateral apoiando antebraço',
          'Elevar perna superior 30-45°',
          'Manter pelve neutra (sem rotação)',
          'Contrair glúteo ativamente'
        ],
        volume: '3 séries x 30 segundos',
        frequencia: '3x/semana',
        progressao: 'Adicionar caneleira após 2 semanas'
      },
      {
        nome: 'Monster Walk Lateral',
        objetivo: 'Ativação de glúteo médio + padrão motor',
        execucao: [
          'Banda nos joelhos, agachamento parcial (45°)',
          'Passos laterais amplos',
          'Empurrar joelhos para FORA contra banda',
          'Manter tronco estável'
        ],
        volume: '3 séries x 20 passos cada lado',
        frequencia: 'Diário (ativação pré-treino)',
        progressao: 'Aumentar resistência ou largura do passo'
      }
    ],
    ajustes_tecnicos: [
      'Adicionar banda elástica nos joelhos durante agachamento (feedback tátil)',
      'Reduzir carga em 20-30% e focar em execução perfeita',
      'Usar espelho lateral para feedback visual em tempo real',
      'Comandos verbais: "Empurra joelhos para FORA"',
      'Gravar cada série e revisar imediatamente'
    ],
    tempo_correcao: '4-6 semanas com protocolo disciplinado'
  },

  'anteriorização': {
    severidade: 'MODERADA',
    exercicios: [
      {
        nome: 'Alongamento de Panturrilha em Step',
        objetivo: 'Melhorar dorsiflexão de tornozelo',
        execucao: [
          'Pé na borda de step, calcanhar suspenso',
          'Descer calcanhar lentamente',
          'Sentir alongamento na panturrilha',
          'Manter joelho reto'
        ],
        volume: '3 séries x 30 segundos',
        frequencia: '2x/dia',
        progressao: 'Aumentar amplitude progressivamente'
      },
      {
        nome: 'Goblet Squat com Pausa',
        objetivo: 'Reaprender padrão de agachamento vertical',
        execucao: [
          'Segurar kettlebell/halter no peito',
          'Agachar mantendo tronco vertical',
          'Pausar 3s no fundo',
          'Usar peso como contra-peso para equilibrar'
        ],
        volume: '4 séries x 8 repetições',
        frequencia: '3x/semana',
        progressao: 'Aumentar peso do goblet'
      }
    ],
    ajustes_tecnicos: [
      'Testar mobilidade de tornozelo (Wall Test - meta: 10cm)',
      'Elevar calcanhares 2-3cm (disco ou placa) temporariamente',
      'Reduzir profundidade para 90° até melhorar mobilidade',
      'Foco em "sentar para trás" ao invés de "descer"'
    ],
    tempo_correcao: '2-4 semanas'
  },

  'lordose': {
    severidade: 'MODERADA',
    exercicios: [
      {
        nome: 'Dead Bug',
        objetivo: 'Fortalecer core + controle de coluna neutra',
        execucao: [
          'Deitado, lombar plana no chão',
          'Braços estendidos, joelhos 90°',
          'Estender braço+perna opostos simultaneamente',
          'NÃO deixar lombar arquear'
        ],
        volume: '3 séries x 10 repetições',
        frequencia: '4x/semana',
        progressao: 'Adicionar caneleira/peso nas mãos'
      },
      {
        nome: 'Prancha Frontal com Retroversão',
        objetivo: 'Estabilização lombar em posição neutra',
        execucao: [
          'Prancha no antebraço',
          'Contrair glúteos e abdômen',
          'Meter o cóccix levemente para dentro',
          'Manter posição sem lordose'
        ],
        volume: '3 séries x 30-45 segundos',
        frequencia: '4x/semana',
        progressao: 'Aumentar tempo progressivamente'
      }
    ],
    ajustes_tecnicos: [
      'Contrair abdômen ANTES de iniciar descida',
      'Imaginar "meter o cóccix para dentro"',
      'Reduzir carga se lombar arquear excessivamente',
      'Usar cinto apenas em cargas >85% 1RM'
    ],
    tempo_correcao: '3-4 semanas'
  },

  'cifose': {
    severidade: 'MODERADA',
    exercicios: [
      {
        nome: 'Face Pull com Rotação Externa',
        objetivo: 'Fortalecer retratores escapulares e rotadores externos',
        execucao: [
          'Polia alta, corda ou elástico',
          'Puxar em direção ao rosto',
          'Rotacionar externamente no final',
          'Apertar escápulas'
        ],
        volume: '3 séries x 15 repetições',
        frequencia: '4x/semana',
        progressao: 'Aumentar resistência gradualmente'
      },
      {
        nome: 'Extensão Torácica no Foam Roller',
        objetivo: 'Melhorar mobilidade torácica em extensão',
        execucao: [
          'Foam roller perpendicular às costas',
          'Posicionar na região torácica média',
          'Estender sobre o rolo com controle',
          'Manter lombar neutra'
        ],
        volume: '2-3 minutos',
        frequencia: 'Diário',
        progressao: 'Mover para diferentes níveis da torácica'
      }
    ],
    ajustes_tecnicos: [
      'Comando: "Peito para cima, escápulas para trás e para baixo"',
      'Olhar fixo em ponto à frente (não para baixo)',
      'Usar front squat ou safety bar temporariamente',
      'Fortalecer extensores torácicos'
    ],
    tempo_correcao: '4-6 semanas'
  },

  'joelho': {
    severidade: 'MODERADA',
    exercicios: [
      {
        nome: 'Terminal Knee Extension (TKE)',
        objetivo: 'Fortalecer vasto medial e estabilizar joelho',
        execucao: [
          'Banda elástica atrás do joelho',
          'Partir de flexão parcial (30°)',
          'Estender completamente contra resistência',
          'Controlar retorno'
        ],
        volume: '3 séries x 15 repetições',
        frequencia: '4x/semana',
        progressao: 'Aumentar resistência da banda'
      },
      {
        nome: 'Step Down Controlado',
        objetivo: 'Controle excêntrico de joelho + equilíbrio',
        execucao: [
          'Em step de 10-15cm',
          'Descer uma perna controladamente',
          'Tocar calcanhar no chão levemente',
          'Subir sem impulso'
        ],
        volume: '3 séries x 10 repetições cada lado',
        frequencia: '3x/semana',
        progressao: 'Aumentar altura do step'
      }
    ],
    ajustes_tecnicos: [
      'Verificar tracking patelar durante movimento',
      'Manter joelhos alinhados com 2º dedo do pé',
      'Evitar bloqueio agressivo do joelho no topo',
      'Fortalecer quadríceps de forma equilibrada'
    ],
    tempo_correcao: '3-5 semanas'
  },

  'coluna': {
    severidade: 'MODERADA',
    exercicios: [
      {
        nome: 'Bird Dog',
        objetivo: 'Estabilização de coluna + coordenação',
        execucao: [
          'Quatro apoios, coluna neutra',
          'Estender braço e perna opostos',
          'Manter quadril nivelado',
          'Contrair core durante todo movimento'
        ],
        volume: '3 séries x 10 repetições cada lado',
        frequencia: '4x/semana',
        progressao: 'Adicionar pausa de 3s na extensão'
      },
      {
        nome: 'McGill Curl-Up',
        objetivo: 'Fortalecer reto abdominal sem flexão lombar',
        execucao: [
          'Deitado, uma perna estendida, outra flexionada',
          'Mãos sob lombar para feedback',
          'Elevar cabeça e ombros levemente',
          'NÃO achatar lombar no chão'
        ],
        volume: '3 séries x 10 repetições',
        frequencia: '4x/semana',
        progressao: 'Aumentar tempo de sustentação'
      }
    ],
    ajustes_tecnicos: [
      'Ativar core antes de qualquer movimento',
      'Respirar corretamente (expirar no esforço)',
      'Manter coluna neutra em todas as fases',
      'Evitar flexão/extensão excessiva sob carga'
    ],
    tempo_correcao: '4-6 semanas'
  },

  'quadril': {
    severidade: 'MODERADA',
    exercicios: [
      {
        nome: '90/90 Hip Stretch',
        objetivo: 'Melhorar mobilidade de rotação de quadril',
        execucao: [
          'Sentado, ambas pernas em 90°',
          'Rotacionar tronco sobre perna da frente',
          'Manter coluna ereta',
          'Alternar lados'
        ],
        volume: '2 minutos cada lado',
        frequencia: 'Diário',
        progressao: 'Adicionar inclinação anterior'
      },
      {
        nome: 'Hip Airplane',
        objetivo: 'Estabilidade + mobilidade de quadril',
        execucao: [
          'Apoio unilateral',
          'Rotacionar quadril interno e externo',
          'Manter perna de apoio estável',
          'Controlar todo o movimento'
        ],
        volume: '3 séries x 8 repetições cada lado',
        frequencia: '3x/semana',
        progressao: 'Aumentar amplitude de rotação'
      }
    ],
    ajustes_tecnicos: [
      'Avaliar mobilidade de quadril (FABER test)',
      'Trabalhar tanto rotação interna quanto externa',
      'Fortalecer flexores e extensores equilibradamente',
      'Alongar hip flexors se encurtados'
    ],
    tempo_correcao: '3-5 semanas'
  }
};

/**
 * Busca recomendações baseado no desvio detectado
 */
export function getRecommendations(desvio: string): RecomendacaoCorretiva | null {
  const normalized = desvio.toLowerCase();

  // Buscar match parcial nas chaves do banco
  for (const [key, value] of Object.entries(EXERCISE_DATABASE)) {
    if (normalized.includes(key)) {
      return value;
    }
  }

  // Buscar por sinônimos comuns
  const synonymMap: Record<string, string> = {
    'valgismo': 'valgo',
    'valgus': 'valgo',
    'colapso medial': 'valgo',
    'knee cave': 'valgo',
    'inclinação anterior': 'anteriorização',
    'forward lean': 'anteriorização',
    'trunk lean': 'anteriorização',
    'hiperlordose': 'lordose',
    'arco lombar': 'lordose',
    'cifótica': 'cifose',
    'dorso curvo': 'cifose',
    'rounded back': 'cifose',
  };

  for (const [synonym, key] of Object.entries(synonymMap)) {
    if (normalized.includes(synonym)) {
      return EXERCISE_DATABASE[key] || null;
    }
  }

  return null;
}

/**
 * Gera recomendações completas para uma lista de desvios
 */
export function generateAllRecommendations(
  pontosCriticos: Array<{ nome: string; severidade: string }>
): Array<{
  desvio: string;
  severidade: string;
  exercicios: Exercicio[];
  ajustes_tecnicos: string[];
  tempo_correcao: string;
}> {
  const recommendations: Array<{
    desvio: string;
    severidade: string;
    exercicios: Exercicio[];
    ajustes_tecnicos: string[];
    tempo_correcao: string;
  }> = [];

  for (const ponto of pontosCriticos) {
    const rec = getRecommendations(ponto.nome);

    if (rec) {
      recommendations.push({
        desvio: ponto.nome,
        severidade: ponto.severidade,
        exercicios: rec.exercicios,
        ajustes_tecnicos: rec.ajustes_tecnicos,
        tempo_correcao: rec.tempo_correcao,
      });
    }
  }

  // Ordenar por severidade (CRITICA primeiro)
  const severityOrder = { 'CRITICA': 0, 'MODERADA': 1, 'LEVE': 2 };
  recommendations.sort((a, b) =>
    (severityOrder[a.severidade as keyof typeof severityOrder] || 2) -
    (severityOrder[b.severidade as keyof typeof severityOrder] || 2)
  );

  return recommendations;
}
