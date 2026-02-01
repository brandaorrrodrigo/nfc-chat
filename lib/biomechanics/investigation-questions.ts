/**
 * Investigation Questions - Sistema de perguntas progressivas por região anatômica
 *
 * Baseado em literatura científica:
 * - Netter: Atlas de Anatomia Humana
 * - Sobotta: Atlas de Anatomia
 * - Cyriax: Tratado de Medicina Ortopédica
 * - Kapandji: Fisiologia Articular
 */

export interface InvestigationFlow {
  region: string;
  questions: string[];
  redFlags: string[]; // Sinais de alerta para encaminhar ao médico
  commonIssues: {
    pattern: string;
    diagnosis: string;
    adjustment: string;
  }[];
}

export const INVESTIGATION_FLOWS: Record<string, InvestigationFlow> = {
  'ombro': {
    region: 'ombro',
    questions: [
      'Onde EXATAMENTE no ombro dói? (frente, lateral, trás, em cima?)',
      'A dor piora quando você levanta o braço acima da cabeça?',
      'Você sente algum estalo ou "clique" durante o movimento?',
      'A dor irradia para o pescoço ou para o braço?',
      'Consegue dormir deitada sobre esse ombro?',
      'Há quanto tempo isso vem acontecendo?'
    ],
    redFlags: [
      'Dor que acorda à noite',
      'Perda de força progressiva',
      'Inchaço visível',
      'Deformidade',
      'Dor após trauma/queda',
      'Formigamento constante no braço'
    ],
    commonIssues: [
      {
        pattern: 'Dor na frente do ombro + piora com elevação lateral + estalo',
        diagnosis: 'Possível impacto subacromial',
        adjustment: 'Reduzir amplitude (não passar de 90°), trabalhar rotação externa, fortalecer manguito rotador (face pulls, band pull-aparts, external rotation)'
      },
      {
        pattern: 'Dor no topo do ombro + piora ao pegar peso',
        diagnosis: 'Possível tensão no trapézio superior',
        adjustment: 'Retrair escápula antes de elevar, evitar encolher ombros, alongar trapézio superior, fortalecer trapézio médio/inferior (Y-raises, T-raises)'
      },
      {
        pattern: 'Dor na frente + desenvolvimento/supino + estalo',
        diagnosis: 'Possível instabilidade anterior ou impacto',
        adjustment: 'Reduzir amplitude (não descer além de 90°), fortalecer manguito rotador, evitar desenvolvimento atrás da nuca'
      }
    ]
  },

  'joelho': {
    region: 'joelho',
    questions: [
      'Onde no joelho dói? (frente/atrás da patela, lateral interna, lateral externa?)',
      'Quando dói: na descida do agachamento, na subida, ou no fundo?',
      'Você sente o joelho "estalar" ou "travar"?',
      'Seus pés apontam para frente, ou ficam virados para fora/dentro?',
      'O joelho "passa" da linha dos pés no agachamento?',
      'Você sente inchaço após o treino?'
    ],
    redFlags: [
      'Joelho incha imediatamente após exercício',
      'Travamento completo (não consegue estender)',
      'Instabilidade ("falseio")',
      'Dor atrás do joelho com inchaço',
      'Dor após torção/trauma',
      'Vermelhidão ou calor local'
    ],
    commonIssues: [
      {
        pattern: 'Dor na frente da patela + joelho passa dos pés + descida do agachamento',
        diagnosis: 'Sobrecarga patelofemoral por excesso de flexão de joelho',
        adjustment: 'Empurrar quadril para trás (movimento de sentar), não deixar joelho ultrapassar muito os dedos, fortalecer glúteo (hip thrust, ponte), reduzir profundidade temporariamente'
      },
      {
        pattern: 'Dor lateral interna + joelhos "colapsam" para dentro',
        diagnosis: 'Valgo dinâmico (joelhos em X) por fraqueza de glúteo médio',
        adjustment: 'Ativar glúteo médio antes do treino (clamshell, side lying abduction), usar banda nos joelhos (empurrar para fora), agachamento mais estreito, fortalecer abdutor de quadril'
      },
      {
        pattern: 'Dor atrás da patela + agachamento profundo',
        diagnosis: 'Possível compressão patelofemoral',
        adjustment: 'Limitar profundidade (não descer além de 90°), trabalhar mobilidade de tornozelo, stance mais largo'
      }
    ]
  },

  'lombar': {
    region: 'lombar',
    questions: [
      'A dor é no centro da coluna ou mais para o lado?',
      'Quando dói: no início do movimento, sob carga, ou após terminar?',
      'Você sente a dor irradiar para a perna? Se sim, até onde?',
      'A dor piora quando você flexiona (dobra) a coluna?',
      'Você mantém a lombar neutra (não arredonda) durante o exercício?',
      'Sente formigamento ou dormência nas pernas?'
    ],
    redFlags: [
      'Dor que irradia abaixo do joelho',
      'Formigamento ou fraqueza na perna',
      'Perda de controle de bexiga/intestino',
      'Dor que piora MUITO ao tossir/espirrar',
      'Dor noturna intensa',
      'Histórico de trauma/queda'
    ],
    commonIssues: [
      {
        pattern: 'Dor no centro + piora ao flexionar + durante levantamento terra',
        diagnosis: 'Possível flexão lombar excessiva sob carga',
        adjustment: 'Manter lombar neutra (não arredondar), ativar core ANTES de puxar, reduzir carga e corrigir técnica, trabalhar hip hinge pattern sem peso primeiro'
      },
      {
        pattern: 'Dor unilateral + depois de agachamento profundo',
        diagnosis: 'Possível compensação assimétrica',
        adjustment: 'Verificar mobilidade de quadril (teste de Thomas, pigeon pose), trabalhar unilateral (afundo, bulgarian split squat), fortalecer core anti-rotação (pallof press, bird dog)'
      },
      {
        pattern: 'Dor no final da extensão + hiperextensão',
        diagnosis: 'Possível compressão facetária',
        adjustment: 'Evitar hiperextender lombar (contrair glúteo no topo), fortalecer core, evitar ponte com extensão excessiva'
      }
    ]
  },

  'pulso': {
    region: 'pulso',
    questions: [
      'Onde no pulso dói? (parte de cima, de baixo, lateral do polegar, lateral do mindinho?)',
      'A dor é tipo "choque", "queimação" ou "pressão"?',
      'Piora quando você flexiona o pulso ou quando estende?',
      'Você sente formigamento nos dedos? Quais dedos?',
      'A pegada da barra está reta ou muito dobrada?',
      'Você usa munhequeira/wraps?'
    ],
    redFlags: [
      'Formigamento constante nos dedos',
      'Perda de força na mão progressiva',
      'Inchaço visível no pulso',
      'Dor que acorda à noite',
      'Trauma recente',
      'Dedos ficam brancos/roxos'
    ],
    commonIssues: [
      {
        pattern: 'Choque/formigamento + polegar, indicador, médio + rosca direta',
        diagnosis: 'Possível compressão de nervo mediano por hiperextensão de pulso',
        adjustment: 'Mudar para barra EZ (reduz stress), manter pulso neutro, fortalecer antebraço (wrist curls), usar pegada "W" (palmas ligeiramente para dentro)'
      },
      {
        pattern: 'Dor em cima do pulso + supino + flexão excessiva',
        diagnosis: 'Hiperextensão de pulso sob carga',
        adjustment: 'Manter pulso neutro (alinhado com antebraço), apertar a barra forte, usar grip mais fechado, fortalecer extensores de pulso'
      },
      {
        pattern: 'Dor lateral mindinho + pull-ups + pegada pronada',
        diagnosis: 'Stress no complexo TFCC (triangular fibrocartilage)',
        adjustment: 'Usar pegada supinada ou neutra, evitar pegada muito larga, fortalecer flexores ulnares'
      }
    ]
  },

  'quadril': {
    region: 'quadril',
    questions: [
      'Onde no quadril dói? (virilha, lateral, atrás/glúteo?)',
      'A dor é tipo "fisgada", "aperto" ou "travamento"?',
      'Piora quando você abre a perna (abdução) ou fecha (adução)?',
      'Você sente "estalo" no quadril ao agachar fundo?',
      'A dor melhora ou piora ao alongar?',
      'Você consegue fazer agachamento profundo sem dor?'
    ],
    redFlags: [
      'Dor intensa na virilha após movimento brusco',
      'Incapacidade de apoiar peso na perna',
      'Quadril "trava" e não destraba',
      'Dor que piora progressivamente',
      'Histórico de displasia de quadril',
      'Dor irradiando para joelho'
    ],
    commonIssues: [
      {
        pattern: 'Dor na virilha + agachamento profundo + estalo',
        diagnosis: 'Possível impacto femoroacetabular (FAI) ou tensão de flexor de quadril',
        adjustment: 'Reduzir profundidade (parar em 90°), stance mais largo, trabalhar mobilidade de quadril (90-90 stretch, pigeon pose), fortalecer glúteo'
      },
      {
        pattern: 'Dor lateral + abdutor/agachamento sumô',
        diagnosis: 'Tensão em tensor da fáscia lata ou bursite trocantérica',
        adjustment: 'Alongar TFL e banda iliotibial (foam rolling), fortalecer glúteo médio (clamshell, side plank hip lift), evitar amplitude excessiva em abdução'
      },
      {
        pattern: 'Dor atrás/glúteo + agachamento fundo + flexão excessiva',
        diagnosis: 'Possível impingement posterior ou piriforme tenso',
        adjustment: 'Melhorar mobilidade de tornozelo, stance mais estreito, alongar piriforme, trabalhar external rotation'
      }
    ]
  },

  'cotovelo': {
    region: 'cotovelo',
    questions: [
      'Onde no cotovelo dói? (lateral/parte de fora, medial/parte de dentro, atrás?)',
      'A dor piora quando você aperta/segura objetos?',
      'Piora em exercícios de puxar (costas) ou empurrar (peito/tríceps)?',
      'Você sente fraqueza no antebraço?',
      'A dor irradia para o pulso ou para o ombro?',
      'Há quanto tempo está acontecendo?'
    ],
    redFlags: [
      'Perda súbita de força',
      'Deformidade visível',
      'Inchaço significativo',
      'Travamento do cotovelo',
      'Dor após trauma direto',
      'Dormência persistente na mão'
    ],
    commonIssues: [
      {
        pattern: 'Dor lateral + rosca/pull-ups + pegada pronada',
        diagnosis: 'Possível epicondilite lateral (cotovelo de tenista)',
        adjustment: 'Usar pegada supinada ou neutra, reduzir volume/carga, fortalecer extensores de pulso, usar cotoveleira se necessário'
      },
      {
        pattern: 'Dor medial + rosca com peso pesado + pegada supinada',
        diagnosis: 'Possível epicondilite medial (cotovelo de golfista)',
        adjustment: 'Reduzir peso, usar pegada mais neutra (martelo), fortalecer flexores de pulso progressivamente, evitar full ROM no final'
      },
      {
        pattern: 'Dor atrás + tríceps/dips + extensão completa',
        diagnosis: 'Stress no tríceps ou hiperextensão',
        adjustment: 'Não travar cotovelo completamente, reduzir amplitude, trabalhar controle excêntrico'
      }
    ]
  },

  'tornozelo': {
    region: 'tornozelo',
    questions: [
      'Onde no tornozelo dói? (frente, atrás/tendão de aquiles, lateral?)',
      'A dor piora ao agachar fundo ou ao subir na ponta dos pés?',
      'Você teve entorse recentemente?',
      'Sente instabilidade ao caminhar?',
      'A dor é constante ou só durante exercícios?',
      'Há inchaço visível?'
    ],
    redFlags: [
      'Inchaço significativo imediato',
      'Impossibilidade de apoiar peso',
      'Deformidade',
      'Instabilidade severa',
      'Dor após entorse recente',
      'Vermelhidão e calor'
    ],
    commonIssues: [
      {
        pattern: 'Dor na frente + agachamento profundo + mobilidade limitada',
        diagnosis: 'Impingimento anterior ou mobilidade reduzida de tornozelo',
        adjustment: 'Melhorar mobilidade de dorsiflexão (wall ankle stretch), usar calço no calcanhar temporariamente, trabalhar mobilidade'
      },
      {
        pattern: 'Dor atrás/tendão + panturrilha/saltos',
        diagnosis: 'Possível tendinite de aquiles',
        adjustment: 'Reduzir volume de panturrilha, fortalecer progressivamente com excêntricos, alongar sóleo, gelo após treino'
      },
      {
        pattern: 'Dor lateral + instabilidade + histórico de entorse',
        diagnosis: 'Fraqueza de estabilizadores laterais',
        adjustment: 'Fortalecer fibulares (eversão), trabalho proprioceptivo (balance board), tobillera de suporte'
      }
    ]
  }
};

export function getInvestigationFlow(region: string): InvestigationFlow | null {
  const normalized = region.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  for (const [key, flow] of Object.entries(INVESTIGATION_FLOWS)) {
    if (normalized.includes(key)) {
      return flow;
    }
  }

  return null;
}

export function getAllRegions(): string[] {
  return Object.keys(INVESTIGATION_FLOWS);
}
