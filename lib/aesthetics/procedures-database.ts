/**
 * Base de Conhecimento de Procedimentos Estéticos
 * Fonte: Tratados de Cirurgia Plástica SBCP + Anatomia Moore/Netter
 */

export interface ProcedureData {
  name: string;
  category: 'corporal' | 'facial' | 'mamário' | 'minimamente_invasivo';
  anatomyInvolved: string[];
  requiredPrep: {
    physical: string[];
    nutritional: string[];
    medical: string[];
    psychological: string[];
  };
  recoveryTime: {
    returnToWork: string;
    returnToTraining: string;
    fullRecovery: string;
  };
  risks: string[];
  idealCandidateProfile: string;
  notRecommendedFor: string[];
  scientificSource: string;
  prepTimeRecommended: string;
}

export const PROCEDURES_DATABASE: Record<string, ProcedureData> = {
  lipoaspiração: {
    name: 'Lipoaspiração (Lipoescultura)',
    category: 'corporal',
    anatomyInvolved: ['tecido adiposo subcutâneo', 'fáscia muscular'],

    requiredPrep: {
      physical: [
        'Tônus muscular adequado (evita flacidez pós)',
        'Core fortalecido (sustentação da fáscia)',
        'Peso estável há pelo menos 3 meses',
        'IMC idealmente <30',
      ],
      nutritional: [
        'Dieta anti-inflamatória 30 dias antes',
        'Hidratação adequada (2-3L água/dia)',
        'Proteína >1.5g/kg (cicatrização)',
        'Suplementação: Vit C, Zinco, Ômega-3 (sob orientação)',
      ],
      medical: [
        'Exames pré-operatórios (hemograma, coagulação)',
        'Avaliação cardiovascular',
        'Suspensão de anticoagulantes (sob orientação médica)',
        'Não fumar por pelo menos 4 semanas antes',
      ],
      psychological: [
        'Expectativas realistas (não é emagrecimento)',
        'Entender que não remove celulite',
        'Compreender riscos (seroma, irregularidades)',
      ],
    },

    recoveryTime: {
      returnToWork: '7-10 dias (depende do volume)',
      returnToTraining: '30-45 dias (cardio leve) / 60 dias (treino completo)',
      fullRecovery: '3-6 meses (resultado final)',
    },

    risks: [
      'Seroma (acúmulo de líquido)',
      'Irregularidades no contorno',
      'Flacidez se tônus muscular inadequado',
      'Trombose (raro, mas possível)',
      'Infecção (raro com cirurgião adequado)',
    ],

    idealCandidateProfile:
      'Mulher com peso estável, tônus muscular bom, gordura localizada resistente a dieta/treino, expectativas realistas',

    notRecommendedFor: [
      'Obesidade (IMC >35)',
      'Flacidez severa (indicação: abdominoplastia)',
      'Expectativa de "emagrecer" com lipo',
      'Condições médicas não controladas',
      'Fumantes (sem cessação)',
    ],

    scientificSource: 'Tratado de Cirurgia Plástica SBCP + Moore Anatomia Clínica',
    prepTimeRecommended: '3-6 meses',
  },

  abdominoplastia: {
    name: 'Abdominoplastia (Dermolipectomia Abdominal)',
    category: 'corporal',
    anatomyInvolved: ['pele abdominal', 'músculo reto abdominal', 'fáscia'],

    requiredPrep: {
      physical: [
        'Core MUITO fortalecido (reabilita diástase se houver)',
        'Peso estável há 6+ meses',
        'IMC idealmente <30',
        'Sem planos de gravidez futura',
      ],
      nutritional: [
        'Dieta rica em proteína (cicatrização da grande incisão)',
        'Anti-inflamatórios naturais (cúrcuma, gengibre)',
        'Hidratação rigorosa',
        'Evitar sódio excessivo (reduz inchaço pós)',
      ],
      medical: [
        'Exames completos (inclusive avaliação cardíaca)',
        'Avaliação de diástase de reto (se pós-parto)',
        'Tratamento de qualquer hérnia abdominal',
        'Não fumar por 8 semanas antes',
      ],
      psychological: [
        'Aceitar cicatriz grande (mas baixa, escondida)',
        'Entender que recuperação é LONGA',
        'Ter suporte em casa (primeiras 2 semanas críticas)',
      ],
    },

    recoveryTime: {
      returnToWork: '14-21 dias',
      returnToTraining: '60 dias (cardio leve) / 90 dias (core/pesado)',
      fullRecovery: '6-12 meses',
    },

    risks: [
      'Seroma (muito comum)',
      'Cicatriz alargada',
      'Necrose de pele (raro, mais em fumantes)',
      'Trombose venosa profunda',
      'Recorrência de diástase (se não fortalecer core)',
    ],

    idealCandidateProfile:
      'Mulher pós-gravidez ou grande emagrecimento, com excesso de pele + flacidez muscular, peso estável, sem planos de gravidez',

    notRecommendedFor: [
      'Planos de engravidar',
      'Obesidade não tratada',
      'Fumantes',
      'Expectativa de "barriga tanquinho" sem treino',
      'Core fraco (alto risco de recorrência)',
    ],

    scientificSource: 'Tratado de Cirurgia Plástica Reconstructiva (Mathes) + Sobotta Atlas',
    prepTimeRecommended: '6-12 meses',
  },

  'mamoplastia de aumento': {
    name: 'Mamoplastia de Aumento (Prótese Mamária)',
    category: 'mamário',
    anatomyInvolved: ['glândula mamária', 'músculo peitoral', 'pele mamária'],

    requiredPrep: {
      physical: [
        'Peitoral fortalecido (sustentação da prótese)',
        'Peso estável',
        'Postura correta (evita assimetria)',
        'Dorsal e trapézio fortes (evita dor nas costas)',
      ],
      nutritional: [
        'Dieta balanceada (cicatrização)',
        'Proteína adequada',
        'Evitar suplementos que afinem sangue (ginko, óleo peixe)',
      ],
      medical: [
        'Mamografia/ultrassom (baseline pré-cirúrgico)',
        'Exames de rotina',
        'Decisão sobre via (inframamária, axilar, areolar)',
        'Decisão sobre posição (submuscular, subfascial, subglandular)',
      ],
      psychological: [
        'Escolher tamanho com cirurgião (não com Instagram)',
        'Aceitar troca de prótese a cada 10-15 anos',
        'Entender que pode atrapalhar amamentação futura',
      ],
    },

    recoveryTime: {
      returnToWork: '7 dias',
      returnToTraining: '30 dias (inferior) / 45-60 dias (superior/peitoral)',
      fullRecovery: '6 meses (prótese acomoda)',
    },

    risks: [
      'Contratura capsular (endurecimento)',
      'Assimetria',
      'Perda/alteração de sensibilidade no mamilo',
      'Rotação da prótese',
      'Ruptura da prótese (a longo prazo)',
    ],

    idealCandidateProfile:
      'Mulher com mama pequena ou perda de volume pós-amamentação, expectativas realistas, sem planos imediatos de gravidez',

    notRecommendedFor: [
      'Grávidas ou amamentando',
      'Expectativa de "tamanho de celebridade X"',
      'Histórico familiar forte de câncer de mama sem acompanhamento',
      'Muito jovem (<21 anos)',
    ],

    scientificSource: 'SBCP - Consenso Brasileiro de Mamoplastia + Anatomia de Moore',
    prepTimeRecommended: '2-3 meses',
  },

  bbl: {
    name: 'BBL (Brazilian Butt Lift / Lipoenxertia Glútea)',
    category: 'corporal',
    anatomyInvolved: ['tecido adiposo', 'músculo glúteo', 'fáscia'],

    requiredPrep: {
      physical: [
        'Glúteo fortalecido (recebe enxerto melhor)',
        'Gordura doadora suficiente (abdômen, flancos)',
        'Peso estável há 3+ meses',
        'IMC entre 25-30 (ideal)',
      ],
      nutritional: [
        'Dieta rica em proteína (sobrevivência do enxerto)',
        'Hidratação intensa',
        'Evitar álcool e cigarro (vasoconstrição)',
      ],
      medical: [
        'Exames completos',
        'Avaliação vascular',
        'Escolher cirurgião MUITO experiente (procedimento de alto risco)',
      ],
      psychological: [
        'Entender que 30-50% do enxerto pode ser reabsorvido',
        'Aceitar necessidade de retoque (comum)',
        'Compreender recuperação difícil (não sentar 6-8 semanas)',
      ],
    },

    recoveryTime: {
      returnToWork: '14-21 dias',
      returnToTraining: '60 dias (inferior) / 90 dias (glúteo)',
      fullRecovery: '6-12 meses (enxerto estabiliza)',
    },

    risks: [
      'Embolia gordurosa (GRAVE - pode ser fatal)',
      'Reabsorção do enxerto (30-50%)',
      'Assimetria',
      'Necrose de gordura',
      'Infecção',
    ],

    idealCandidateProfile:
      'Mulher com gordura localizada para doar, glúteo pouco desenvolvido, expectativas realistas sobre reabsorção',

    notRecommendedFor: [
      'Muito magra (sem gordura doadora)',
      'Fumantes',
      'Expectativa de resultado permanente sem manutenção',
      'Falta de condições para recuperação de 6-8 semanas sem sentar',
    ],

    scientificSource: 'SBCP - Consenso sobre Segurança em BBL',
    prepTimeRecommended: '3-6 meses',
  },

  rinoplastia: {
    name: 'Rinoplastia (Cirurgia de Nariz)',
    category: 'facial',
    anatomyInvolved: ['osso nasal', 'cartilagem', 'septo nasal', 'mucosa'],

    requiredPrep: {
      physical: ['Peso estável', 'Boa saúde respiratória'],
      nutritional: ['Dieta balanceada', 'Hidratação', 'Vitamina C'],
      medical: [
        'Tomografia de face (avaliação óssea)',
        'Avaliação otorrino (função respiratória)',
        'Não fumar 4+ semanas antes',
      ],
      psychological: [
        'Expectativas MUITO realistas (resultado não é igual a foto)',
        'Aceitar inchaço prolongado (6-12 meses)',
        'Entender que resultado final leva 1-2 anos',
      ],
    },

    recoveryTime: {
      returnToWork: '7-10 dias',
      returnToTraining: '30 dias (leve) / 90 dias (pesado)',
      fullRecovery: '12-24 meses (osso/cartilagem remodelam)',
    },

    risks: [
      'Resultado insatisfatório (necessita retoque)',
      'Assimetria',
      'Dificuldade respiratória',
      'Necrose de pele (raro)',
      'Perfuração de septo (raro)',
    ],

    idealCandidateProfile:
      'Pessoa com deformidade nasal (estética ou funcional), expectativas realistas, paciência para resultado final',

    notRecommendedFor: [
      'Muito jovem (<18 anos)',
      'Expectativa de "nariz de celebridade X"',
      'Instabilidade emocional',
      'Fumantes',
    ],

    scientificSource: 'Tratado de Cirurgia Plástica Facial + Anatomia de Netter',
    prepTimeRecommended: '2-3 meses',
  },
};

export function findProcedure(procedureName: string): ProcedureData | null {
  const normalized = procedureName.toLowerCase().trim();

  // Match exato
  if (PROCEDURES_DATABASE[normalized]) {
    return PROCEDURES_DATABASE[normalized];
  }

  // Match parcial
  for (const [key, value] of Object.entries(PROCEDURES_DATABASE)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value;
    }
  }

  // Aliases
  if (normalized.includes('silicone') || normalized.includes('prótese mama')) {
    return PROCEDURES_DATABASE['mamoplastia de aumento'];
  }
  if (normalized.includes('lipo') && !normalized.includes('enxertia')) {
    return PROCEDURES_DATABASE['lipoaspiração'];
  }
  if (normalized.includes('barriga') || normalized.includes('abdômen')) {
    return PROCEDURES_DATABASE['abdominoplastia'];
  }
  if (normalized.includes('nariz')) {
    return PROCEDURES_DATABASE['rinoplastia'];
  }

  return null;
}
