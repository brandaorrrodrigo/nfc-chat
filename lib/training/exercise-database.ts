/**
 * Exercise Database - Base de dados MASSIVA de exercícios com análise biomecânica
 *
 * FONTE: Baseado em literatura de Bret Contreras (Glute Lab), NSCA, ACSM, ACE Fitness
 * Contém 250+ exercícios organizados por grupo muscular
 *
 * NOMES: Todos em PORTUGUÊS com aliases em inglês para busca flexível
 */

// ==========================================
// TIPOS
// ==========================================

export interface ExerciseData {
  name: string;
  aliases: string[];
  primaryMuscles: string[];
  secondaryMuscles: string[];
  movementPattern: string;
  equipment: string;
  difficulty: 'iniciante' | 'intermediário' | 'avançado';
  biomechanics: {
    activation: string;
    rom: string;
    joint: string;
  };
  progressions: string[];
  variations: string[];
  commonMistakes: string[];
  scientificSource: string;
}

// ==========================================
// BASE DE DADOS - 250+ EXERCÍCIOS
// ==========================================

export const EXERCISE_DATABASE: Record<string, ExerciseData> = {

  // ============================================================
  // GLÚTEOS - 45+ EXERCÍCIOS (Bret Contreras - Glute Lab)
  // ============================================================

  'hip thrust': {
    name: 'Elevação Pélvica com Barra',
    aliases: ['hip thrust', 'elevação pélvica', 'elevacao pelvica', 'ponte com barra', 'glute bridge barra', 'thrust', 'barbell hip thrust'],
    primaryMuscles: ['glúteo máximo'],
    secondaryMuscles: ['isquiotibiais', 'core', 'quadríceps'],
    movementPattern: 'extensão de quadril',
    equipment: 'barra',
    difficulty: 'intermediário',
    biomechanics: {
      activation: '89% glúteo máximo (maior que agachamento)',
      rom: 'Extensão completa de quadril (0° a 180°)',
      joint: 'Coxofemoral (quadril)',
    },
    progressions: ['Hip thrust unilateral', 'Pausa de 3s no topo', 'Pés elevados', 'Banda nos joelhos'],
    variations: ['Glute bridge', 'Hip thrust na Smith', 'Frog pump', 'B-stance hip thrust'],
    commonMistakes: ['Hiperextender a lombar', 'Não fazer squeeze no topo', 'Barra muito baixa'],
    scientificSource: 'Contreras et al. (2015) - Journal of Strength & Conditioning',
  },

  'ponte de gluteo': {
    name: 'Ponte de Glúteo',
    aliases: ['glute bridge', 'ponte', 'bridge', 'elevação de quadril', 'ponte gluteo'],
    primaryMuscles: ['glúteo máximo'],
    secondaryMuscles: ['isquiotibiais', 'core'],
    movementPattern: 'extensão de quadril',
    equipment: 'corpo livre',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '75% glúteo máximo',
      rom: 'Extensão de quadril no chão',
      joint: 'Coxofemoral',
    },
    progressions: ['Adicionar peso', 'Versão unilateral', 'Pés elevados', 'Evoluir para hip thrust'],
    variations: ['Single leg bridge', 'Marching bridge', 'Com banda'],
    commonMistakes: ['Não subir quadril completamente', 'Usar impulso'],
    scientificSource: 'Contreras & Schoenfeld (2011)',
  },

  'ponte unilateral': {
    name: 'Ponte Unilateral',
    aliases: ['single leg glute bridge', 'ponte uma perna', 'single leg bridge'],
    primaryMuscles: ['glúteo máximo'],
    secondaryMuscles: ['isquiotibiais', 'core'],
    movementPattern: 'extensão de quadril unilateral',
    equipment: 'corpo livre',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '81% glúteo (maior que bilateral)',
      rom: 'Extensão completa unilateral',
      joint: 'Coxofemoral',
    },
    progressions: ['Adicionar caneleira', 'Pé elevado', 'Evoluir para hip thrust unilateral'],
    variations: ['Com elástico', 'Pé elevado no step'],
    commonMistakes: ['Quadril caindo para o lado', 'Não contrair no topo'],
    scientificSource: 'Contreras (2019)',
  },

  'frog pump': {
    name: 'Frog Pump',
    aliases: ['bomba sapo', 'frog pumps', 'pump de sapo'],
    primaryMuscles: ['glúteo máximo', 'glúteo médio'],
    secondaryMuscles: ['adutor'],
    movementPattern: 'extensão de quadril com abdução',
    equipment: 'corpo livre',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '82% glúteo (abdução aumenta ativação)',
      rom: 'Curta amplitude com foco em contração',
      joint: 'Coxofemoral',
    },
    progressions: ['Adicionar halter no quadril', 'Pausas no topo'],
    variations: ['Com banda', 'Frog pump elevado'],
    commonMistakes: ['Não manter joelhos abertos', 'Amplitude excessiva'],
    scientificSource: 'Contreras - Glute Lab (2019)',
  },

  'coice no cabo': {
    name: 'Coice no Cabo',
    aliases: ['kickback', 'glute kickback', 'cable kickback', 'coice', 'kickback no cabo', 'coice de burro'],
    primaryMuscles: ['glúteo máximo'],
    secondaryMuscles: ['isquiotibiais'],
    movementPattern: 'extensão de quadril unilateral',
    equipment: 'cabo',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '70% glúteo máximo',
      rom: 'Extensão de quadril isolada',
      joint: 'Coxofemoral',
    },
    progressions: ['Aumentar carga', 'Pausa no pico', 'Versão com caneleira'],
    variations: ['Na máquina', 'No cabo', 'Com elástico', 'No chão 4 apoios'],
    commonMistakes: ['Usar impulso do tronco', 'Hiperextender a lombar'],
    scientificSource: 'ACE Fitness Study (2006)',
  },

  'coice na maquina': {
    name: 'Coice na Máquina',
    aliases: ['glute machine', 'kickback machine', 'maquina de gluteo'],
    primaryMuscles: ['glúteo máximo'],
    secondaryMuscles: ['isquiotibiais'],
    movementPattern: 'extensão de quadril guiada',
    equipment: 'máquina',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '72% glúteo máximo',
      rom: 'Extensão controlada',
      joint: 'Coxofemoral',
    },
    progressions: ['Aumentar carga', 'Drop sets'],
    variations: ['Com pausa', 'Cadência lenta'],
    commonMistakes: ['Usar impulso', 'Carga excessiva'],
    scientificSource: 'ACE Fitness (2006)',
  },

  'abdutora': {
    name: 'Cadeira Abdutora',
    aliases: ['abducao', 'cadeira abdutora', 'hip abduction', 'maquina abdutora', 'abdução de quadril'],
    primaryMuscles: ['glúteo médio', 'glúteo mínimo'],
    secondaryMuscles: ['tensor da fáscia lata'],
    movementPattern: 'abdução de quadril',
    equipment: 'máquina',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '85% glúteo médio',
      rom: 'Abdução de 0° a 45°',
      joint: 'Coxofemoral',
    },
    progressions: ['Aumentar carga', 'Pausa no pico', 'Cadência lenta'],
    variations: ['Sentado', 'Em pé no cabo', 'Deitado lateral'],
    commonMistakes: ['Inclinar o tronco', 'Usar impulso'],
    scientificSource: 'Boren et al. (2011)',
  },

  'abdução no cabo': {
    name: 'Abdução de Quadril no Cabo',
    aliases: ['cable hip abduction', 'abdução em pé', 'cable abduction'],
    primaryMuscles: ['glúteo médio'],
    secondaryMuscles: ['glúteo mínimo', 'tensor fascia lata'],
    movementPattern: 'abdução de quadril em pé',
    equipment: 'cabo',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '78% glúteo médio',
      rom: 'Abdução em pé',
      joint: 'Coxofemoral',
    },
    progressions: ['Aumentar carga', 'Pausa', 'Cadência lenta'],
    variations: ['Com tornozeleira', 'Inclinado'],
    commonMistakes: ['Inclinar corpo', 'Usar impulso'],
    scientificSource: 'Boren et al. (2011)',
  },

  'abdução deitado': {
    name: 'Abdução Deitado Lateral',
    aliases: ['side lying hip abduction', 'abdução lateral', 'elevação lateral perna'],
    primaryMuscles: ['glúteo médio'],
    secondaryMuscles: ['glúteo mínimo'],
    movementPattern: 'abdução deitado',
    equipment: 'corpo livre',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '79% glúteo médio',
      rom: 'Abdução de 0° a 45°',
      joint: 'Coxofemoral',
    },
    progressions: ['Adicionar caneleira', 'Adicionar banda', 'Aumentar repetições'],
    variations: ['Com caneleira', 'Com banda', 'Com círculos'],
    commonMistakes: ['Girar o quadril', 'Levantar demais'],
    scientificSource: 'Distefano et al. (2009)',
  },

  'concha': {
    name: 'Concha (Clamshell)',
    aliases: ['clamshell', 'clam', 'abdução deitado joelhos'],
    primaryMuscles: ['glúteo médio'],
    secondaryMuscles: ['glúteo mínimo', 'rotadores externos'],
    movementPattern: 'rotação externa de quadril',
    equipment: 'elástico ou corpo livre',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '77% glúteo médio',
      rom: 'Rotação externa com quadril flexionado',
      joint: 'Coxofemoral',
    },
    progressions: ['Adicionar banda', 'Aumentar resistência', 'Com elevação'],
    variations: ['Com banda', 'Com elevação de quadril', 'Standing clamshell'],
    commonMistakes: ['Girar o tronco', 'Não manter pés unidos'],
    scientificSource: 'Distefano et al. (2009)',
  },

  'hidrante': {
    name: 'Hidrante (Fire Hydrant)',
    aliases: ['fire hydrant', 'dirty dog', 'quadruped hip abduction'],
    primaryMuscles: ['glúteo médio', 'glúteo máximo'],
    secondaryMuscles: ['core'],
    movementPattern: 'abdução em 4 apoios',
    equipment: 'corpo livre',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '74% glúteo médio',
      rom: 'Abdução com joelho flexionado',
      joint: 'Coxofemoral',
    },
    progressions: ['Adicionar caneleira', 'Adicionar banda', 'Círculos de quadril'],
    variations: ['Com banda', 'Com círculos', 'Com extensão'],
    commonMistakes: ['Girar a coluna', 'Não estabilizar core'],
    scientificSource: 'Boren et al. (2011)',
  },

  'subida no banco': {
    name: 'Subida no Banco (Step Up)',
    aliases: ['step up', 'step', 'subida', 'box step up'],
    primaryMuscles: ['glúteo máximo', 'quadríceps'],
    secondaryMuscles: ['isquiotibiais', 'panturrilha'],
    movementPattern: 'extensão unilateral',
    equipment: 'banco ou caixa',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '75% glúteo, 70% quadríceps',
      rom: 'Extensão completa de quadril e joelho',
      joint: 'Coxofemoral + joelho',
    },
    progressions: ['Aumentar altura', 'Adicionar halteres', 'Com barra'],
    variations: ['Lateral step up', 'Crossover step up', 'Com joelho alto'],
    commonMistakes: ['Empurrar com perna de trás', 'Inclinar tronco'],
    scientificSource: 'Simenz et al. (2012)',
  },

  'step up lateral': {
    name: 'Step Up Lateral',
    aliases: ['lateral step up', 'subida lateral', 'side step up'],
    primaryMuscles: ['glúteo médio', 'quadríceps'],
    secondaryMuscles: ['adutor', 'glúteo máximo'],
    movementPattern: 'extensão lateral',
    equipment: 'banco ou caixa',
    difficulty: 'intermediário',
    biomechanics: {
      activation: '80% glúteo médio',
      rom: 'Extensão com ênfase lateral',
      joint: 'Coxofemoral + joelho',
    },
    progressions: ['Aumentar altura', 'Adicionar peso'],
    variations: ['Com halteres', 'Com barra'],
    commonMistakes: ['Usar impulso', 'Inclinar tronco'],
    scientificSource: 'Simenz et al. (2012)',
  },

  'afundo reverso': {
    name: 'Afundo Reverso',
    aliases: ['reverse lunge', 'lunge reverso', 'passada reversa', 'passada pra tras'],
    primaryMuscles: ['glúteo máximo', 'quadríceps'],
    secondaryMuscles: ['isquiotibiais', 'core'],
    movementPattern: 'agachamento unilateral',
    equipment: 'corpo livre ou halteres',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '78% glúteo (mais que frontal)',
      rom: 'Flexão profunda de quadril e joelho',
      joint: 'Coxofemoral + joelho',
    },
    progressions: ['Adicionar halteres', 'Adicionar barra', 'Deficit'],
    variations: ['Com halteres', 'Com barra', 'Deficit', 'Walking'],
    commonMistakes: ['Joelho passando do pé', 'Tronco inclinado'],
    scientificSource: 'Farrokhi et al. (2008)',
  },

  'afundo frontal': {
    name: 'Afundo Frontal',
    aliases: ['forward lunge', 'lunge frontal', 'passada frontal', 'passada pra frente'],
    primaryMuscles: ['quadríceps', 'glúteo máximo'],
    secondaryMuscles: ['isquiotibiais', 'core'],
    movementPattern: 'agachamento unilateral',
    equipment: 'corpo livre ou halteres',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '75% quadríceps, 65% glúteo',
      rom: 'Flexão de quadril e joelho',
      joint: 'Coxofemoral + joelho',
    },
    progressions: ['Adicionar peso', 'Walking lunges'],
    variations: ['Com halteres', 'Com barra', 'Walking'],
    commonMistakes: ['Joelho colapsando', 'Passada curta'],
    scientificSource: 'Farrokhi et al. (2008)',
  },

  'afundo caminhando': {
    name: 'Afundo Caminhando',
    aliases: ['walking lunge', 'lunge walking', 'passada caminhando'],
    primaryMuscles: ['quadríceps', 'glúteo máximo'],
    secondaryMuscles: ['isquiotibiais', 'core', 'panturrilha'],
    movementPattern: 'agachamento unilateral dinâmico',
    equipment: 'corpo livre ou halteres',
    difficulty: 'intermediário',
    biomechanics: {
      activation: '77% quadríceps, 72% glúteo',
      rom: 'Flexão alternada caminhando',
      joint: 'Coxofemoral + joelho',
    },
    progressions: ['Adicionar peso', 'Aumentar distância'],
    variations: ['Com halteres', 'Com barra', 'Reverso'],
    commonMistakes: ['Perder equilíbrio', 'Passos curtos'],
    scientificSource: 'Farrokhi et al. (2008)',
  },

  'afundo cruzado': {
    name: 'Afundo Cruzado (Curtsy Lunge)',
    aliases: ['curtsy lunge', 'lunge cruzado', 'curtsy', 'crossover lunge'],
    primaryMuscles: ['glúteo máximo', 'glúteo médio'],
    secondaryMuscles: ['quadríceps', 'adutor'],
    movementPattern: 'agachamento unilateral com adução',
    equipment: 'corpo livre ou halteres',
    difficulty: 'intermediário',
    biomechanics: {
      activation: '80% glúteo médio',
      rom: 'Flexão com adução de quadril',
      joint: 'Coxofemoral + joelho',
    },
    progressions: ['Adicionar halteres', 'Aumentar profundidade'],
    variations: ['Com halteres', 'Com pulse', 'Sliding'],
    commonMistakes: ['Joelho colapsando', 'Perder equilíbrio'],
    scientificSource: 'Contreras - Glute Lab (2019)',
  },

  'afundo bulgaro': {
    name: 'Afundo Búlgaro',
    aliases: ['bulgarian split squat', 'bulgaro', 'split squat elevado', 'agachamento bulgaro'],
    primaryMuscles: ['quadríceps', 'glúteo máximo'],
    secondaryMuscles: ['isquiotibiais', 'core'],
    movementPattern: 'agachamento unilateral',
    equipment: 'banco + halteres',
    difficulty: 'intermediário',
    biomechanics: {
      activation: '82% quadríceps, 78% glúteo',
      rom: 'Flexão profunda unilateral',
      joint: 'Coxofemoral + joelho',
    },
    progressions: ['Aumentar carga', 'Deficit', 'Pausa no fundo'],
    variations: ['Com halteres', 'Com barra', 'Na Smith'],
    commonMistakes: ['Tronco inclinado', 'Joelho colapsando'],
    scientificSource: 'Speirs et al. (2016)',
  },

  'puxada entre pernas': {
    name: 'Puxada Entre Pernas',
    aliases: ['cable pull through', 'pull through', 'pull through no cabo'],
    primaryMuscles: ['glúteo máximo', 'isquiotibiais'],
    secondaryMuscles: ['lombar', 'core'],
    movementPattern: 'dobradiça de quadril',
    equipment: 'cabo',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '72% glúteo, tensão constante',
      rom: 'Hip hinge completo',
      joint: 'Coxofemoral',
    },
    progressions: ['Aumentar carga', 'Pausa no topo'],
    variations: ['Com elástico', 'Kettlebell swing'],
    commonMistakes: ['Usar os braços', 'Arredondar lombar'],
    scientificSource: 'Contreras (2013)',
  },

  'balanco kettlebell': {
    name: 'Balanço com Kettlebell',
    aliases: ['kettlebell swing', 'swing', 'kb swing', 'russian swing', 'american swing'],
    primaryMuscles: ['glúteo máximo', 'isquiotibiais'],
    secondaryMuscles: ['core', 'ombros', 'lombar'],
    movementPattern: 'dobradiça de quadril explosiva',
    equipment: 'kettlebell',
    difficulty: 'intermediário',
    biomechanics: {
      activation: '76% glúteo, movimento balístico',
      rom: 'Hip hinge explosivo',
      joint: 'Coxofemoral',
    },
    progressions: ['Aumentar peso', 'Single arm', 'American swing'],
    variations: ['Russian', 'American', 'Single arm', 'Alternating'],
    commonMistakes: ['Usar os braços', 'Agachar em vez de hip hinge'],
    scientificSource: 'McGill & Marshall (2012)',
  },

  'terra sumo': {
    name: 'Levantamento Terra Sumô',
    aliases: ['sumo deadlift', 'terra sumo', 'sumo', 'levantamento sumo', 'deadlift sumo'],
    primaryMuscles: ['glúteo máximo', 'quadríceps', 'adutor'],
    secondaryMuscles: ['isquiotibiais', 'lombar', 'trapézio'],
    movementPattern: 'levantamento base larga',
    equipment: 'barra',
    difficulty: 'intermediário',
    biomechanics: {
      activation: '85% glúteo (mais que convencional)',
      rom: 'Menor amplitude vertical',
      joint: 'Coxofemoral + joelhos',
    },
    progressions: ['Aumentar carga', 'Deficit', 'Paused'],
    variations: ['Com halteres', 'Block pull', 'Deficit'],
    commonMistakes: ['Joelhos colapsando', 'Quadril subindo antes'],
    scientificSource: 'Escamilla et al. (2002)',
  },

  'stiff': {
    name: 'Stiff (Levantamento Terra Romeno)',
    aliases: ['romanian deadlift', 'rdl', 'romeno', 'levantamento romeno', 'stiff leg deadlift'],
    primaryMuscles: ['isquiotibiais', 'glúteo máximo'],
    secondaryMuscles: ['lombar', 'trapézio', 'antebraços'],
    movementPattern: 'dobradiça de quadril',
    equipment: 'barra',
    difficulty: 'intermediário',
    biomechanics: {
      activation: '91% posterior (isquio + glúteo)',
      rom: 'Flexão de quadril 90°+ joelhos semi-flexionados',
      joint: 'Coxofemoral',
    },
    progressions: ['Single leg', 'Deficit', 'Paused', 'Snatch grip'],
    variations: ['Com halteres', 'Single leg', 'B-stance'],
    commonMistakes: ['Arredondar lombar', 'Dobrar demais joelhos'],
    scientificSource: 'Schoenfeld & Grgic (2020)',
  },

  'stiff unilateral': {
    name: 'Stiff Unilateral',
    aliases: ['single leg rdl', 'single leg romanian deadlift', 'stiff uma perna'],
    primaryMuscles: ['isquiotibiais', 'glúteo máximo'],
    secondaryMuscles: ['lombar', 'core'],
    movementPattern: 'hip hinge unilateral',
    equipment: 'halteres',
    difficulty: 'avançado',
    biomechanics: {
      activation: '92% posterior + estabilização',
      rom: 'Hip hinge profundo unilateral',
      joint: 'Coxofemoral',
    },
    progressions: ['Aumentar carga', 'Deficit'],
    variations: ['Com KB', 'Com halteres', 'B-stance'],
    commonMistakes: ['Perder equilíbrio', 'Girar quadril'],
    scientificSource: 'Schoenfeld (2020)',
  },

  'bom dia': {
    name: 'Bom Dia (Good Morning)',
    aliases: ['good morning', 'goodmorning', 'flexao de tronco'],
    primaryMuscles: ['isquiotibiais', 'glúteo máximo', 'lombar'],
    secondaryMuscles: ['core'],
    movementPattern: 'dobradiça de quadril com barra',
    equipment: 'barra',
    difficulty: 'intermediário',
    biomechanics: {
      activation: '85% isquiotibiais, 78% lombar',
      rom: 'Hip hinge com barra nos ombros',
      joint: 'Coxofemoral + coluna',
    },
    progressions: ['Aumentar carga', 'Paused', 'Seated'],
    variations: ['Seated', 'Banded', 'Safety bar'],
    commonMistakes: ['Arredondar coluna', 'Peso excessivo'],
    scientificSource: 'Vigotsky et al. (2015)',
  },

  'extensao de coluna': {
    name: 'Extensão de Coluna (Hiperextensão)',
    aliases: ['hiperextensao', 'extensao lombar', 'back extension', 'roman chair', '45 degree'],
    primaryMuscles: ['lombar', 'glúteo máximo'],
    secondaryMuscles: ['isquiotibiais'],
    movementPattern: 'extensão de coluna e quadril',
    equipment: 'banco 45° ou romano',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '70% lombar, 65% glúteo',
      rom: 'Extensão de coluna + quadril',
      joint: 'Coluna lombar + coxofemoral',
    },
    progressions: ['Adicionar peso', 'Pausa no topo', 'Unilateral'],
    variations: ['45°', 'Horizontal', 'Reverse hyper'],
    commonMistakes: ['Hiperextender lombar', 'Usar impulso'],
    scientificSource: 'Mayer et al. (2008)',
  },

  'reverse hyper': {
    name: 'Hiperextensão Reversa',
    aliases: ['reverse hyperextension', 'hiperextensao reversa'],
    primaryMuscles: ['glúteo máximo', 'isquiotibiais'],
    secondaryMuscles: ['lombar'],
    movementPattern: 'extensão de quadril tronco fixo',
    equipment: 'máquina ou banco',
    difficulty: 'intermediário',
    biomechanics: {
      activation: '82% glúteo, descomprime coluna',
      rom: 'Extensão de quadril isolada',
      joint: 'Coxofemoral',
    },
    progressions: ['Aumentar carga', 'Pausa', 'Unilateral'],
    variations: ['Na máquina', 'No banco', 'Com banda'],
    commonMistakes: ['Usar impulso', 'Amplitude excessiva'],
    scientificSource: 'Simmons (Westside Barbell)',
  },

  'adutora': {
    name: 'Cadeira Adutora',
    aliases: ['adduction', 'adutora', 'maquina adutora', 'hip adduction'],
    primaryMuscles: ['adutor magno', 'adutor longo', 'adutor curto'],
    secondaryMuscles: ['grácil', 'pectíneo'],
    movementPattern: 'adução de quadril',
    equipment: 'máquina',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '85% adutores',
      rom: 'Adução de 45° a 0°',
      joint: 'Coxofemoral',
    },
    progressions: ['Aumentar carga', 'Pausa', 'Cadência lenta'],
    variations: ['Sentado', 'Em pé no cabo'],
    commonMistakes: ['Usar impulso', 'Carga excessiva'],
    scientificSource: 'NSCA (2015)',
  },

  'adução no cabo': {
    name: 'Adução no Cabo',
    aliases: ['cable adduction', 'adução em pé', 'cable hip adduction'],
    primaryMuscles: ['adutor'],
    secondaryMuscles: ['glúteo médio'],
    movementPattern: 'adução em pé',
    equipment: 'cabo',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '80% adutores',
      rom: 'Adução em pé controlada',
      joint: 'Coxofemoral',
    },
    progressions: ['Aumentar carga', 'Pausa'],
    variations: ['Com tornozeleira', 'Inclinado'],
    commonMistakes: ['Usar impulso', 'Girar tronco'],
    scientificSource: 'NSCA (2015)',
  },

  // ============================================================
  // QUADRÍCEPS - 35+ EXERCÍCIOS
  // ============================================================

  'agachamento livre': {
    name: 'Agachamento Livre',
    aliases: ['squat', 'back squat', 'agachamento', 'agachamento com barra'],
    primaryMuscles: ['quadríceps', 'glúteo máximo'],
    secondaryMuscles: ['isquiotibiais', 'core', 'lombar'],
    movementPattern: 'agachamento bilateral',
    equipment: 'barra',
    difficulty: 'intermediário',
    biomechanics: {
      activation: '88% quadríceps, 70% glúteo',
      rom: 'Flexão até paralelo ou abaixo',
      joint: 'Joelhos + coxofemoral',
    },
    progressions: ['Aumentar profundidade', 'Pause squat', 'Tempo squat'],
    variations: ['High bar', 'Low bar', 'Front squat', 'Box squat'],
    commonMistakes: ['Joelhos para dentro', 'Arredondar lombar'],
    scientificSource: 'Schoenfeld et al. (2021)',
  },

  'agachamento frontal': {
    name: 'Agachamento Frontal',
    aliases: ['front squat', 'agachamento com barra na frente'],
    primaryMuscles: ['quadríceps'],
    secondaryMuscles: ['glúteo', 'core', 'lombar'],
    movementPattern: 'agachamento com carga anterior',
    equipment: 'barra',
    difficulty: 'avançado',
    biomechanics: {
      activation: '92% quadríceps (mais que back squat)',
      rom: 'Flexão profunda mantendo tronco ereto',
      joint: 'Joelhos + coxofemoral',
    },
    progressions: ['Aumentar carga', 'Pausa no fundo'],
    variations: ['Clean grip', 'Cross grip', 'Com kettlebells'],
    commonMistakes: ['Cotovelos caindo', 'Tronco inclinando'],
    scientificSource: 'Contreras et al. (2016)',
  },

  'agachamento goblet': {
    name: 'Agachamento Goblet',
    aliases: ['goblet squat', 'agachamento com halter', 'agachamento calice'],
    primaryMuscles: ['quadríceps', 'glúteo'],
    secondaryMuscles: ['core', 'bíceps'],
    movementPattern: 'agachamento com carga frontal',
    equipment: 'halter ou kettlebell',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '85% quadríceps, 72% glúteo',
      rom: 'Flexão profunda natural',
      joint: 'Joelhos + coxofemoral',
    },
    progressions: ['Aumentar peso', 'Pausa', 'Evoluir para front squat'],
    variations: ['Com halter', 'Com kettlebell'],
    commonMistakes: ['Joelhos para dentro', 'Não descer fundo'],
    scientificSource: 'NSCA (2015)',
  },

  'agachamento na smith': {
    name: 'Agachamento na Smith',
    aliases: ['smith squat', 'agachamento smith', 'smith machine squat'],
    primaryMuscles: ['quadríceps', 'glúteo'],
    secondaryMuscles: ['isquiotibiais'],
    movementPattern: 'agachamento guiado',
    equipment: 'Smith machine',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '82% quadríceps',
      rom: 'Trajetória guiada',
      joint: 'Joelhos + coxofemoral',
    },
    progressions: ['Aumentar carga', 'Pés mais à frente'],
    variations: ['Pés neutros', 'Pés à frente', 'Sissy squat'],
    commonMistakes: ['Joelhos para dentro', 'Não trancar a máquina'],
    scientificSource: 'Schwanbeck et al. (2009)',
  },

  'agachamento hack': {
    name: 'Agachamento Hack',
    aliases: ['hack squat', 'hack', 'maquina hack'],
    primaryMuscles: ['quadríceps'],
    secondaryMuscles: ['glúteo'],
    movementPattern: 'agachamento na máquina inclinada',
    equipment: 'máquina hack',
    difficulty: 'intermediário',
    biomechanics: {
      activation: '90% quadríceps',
      rom: 'Flexão profunda guiada',
      joint: 'Joelhos + coxofemoral',
    },
    progressions: ['Aumentar carga', 'Pés mais baixos'],
    variations: ['Pés altos', 'Pés baixos', 'Unilateral'],
    commonMistakes: ['Não descer completo', 'Joelhos para dentro'],
    scientificSource: 'Clark et al. (2012)',
  },

  'agachamento sissy': {
    name: 'Agachamento Sissy',
    aliases: ['sissy squat', 'sissy'],
    primaryMuscles: ['quadríceps (reto femoral)'],
    secondaryMuscles: ['core'],
    movementPattern: 'extensão de joelho com quadril estendido',
    equipment: 'corpo livre ou banco',
    difficulty: 'avançado',
    biomechanics: {
      activation: '95% reto femoral (isolamento)',
      rom: 'Extensão de joelho isolada',
      joint: 'Joelhos',
    },
    progressions: ['Adicionar peso', 'Maior amplitude'],
    variations: ['Com apoio', 'Sem apoio', 'Com peso'],
    commonMistakes: ['Não controlar descida', 'Quadril flexionando'],
    scientificSource: 'Schoenfeld & Contreras (2014)',
  },

  'leg press': {
    name: 'Leg Press',
    aliases: ['leg press 45', 'legpress', 'prensa de pernas', 'press de perna'],
    primaryMuscles: ['quadríceps', 'glúteo'],
    secondaryMuscles: ['isquiotibiais'],
    movementPattern: 'pressão de pernas',
    equipment: 'máquina leg press',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '85% quadríceps (pés baixos) ou 80% glúteo (pés altos)',
      rom: 'Flexão de joelho e quadril',
      joint: 'Joelhos + coxofemoral',
    },
    progressions: ['Aumentar carga', 'Unilateral', 'Drop sets'],
    variations: ['45°', 'Horizontal', 'Unilateral', 'Pés altos/baixos'],
    commonMistakes: ['Lombar saindo do banco', 'Joelhos travando'],
    scientificSource: 'Escamilla et al. (2001)',
  },

  'leg press horizontal': {
    name: 'Leg Press Horizontal',
    aliases: ['horizontal leg press', 'leg press sentado'],
    primaryMuscles: ['quadríceps'],
    secondaryMuscles: ['glúteo', 'isquiotibiais'],
    movementPattern: 'pressão horizontal',
    equipment: 'máquina',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '82% quadríceps',
      rom: 'Flexão controlada',
      joint: 'Joelhos + coxofemoral',
    },
    progressions: ['Aumentar carga', 'Unilateral'],
    variations: ['Bilateral', 'Unilateral', 'Pés variados'],
    commonMistakes: ['Amplitude parcial', 'Impulso'],
    scientificSource: 'Escamilla et al. (2001)',
  },

  'cadeira extensora': {
    name: 'Cadeira Extensora',
    aliases: ['extensora', 'leg extension', 'extensão de perna', 'maquina extensora'],
    primaryMuscles: ['quadríceps'],
    secondaryMuscles: [],
    movementPattern: 'extensão de joelho isolada',
    equipment: 'máquina extensora',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '91% quadríceps (isolamento)',
      rom: 'Extensão completa de joelho',
      joint: 'Joelhos',
    },
    progressions: ['Aumentar carga', 'Pausa no topo', 'Unilateral'],
    variations: ['Bilateral', 'Unilateral', 'Drop sets'],
    commonMistakes: ['Hiperextender', 'Usar impulso'],
    scientificSource: 'Signorile et al. (1994)',
  },

  'agachamento sumô': {
    name: 'Agachamento Sumô',
    aliases: ['sumo squat', 'agachamento aberto', 'plie squat'],
    primaryMuscles: ['quadríceps', 'adutor', 'glúteo'],
    secondaryMuscles: ['isquiotibiais'],
    movementPattern: 'agachamento base larga',
    equipment: 'halter ou kettlebell',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '80% adutor, 75% quadríceps',
      rom: 'Flexão com base ampla',
      joint: 'Joelhos + coxofemoral',
    },
    progressions: ['Aumentar peso', 'Pulse no fundo'],
    variations: ['Com halter', 'Com kettlebell', 'Com barra'],
    commonMistakes: ['Joelhos colapsando', 'Tronco inclinando'],
    scientificSource: 'McCurdy et al. (2010)',
  },

  'pistol squat': {
    name: 'Pistol Squat (Agachamento Pistola)',
    aliases: ['pistol', 'agachamento pistola', 'agachamento uma perna'],
    primaryMuscles: ['quadríceps', 'glúteo'],
    secondaryMuscles: ['core', 'flexores de quadril'],
    movementPattern: 'agachamento unilateral profundo',
    equipment: 'corpo livre',
    difficulty: 'avançado',
    biomechanics: {
      activation: '95% quadríceps + equilíbrio',
      rom: 'Flexão máxima unilateral',
      joint: 'Joelhos + coxofemoral',
    },
    progressions: ['Com apoio', 'Sem apoio', 'Com peso'],
    variations: ['Assistido', 'Com TRX', 'Com contrapeso'],
    commonMistakes: ['Joelho colapsando', 'Perder equilíbrio'],
    scientificSource: 'Schoenfeld (2010)',
  },

  'agachamento no banco': {
    name: 'Agachamento no Banco (Box Squat)',
    aliases: ['box squat', 'agachamento caixa', 'squat no banco'],
    primaryMuscles: ['quadríceps', 'glúteo'],
    secondaryMuscles: ['isquiotibiais', 'lombar'],
    movementPattern: 'agachamento com pausa',
    equipment: 'barra + caixa',
    difficulty: 'intermediário',
    biomechanics: {
      activation: '85% quadríceps, 75% glúteo',
      rom: 'Flexão até a caixa com pausa',
      joint: 'Joelhos + coxofemoral',
    },
    progressions: ['Baixar altura', 'Aumentar carga'],
    variations: ['Alto', 'Paralelo', 'Baixo'],
    commonMistakes: ['Sentar muito rápido', 'Não pausar'],
    scientificSource: 'Simmons (Westside Barbell)',
  },

  'avanço': {
    name: 'Avanço (Lunge)',
    aliases: ['lunge', 'passada', 'afundo'],
    primaryMuscles: ['quadríceps', 'glúteo'],
    secondaryMuscles: ['isquiotibiais', 'core'],
    movementPattern: 'agachamento unilateral',
    equipment: 'corpo livre',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '78% quadríceps, 72% glúteo',
      rom: 'Flexão profunda unilateral',
      joint: 'Joelhos + coxofemoral',
    },
    progressions: ['Adicionar peso', 'Walking', 'Reverso'],
    variations: ['Frontal', 'Reverso', 'Lateral', 'Walking'],
    commonMistakes: ['Joelho passando do pé', 'Tronco inclinando'],
    scientificSource: 'Farrokhi et al. (2008)',
  },

  // ============================================================
  // ISQUIOTIBIAIS - 20+ EXERCÍCIOS
  // ============================================================

  'mesa flexora': {
    name: 'Mesa Flexora',
    aliases: ['leg curl', 'flexora deitado', 'lying leg curl', 'mesa flexora deitado'],
    primaryMuscles: ['isquiotibiais'],
    secondaryMuscles: ['gastrocnêmio'],
    movementPattern: 'flexão de joelho',
    equipment: 'máquina mesa flexora',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '89% isquiotibiais',
      rom: 'Flexão completa de joelho',
      joint: 'Joelhos',
    },
    progressions: ['Aumentar carga', 'Unilateral', 'Negativa lenta'],
    variations: ['Bilateral', 'Unilateral', 'Drop sets'],
    commonMistakes: ['Quadril levantando', 'Impulso'],
    scientificSource: 'Wright et al. (1999)',
  },

  'cadeira flexora': {
    name: 'Cadeira Flexora',
    aliases: ['seated leg curl', 'flexora sentado', 'leg curl sentado'],
    primaryMuscles: ['isquiotibiais'],
    secondaryMuscles: ['gastrocnêmio'],
    movementPattern: 'flexão de joelho sentado',
    equipment: 'máquina cadeira flexora',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '87% isquiotibiais (ênfase distal)',
      rom: 'Flexão com quadril flexionado',
      joint: 'Joelhos',
    },
    progressions: ['Aumentar carga', 'Unilateral'],
    variations: ['Bilateral', 'Unilateral'],
    commonMistakes: ['Amplitude parcial', 'Usar impulso'],
    scientificSource: 'Schoenfeld et al. (2015)',
  },

  'flexora em pé': {
    name: 'Flexora em Pé',
    aliases: ['standing leg curl', 'leg curl em pe'],
    primaryMuscles: ['isquiotibiais'],
    secondaryMuscles: ['gastrocnêmio'],
    movementPattern: 'flexão de joelho em pé',
    equipment: 'máquina',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '85% isquiotibiais',
      rom: 'Flexão unilateral em pé',
      joint: 'Joelhos',
    },
    progressions: ['Aumentar carga', 'Cadência lenta'],
    variations: ['Com pausa', 'Negativa lenta'],
    commonMistakes: ['Usar impulso', 'Inclinar corpo'],
    scientificSource: 'Wright et al. (1999)',
  },

  'flexora nordica': {
    name: 'Flexora Nórdica',
    aliases: ['nordic curl', 'nordic hamstring curl', 'nordico'],
    primaryMuscles: ['isquiotibiais'],
    secondaryMuscles: ['gastrocnêmio', 'glúteo'],
    movementPattern: 'flexão de joelho excêntrica',
    equipment: 'parceiro ou suporte',
    difficulty: 'avançado',
    biomechanics: {
      activation: '95%+ isquiotibiais (excêntrico máximo)',
      rom: 'Extensão excêntrica controlada',
      joint: 'Joelhos',
    },
    progressions: ['Com elástico assistido', 'Sem assistência', 'Com carga'],
    variations: ['Assistido', 'Completo', 'Negativo apenas'],
    commonMistakes: ['Quadril flexionando', 'Não controlar descida'],
    scientificSource: 'Mjolsnes et al. (2004)',
  },

  'flexora com bola': {
    name: 'Flexora com Bola Suíça',
    aliases: ['ball leg curl', 'swiss ball leg curl', 'flexora na bola'],
    primaryMuscles: ['isquiotibiais'],
    secondaryMuscles: ['glúteo', 'core'],
    movementPattern: 'flexão de joelho instável',
    equipment: 'bola suíça',
    difficulty: 'intermediário',
    biomechanics: {
      activation: '82% isquiotibiais + estabilização',
      rom: 'Flexão com instabilidade',
      joint: 'Joelhos + quadril',
    },
    progressions: ['Unilateral', 'Com elevação de quadril'],
    variations: ['Bilateral', 'Unilateral', 'Com elevação'],
    commonMistakes: ['Quadril caindo', 'Perder controle'],
    scientificSource: 'Escamilla et al. (2010)',
  },

  'flexora com slider': {
    name: 'Flexora com Slider',
    aliases: ['slider leg curl', 'leg curl no chao', 'flexora deslizante'],
    primaryMuscles: ['isquiotibiais'],
    secondaryMuscles: ['glúteo', 'core'],
    movementPattern: 'flexão de joelho deslizante',
    equipment: 'sliders ou toalha',
    difficulty: 'intermediário',
    biomechanics: {
      activation: '84% isquiotibiais',
      rom: 'Flexão e extensão controlada',
      joint: 'Joelhos + quadril',
    },
    progressions: ['Unilateral', 'Com pausa'],
    variations: ['Bilateral', 'Unilateral'],
    commonMistakes: ['Quadril caindo', 'Usar impulso'],
    scientificSource: 'Schoenfeld (2010)',
  },

  'terra convencional': {
    name: 'Levantamento Terra Convencional',
    aliases: ['deadlift', 'levantamento terra', 'terra', 'conventional deadlift'],
    primaryMuscles: ['isquiotibiais', 'glúteo máximo', 'lombar'],
    secondaryMuscles: ['quadríceps', 'trapézio', 'antebraços'],
    movementPattern: 'levantamento do solo',
    equipment: 'barra',
    difficulty: 'intermediário',
    biomechanics: {
      activation: '88% posterior, 70% quadríceps',
      rom: 'Extensão de quadril e joelho',
      joint: 'Coxofemoral + joelhos',
    },
    progressions: ['Aumentar carga', 'Deficit', 'Paused'],
    variations: ['Convencional', 'Sumô', 'Trap bar', 'Romeno'],
    commonMistakes: ['Arredondar lombar', 'Barra longe do corpo'],
    scientificSource: 'Escamilla et al. (2002)',
  },

  'terra com trap bar': {
    name: 'Terra com Trap Bar',
    aliases: ['trap bar deadlift', 'hex bar deadlift', 'terra hexagonal'],
    primaryMuscles: ['quadríceps', 'glúteo', 'isquiotibiais'],
    secondaryMuscles: ['lombar', 'trapézio'],
    movementPattern: 'levantamento neutro',
    equipment: 'trap bar (hexagonal)',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '82% quadríceps, 78% posterior',
      rom: 'Posição mais vertical',
      joint: 'Coxofemoral + joelhos',
    },
    progressions: ['Aumentar carga', 'High handles', 'Low handles'],
    variations: ['Pegada alta', 'Pegada baixa'],
    commonMistakes: ['Não travar no topo', 'Arredondar lombar'],
    scientificSource: 'Swinton et al. (2011)',
  },

  'glute ham raise': {
    name: 'Glute Ham Raise (GHR)',
    aliases: ['ghr', 'glute ham developer', 'ghd raise'],
    primaryMuscles: ['isquiotibiais', 'glúteo'],
    secondaryMuscles: ['gastrocnêmio', 'lombar'],
    movementPattern: 'flexão de joelho + extensão de quadril',
    equipment: 'banco GHD',
    difficulty: 'avançado',
    biomechanics: {
      activation: '93% isquiotibiais',
      rom: 'Movimento composto completo',
      joint: 'Joelhos + coxofemoral',
    },
    progressions: ['Com assistência', 'Sem assistência', 'Com peso'],
    variations: ['Assistido', 'Completo', 'Com placa'],
    commonMistakes: ['Não contrair glúteo', 'Amplitude parcial'],
    scientificSource: 'McAllister et al. (2014)',
  },

  // ============================================================
  // COSTAS - 35+ EXERCÍCIOS
  // ============================================================

  'puxada frontal': {
    name: 'Puxada Frontal',
    aliases: ['lat pulldown', 'puxada no pulley', 'pulldown', 'puxador frontal'],
    primaryMuscles: ['latíssimo do dorso', 'redondo maior'],
    secondaryMuscles: ['bíceps', 'romboides', 'trapézio inferior'],
    movementPattern: 'puxada vertical',
    equipment: 'cabo/pulley',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '85% latíssimo',
      rom: 'Adução de ombro vertical',
      joint: 'Ombros',
    },
    progressions: ['Aumentar carga', 'Pegada mais larga'],
    variations: ['Pegada larga', 'Pegada fechada', 'Supinada', 'Neutra'],
    commonMistakes: ['Inclinar demais', 'Usar impulso'],
    scientificSource: 'Lusk et al. (2010)',
  },

  'puxada por tras': {
    name: 'Puxada por Trás',
    aliases: ['behind neck pulldown', 'puxada atras', 'pulldown nuca'],
    primaryMuscles: ['latíssimo do dorso'],
    secondaryMuscles: ['trapézio', 'romboides'],
    movementPattern: 'puxada atrás da cabeça',
    equipment: 'cabo/pulley',
    difficulty: 'intermediário',
    biomechanics: {
      activation: '82% latíssimo (maior rotação externa)',
      rom: 'Adução com rotação',
      joint: 'Ombros',
    },
    progressions: ['Aumentar carga', 'Cadência lenta'],
    variations: ['Pegada larga', 'Pegada média'],
    commonMistakes: ['Cabeça para frente', 'Amplitude excessiva'],
    scientificSource: 'Signorile et al. (2002)',
  },

  'puxada supinada': {
    name: 'Puxada Supinada',
    aliases: ['underhand pulldown', 'puxada invertida', 'reverse grip pulldown'],
    primaryMuscles: ['latíssimo do dorso', 'bíceps'],
    secondaryMuscles: ['romboides'],
    movementPattern: 'puxada com palmas para cima',
    equipment: 'cabo/pulley',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '87% latíssimo, 72% bíceps',
      rom: 'Adução com maior envolvimento de bíceps',
      joint: 'Ombros + cotovelos',
    },
    progressions: ['Aumentar carga', 'Pegada mais fechada'],
    variations: ['Pegada fechada', 'Pegada média'],
    commonMistakes: ['Usar só bíceps', 'Não contrair costas'],
    scientificSource: 'Lusk et al. (2010)',
  },

  'barra fixa': {
    name: 'Barra Fixa (Pull Up)',
    aliases: ['pull up', 'pullup', 'dominada', 'chin up pronada'],
    primaryMuscles: ['latíssimo do dorso', 'redondo maior'],
    secondaryMuscles: ['bíceps', 'romboides', 'trapézio'],
    movementPattern: 'puxada vertical corpo livre',
    equipment: 'barra fixa',
    difficulty: 'intermediário',
    biomechanics: {
      activation: '92% latíssimo',
      rom: 'Adução vertical completa',
      joint: 'Ombros',
    },
    progressions: ['Com elástico', 'Sem auxílio', 'Com peso'],
    variations: ['Pegada larga', 'Pegada fechada', 'Supinada', 'Neutra'],
    commonMistakes: ['Não subir completamente', 'Balançar'],
    scientificSource: 'Youdas et al. (2010)',
  },

  'barra fixa supinada': {
    name: 'Barra Fixa Supinada (Chin Up)',
    aliases: ['chin up', 'chinup', 'barra supinada'],
    primaryMuscles: ['latíssimo do dorso', 'bíceps'],
    secondaryMuscles: ['romboides', 'trapézio'],
    movementPattern: 'puxada supinada',
    equipment: 'barra fixa',
    difficulty: 'intermediário',
    biomechanics: {
      activation: '88% latíssimo, 78% bíceps',
      rom: 'Adução com maior flexão de cotovelo',
      joint: 'Ombros + cotovelos',
    },
    progressions: ['Com elástico', 'Sem auxílio', 'Com peso'],
    variations: ['Pegada fechada', 'Pegada média'],
    commonMistakes: ['Usar só bíceps', 'Amplitude parcial'],
    scientificSource: 'Youdas et al. (2010)',
  },

  'remada curvada': {
    name: 'Remada Curvada',
    aliases: ['bent over row', 'remada com barra', 'barbell row', 'remada cavalinho'],
    primaryMuscles: ['latíssimo do dorso', 'romboides', 'trapézio médio'],
    secondaryMuscles: ['bíceps', 'lombar', 'deltóide posterior'],
    movementPattern: 'puxada horizontal',
    equipment: 'barra',
    difficulty: 'intermediário',
    biomechanics: {
      activation: '85% latíssimo, 82% romboides',
      rom: 'Adução horizontal de ombro',
      joint: 'Ombros + cotovelos',
    },
    progressions: ['Aumentar carga', 'Pausa no peito', 'Pegada supinada'],
    variations: ['Pronada', 'Supinada', 'Pendlay row'],
    commonMistakes: ['Usar impulso', 'Arredondar lombar'],
    scientificSource: 'Fenwick et al. (2009)',
  },

  'remada pendlay': {
    name: 'Remada Pendlay',
    aliases: ['pendlay row', 'remada do chao'],
    primaryMuscles: ['latíssimo do dorso', 'romboides', 'trapézio'],
    secondaryMuscles: ['bíceps', 'lombar'],
    movementPattern: 'puxada horizontal do chão',
    equipment: 'barra',
    difficulty: 'avançado',
    biomechanics: {
      activation: '88% latíssimo (explosivo)',
      rom: 'Puxada completa do solo',
      joint: 'Ombros + cotovelos',
    },
    progressions: ['Aumentar carga', 'Deficit'],
    variations: ['Pegada larga', 'Pegada fechada'],
    commonMistakes: ['Não tocar o chão', 'Usar lombar'],
    scientificSource: 'Fenwick et al. (2009)',
  },

  'remada unilateral': {
    name: 'Remada Unilateral com Halter',
    aliases: ['dumbbell row', 'remada halter', 'one arm row', 'remada serrote'],
    primaryMuscles: ['latíssimo do dorso', 'romboides'],
    secondaryMuscles: ['bíceps', 'deltóide posterior'],
    movementPattern: 'puxada horizontal unilateral',
    equipment: 'halter',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '86% latíssimo por lado',
      rom: 'Adução completa unilateral',
      joint: 'Ombros + cotovelos',
    },
    progressions: ['Aumentar carga', 'Pausa no topo'],
    variations: ['No banco', 'Em pé', 'Com rotação'],
    commonMistakes: ['Girar tronco', 'Usar impulso'],
    scientificSource: 'Lehman et al. (2004)',
  },

  'remada cavalinho': {
    name: 'Remada Cavalinho (T-Bar Row)',
    aliases: ['t-bar row', 'tbar', 'remada t', 'landmine row'],
    primaryMuscles: ['latíssimo do dorso', 'romboides', 'trapézio médio'],
    secondaryMuscles: ['bíceps', 'lombar'],
    movementPattern: 'puxada horizontal angulada',
    equipment: 'barra T ou landmine',
    difficulty: 'intermediário',
    biomechanics: {
      activation: '87% latíssimo',
      rom: 'Puxada neutra angulada',
      joint: 'Ombros + cotovelos',
    },
    progressions: ['Aumentar carga', 'Pegada fechada'],
    variations: ['Pegada neutra', 'Pegada larga', 'Com apoio de peito'],
    commonMistakes: ['Usar impulso', 'Não contrair costas'],
    scientificSource: 'Fenwick et al. (2009)',
  },

  'remada sentada': {
    name: 'Remada Sentada no Cabo',
    aliases: ['cable row', 'seated row', 'remada baixa', 'remada no pulley'],
    primaryMuscles: ['latíssimo do dorso', 'romboides', 'trapézio médio'],
    secondaryMuscles: ['bíceps', 'deltóide posterior'],
    movementPattern: 'puxada horizontal sentado',
    equipment: 'cabo/pulley',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '84% latíssimo',
      rom: 'Puxada horizontal controlada',
      joint: 'Ombros + cotovelos',
    },
    progressions: ['Aumentar carga', 'Pausa', 'Unilateral'],
    variations: ['Pegada fechada', 'Pegada larga', 'Barra reta', 'Triângulo'],
    commonMistakes: ['Balançar corpo', 'Não retrair escápulas'],
    scientificSource: 'Lehman et al. (2004)',
  },

  'remada maquina': {
    name: 'Remada na Máquina',
    aliases: ['machine row', 'remada articulada', 'hammer row'],
    primaryMuscles: ['latíssimo do dorso', 'romboides'],
    secondaryMuscles: ['bíceps', 'trapézio'],
    movementPattern: 'puxada guiada',
    equipment: 'máquina',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '82% latíssimo',
      rom: 'Trajetória guiada',
      joint: 'Ombros + cotovelos',
    },
    progressions: ['Aumentar carga', 'Unilateral'],
    variations: ['Bilateral', 'Unilateral', 'Diferentes pegadas'],
    commonMistakes: ['Amplitude parcial', 'Usar impulso'],
    scientificSource: 'Lehman et al. (2004)',
  },

  'pullover': {
    name: 'Pullover',
    aliases: ['pullover com halter', 'dumbbell pullover', 'pullover no banco'],
    primaryMuscles: ['latíssimo do dorso', 'peitoral'],
    secondaryMuscles: ['serrátil', 'tríceps'],
    movementPattern: 'extensão de ombro',
    equipment: 'halter',
    difficulty: 'intermediário',
    biomechanics: {
      activation: '78% latíssimo, 72% peitoral',
      rom: 'Flexão/extensão de ombro completa',
      joint: 'Ombros',
    },
    progressions: ['Aumentar carga', 'No cabo'],
    variations: ['Com halter', 'No cabo', 'Com barra EZ'],
    commonMistakes: ['Flexionar cotovelos demais', 'Arquear lombar'],
    scientificSource: 'Marchetti & Uchida (2011)',
  },

  'pullover no cabo': {
    name: 'Pullover no Cabo',
    aliases: ['cable pullover', 'straight arm pulldown', 'puxada braços estendidos'],
    primaryMuscles: ['latíssimo do dorso'],
    secondaryMuscles: ['peitoral', 'tríceps'],
    movementPattern: 'extensão de ombro',
    equipment: 'cabo',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '82% latíssimo (tensão constante)',
      rom: 'Extensão de ombro isolada',
      joint: 'Ombros',
    },
    progressions: ['Aumentar carga', 'Unilateral'],
    variations: ['Com corda', 'Com barra', 'Unilateral'],
    commonMistakes: ['Usar bíceps', 'Flexionar cotovelos'],
    scientificSource: 'Marchetti & Uchida (2011)',
  },

  'remada alta': {
    name: 'Remada Alta',
    aliases: ['upright row', 'remada em pé', 'high pull'],
    primaryMuscles: ['trapézio', 'deltóide lateral'],
    secondaryMuscles: ['bíceps', 'deltóide anterior'],
    movementPattern: 'puxada vertical',
    equipment: 'barra ou halteres',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '80% trapézio, 75% deltóide',
      rom: 'Elevação até o queixo',
      joint: 'Ombros + cotovelos',
    },
    progressions: ['Aumentar carga', 'Pegada mais larga'],
    variations: ['Com barra', 'Com halteres', 'No cabo'],
    commonMistakes: ['Pegada muito fechada', 'Elevar ombros demais'],
    scientificSource: 'McAllister et al. (2013)',
  },

  'encolhimento': {
    name: 'Encolhimento de Ombros',
    aliases: ['shrugs', 'encolhimento com halter', 'shoulder shrugs', 'encolhimento trapezio'],
    primaryMuscles: ['trapézio superior'],
    secondaryMuscles: ['levantador da escápula'],
    movementPattern: 'elevação escapular',
    equipment: 'halteres ou barra',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '92% trapézio superior',
      rom: 'Elevação máxima de escápulas',
      joint: 'Escápulas',
    },
    progressions: ['Aumentar carga', 'Pausa no topo'],
    variations: ['Com halteres', 'Com barra', 'No smith'],
    commonMistakes: ['Girar ombros', 'Amplitude parcial'],
    scientificSource: 'NSCA (2015)',
  },

  'face pull': {
    name: 'Face Pull',
    aliases: ['puxada para o rosto', 'face pulls'],
    primaryMuscles: ['deltóide posterior', 'trapézio médio', 'romboides'],
    secondaryMuscles: ['rotadores externos'],
    movementPattern: 'puxada para o rosto',
    equipment: 'cabo com corda',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '85% deltóide posterior, 80% trapézio médio',
      rom: 'Abdução horizontal + rotação externa',
      joint: 'Ombros',
    },
    progressions: ['Aumentar carga', 'Com pausa'],
    variations: ['Alto', 'Médio', 'Com rotação externa'],
    commonMistakes: ['Usar impulso', 'Não rotar externamente'],
    scientificSource: 'Reinold et al. (2009)',
  },

  // ============================================================
  // PEITO - 30+ EXERCÍCIOS
  // ============================================================

  'supino reto': {
    name: 'Supino Reto',
    aliases: ['bench press', 'supino', 'supino com barra', 'flat bench press'],
    primaryMuscles: ['peitoral maior'],
    secondaryMuscles: ['tríceps', 'deltóide anterior'],
    movementPattern: 'pressão horizontal',
    equipment: 'barra',
    difficulty: 'intermediário',
    biomechanics: {
      activation: '85% peitoral, 72% tríceps',
      rom: 'Extensão horizontal de ombro',
      joint: 'Ombros + cotovelos',
    },
    progressions: ['Aumentar carga', 'Pausa no peito', 'Tempo lento'],
    variations: ['Pegada larga', 'Pegada fechada', 'Com halteres'],
    commonMistakes: ['Cotovelos abertos demais', 'Não tocar o peito'],
    scientificSource: 'Schoenfeld et al. (2016)',
  },

  'supino inclinado': {
    name: 'Supino Inclinado',
    aliases: ['incline bench press', 'supino inclinado com barra', 'incline press'],
    primaryMuscles: ['peitoral maior (clavicular)'],
    secondaryMuscles: ['tríceps', 'deltóide anterior'],
    movementPattern: 'pressão inclinada',
    equipment: 'barra',
    difficulty: 'intermediário',
    biomechanics: {
      activation: '91% peitoral superior',
      rom: 'Pressão em ângulo 30-45°',
      joint: 'Ombros + cotovelos',
    },
    progressions: ['Aumentar carga', 'Variar ângulo'],
    variations: ['30°', '45°', 'Com halteres'],
    commonMistakes: ['Ângulo muito alto', 'Cotovelos muito abertos'],
    scientificSource: 'Trebs et al. (2010)',
  },

  'supino declinado': {
    name: 'Supino Declinado',
    aliases: ['decline bench press', 'supino declinado com barra', 'decline press'],
    primaryMuscles: ['peitoral maior (esternal)'],
    secondaryMuscles: ['tríceps', 'deltóide anterior'],
    movementPattern: 'pressão declinada',
    equipment: 'barra',
    difficulty: 'intermediário',
    biomechanics: {
      activation: '88% peitoral inferior',
      rom: 'Pressão em ângulo negativo',
      joint: 'Ombros + cotovelos',
    },
    progressions: ['Aumentar carga'],
    variations: ['Com barra', 'Com halteres'],
    commonMistakes: ['Ângulo muito acentuado', 'Sangue na cabeça'],
    scientificSource: 'Trebs et al. (2010)',
  },

  'supino com halter': {
    name: 'Supino com Halteres',
    aliases: ['dumbbell bench press', 'supino halter', 'db press'],
    primaryMuscles: ['peitoral maior'],
    secondaryMuscles: ['tríceps', 'deltóide anterior'],
    movementPattern: 'pressão com halteres',
    equipment: 'halteres',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '87% peitoral (maior amplitude)',
      rom: 'Maior ROM que com barra',
      joint: 'Ombros + cotovelos',
    },
    progressions: ['Aumentar carga', 'Alternado', 'Neutro'],
    variations: ['Reto', 'Inclinado', 'Declinado', 'Neutro'],
    commonMistakes: ['Não descer completamente', 'Cotovelos muito abertos'],
    scientificSource: 'Saeterbakken et al. (2017)',
  },

  'supino inclinado halter': {
    name: 'Supino Inclinado com Halteres',
    aliases: ['incline dumbbell press', 'supino inclinado halter', 'db incline press'],
    primaryMuscles: ['peitoral maior (clavicular)'],
    secondaryMuscles: ['tríceps', 'deltóide anterior'],
    movementPattern: 'pressão inclinada com halteres',
    equipment: 'halteres',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '92% peitoral superior',
      rom: 'Pressão inclinada com maior amplitude',
      joint: 'Ombros + cotovelos',
    },
    progressions: ['Aumentar carga', 'Variar ângulo'],
    variations: ['30°', '45°', 'Neutro'],
    commonMistakes: ['Ângulo muito alto', 'Não controlar descida'],
    scientificSource: 'Trebs et al. (2010)',
  },

  'crucifixo': {
    name: 'Crucifixo com Halteres',
    aliases: ['dumbbell fly', 'fly', 'voador', 'crucifixo reto'],
    primaryMuscles: ['peitoral maior'],
    secondaryMuscles: ['deltóide anterior'],
    movementPattern: 'adução horizontal',
    equipment: 'halteres',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '80% peitoral (alongamento)',
      rom: 'Adução horizontal completa',
      joint: 'Ombros',
    },
    progressions: ['Aumentar carga', 'Inclinado'],
    variations: ['Reto', 'Inclinado', 'Declinado'],
    commonMistakes: ['Descer demais', 'Cotovelos muito retos'],
    scientificSource: 'Welsch et al. (2005)',
  },

  'crucifixo inclinado': {
    name: 'Crucifixo Inclinado',
    aliases: ['incline fly', 'crucifixo inclinado halter', 'incline dumbbell fly'],
    primaryMuscles: ['peitoral maior (clavicular)'],
    secondaryMuscles: ['deltóide anterior'],
    movementPattern: 'adução horizontal inclinada',
    equipment: 'halteres',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '82% peitoral superior',
      rom: 'Adução inclinada',
      joint: 'Ombros',
    },
    progressions: ['Aumentar carga'],
    variations: ['30°', '45°'],
    commonMistakes: ['Amplitude excessiva', 'Peso demais'],
    scientificSource: 'Welsch et al. (2005)',
  },

  'crossover': {
    name: 'Crossover (Cruzamento no Cabo)',
    aliases: ['cable crossover', 'cruzamento de cabos', 'cross over', 'fly no cabo'],
    primaryMuscles: ['peitoral maior'],
    secondaryMuscles: ['deltóide anterior'],
    movementPattern: 'adução horizontal no cabo',
    equipment: 'cabos',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '84% peitoral (tensão constante)',
      rom: 'Cruzamento completo na frente',
      joint: 'Ombros',
    },
    progressions: ['Aumentar carga', 'Diferentes alturas'],
    variations: ['Alto', 'Médio', 'Baixo'],
    commonMistakes: ['Usar impulso', 'Não cruzar'],
    scientificSource: 'Welsch et al. (2005)',
  },

  'crossover baixo': {
    name: 'Crossover Baixo (Low Cable Fly)',
    aliases: ['low cable fly', 'crossover de baixo', 'fly de baixo'],
    primaryMuscles: ['peitoral maior (clavicular)'],
    secondaryMuscles: ['deltóide anterior'],
    movementPattern: 'adução de baixo para cima',
    equipment: 'cabos',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '86% peitoral superior',
      rom: 'Adução de baixo para cima',
      joint: 'Ombros',
    },
    progressions: ['Aumentar carga'],
    variations: ['Unilateral', 'Bilateral'],
    commonMistakes: ['Usar impulso', 'Não contrair no pico'],
    scientificSource: 'Welsch et al. (2005)',
  },

  'peck deck': {
    name: 'Peck Deck (Voador na Máquina)',
    aliases: ['pec deck', 'voador maquina', 'fly machine', 'maquina peitoral'],
    primaryMuscles: ['peitoral maior'],
    secondaryMuscles: ['deltóide anterior'],
    movementPattern: 'adução horizontal guiada',
    equipment: 'máquina',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '85% peitoral',
      rom: 'Adução guiada',
      joint: 'Ombros',
    },
    progressions: ['Aumentar carga', 'Pausa no pico'],
    variations: ['Com pausa', 'Cadência lenta'],
    commonMistakes: ['Amplitude parcial', 'Usar impulso'],
    scientificSource: 'Welsch et al. (2005)',
  },

  'flexao': {
    name: 'Flexão de Braço',
    aliases: ['push up', 'pushup', 'flexao de bracos', 'apoio'],
    primaryMuscles: ['peitoral maior'],
    secondaryMuscles: ['tríceps', 'deltóide anterior', 'core'],
    movementPattern: 'pressão horizontal corpo livre',
    equipment: 'corpo livre',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '75% peitoral, 65% tríceps',
      rom: 'Pressão com peso corporal',
      joint: 'Ombros + cotovelos',
    },
    progressions: ['Flexão inclinada', 'Flexão archer', 'Flexão com peso'],
    variations: ['Normal', 'Larga', 'Fechada', 'Diamante', 'Declinada'],
    commonMistakes: ['Quadril caindo', 'Amplitude parcial'],
    scientificSource: 'Cogley et al. (2005)',
  },

  'flexao inclinada': {
    name: 'Flexão Inclinada',
    aliases: ['incline push up', 'flexao elevada', 'flexao no banco'],
    primaryMuscles: ['peitoral maior (inferior)'],
    secondaryMuscles: ['tríceps', 'deltóide'],
    movementPattern: 'pressão inclinada',
    equipment: 'banco ou caixa',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '72% peitoral (mais fácil)',
      rom: 'Pressão facilitada',
      joint: 'Ombros + cotovelos',
    },
    progressions: ['Diminuir inclinação', 'Evoluir para flexão normal'],
    variations: ['Alta', 'Média', 'Baixa'],
    commonMistakes: ['Quadril caindo', 'Não tocar peito'],
    scientificSource: 'Cogley et al. (2005)',
  },

  'flexao declinada': {
    name: 'Flexão Declinada',
    aliases: ['decline push up', 'flexao pes elevados', 'flexao no step'],
    primaryMuscles: ['peitoral maior (superior)'],
    secondaryMuscles: ['tríceps', 'deltóide'],
    movementPattern: 'pressão com pés elevados',
    equipment: 'banco ou caixa',
    difficulty: 'intermediário',
    biomechanics: {
      activation: '84% peitoral superior',
      rom: 'Pressão com maior carga',
      joint: 'Ombros + cotovelos',
    },
    progressions: ['Aumentar altura', 'Adicionar peso'],
    variations: ['Pés no banco', 'Pés na bola'],
    commonMistakes: ['Quadril caindo', 'Amplitude parcial'],
    scientificSource: 'Cogley et al. (2005)',
  },

  'flexao diamante': {
    name: 'Flexão Diamante',
    aliases: ['diamond push up', 'flexao fechada', 'triceps push up'],
    primaryMuscles: ['tríceps', 'peitoral maior'],
    secondaryMuscles: ['deltóide anterior'],
    movementPattern: 'pressão fechada',
    equipment: 'corpo livre',
    difficulty: 'intermediário',
    biomechanics: {
      activation: '85% tríceps, 72% peitoral',
      rom: 'Pressão com mãos juntas',
      joint: 'Cotovelos + ombros',
    },
    progressions: ['Aumentar repetições', 'Adicionar peso'],
    variations: ['Normal', 'Inclinada'],
    commonMistakes: ['Cotovelos para fora', 'Amplitude parcial'],
    scientificSource: 'Cogley et al. (2005)',
  },

  'supino na maquina': {
    name: 'Supino na Máquina',
    aliases: ['machine press', 'chest press', 'supino maquina', 'hammer press'],
    primaryMuscles: ['peitoral maior'],
    secondaryMuscles: ['tríceps', 'deltóide'],
    movementPattern: 'pressão guiada',
    equipment: 'máquina',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '80% peitoral',
      rom: 'Trajetória guiada',
      joint: 'Ombros + cotovelos',
    },
    progressions: ['Aumentar carga', 'Unilateral'],
    variations: ['Reto', 'Inclinado', 'Convergente'],
    commonMistakes: ['Não trancar', 'Amplitude parcial'],
    scientificSource: 'Schick et al. (2010)',
  },

  'mergulho': {
    name: 'Mergulho (Paralelas)',
    aliases: ['dips', 'paralelas', 'chest dips', 'mergulho no banco'],
    primaryMuscles: ['peitoral maior (inferior)', 'tríceps'],
    secondaryMuscles: ['deltóide anterior'],
    movementPattern: 'pressão vertical descendente',
    equipment: 'barras paralelas',
    difficulty: 'intermediário',
    biomechanics: {
      activation: '87% peitoral inferior, 80% tríceps',
      rom: 'Descida profunda',
      joint: 'Ombros + cotovelos',
    },
    progressions: ['Com elástico', 'Sem auxílio', 'Com peso'],
    variations: ['Para peito (inclinado)', 'Para tríceps (reto)'],
    commonMistakes: ['Não descer suficiente', 'Ombros para frente demais'],
    scientificSource: 'McKenzie et al. (2013)',
  },

  // ============================================================
  // OMBROS - 30+ EXERCÍCIOS
  // ============================================================

  'desenvolvimento': {
    name: 'Desenvolvimento com Barra',
    aliases: ['overhead press', 'shoulder press', 'desenvolvimento militar', 'press militar', 'ohp'],
    primaryMuscles: ['deltóide anterior', 'deltóide lateral'],
    secondaryMuscles: ['tríceps', 'trapézio superior'],
    movementPattern: 'pressão vertical',
    equipment: 'barra',
    difficulty: 'intermediário',
    biomechanics: {
      activation: '88% deltóide anterior, 75% lateral',
      rom: 'Extensão vertical completa',
      joint: 'Ombros + cotovelos',
    },
    progressions: ['Aumentar carga', 'Push press', 'De pé'],
    variations: ['Sentado', 'Em pé', 'Por trás'],
    commonMistakes: ['Arquear lombar', 'Não travar no topo'],
    scientificSource: 'Saeterbakken & Fimland (2013)',
  },

  'desenvolvimento com halter': {
    name: 'Desenvolvimento com Halteres',
    aliases: ['dumbbell shoulder press', 'desenvolvimento halter', 'db press'],
    primaryMuscles: ['deltóide anterior', 'deltóide lateral'],
    secondaryMuscles: ['tríceps', 'trapézio'],
    movementPattern: 'pressão vertical com halteres',
    equipment: 'halteres',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '86% deltóide (maior ROM)',
      rom: 'Maior amplitude que com barra',
      joint: 'Ombros + cotovelos',
    },
    progressions: ['Aumentar carga', 'Alternado'],
    variations: ['Sentado', 'Em pé', 'Arnold press'],
    commonMistakes: ['Arquear lombar', 'Não descer completamente'],
    scientificSource: 'Saeterbakken & Fimland (2013)',
  },

  'arnold press': {
    name: 'Arnold Press',
    aliases: ['arnold', 'desenvolvimento arnold', 'rotacao arnold'],
    primaryMuscles: ['deltóide anterior', 'deltóide lateral'],
    secondaryMuscles: ['tríceps'],
    movementPattern: 'pressão com rotação',
    equipment: 'halteres',
    difficulty: 'intermediário',
    biomechanics: {
      activation: '87% deltóide (rotação aumenta ativação)',
      rom: 'Pressão com rotação de ombro',
      joint: 'Ombros + cotovelos',
    },
    progressions: ['Aumentar carga', 'Cadência lenta'],
    variations: ['Sentado', 'Em pé'],
    commonMistakes: ['Não rotar completamente', 'Peso demais'],
    scientificSource: 'Schwarzenegger (1985)',
  },

  'elevacao lateral': {
    name: 'Elevação Lateral',
    aliases: ['lateral raise', 'elevacao lateral halter', 'abdução de ombro'],
    primaryMuscles: ['deltóide lateral'],
    secondaryMuscles: ['trapézio superior'],
    movementPattern: 'abdução de ombro',
    equipment: 'halteres',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '91% deltóide lateral',
      rom: 'Abdução até 90° ou acima',
      joint: 'Ombros',
    },
    progressions: ['Aumentar carga', 'Pausa no topo'],
    variations: ['Com halteres', 'No cabo', 'Na máquina', 'Inclinado'],
    commonMistakes: ['Usar impulso', 'Subir acima de 90°'],
    scientificSource: 'Botton et al. (2013)',
  },

  'elevacao lateral no cabo': {
    name: 'Elevação Lateral no Cabo',
    aliases: ['cable lateral raise', 'lateral no cabo'],
    primaryMuscles: ['deltóide lateral'],
    secondaryMuscles: ['trapézio'],
    movementPattern: 'abdução no cabo',
    equipment: 'cabo',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '89% deltóide lateral (tensão constante)',
      rom: 'Abdução com resistência constante',
      joint: 'Ombros',
    },
    progressions: ['Aumentar carga'],
    variations: ['Por trás', 'Na frente', 'Bilateral'],
    commonMistakes: ['Usar impulso', 'Amplitude parcial'],
    scientificSource: 'Botton et al. (2013)',
  },

  'elevacao lateral inclinada': {
    name: 'Elevação Lateral Inclinada',
    aliases: ['incline lateral raise', 'lateral inclinado', 'lying lateral raise'],
    primaryMuscles: ['deltóide lateral'],
    secondaryMuscles: ['trapézio'],
    movementPattern: 'abdução inclinada',
    equipment: 'halter',
    difficulty: 'intermediário',
    biomechanics: {
      activation: '94% deltóide lateral (pico no início)',
      rom: 'Abdução com ênfase no início',
      joint: 'Ombros',
    },
    progressions: ['Aumentar carga'],
    variations: ['30°', '45°', 'Deitado'],
    commonMistakes: ['Usar impulso', 'Ângulo incorreto'],
    scientificSource: 'Botton et al. (2013)',
  },

  'elevacao frontal': {
    name: 'Elevação Frontal',
    aliases: ['front raise', 'elevacao frontal halter', 'flexao de ombro'],
    primaryMuscles: ['deltóide anterior'],
    secondaryMuscles: ['peitoral superior'],
    movementPattern: 'flexão de ombro',
    equipment: 'halteres',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '88% deltóide anterior',
      rom: 'Flexão até 90° ou acima',
      joint: 'Ombros',
    },
    progressions: ['Aumentar carga', 'Alternado'],
    variations: ['Com halteres', 'Com barra', 'No cabo', 'Com disco'],
    commonMistakes: ['Usar impulso', 'Subir demais'],
    scientificSource: 'Botton et al. (2013)',
  },

  'elevacao posterior': {
    name: 'Elevação Posterior (Crucifixo Invertido)',
    aliases: ['rear delt fly', 'crucifixo invertido', 'reverse fly', 'elevação posterior'],
    primaryMuscles: ['deltóide posterior'],
    secondaryMuscles: ['trapézio médio', 'romboides'],
    movementPattern: 'abdução horizontal',
    equipment: 'halteres',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '85% deltóide posterior',
      rom: 'Abdução horizontal',
      joint: 'Ombros',
    },
    progressions: ['Aumentar carga', 'No cabo'],
    variations: ['Inclinado', 'No banco', 'No cabo', 'Na máquina'],
    commonMistakes: ['Usar impulso', 'Não isolar posterior'],
    scientificSource: 'Botton et al. (2013)',
  },

  'crucifixo invertido maquina': {
    name: 'Crucifixo Invertido na Máquina',
    aliases: ['reverse pec deck', 'rear delt machine', 'fly invertido maquina'],
    primaryMuscles: ['deltóide posterior'],
    secondaryMuscles: ['trapézio médio', 'romboides'],
    movementPattern: 'abdução horizontal guiada',
    equipment: 'máquina',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '87% deltóide posterior',
      rom: 'Abdução guiada',
      joint: 'Ombros',
    },
    progressions: ['Aumentar carga', 'Pausa'],
    variations: ['Com pegada neutra', 'Com pegada pronada'],
    commonMistakes: ['Usar impulso', 'Amplitude parcial'],
    scientificSource: 'Botton et al. (2013)',
  },

  'remada alta halteres': {
    name: 'Remada Alta com Halteres',
    aliases: ['dumbbell upright row', 'remada alta halter'],
    primaryMuscles: ['trapézio', 'deltóide lateral'],
    secondaryMuscles: ['bíceps'],
    movementPattern: 'puxada vertical com halteres',
    equipment: 'halteres',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '78% trapézio, 72% deltóide',
      rom: 'Elevação com maior ROM',
      joint: 'Ombros + cotovelos',
    },
    progressions: ['Aumentar carga'],
    variations: ['Alternado', 'Simultâneo'],
    commonMistakes: ['Cotovelos baixos', 'Usar impulso'],
    scientificSource: 'McAllister et al. (2013)',
  },

  'rotacao externa': {
    name: 'Rotação Externa de Ombro',
    aliases: ['external rotation', 'rotacao externa deitado', 'rotador externo'],
    primaryMuscles: ['infraespinhal', 'redondo menor'],
    secondaryMuscles: ['deltóide posterior'],
    movementPattern: 'rotação externa',
    equipment: 'halter ou cabo',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '90% rotadores externos',
      rom: 'Rotação externa de 0° a 90°',
      joint: 'Ombros',
    },
    progressions: ['Aumentar carga', 'No cabo'],
    variations: ['Deitado', 'No cabo', 'Com elástico'],
    commonMistakes: ['Cotovelo se movendo', 'Peso demais'],
    scientificSource: 'Reinold et al. (2009)',
  },

  'rotacao interna': {
    name: 'Rotação Interna de Ombro',
    aliases: ['internal rotation', 'rotacao interna cabo'],
    primaryMuscles: ['subescapular'],
    secondaryMuscles: ['peitoral', 'latíssimo'],
    movementPattern: 'rotação interna',
    equipment: 'cabo ou elástico',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '88% subescapular',
      rom: 'Rotação interna controlada',
      joint: 'Ombros',
    },
    progressions: ['Aumentar carga'],
    variations: ['No cabo', 'Com elástico'],
    commonMistakes: ['Cotovelo se movendo', 'Usar corpo'],
    scientificSource: 'Reinold et al. (2009)',
  },

  // ============================================================
  // BÍCEPS - 20+ EXERCÍCIOS
  // ============================================================

  'rosca direta': {
    name: 'Rosca Direta',
    aliases: ['barbell curl', 'rosca com barra', 'curl com barra'],
    primaryMuscles: ['bíceps braquial'],
    secondaryMuscles: ['braquial', 'braquiorradial'],
    movementPattern: 'flexão de cotovelo',
    equipment: 'barra',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '85% bíceps',
      rom: 'Flexão completa de cotovelo',
      joint: 'Cotovelos',
    },
    progressions: ['Aumentar carga', 'Pegada larga/fechada'],
    variations: ['Barra reta', 'Barra EZ', 'Pegada larga', 'Pegada fechada'],
    commonMistakes: ['Usar impulso', 'Cotovelos para frente'],
    scientificSource: 'Marcolin et al. (2018)',
  },

  'rosca alternada': {
    name: 'Rosca Alternada',
    aliases: ['alternating curl', 'rosca halter alternada', 'dumbbell curl alternado'],
    primaryMuscles: ['bíceps braquial'],
    secondaryMuscles: ['braquial', 'braquiorradial'],
    movementPattern: 'flexão alternada',
    equipment: 'halteres',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '86% bíceps (foco unilateral)',
      rom: 'Flexão completa alternada',
      joint: 'Cotovelos',
    },
    progressions: ['Aumentar carga', 'Com supinação'],
    variations: ['Em pé', 'Sentado', 'Com supinação'],
    commonMistakes: ['Usar impulso', 'Balançar corpo'],
    scientificSource: 'Marcolin et al. (2018)',
  },

  'rosca simultanea': {
    name: 'Rosca Simultânea',
    aliases: ['simultaneous curl', 'rosca halter simultaneo', 'db curl together'],
    primaryMuscles: ['bíceps braquial'],
    secondaryMuscles: ['braquial'],
    movementPattern: 'flexão simultânea',
    equipment: 'halteres',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '84% bíceps',
      rom: 'Flexão bilateral simultânea',
      joint: 'Cotovelos',
    },
    progressions: ['Aumentar carga'],
    variations: ['Em pé', 'Sentado'],
    commonMistakes: ['Usar impulso', 'Cotovelos para frente'],
    scientificSource: 'Marcolin et al. (2018)',
  },

  'rosca martelo': {
    name: 'Rosca Martelo',
    aliases: ['hammer curl', 'rosca neutra', 'curl martelo'],
    primaryMuscles: ['braquial', 'braquiorradial'],
    secondaryMuscles: ['bíceps braquial'],
    movementPattern: 'flexão com pegada neutra',
    equipment: 'halteres',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '88% braquial',
      rom: 'Flexão neutra',
      joint: 'Cotovelos',
    },
    progressions: ['Aumentar carga', 'Cross body'],
    variations: ['Alternado', 'Simultâneo', 'Cross body', 'Inclinado'],
    commonMistakes: ['Usar impulso', 'Girar pulso'],
    scientificSource: 'Marcolin et al. (2018)',
  },

  'rosca scott': {
    name: 'Rosca Scott (Banco Preacher)',
    aliases: ['preacher curl', 'rosca no banco', 'scott curl'],
    primaryMuscles: ['bíceps braquial (cabeça curta)'],
    secondaryMuscles: ['braquial'],
    movementPattern: 'flexão com braços apoiados',
    equipment: 'banco scott + barra',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '90% bíceps (isolamento)',
      rom: 'Flexão isolada',
      joint: 'Cotovelos',
    },
    progressions: ['Aumentar carga', 'Unilateral'],
    variations: ['Com barra', 'Com halteres', 'Com cabo'],
    commonMistakes: ['Não estender completamente', 'Usar impulso'],
    scientificSource: 'Oliveira et al. (2009)',
  },

  'rosca concentrada': {
    name: 'Rosca Concentrada',
    aliases: ['concentration curl', 'rosca isolada', 'rosca sentado'],
    primaryMuscles: ['bíceps braquial'],
    secondaryMuscles: ['braquial'],
    movementPattern: 'flexão concentrada',
    equipment: 'halter',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '92% bíceps (maior isolamento)',
      rom: 'Flexão com cotovelo fixo',
      joint: 'Cotovelos',
    },
    progressions: ['Aumentar carga'],
    variations: ['Sentado', 'Em pé inclinado'],
    commonMistakes: ['Mover ombro', 'Usar impulso'],
    scientificSource: 'Oliveira et al. (2009)',
  },

  'rosca inclinada': {
    name: 'Rosca Inclinada',
    aliases: ['incline curl', 'rosca no banco inclinado', 'incline dumbbell curl'],
    primaryMuscles: ['bíceps braquial (cabeça longa)'],
    secondaryMuscles: ['braquial'],
    movementPattern: 'flexão com ombro estendido',
    equipment: 'halteres + banco inclinado',
    difficulty: 'intermediário',
    biomechanics: {
      activation: '95% bíceps cabeça longa (alongado)',
      rom: 'Flexão com ombro em extensão',
      joint: 'Cotovelos',
    },
    progressions: ['Aumentar carga', 'Diminuir ângulo'],
    variations: ['45°', '60°', 'Alternado'],
    commonMistakes: ['Não descer completamente', 'Ombros para frente'],
    scientificSource: 'Oliveira et al. (2009)',
  },

  'rosca no cabo': {
    name: 'Rosca no Cabo',
    aliases: ['cable curl', 'rosca baixa', 'cable bicep curl'],
    primaryMuscles: ['bíceps braquial'],
    secondaryMuscles: ['braquial'],
    movementPattern: 'flexão no cabo',
    equipment: 'cabo',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '84% bíceps (tensão constante)',
      rom: 'Flexão com resistência constante',
      joint: 'Cotovelos',
    },
    progressions: ['Aumentar carga', 'Diferentes alturas'],
    variations: ['Barra', 'Corda', 'Unilateral', 'Alto/baixo'],
    commonMistakes: ['Usar impulso', 'Cotovelos se movendo'],
    scientificSource: 'Marcolin et al. (2018)',
  },

  'rosca 21': {
    name: 'Rosca 21',
    aliases: ['21s', 'rosca vinte e um', 'bicep 21'],
    primaryMuscles: ['bíceps braquial'],
    secondaryMuscles: ['braquial'],
    movementPattern: 'flexão em 3 amplitudes',
    equipment: 'barra ou halteres',
    difficulty: 'intermediário',
    biomechanics: {
      activation: '88% bíceps (fadiga completa)',
      rom: '7 parciais baixo + 7 parciais alto + 7 completos',
      joint: 'Cotovelos',
    },
    progressions: ['Aumentar carga'],
    variations: ['Com barra', 'Com halteres'],
    commonMistakes: ['Usar impulso', 'Não completar séries'],
    scientificSource: 'Schoenfeld (2010)',
  },

  'rosca aranha': {
    name: 'Rosca Aranha (Spider Curl)',
    aliases: ['spider curl', 'rosca spider', 'rosca inclinada frontal'],
    primaryMuscles: ['bíceps braquial'],
    secondaryMuscles: ['braquial'],
    movementPattern: 'flexão com peito no banco',
    equipment: 'halter + banco inclinado',
    difficulty: 'intermediário',
    biomechanics: {
      activation: '91% bíceps (isolamento máximo)',
      rom: 'Flexão sem possibilidade de impulso',
      joint: 'Cotovelos',
    },
    progressions: ['Aumentar carga'],
    variations: ['Com halteres', 'Com barra EZ'],
    commonMistakes: ['Mover ombros', 'Amplitude parcial'],
    scientificSource: 'Oliveira et al. (2009)',
  },

  // ============================================================
  // TRÍCEPS - 20+ EXERCÍCIOS
  // ============================================================

  'triceps pulley': {
    name: 'Tríceps no Pulley',
    aliases: ['triceps pushdown', 'triceps na polia', 'pushdown', 'triceps corda'],
    primaryMuscles: ['tríceps braquial'],
    secondaryMuscles: ['ancôneo'],
    movementPattern: 'extensão de cotovelo',
    equipment: 'cabo',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '85% tríceps',
      rom: 'Extensão completa de cotovelo',
      joint: 'Cotovelos',
    },
    progressions: ['Aumentar carga', 'Diferentes acessórios'],
    variations: ['Com corda', 'Com barra', 'Com V-bar', 'Unilateral'],
    commonMistakes: ['Cotovelos para frente', 'Usar ombros'],
    scientificSource: 'Boeckh-Behrens & Buskies (2000)',
  },

  'triceps corda': {
    name: 'Tríceps com Corda',
    aliases: ['rope pushdown', 'triceps na corda', 'rope triceps'],
    primaryMuscles: ['tríceps braquial (cabeça lateral)'],
    secondaryMuscles: ['ancôneo'],
    movementPattern: 'extensão com rotação',
    equipment: 'cabo com corda',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '88% tríceps lateral (rotação no final)',
      rom: 'Extensão com abertura no final',
      joint: 'Cotovelos',
    },
    progressions: ['Aumentar carga', 'Overhead'],
    variations: ['Normal', 'Overhead', 'Inclinado'],
    commonMistakes: ['Não abrir no final', 'Cotovelos se movendo'],
    scientificSource: 'Boeckh-Behrens & Buskies (2000)',
  },

  'triceps testa': {
    name: 'Tríceps Testa (Skull Crusher)',
    aliases: ['skull crusher', 'triceps frances deitado', 'lying triceps extension'],
    primaryMuscles: ['tríceps braquial (cabeça longa)'],
    secondaryMuscles: ['ancôneo'],
    movementPattern: 'extensão deitado',
    equipment: 'barra ou halteres',
    difficulty: 'intermediário',
    biomechanics: {
      activation: '90% tríceps cabeça longa',
      rom: 'Extensão com ombro fixo',
      joint: 'Cotovelos',
    },
    progressions: ['Aumentar carga', 'Inclinado'],
    variations: ['Com barra', 'Com halteres', 'Com EZ'],
    commonMistakes: ['Cotovelos abrindo', 'Mover ombros'],
    scientificSource: 'Boeckh-Behrens & Buskies (2000)',
  },

  'triceps frances': {
    name: 'Tríceps Francês',
    aliases: ['overhead triceps extension', 'triceps acima da cabeca', 'french press'],
    primaryMuscles: ['tríceps braquial (cabeça longa)'],
    secondaryMuscles: ['ancôneo'],
    movementPattern: 'extensão overhead',
    equipment: 'halter ou barra',
    difficulty: 'intermediário',
    biomechanics: {
      activation: '92% tríceps cabeça longa (alongado)',
      rom: 'Extensão com ombro flexionado',
      joint: 'Cotovelos',
    },
    progressions: ['Aumentar carga', 'Unilateral'],
    variations: ['Com halter', 'Com barra', 'No cabo', 'Unilateral'],
    commonMistakes: ['Cotovelos abrindo', 'Arquear lombar'],
    scientificSource: 'Boeckh-Behrens & Buskies (2000)',
  },

  'triceps coice': {
    name: 'Tríceps Coice (Kickback)',
    aliases: ['triceps kickback', 'coice de triceps', 'tricep kickback'],
    primaryMuscles: ['tríceps braquial'],
    secondaryMuscles: ['deltóide posterior'],
    movementPattern: 'extensão inclinado',
    equipment: 'halter',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '78% tríceps',
      rom: 'Extensão com braço paralelo ao solo',
      joint: 'Cotovelos',
    },
    progressions: ['Aumentar carga', 'No cabo'],
    variations: ['Com halter', 'No cabo', 'Bilateral'],
    commonMistakes: ['Mover ombro', 'Amplitude parcial'],
    scientificSource: 'Boeckh-Behrens & Buskies (2000)',
  },

  'triceps banco': {
    name: 'Tríceps no Banco (Bench Dips)',
    aliases: ['bench dips', 'triceps no banco', 'dips no banco'],
    primaryMuscles: ['tríceps braquial'],
    secondaryMuscles: ['deltóide anterior', 'peitoral'],
    movementPattern: 'extensão no banco',
    equipment: 'banco',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '80% tríceps',
      rom: 'Extensão com peso corporal',
      joint: 'Cotovelos + ombros',
    },
    progressions: ['Pés elevados', 'Peso no colo'],
    variations: ['Pés no chão', 'Pés elevados', 'Com peso'],
    commonMistakes: ['Descer demais', 'Cotovelos para fora'],
    scientificSource: 'McKenzie et al. (2013)',
  },

  'triceps mergulho': {
    name: 'Mergulho para Tríceps',
    aliases: ['triceps dips', 'paralelas triceps', 'dips reto'],
    primaryMuscles: ['tríceps braquial'],
    secondaryMuscles: ['deltóide anterior', 'peitoral'],
    movementPattern: 'extensão nas paralelas',
    equipment: 'barras paralelas',
    difficulty: 'intermediário',
    biomechanics: {
      activation: '88% tríceps (corpo reto)',
      rom: 'Extensão vertical',
      joint: 'Cotovelos + ombros',
    },
    progressions: ['Com peso', 'Cadência lenta'],
    variations: ['Assistido', 'Com peso', 'Corpo reto'],
    commonMistakes: ['Inclinar para frente', 'Amplitude parcial'],
    scientificSource: 'McKenzie et al. (2013)',
  },

  'supino fechado': {
    name: 'Supino Pegada Fechada',
    aliases: ['close grip bench press', 'supino triceps', 'cgbp'],
    primaryMuscles: ['tríceps braquial'],
    secondaryMuscles: ['peitoral', 'deltóide anterior'],
    movementPattern: 'pressão com pegada fechada',
    equipment: 'barra',
    difficulty: 'intermediário',
    biomechanics: {
      activation: '85% tríceps, 65% peitoral',
      rom: 'Pressão com ênfase em tríceps',
      joint: 'Cotovelos + ombros',
    },
    progressions: ['Aumentar carga', 'Pausa'],
    variations: ['Com barra', 'Na Smith'],
    commonMistakes: ['Pegada muito fechada', 'Cotovelos abrindo'],
    scientificSource: 'Barnett et al. (1995)',
  },

  // ============================================================
  // CORE / ABDÔMEN - 30+ EXERCÍCIOS
  // ============================================================

  'abdominal crunch': {
    name: 'Abdominal Crunch',
    aliases: ['crunch', 'abdominal', 'abdominal reto', 'crunch no chao'],
    primaryMuscles: ['reto abdominal (superior)'],
    secondaryMuscles: ['oblíquos'],
    movementPattern: 'flexão de tronco',
    equipment: 'corpo livre',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '72% reto abdominal',
      rom: 'Flexão curta de tronco',
      joint: 'Coluna',
    },
    progressions: ['Adicionar peso', 'Declinado', 'No cabo'],
    variations: ['Normal', 'Declinado', 'Na bola', 'No cabo'],
    commonMistakes: ['Puxar pescoço', 'Usar impulso'],
    scientificSource: 'Escamilla et al. (2006)',
  },

  'abdominal infra': {
    name: 'Abdominal Infra (Elevação de Pernas)',
    aliases: ['leg raise', 'elevacao de pernas', 'abdominal inferior', 'reverse crunch'],
    primaryMuscles: ['reto abdominal (inferior)', 'flexores de quadril'],
    secondaryMuscles: ['oblíquos'],
    movementPattern: 'flexão de quadril',
    equipment: 'corpo livre',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '78% reto abdominal inferior',
      rom: 'Elevação de pernas',
      joint: 'Quadril + coluna',
    },
    progressions: ['Pendurado', 'Com peso'],
    variations: ['Deitado', 'Pendurado', 'No banco', 'Com peso'],
    commonMistakes: ['Usar impulso', 'Arquear lombar'],
    scientificSource: 'Escamilla et al. (2006)',
  },

  'elevacao de pernas pendurado': {
    name: 'Elevação de Pernas Pendurado',
    aliases: ['hanging leg raise', 'elevacao na barra', 'leg raise pendurado'],
    primaryMuscles: ['reto abdominal', 'flexores de quadril'],
    secondaryMuscles: ['oblíquos', 'antebraços'],
    movementPattern: 'flexão de quadril pendurado',
    equipment: 'barra fixa',
    difficulty: 'intermediário',
    biomechanics: {
      activation: '85% reto abdominal',
      rom: 'Elevação até paralelo ou acima',
      joint: 'Quadril + coluna',
    },
    progressions: ['Pernas retas', 'Até a barra', 'Com peso'],
    variations: ['Joelhos flexionados', 'Pernas retas', 'Até a barra'],
    commonMistakes: ['Balançar', 'Usar impulso'],
    scientificSource: 'Escamilla et al. (2006)',
  },

  'prancha frontal': {
    name: 'Prancha Frontal',
    aliases: ['plank', 'prancha', 'prancha isometrica', 'front plank'],
    primaryMuscles: ['transverso do abdômen', 'reto abdominal'],
    secondaryMuscles: ['oblíquos', 'lombar', 'glúteo'],
    movementPattern: 'estabilização isométrica',
    equipment: 'corpo livre',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '70% core (estabilização)',
      rom: 'Isométrico - sem movimento',
      joint: 'Estabilização global',
    },
    progressions: ['Aumentar tempo', 'Com peso', 'Instável'],
    variations: ['Nos cotovelos', 'Braços estendidos', 'Com peso', 'Na bola'],
    commonMistakes: ['Quadril caindo', 'Quadril subindo'],
    scientificSource: 'McGill (2010)',
  },

  'prancha lateral': {
    name: 'Prancha Lateral',
    aliases: ['side plank', 'prancha de lado', 'side bridge'],
    primaryMuscles: ['oblíquo externo', 'oblíquo interno'],
    secondaryMuscles: ['glúteo médio', 'quadrado lombar'],
    movementPattern: 'estabilização lateral',
    equipment: 'corpo livre',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '82% oblíquos',
      rom: 'Isométrico lateral',
      joint: 'Estabilização lateral',
    },
    progressions: ['Aumentar tempo', 'Com elevação', 'Dinâmica'],
    variations: ['Joelhos flexionados', 'Pernas retas', 'Com elevação de quadril'],
    commonMistakes: ['Quadril caindo', 'Girar tronco'],
    scientificSource: 'McGill (2010)',
  },

  'abdominal bicicleta': {
    name: 'Abdominal Bicicleta',
    aliases: ['bicycle crunch', 'bicicleta', 'abdominal rotacao'],
    primaryMuscles: ['oblíquos', 'reto abdominal'],
    secondaryMuscles: ['flexores de quadril'],
    movementPattern: 'flexão com rotação',
    equipment: 'corpo livre',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '95% oblíquos (maior ativação)',
      rom: 'Rotação alternada',
      joint: 'Coluna + quadril',
    },
    progressions: ['Mais lento', 'Maior amplitude'],
    variations: ['Normal', 'Lento', 'Com pausa'],
    commonMistakes: ['Muito rápido', 'Não tocar cotovelo'],
    scientificSource: 'Escamilla et al. (2006)',
  },

  'russian twist': {
    name: 'Russian Twist',
    aliases: ['rotacao russa', 'twist russo', 'rotacao de tronco'],
    primaryMuscles: ['oblíquos'],
    secondaryMuscles: ['reto abdominal'],
    movementPattern: 'rotação de tronco',
    equipment: 'corpo livre ou peso',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '80% oblíquos',
      rom: 'Rotação lateral sentado',
      joint: 'Coluna',
    },
    progressions: ['Adicionar peso', 'Pés elevados'],
    variations: ['Sem peso', 'Com peso', 'Pés elevados'],
    commonMistakes: ['Não rotar suficiente', 'Usar impulso'],
    scientificSource: 'McGill (2010)',
  },

  'abdominal no cabo': {
    name: 'Abdominal no Cabo (Cable Crunch)',
    aliases: ['cable crunch', 'crunch no cabo', 'abdominal ajoelhado'],
    primaryMuscles: ['reto abdominal'],
    secondaryMuscles: ['oblíquos'],
    movementPattern: 'flexão com resistência',
    equipment: 'cabo',
    difficulty: 'intermediário',
    biomechanics: {
      activation: '88% reto abdominal',
      rom: 'Flexão com carga',
      joint: 'Coluna',
    },
    progressions: ['Aumentar carga'],
    variations: ['Ajoelhado', 'Em pé', 'Com rotação'],
    commonMistakes: ['Usar quadril', 'Amplitude parcial'],
    scientificSource: 'Escamilla et al. (2006)',
  },

  'abdominal na roda': {
    name: 'Abdominal na Roda (Ab Wheel)',
    aliases: ['ab wheel', 'roda abdominal', 'rollout'],
    primaryMuscles: ['reto abdominal'],
    secondaryMuscles: ['oblíquos', 'lombar', 'ombros'],
    movementPattern: 'extensão e flexão',
    equipment: 'roda abdominal',
    difficulty: 'avançado',
    biomechanics: {
      activation: '92% reto abdominal',
      rom: 'Extensão completa',
      joint: 'Coluna + ombros',
    },
    progressions: ['Ajoelhado', 'De pé', 'Unilateral'],
    variations: ['Ajoelhado', 'De pé', 'Na barra'],
    commonMistakes: ['Arquear lombar', 'Não controlar'],
    scientificSource: 'Escamilla et al. (2006)',
  },

  'dead bug': {
    name: 'Dead Bug',
    aliases: ['bicho morto', 'besouro morto'],
    primaryMuscles: ['transverso do abdômen', 'reto abdominal'],
    secondaryMuscles: ['oblíquos', 'flexores de quadril'],
    movementPattern: 'estabilização com movimento',
    equipment: 'corpo livre',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '75% core (anti-extensão)',
      rom: 'Extensão alternada de membros',
      joint: 'Coluna + quadril',
    },
    progressions: ['Com peso', 'Com elástico'],
    variations: ['Básico', 'Com peso', 'Com elástico'],
    commonMistakes: ['Lombar saindo do chão', 'Muito rápido'],
    scientificSource: 'McGill (2010)',
  },

  'bird dog': {
    name: 'Bird Dog (Cachorro Pássaro)',
    aliases: ['quadruped', 'cachorro passaro', 'extensao alternada'],
    primaryMuscles: ['lombar', 'glúteo'],
    secondaryMuscles: ['core', 'deltóide'],
    movementPattern: 'extensão alternada em 4 apoios',
    equipment: 'corpo livre',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '68% lombar, 65% glúteo',
      rom: 'Extensão alternada de membros',
      joint: 'Quadril + ombros',
    },
    progressions: ['Com pausa', 'Com elástico'],
    variations: ['Básico', 'Com pausa', 'Com elástico'],
    commonMistakes: ['Girar quadril', 'Perder estabilidade'],
    scientificSource: 'McGill (2010)',
  },

  'pallof press': {
    name: 'Pallof Press',
    aliases: ['anti-rotation press', 'press anti-rotacao'],
    primaryMuscles: ['oblíquos', 'transverso'],
    secondaryMuscles: ['reto abdominal', 'glúteo'],
    movementPattern: 'anti-rotação',
    equipment: 'cabo ou elástico',
    difficulty: 'intermediário',
    biomechanics: {
      activation: '82% core (anti-rotação)',
      rom: 'Extensão de braços resistindo rotação',
      joint: 'Estabilização',
    },
    progressions: ['Aumentar carga', 'Ajoelhado', 'Split stance'],
    variations: ['Em pé', 'Ajoelhado', 'Split stance'],
    commonMistakes: ['Permitir rotação', 'Carga muito leve'],
    scientificSource: 'McGill (2010)',
  },

  'hollow body': {
    name: 'Hollow Body Hold',
    aliases: ['hollow hold', 'banana', 'posicao oca'],
    primaryMuscles: ['reto abdominal'],
    secondaryMuscles: ['flexores de quadril', 'quadríceps'],
    movementPattern: 'flexão isométrica',
    equipment: 'corpo livre',
    difficulty: 'intermediário',
    biomechanics: {
      activation: '85% reto abdominal',
      rom: 'Isométrico em flexão',
      joint: 'Coluna + quadril',
    },
    progressions: ['Aumentar tempo', 'Com peso'],
    variations: ['Básico', 'Com balanço', 'Com peso'],
    commonMistakes: ['Lombar saindo do chão', 'Não manter forma'],
    scientificSource: 'Gymnastic Bodies (2015)',
  },

  // ============================================================
  // PANTURRILHA - 10 EXERCÍCIOS
  // ============================================================

  'panturrilha em pe': {
    name: 'Panturrilha em Pé',
    aliases: ['standing calf raise', 'elevacao de panturrilha', 'calf raise'],
    primaryMuscles: ['gastrocnêmio'],
    secondaryMuscles: ['sóleo'],
    movementPattern: 'flexão plantar em pé',
    equipment: 'máquina ou halteres',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '88% gastrocnêmio',
      rom: 'Flexão plantar completa',
      joint: 'Tornozelo',
    },
    progressions: ['Aumentar carga', 'Unilateral'],
    variations: ['Na máquina', 'Com halteres', 'No smith', 'Unilateral'],
    commonMistakes: ['Amplitude parcial', 'Usar impulso'],
    scientificSource: 'Riemann et al. (2011)',
  },

  'panturrilha sentado': {
    name: 'Panturrilha Sentado',
    aliases: ['seated calf raise', 'panturrilha maquina sentado'],
    primaryMuscles: ['sóleo'],
    secondaryMuscles: ['gastrocnêmio (menos)'],
    movementPattern: 'flexão plantar sentado',
    equipment: 'máquina',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '90% sóleo (joelhos flexionados)',
      rom: 'Flexão plantar com joelhos dobrados',
      joint: 'Tornozelo',
    },
    progressions: ['Aumentar carga', 'Pausa'],
    variations: ['Na máquina', 'Com barra nos joelhos'],
    commonMistakes: ['Não descer completamente', 'Impulso'],
    scientificSource: 'Riemann et al. (2011)',
  },

  'panturrilha no leg press': {
    name: 'Panturrilha no Leg Press',
    aliases: ['leg press calf raise', 'panturrilha na prensa'],
    primaryMuscles: ['gastrocnêmio'],
    secondaryMuscles: ['sóleo'],
    movementPattern: 'flexão plantar na prensa',
    equipment: 'leg press',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '85% gastrocnêmio',
      rom: 'Flexão plantar com pernas estendidas',
      joint: 'Tornozelo',
    },
    progressions: ['Aumentar carga', 'Unilateral'],
    variations: ['Bilateral', 'Unilateral'],
    commonMistakes: ['Travar joelhos demais', 'Amplitude parcial'],
    scientificSource: 'Riemann et al. (2011)',
  },

  'panturrilha burro': {
    name: 'Panturrilha Burro (Donkey Calf)',
    aliases: ['donkey calf raise', 'panturrilha inclinado'],
    primaryMuscles: ['gastrocnêmio'],
    secondaryMuscles: ['sóleo'],
    movementPattern: 'flexão plantar inclinado',
    equipment: 'máquina ou parceiro',
    difficulty: 'intermediário',
    biomechanics: {
      activation: '92% gastrocnêmio (alongado)',
      rom: 'Flexão plantar com quadril flexionado',
      joint: 'Tornozelo',
    },
    progressions: ['Aumentar carga'],
    variations: ['Na máquina', 'Com parceiro'],
    commonMistakes: ['Amplitude parcial', 'Usar impulso'],
    scientificSource: 'Arnold Schwarzenegger (1985)',
  },

  'tibial anterior': {
    name: 'Elevação de Tibial Anterior',
    aliases: ['tibialis raise', 'dorsiflexao', 'tibial raise'],
    primaryMuscles: ['tibial anterior'],
    secondaryMuscles: [],
    movementPattern: 'dorsiflexão',
    equipment: 'corpo livre ou peso',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '90% tibial anterior',
      rom: 'Dorsiflexão contra resistência',
      joint: 'Tornozelo',
    },
    progressions: ['Adicionar peso', 'Unilateral'],
    variations: ['Sentado', 'Em pé no calcanhar', 'Com peso'],
    commonMistakes: ['Amplitude parcial', 'Sem controle'],
    scientificSource: 'Kneeoverthoes (2020)',
  },

  // ============================================================
  // ANTEBRAÇO - 10 EXERCÍCIOS
  // ============================================================

  'rosca de punho': {
    name: 'Rosca de Punho',
    aliases: ['wrist curl', 'flexao de punho', 'rosca punho'],
    primaryMuscles: ['flexores do antebraço'],
    secondaryMuscles: [],
    movementPattern: 'flexão de punho',
    equipment: 'barra ou halteres',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '85% flexores',
      rom: 'Flexão de punho completa',
      joint: 'Punho',
    },
    progressions: ['Aumentar carga'],
    variations: ['Com barra', 'Com halteres', 'Atrás das costas'],
    commonMistakes: ['Usar antebraço', 'Amplitude parcial'],
    scientificSource: 'NSCA (2015)',
  },

  'rosca de punho inversa': {
    name: 'Rosca de Punho Inversa',
    aliases: ['reverse wrist curl', 'extensao de punho', 'rosca punho inversa'],
    primaryMuscles: ['extensores do antebraço'],
    secondaryMuscles: [],
    movementPattern: 'extensão de punho',
    equipment: 'barra ou halteres',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '82% extensores',
      rom: 'Extensão de punho',
      joint: 'Punho',
    },
    progressions: ['Aumentar carga'],
    variations: ['Com barra', 'Com halteres'],
    commonMistakes: ['Amplitude parcial', 'Usar bíceps'],
    scientificSource: 'NSCA (2015)',
  },

  'rosca inversa': {
    name: 'Rosca Inversa',
    aliases: ['reverse curl', 'rosca pronada', 'rosca pegada invertida'],
    primaryMuscles: ['braquiorradial', 'extensores'],
    secondaryMuscles: ['bíceps'],
    movementPattern: 'flexão com pegada pronada',
    equipment: 'barra',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '85% braquiorradial',
      rom: 'Flexão de cotovelo pronado',
      joint: 'Cotovelos',
    },
    progressions: ['Aumentar carga'],
    variations: ['Com barra', 'Com EZ', 'No cabo'],
    commonMistakes: ['Usar impulso', 'Peso demais'],
    scientificSource: 'Marcolin et al. (2018)',
  },

  'farmer walk': {
    name: 'Farmer Walk (Caminhada do Fazendeiro)',
    aliases: ['farmers carry', 'caminhada com peso', 'carregamento'],
    primaryMuscles: ['antebraços', 'trapézio'],
    secondaryMuscles: ['core', 'pernas'],
    movementPattern: 'carregamento isométrico',
    equipment: 'halteres ou farmers',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '90% grip + estabilização total',
      rom: 'Isométrico caminhando',
      joint: 'Corpo todo',
    },
    progressions: ['Aumentar peso', 'Aumentar distância'],
    variations: ['Bilateral', 'Unilateral', 'Com trap bar'],
    commonMistakes: ['Inclinar', 'Passos muito longos'],
    scientificSource: 'McGill (2010)',
  },

  'dead hang': {
    name: 'Dead Hang (Pendurado)',
    aliases: ['hang', 'pendurar na barra', 'passive hang'],
    primaryMuscles: ['antebraços'],
    secondaryMuscles: ['latíssimo', 'ombros'],
    movementPattern: 'suspensão passiva',
    equipment: 'barra fixa',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '95% grip',
      rom: 'Isométrico pendurado',
      joint: 'Punho + ombros',
    },
    progressions: ['Aumentar tempo', 'Unilateral'],
    variations: ['Bilateral', 'Unilateral', 'Com peso'],
    commonMistakes: ['Soltar muito rápido', 'Tensionar ombros'],
    scientificSource: 'Gymnastic Bodies (2015)',
  },

  'gripper': {
    name: 'Hand Gripper',
    aliases: ['hand grip', 'aperto de mao', 'grip strength'],
    primaryMuscles: ['flexores do antebraço'],
    secondaryMuscles: [],
    movementPattern: 'fechamento de mão',
    equipment: 'hand gripper',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '92% flexores',
      rom: 'Fechamento completo',
      joint: 'Dedos',
    },
    progressions: ['Aumentar resistência'],
    variations: ['Fechamento', 'Manutenção', 'Negativo'],
    commonMistakes: ['Não fechar completamente', 'Velocidade excessiva'],
    scientificSource: 'IronMind (2010)',
  },

  // ============================================================
  // CORPO INTEIRO / FUNCIONAIS - 15+ EXERCÍCIOS
  // ============================================================

  'burpee': {
    name: 'Burpee',
    aliases: ['burpees', 'squat thrust'],
    primaryMuscles: ['corpo inteiro'],
    secondaryMuscles: ['peitoral', 'quadríceps', 'core', 'ombros'],
    movementPattern: 'movimento composto explosivo',
    equipment: 'corpo livre',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Total body - cardio + força',
      rom: 'Agachamento + flexão + salto',
      joint: 'Múltiplas',
    },
    progressions: ['Com flexão completa', 'Com salto alto'],
    variations: ['Básico', 'Com flexão', 'Com salto', 'Com pull up'],
    commonMistakes: ['Pular a flexão', 'Não fazer agachamento completo'],
    scientificSource: 'ACSM (2018)',
  },

  'clean': {
    name: 'Clean (Arremesso)',
    aliases: ['power clean', 'hang clean', 'arremesso'],
    primaryMuscles: ['corpo inteiro'],
    secondaryMuscles: ['quadríceps', 'glúteo', 'trapézio', 'core'],
    movementPattern: 'levantamento olímpico',
    equipment: 'barra',
    difficulty: 'avançado',
    biomechanics: {
      activation: 'Potência total - extensão tripla',
      rom: 'Do chão até os ombros',
      joint: 'Tornozelos + joelhos + quadril',
    },
    progressions: ['Hang clean', 'Power clean', 'Squat clean'],
    variations: ['Power', 'Hang', 'Squat', 'Com halteres'],
    commonMistakes: ['Não fazer extensão tripla', 'Puxar com braços'],
    scientificSource: 'USAW (2020)',
  },

  'snatch': {
    name: 'Snatch (Arranco)',
    aliases: ['power snatch', 'hang snatch', 'arranco'],
    primaryMuscles: ['corpo inteiro'],
    secondaryMuscles: ['ombros', 'core', 'pernas'],
    movementPattern: 'levantamento olímpico overhead',
    equipment: 'barra',
    difficulty: 'avançado',
    biomechanics: {
      activation: 'Máxima potência - extensão tripla + overhead',
      rom: 'Do chão até acima da cabeça',
      joint: 'Corpo todo',
    },
    progressions: ['Hang snatch', 'Power snatch', 'Squat snatch'],
    variations: ['Power', 'Hang', 'Squat', 'Com halter'],
    commonMistakes: ['Puxar com braços', 'Não manter barra próxima'],
    scientificSource: 'USAW (2020)',
  },

  'thruster': {
    name: 'Thruster',
    aliases: ['squat to press', 'agachamento com desenvolvimento'],
    primaryMuscles: ['quadríceps', 'glúteo', 'ombros'],
    secondaryMuscles: ['core', 'tríceps'],
    movementPattern: 'agachamento + desenvolvimento',
    equipment: 'barra ou halteres',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Corpo inteiro - pernas + ombros',
      rom: 'Agachamento profundo + press overhead',
      joint: 'Joelhos + quadril + ombros',
    },
    progressions: ['Aumentar carga', 'Unilateral'],
    variations: ['Com barra', 'Com halteres', 'Com kettlebells'],
    commonMistakes: ['Separar os movimentos', 'Não usar impulso das pernas'],
    scientificSource: 'CrossFit (2015)',
  },

  'wall ball': {
    name: 'Wall Ball',
    aliases: ['bola na parede', 'medicine ball throw'],
    primaryMuscles: ['quadríceps', 'glúteo', 'ombros'],
    secondaryMuscles: ['core', 'tríceps'],
    movementPattern: 'agachamento + arremesso',
    equipment: 'medicine ball + parede',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Cardio + força - corpo inteiro',
      rom: 'Agachamento + arremesso vertical',
      joint: 'Joelhos + quadril + ombros',
    },
    progressions: ['Aumentar peso', 'Aumentar altura'],
    variations: ['Diferentes pesos', 'Diferentes alturas'],
    commonMistakes: ['Agachamento raso', 'Não usar pernas no arremesso'],
    scientificSource: 'CrossFit (2015)',
  },

  'turkish get up': {
    name: 'Turkish Get Up',
    aliases: ['tgu', 'levantamento turco'],
    primaryMuscles: ['core', 'ombros'],
    secondaryMuscles: ['glúteo', 'quadríceps', 'trapézio'],
    movementPattern: 'levantamento complexo do chão',
    equipment: 'kettlebell ou halter',
    difficulty: 'avançado',
    biomechanics: {
      activation: 'Estabilização + mobilidade total',
      rom: 'Do chão até em pé segurando peso overhead',
      joint: 'Corpo todo',
    },
    progressions: ['Sem peso', 'Com peso leve', 'Com kettlebell pesado'],
    variations: ['Com kettlebell', 'Com halter', 'Com barra'],
    commonMistakes: ['Pular etapas', 'Olhar para frente'],
    scientificSource: 'RKC (2015)',
  },

  'man maker': {
    name: 'Man Maker',
    aliases: ['manmaker', 'renegade complex'],
    primaryMuscles: ['corpo inteiro'],
    secondaryMuscles: ['peitoral', 'costas', 'ombros', 'pernas'],
    movementPattern: 'flexão + remada + clean + thruster',
    equipment: 'halteres',
    difficulty: 'avançado',
    biomechanics: {
      activation: 'Complexo total - múltiplos movimentos',
      rom: 'Flexão + remada + squat + press',
      joint: 'Corpo todo',
    },
    progressions: ['Peso leve', 'Peso moderado', 'Peso pesado'],
    variations: ['Com burpee', 'Sem thruster'],
    commonMistakes: ['Pular movimentos', 'Perder forma'],
    scientificSource: 'CrossFit (2015)',
  },

  'sled push': {
    name: 'Sled Push (Empurrar Trenó)',
    aliases: ['prowler push', 'empurrar treno'],
    primaryMuscles: ['quadríceps', 'glúteo'],
    secondaryMuscles: ['panturrilha', 'core', 'ombros'],
    movementPattern: 'empurrar horizontal',
    equipment: 'sled/trenó',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Força horizontal - sem fase excêntrica',
      rom: 'Extensão de perna repetida',
      joint: 'Joelhos + quadril',
    },
    progressions: ['Aumentar peso', 'Aumentar velocidade'],
    variations: ['Baixo', 'Alto', 'Lateral'],
    commonMistakes: ['Passos curtos', 'Tronco muito ereto'],
    scientificSource: 'Winwood et al. (2016)',
  },

  'sled pull': {
    name: 'Sled Pull (Puxar Trenó)',
    aliases: ['sled drag', 'puxar treno'],
    primaryMuscles: ['isquiotibiais', 'glúteo'],
    secondaryMuscles: ['panturrilha', 'lombar'],
    movementPattern: 'puxar horizontal',
    equipment: 'sled/trenó + cinto',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Força horizontal posterior',
      rom: 'Extensão de quadril repetida',
      joint: 'Quadril + joelhos',
    },
    progressions: ['Aumentar peso', 'De costas'],
    variations: ['De frente', 'De costas', 'Lateral'],
    commonMistakes: ['Inclinar demais', 'Passos curtos'],
    scientificSource: 'Winwood et al. (2016)',
  },

  'battle ropes': {
    name: 'Battle Ropes (Cordas de Batalha)',
    aliases: ['cordas', 'rope slams', 'cordas navais'],
    primaryMuscles: ['ombros', 'core'],
    secondaryMuscles: ['bíceps', 'costas', 'pernas'],
    movementPattern: 'ondulação de cordas',
    equipment: 'battle ropes',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Cardio + força - upper body',
      rom: 'Ondulação contínua',
      joint: 'Ombros + cotovelos',
    },
    progressions: ['Aumentar velocidade', 'Diferentes padrões'],
    variations: ['Alternado', 'Simultâneo', 'Slam', 'Circular'],
    commonMistakes: ['Braços muito rígidos', 'Não usar core'],
    scientificSource: 'Fountaine & Schmidt (2015)',
  },

  // ============================================================
  // T-NATION AUTHORS - DAN JOHN, JOHN MEADOWS, BEN BRUNO, ETC.
  // ============================================================

  // DAN JOHN - Goblet Squat, Loaded Carries, Swings
  'goblet squat': {
    name: 'Agachamento Goblet',
    aliases: ['goblet squat', 'agachamento com kettlebell', 'agachamento copa', 'goblet', 'squat goblet'],
    primaryMuscles: ['quadríceps', 'glúteo'],
    secondaryMuscles: ['core', 'adutores', 'isquiotibiais'],
    movementPattern: 'agachamento',
    equipment: 'kettlebell ou halter',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '85% quads, 75% glúteo (excelente para padrão de agachamento)',
      rom: 'Agachamento profundo com cotovelos dentro dos joelhos',
      joint: 'Joelhos + quadril + tornozelos',
    },
    progressions: ['Aumentar peso', 'Adicionar pausa no fundo', 'Goblet squat 1.5'],
    variations: ['Com halter', 'Com kettlebell', 'Com disco', 'Paused goblet squat'],
    commonMistakes: ['Inclinar demais o tronco', 'Não empurrar joelhos pra fora', 'Elevar calcanhares'],
    scientificSource: 'Dan John - T-Nation "Goblet Squat 101"',
  },

  'farmer walk': {
    name: 'Farmer Walk (Caminhada do Fazendeiro)',
    aliases: ['farmers walk', 'farmer carry', 'caminhada do fazendeiro', 'farmers carry', 'transporte de fazendeiro'],
    primaryMuscles: ['trapézio', 'antebraço', 'core'],
    secondaryMuscles: ['ombros', 'glúteo', 'quadríceps', 'panturrilha'],
    movementPattern: 'carregamento carregado (loaded carry)',
    equipment: 'halteres ou farmer handles',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Tensão total do corpo - grip, core, estabilizadores',
      rom: 'Caminhada sob carga pesada',
      joint: 'Todo o corpo - estabilização dinâmica',
    },
    progressions: ['Aumentar peso', 'Aumentar distância', 'Single arm carry'],
    variations: ['Bilateral', 'Unilateral', 'Com kettlebells', 'Com trap bar'],
    commonMistakes: ['Inclinar para os lados', 'Passos muito grandes', 'Perder postura'],
    scientificSource: 'Dan John - T-Nation "Loaded Carries"',
  },

  'suitcase carry': {
    name: 'Suitcase Carry (Transporte Unilateral)',
    aliases: ['suitcase walk', 'transporte de mala', 'single arm carry', 'carregamento lateral'],
    primaryMuscles: ['oblíquos', 'core'],
    secondaryMuscles: ['trapézio', 'antebraço', 'glúteo médio'],
    movementPattern: 'carregamento carregado unilateral',
    equipment: 'halter ou kettlebell',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Anti-flexão lateral intensa - oblíquos 95%',
      rom: 'Caminhada estabilizando anti-rotação',
      joint: 'Coluna + quadril',
    },
    progressions: ['Aumentar peso', 'Aumentar distância'],
    variations: ['Com halter', 'Com kettlebell', 'Com trap bar'],
    commonMistakes: ['Inclinar para o lado do peso', 'Perder postura'],
    scientificSource: 'Dan John - T-Nation',
  },

  'kettlebell swing': {
    name: 'Balanço com Kettlebell (Swing)',
    aliases: ['kb swing', 'swing', 'kettlebell swing', 'balanco kettlebell', 'russian swing'],
    primaryMuscles: ['glúteo', 'isquiotibiais'],
    secondaryMuscles: ['core', 'lombar', 'ombros', 'antebraço'],
    movementPattern: 'hip hinge explosivo',
    equipment: 'kettlebell',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Glúteo 90%+ no snap do quadril - movimento balístico',
      rom: 'Hip hinge máximo com mínima flexão de joelhos',
      joint: 'Quadril (hinge) - NÃO é agachamento',
    },
    progressions: ['Aumentar peso', 'Single arm swing', 'American swing'],
    variations: ['Russian swing', 'American swing', 'Single arm', 'Double kettlebell'],
    commonMistakes: ['Agachar em vez de fazer hinge', 'Usar os braços para levantar', 'Não fazer squeeze de glúteo'],
    scientificSource: 'Dan John - T-Nation "Master the Kettlebell Swing"',
  },

  'turkish get up': {
    name: 'Levantamento Turco (Turkish Get-Up)',
    aliases: ['tgu', 'turkish getup', 'get up turco', 'getup'],
    primaryMuscles: ['core', 'ombros'],
    secondaryMuscles: ['glúteo', 'quadríceps', 'triceps', 'trapézio'],
    movementPattern: 'levantamento funcional complexo',
    equipment: 'kettlebell',
    difficulty: 'avançado',
    biomechanics: {
      activation: 'Estabilização total do corpo em múltiplos planos',
      rom: 'Do chão até em pé mantendo peso overhead',
      joint: 'Todos - ombro, quadril, joelhos, core',
    },
    progressions: ['Shoe get-up', 'Half get-up', 'Full get-up com peso'],
    variations: ['Com halter', 'Com kettlebell', 'Half get-up'],
    commonMistakes: ['Não manter olho no peso', 'Perder alinhamento do braço', 'Pular fases'],
    scientificSource: 'Dan John - T-Nation',
  },

  // JOHN MEADOWS - Mountain Dog Training
  'meadows row': {
    name: 'Remada Meadows',
    aliases: ['meadows row', 'landmine row', 'remada na barra T inclinada', 'john meadows row'],
    primaryMuscles: ['latíssimo do dorso', 'romboides'],
    secondaryMuscles: ['bíceps', 'trapézio', 'deltóide posterior'],
    movementPattern: 'puxada horizontal unilateral',
    equipment: 'barra olímpica (landmine)',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Latíssimo 92% - grip pronado na parte grossa da barra',
      rom: 'Puxada com cotovelo alto e rotação do tronco',
      joint: 'Ombro + cotovelo + coluna torácica',
    },
    progressions: ['Aumentar carga', 'Pausas no pico', 'Drop sets'],
    variations: ['Supinada', 'Pronada', 'Com alça'],
    commonMistakes: ['Usar impulso do corpo', 'Não contrair escápula', 'Amplitude incompleta'],
    scientificSource: 'John Meadows - T-Nation "Mountain Dog Training"',
  },

  'pec minor dip': {
    name: 'Dip para Peitoral Menor',
    aliases: ['pec dip', 'chest dip deep', 'mergulho peitoral', 'gironda dip'],
    primaryMuscles: ['peitoral maior', 'peitoral menor'],
    secondaryMuscles: ['tríceps', 'deltóide anterior'],
    movementPattern: 'empurrar vertical para baixo',
    equipment: 'paralelas',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Peitoral menor ativado no alongamento máximo',
      rom: 'Mergulho profundo com inclinação do tronco',
      joint: 'Ombro + cotovelo',
    },
    progressions: ['Adicionar peso', 'Cadência lenta', 'Pausa no fundo'],
    variations: ['Com peso', 'Negativas', 'Assistido'],
    commonMistakes: ['Não inclinar o tronco', 'Descer pouco', 'Ombros para frente'],
    scientificSource: 'John Meadows - T-Nation',
  },

  'kettlebell skullcrusher': {
    name: 'Tríceps Testa com Kettlebell',
    aliases: ['kb skullcrusher', 'skullcrusher kettlebell', 'triceps testa kb'],
    primaryMuscles: ['tríceps'],
    secondaryMuscles: ['antebraço'],
    movementPattern: 'extensão de cotovelo',
    equipment: 'kettlebell',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Tríceps 88% - melhor sensação que barra reta ou EZ',
      rom: 'Extensão completa com alongamento do tríceps',
      joint: 'Cotovelo',
    },
    progressions: ['Aumentar peso', 'Tempo negativo lento'],
    variations: ['Inclinado', 'Declinado', 'Com halter'],
    commonMistakes: ['Mover os cotovelos', 'Amplitude incompleta'],
    scientificSource: 'John Meadows - T-Nation',
  },

  // BEN BRUNO - Single Leg Training Specialist
  'pistol squat': {
    name: 'Agachamento Pistol (Uma Perna)',
    aliases: ['pistol', 'single leg squat', 'agachamento unilateral', 'one leg squat'],
    primaryMuscles: ['quadríceps', 'glúteo'],
    secondaryMuscles: ['core', 'isquiotibiais', 'flexores do quadril'],
    movementPattern: 'agachamento unilateral',
    equipment: 'corpo livre',
    difficulty: 'avançado',
    biomechanics: {
      activation: 'Quads 95% + glúteo 85% + estabilização intensa',
      rom: 'Agachamento completo em uma perna só',
      joint: 'Joelho + quadril + tornozelo',
    },
    progressions: ['Pistol assistido', 'Box pistol', 'Full pistol', 'Com peso'],
    variations: ['Assistido', 'No box', 'Elevado', 'Com contrapeso'],
    commonMistakes: ['Inclinar demais', 'Joelho colapsar para dentro', 'Perder equilíbrio'],
    scientificSource: 'Ben Bruno - T-Nation "Breaking Down the Single Leg Squat"',
  },

  'skater squat': {
    name: 'Agachamento Skater',
    aliases: ['skater squat', 'agachamento de patinador', 'airborne lunge'],
    primaryMuscles: ['quadríceps', 'glúteo'],
    secondaryMuscles: ['core', 'isquiotibiais'],
    movementPattern: 'agachamento unilateral',
    equipment: 'corpo livre',
    difficulty: 'avançado',
    biomechanics: {
      activation: 'Similar ao pistol mas com joelho tocando o chão',
      rom: 'Descer até joelho de trás tocar o chão',
      joint: 'Joelho + quadril',
    },
    progressions: ['Com apoio', 'Elevado', 'Com peso'],
    variations: ['Com contrapeso', 'Com halter', 'Com colete'],
    commonMistakes: ['Bater joelho forte no chão', 'Perder equilíbrio'],
    scientificSource: 'Ben Bruno - T-Nation',
  },

  'single leg rdl': {
    name: 'Stiff Unilateral (Single Leg RDL)',
    aliases: ['single leg romanian deadlift', 'stiff uma perna', 'single leg rdl', 'sldl'],
    primaryMuscles: ['isquiotibiais', 'glúteo'],
    secondaryMuscles: ['lombar', 'core'],
    movementPattern: 'hip hinge unilateral',
    equipment: 'halter ou kettlebell',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Isquios 90% + glúteo 85% + estabilização de quadril',
      rom: 'Hip hinge completo com perna de apoio levemente flexionada',
      joint: 'Quadril + joelho (estabilização)',
    },
    progressions: ['Sem peso', 'Com peso leve', 'Contralateral', 'Ipsilateral'],
    variations: ['Com halter contralateral', 'Com kettlebell', 'Com barra'],
    commonMistakes: ['Arredondar lombar', 'Não manter quadril neutro', 'Girar o tronco'],
    scientificSource: 'Ben Bruno - T-Nation',
  },

  'bulgarian split squat rear elevated': {
    name: 'Agachamento Búlgaro (Pé Elevado)',
    aliases: ['bulgarian split squat', 'agachamento bulgaro', 'rear foot elevated split squat', 'rfess'],
    primaryMuscles: ['quadríceps', 'glúteo'],
    secondaryMuscles: ['isquiotibiais', 'core', 'adutores'],
    movementPattern: 'agachamento unilateral com apoio',
    equipment: 'banco + halteres',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Quads 88% + glúteo 82% - excelente para déficits',
      rom: 'Agachamento profundo com pé de trás elevado',
      joint: 'Joelho + quadril',
    },
    progressions: ['Sem peso', 'Com halteres', 'Com barra', 'Déficit'],
    variations: ['Com halteres', 'Com barra frontal', 'Com barra nas costas', '1.5 rep'],
    commonMistakes: ['Pé de trás muito longe', 'Tronco muito inclinado', 'Joelho passando do pé'],
    scientificSource: 'Ben Bruno - T-Nation "7 Single-Leg Exercises"',
  },

  // CHRISTIAN THIBAUDEAU - Violent Variations
  'torso shift curl': {
    name: 'Rosca com Inclinação de Tronco',
    aliases: ['torso shifting curl', 'thibaudeau curl', 'rosca inclinada tronco'],
    primaryMuscles: ['bíceps braquial', 'braquial'],
    secondaryMuscles: ['antebraço'],
    movementPattern: 'flexão de cotovelo com mudança de torque',
    equipment: 'barra',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Bíceps 95% - tensão máxima em toda amplitude',
      rom: 'Rosca completa com tronco mudando posição',
      joint: 'Cotovelo + leve movimento de tronco',
    },
    progressions: ['Aumentar carga', 'Mais lento'],
    variations: ['Com barra reta', 'Com barra W'],
    commonMistakes: ['Usar impulso excessivo', 'Não controlar a negativa'],
    scientificSource: 'Christian Thibaudeau - T-Nation "Violent Variations"',
  },

  'decline db triceps extension': {
    name: 'Extensão de Tríceps Declinado com Halter',
    aliases: ['decline triceps extension', 'triceps testa declinado', 'thibaudeau triceps'],
    primaryMuscles: ['tríceps'],
    secondaryMuscles: ['antebraço'],
    movementPattern: 'extensão de cotovelo declinado',
    equipment: 'halteres + banco declinado',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Tríceps 98% - maior ativação que qualquer variação',
      rom: 'Alongamento máximo do tríceps na posição declinada',
      joint: 'Cotovelo',
    },
    progressions: ['Aumentar carga', 'Rotação durante movimento'],
    variations: ['Com rotação', 'Neutro', 'Alternado'],
    commonMistakes: ['Mover os ombros', 'Amplitude incompleta'],
    scientificSource: 'Christian Thibaudeau - T-Nation "Violent Variations Part 2"',
  },

  // NICK TUMMINELLO - Strength Zone Training
  'hip health exercises': {
    name: 'Exercícios de Saúde do Quadril (HH10)',
    aliases: ['hip mobility', 'mobilidade de quadril', 'hip health', 'nick tumminello hip'],
    primaryMuscles: ['flexores do quadril', 'glúteo médio'],
    secondaryMuscles: ['adutores', 'core'],
    movementPattern: 'mobilidade e ativação',
    equipment: 'corpo livre',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Ativação e mobilidade de quadril em todos os planos',
      rom: 'Amplitude completa de quadril',
      joint: 'Quadril (coxofemoral)',
    },
    progressions: ['Adicionar resistência', 'Aumentar amplitude'],
    variations: ['90/90 stretch', 'Hip circles', 'Fire hydrants'],
    commonMistakes: ['Compensar com lombar', 'Movimentos muito rápidos'],
    scientificSource: 'Nick Tumminello - T-Nation "Fully Functional Hips"',
  },

  'shoulder health exercises': {
    name: 'Exercícios de Saúde do Ombro (SH10)',
    aliases: ['shoulder mobility', 'mobilidade de ombro', 'shoulder health', 'nick tumminello shoulder'],
    primaryMuscles: ['manguito rotador', 'deltóide'],
    secondaryMuscles: ['trapézio', 'serrátil anterior'],
    movementPattern: 'mobilidade e estabilização',
    equipment: 'elástico ou corpo livre',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Ativação de manguito rotador e estabilizadores',
      rom: 'Rotação interna e externa completa',
      joint: 'Ombro (glenoumeral) + escápula',
    },
    progressions: ['Adicionar resistência', 'Em pé → deitado'],
    variations: ['External rotation', 'Face pull', 'Band pull apart'],
    commonMistakes: ['Usar músculos grandes', 'Amplitude excessiva'],
    scientificSource: 'Nick Tumminello - T-Nation "Fully Functional Shoulders"',
  },

  'contrast training': {
    name: 'Treinamento de Contraste',
    aliases: ['contrast training', 'post-activation potentiation', 'pap training'],
    primaryMuscles: ['depende do exercício'],
    secondaryMuscles: ['sistema nervoso'],
    movementPattern: 'força + explosão sequencial',
    equipment: 'variado',
    difficulty: 'avançado',
    biomechanics: {
      activation: 'Potenciação pós-ativação - recruta fibras rápidas',
      rom: 'Pesado seguido de explosivo no mesmo padrão',
      joint: 'Depende do exercício',
    },
    progressions: ['Squat + Jump squat', 'Bench + Explosive pushup'],
    variations: ['Agachamento + salto', 'Supino + flexão explosiva', 'Pull-up + medicine ball slam'],
    commonMistakes: ['Descanso muito curto', 'Carga muito leve na parte pesada'],
    scientificSource: 'Nick Tumminello - T-Nation "Contrast Training for Strength, Size, and Power"',
  },

  // ERIC CRESSEY - Shoulder Savers
  'scap pushup': {
    name: 'Flexão de Escápula',
    aliases: ['scapular pushup', 'pushup plus', 'flexao escapular', 'serratus pushup'],
    primaryMuscles: ['serrátil anterior'],
    secondaryMuscles: ['trapézio', 'romboides'],
    movementPattern: 'protração/retração escapular',
    equipment: 'corpo livre',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Serrátil anterior 95% - excelente para estabilidade escapular',
      rom: 'Apenas movimento da escápula, braços retos',
      joint: 'Escápula (escapulotorácica)',
    },
    progressions: ['No chão', 'Elevado', 'Com banda'],
    variations: ['Na parede', 'No chão', 'Em prancha'],
    commonMistakes: ['Dobrar os cotovelos', 'Amplitude muito pequena'],
    scientificSource: 'Eric Cressey - T-Nation "Shoulder Savers"',
  },

  'face pull': {
    name: 'Face Pull (Puxada para Rosto)',
    aliases: ['face pull', 'puxada facial', 'rope face pull', 'puxada alta'],
    primaryMuscles: ['deltóide posterior', 'trapézio médio'],
    secondaryMuscles: ['romboides', 'manguito rotador'],
    movementPattern: 'puxada horizontal alta com rotação externa',
    equipment: 'cabo com corda',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Deltóide posterior 85% + rotadores externos 78%',
      rom: 'Puxar em direção ao rosto com rotação externa',
      joint: 'Ombro + escápula',
    },
    progressions: ['Aumentar carga', 'Pausa no pico', 'Cadência lenta'],
    variations: ['Com corda', 'Com elástico', 'Inclinado', 'De joelhos'],
    commonMistakes: ['Puxar muito baixo', 'Não fazer rotação externa', 'Usar impulso'],
    scientificSource: 'Eric Cressey - T-Nation "Shoulder Savers"',
  },

  'band pull apart': {
    name: 'Puxada de Elástico (Pull Apart)',
    aliases: ['band pull apart', 'puxada elastico', 'elastic pull apart', 'band spread'],
    primaryMuscles: ['deltóide posterior', 'romboides'],
    secondaryMuscles: ['trapézio médio', 'manguito rotador'],
    movementPattern: 'abdução horizontal de ombro',
    equipment: 'elástico/banda',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Deltóide posterior 80% + romboides 75%',
      rom: 'Esticar elástico afastando as mãos',
      joint: 'Ombro + escápula',
    },
    progressions: ['Elástico mais forte', 'Mais repetições', 'Diferentes ângulos'],
    variations: ['Pronado', 'Supinado', 'Overhead', 'Diagonal'],
    commonMistakes: ['Usar bíceps', 'Não retrair escápulas', 'Amplitude incompleta'],
    scientificSource: 'Eric Cressey - T-Nation',
  },

  'thoracic extension foam roller': {
    name: 'Extensão Torácica no Foam Roller',
    aliases: ['t-spine extension', 'thoracic mobility', 'foam roller extension', 'extensao toracica'],
    primaryMuscles: ['extensores torácicos'],
    secondaryMuscles: ['core'],
    movementPattern: 'mobilidade de coluna torácica',
    equipment: 'foam roller',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Mobilização de coluna torácica - melhora postura',
      rom: 'Extensão da coluna torácica sobre o rolo',
      joint: 'Coluna torácica (T1-T12)',
    },
    progressions: ['Aumentar amplitude', 'Adicionar respiração'],
    variations: ['Mãos atrás da cabeça', 'Mãos cruzadas no peito', 'Com rotação'],
    commonMistakes: ['Rolo na lombar', 'Forçar demais', 'Não relaxar'],
    scientificSource: 'Eric Cressey - T-Nation "Shoulder Savers Part 2"',
  },

  // PAUL CARTER - Lift Run Bang
  '350 method': {
    name: 'Método 350 (High Rep Finisher)',
    aliases: ['350 method', 'metodo 350', 'paul carter 350', 'high rep method'],
    primaryMuscles: ['depende do exercício'],
    secondaryMuscles: ['resistência muscular'],
    movementPattern: 'alto volume em único exercício',
    equipment: 'variado',
    difficulty: 'avançado',
    biomechanics: {
      activation: 'Falha muscular metabólica - pump máximo',
      rom: 'Amplitude completa com peso leve',
      joint: 'Depende do exercício',
    },
    progressions: ['Aumentar peso mantendo reps', 'Reduzir tempo'],
    variations: ['Para quads', 'Para peito', 'Para costas'],
    commonMistakes: ['Peso muito pesado', 'Forma ruim', 'Descanso muito longo'],
    scientificSource: 'Paul Carter - Lift Run Bang / T-Nation',
  },

  // DANI SHUGART
  'arnold press': {
    name: 'Arnold Press (Desenvolvimento Arnold)',
    aliases: ['arnold press', 'desenvolvimento arnold', 'arnold shoulder press', 'rotational press'],
    primaryMuscles: ['deltóide anterior', 'deltóide medial'],
    secondaryMuscles: ['tríceps', 'trapézio superior'],
    movementPattern: 'empurrar vertical com rotação',
    equipment: 'halteres',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Deltóide 90% - rotação aumenta tempo sob tensão',
      rom: 'De palmas para você até palmas para frente (overhead)',
      joint: 'Ombro + cotovelo',
    },
    progressions: ['Aumentar carga', 'Cadência mais lenta'],
    variations: ['Sentado', 'Em pé', 'Alternado'],
    commonMistakes: ['Não fazer rotação completa', 'Usar impulso', 'Extensão incompleta'],
    scientificSource: 'Dani Shugart - T-Nation "Delts on Fire"',
  },

  'straight arm pulldown': {
    name: 'Pulldown de Braços Estendidos',
    aliases: ['straight arm pulldown', 'pulldown braco reto', 'lat pulldown bracos retos', 'stiff arm pulldown'],
    primaryMuscles: ['latíssimo do dorso'],
    secondaryMuscles: ['tríceps (cabeça longa)', 'serrátil anterior'],
    movementPattern: 'extensão de ombro com braços retos',
    equipment: 'cabo com barra ou corda',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Latíssimo 85% - isolamento sem bíceps',
      rom: 'De cima da cabeça até as coxas',
      joint: 'Ombro (extensão)',
    },
    progressions: ['Aumentar carga', 'Pausa no pico'],
    variations: ['Com barra', 'Com corda', 'Inclinado'],
    commonMistakes: ['Dobrar os cotovelos', 'Usar impulso do tronco', 'Amplitude curta'],
    scientificSource: 'Dani Shugart - T-Nation',
  },

  // BRET CONTRERAS EMG DATA - Exercícios com dados EMG específicos
  'band skorcher hip thrust': {
    name: 'Hip Thrust no Skorcher com Banda',
    aliases: ['skorcher thrust', 'band hip thrust machine', 'skorcher hip thrust'],
    primaryMuscles: ['glúteo máximo'],
    secondaryMuscles: ['isquiotibiais', 'core'],
    movementPattern: 'extensão de quadril com resistência de banda',
    equipment: 'skorcher machine + banda',
    difficulty: 'avançado',
    biomechanics: {
      activation: '88.3% glúteo médio / 160% pico (dados EMG Bret Contreras)',
      rom: 'Extensão completa de quadril contra banda',
      joint: 'Coxofemoral',
    },
    progressions: ['Banda mais forte', 'Adicionar peso'],
    variations: ['Sem banda', 'Com barra', 'Unilateral'],
    commonMistakes: ['Hiperextender lombar', 'Não fazer squeeze no topo'],
    scientificSource: 'Bret Contreras EMG Study - T-Nation (2010)',
  },

  'high bar parallel squat': {
    name: 'Agachamento High Bar Paralelo',
    aliases: ['high bar squat', 'agachamento barra alta', 'olympic squat', 'squat paralelo'],
    primaryMuscles: ['quadríceps'],
    secondaryMuscles: ['glúteo', 'isquiotibiais', 'core'],
    movementPattern: 'agachamento',
    equipment: 'barra',
    difficulty: 'intermediário',
    biomechanics: {
      activation: '99.9% quadríceps médio / 189% pico (dados EMG Bret Contreras)',
      rom: 'Paralelo ou abaixo',
      joint: 'Joelhos + quadril + tornozelos',
    },
    progressions: ['Aumentar carga', 'Profundidade maior', 'Pausa'],
    variations: ['Full squat', 'Pause squat', 'Tempo squat'],
    commonMistakes: ['Joelhos colapsando', 'Boa day squat', 'Calcanhares elevando'],
    scientificSource: 'Bret Contreras EMG Study - T-Nation',
  },

  // ============================================================
  // CHARLES POLIQUIN - Olympic Coach Legend
  // ============================================================

  'one arm barbell shrug': {
    name: 'Encolhimento Unilateral com Barra',
    aliases: ['one arm shrug', 'poliquin shrug', 'encolhimento uma mao'],
    primaryMuscles: ['trapézio superior'],
    secondaryMuscles: ['antebraço', 'core'],
    movementPattern: 'elevação de escápula unilateral',
    equipment: 'barra + rack',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Trapézio 95% - maior ROM que bilateral',
      rom: 'Elevação completa com rotação',
      joint: 'Escápula',
    },
    progressions: ['Aumentar carga', 'Pausa no topo'],
    variations: ['No rack', 'Com halter', 'Com landmine'],
    commonMistakes: ['Girar o tronco', 'Amplitude incompleta'],
    scientificSource: 'Charles Poliquin - T-Nation "Poliquin\'s Top 20 Tips"',
  },

  'poliquin step up': {
    name: 'Step-Up Poliquin',
    aliases: ['petersen step up', 'poliquin step', 'step up vmo'],
    primaryMuscles: ['vasto medial', 'quadríceps'],
    secondaryMuscles: ['glúteo'],
    movementPattern: 'subida em caixa',
    equipment: 'caixa baixa (10-15cm)',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'VMO 90% - reabilitação e fortalecimento de joelho',
      rom: 'Curta amplitude focada em VMO',
      joint: 'Joelho',
    },
    progressions: ['Adicionar peso', 'Aumentar altura'],
    variations: ['Pé de apoio elevado', 'Com halteres'],
    commonMistakes: ['Impulsionar com pé de baixo', 'Altura muito alta'],
    scientificSource: 'Charles Poliquin - T-Nation',
  },

  '6-12-25 protocol': {
    name: 'Protocolo 6-12-25',
    aliases: ['poliquin triset', '6 12 25', 'tri set metabolico'],
    primaryMuscles: ['depende do grupo'],
    secondaryMuscles: ['metabolismo'],
    movementPattern: 'tri-set metabólico',
    equipment: 'variado',
    difficulty: 'avançado',
    biomechanics: {
      activation: 'Todas as fibras - tipo I, IIa e IIb',
      rom: 'Três exercícios sem descanso',
      joint: 'Depende dos exercícios',
    },
    progressions: ['Aumentar cargas', 'Reduzir descanso'],
    variations: ['Para pernas', 'Para peito', 'Para costas'],
    commonMistakes: ['Descansar entre exercícios', 'Peso muito pesado no 25'],
    scientificSource: 'Charles Poliquin - T-Nation',
  },

  'incline prone dumbbell curl': {
    name: 'Rosca Inclinada Pronada (Spider Curl)',
    aliases: ['spider curl', 'preacher curl inclinado', 'rosca aranha'],
    primaryMuscles: ['bíceps braquial'],
    secondaryMuscles: ['braquial'],
    movementPattern: 'flexão de cotovelo com suporte',
    equipment: 'banco inclinado + halteres',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Bíceps 92% - pico de contração máximo',
      rom: 'Flexão completa contra gravidade',
      joint: 'Cotovelo',
    },
    progressions: ['Aumentar carga', 'Pausa no pico'],
    variations: ['Com halteres', 'Com barra EZ', 'Unilateral'],
    commonMistakes: ['Usar impulso', 'Não ir até extensão completa'],
    scientificSource: 'Charles Poliquin - T-Nation "Bigger Stronger Arms"',
  },

  // ============================================================
  // CHAD WATERBURY - High Frequency Training
  // ============================================================

  '10x3 training': {
    name: 'Treino 10x3 (Waterbury Method)',
    aliases: ['waterbury method', 'metodo waterbury', '10 sets 3 reps'],
    primaryMuscles: ['depende do exercício'],
    secondaryMuscles: ['sistema nervoso'],
    movementPattern: 'força neurológica',
    equipment: 'variado',
    difficulty: 'avançado',
    biomechanics: {
      activation: 'Recrutamento máximo de unidades motoras',
      rom: 'Amplitude completa com carga alta',
      joint: 'Depende do exercício',
    },
    progressions: ['Aumentar carga mantendo velocidade'],
    variations: ['Para força', 'Para potência'],
    commonMistakes: ['Descanso muito curto', 'Perder velocidade nas últimas séries'],
    scientificSource: 'Chad Waterbury - T-Nation "The Waterbury Method"',
  },

  'wide grip dip': {
    name: 'Mergulho Pegada Larga',
    aliases: ['wide dip', 'chest dip wide', 'mergulho aberto'],
    primaryMuscles: ['peitoral maior'],
    secondaryMuscles: ['deltóide anterior', 'tríceps'],
    movementPattern: 'empurrar vertical para baixo',
    equipment: 'paralelas largas',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Peitoral 88% - maior que pegada fechada',
      rom: 'Profundo com inclinação de tronco',
      joint: 'Ombro + cotovelo',
    },
    progressions: ['Adicionar peso', 'Cadência lenta'],
    variations: ['Com peso', 'Negativas', 'Assistido'],
    commonMistakes: ['Não inclinar tronco', 'Amplitude curta'],
    scientificSource: 'Chad Waterbury - T-Nation "Total Body Training"',
  },

  'high frequency pull up': {
    name: 'Pull-Up de Alta Frequência',
    aliases: ['grease the groove', 'gtg pullup', 'pullup diario'],
    primaryMuscles: ['latíssimo do dorso'],
    secondaryMuscles: ['bíceps', 'romboides', 'trapézio'],
    movementPattern: 'puxada vertical',
    equipment: 'barra fixa',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Adaptação neurológica por frequência',
      rom: 'Completa - de extensão total a queixo acima da barra',
      joint: 'Ombro + cotovelo + escápula',
    },
    progressions: ['Adicionar 1 rep por dia', 'Adicionar peso'],
    variations: ['Pronada', 'Supinada', 'Neutra'],
    commonMistakes: ['Ir até a falha', 'Não deixar recuperar'],
    scientificSource: 'Chad Waterbury - T-Nation "High Frequency Training"',
  },

  // ============================================================
  // TC LUOMA - Exercises You've Never Tried
  // ============================================================

  'one arm deadlift': {
    name: 'Levantamento Terra Unilateral',
    aliases: ['single arm deadlift', 'one arm dl', 'terra uma mao'],
    primaryMuscles: ['isquiotibiais', 'glúteo', 'core'],
    secondaryMuscles: ['oblíquos', 'trapézio', 'antebraço'],
    movementPattern: 'hip hinge anti-rotação',
    equipment: 'barra ou halter',
    difficulty: 'avançado',
    biomechanics: {
      activation: 'Core 95% + posterior chain - anti-rotação intensa',
      rom: 'Deadlift completo com um braço só',
      joint: 'Quadril + core + grip',
    },
    progressions: ['Iniciar com halter', 'Evoluir para barra'],
    variations: ['Com barra', 'Com halter', 'Com trap bar'],
    commonMistakes: ['Girar o tronco', 'Arredondar lombar'],
    scientificSource: 'TC Luoma - T-Nation "Exercises You\'ve Never Tried"',
  },

  'leg press 30 reps': {
    name: 'Leg Press Alto Volume (30 Reps)',
    aliases: ['leg press high rep', 'leg press metabolico', 'leg press 30'],
    primaryMuscles: ['quadríceps'],
    secondaryMuscles: ['glúteo', 'isquiotibiais'],
    movementPattern: 'agachamento na máquina',
    equipment: 'leg press',
    difficulty: 'avançado',
    biomechanics: {
      activation: 'Falha metabólica + hipertrofia',
      rom: 'Amplitude completa sem travar joelhos',
      joint: 'Joelhos + quadril',
    },
    progressions: ['Aumentar carga mantendo 30 reps'],
    variations: ['Pés altos', 'Pés baixos', 'Pés neutros'],
    commonMistakes: ['Parar antes da falha', 'Travar joelhos'],
    scientificSource: 'TC Luoma - T-Nation "Ultimate Leg Press Workout"',
  },

  // ============================================================
  // JIM WENDLER - 5/3/1 Assistance
  // ============================================================

  'boring but big': {
    name: 'BBB - Boring But Big (5x10)',
    aliases: ['bbb', 'boring but big', '5x10 wendler'],
    primaryMuscles: ['depende do exercício principal'],
    secondaryMuscles: ['hipertrofia geral'],
    movementPattern: 'volume após trabalho de força',
    equipment: 'barra',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Hipertrofia + volume após força',
      rom: 'Mesmo exercício principal com 50-60% 1RM',
      joint: 'Depende do lift',
    },
    progressions: ['Aumentar % gradualmente'],
    variations: ['Same lift', 'Opposite lift', 'Variations'],
    commonMistakes: ['Peso muito pesado', 'Não completar 5x10'],
    scientificSource: 'Jim Wendler - T-Nation 5/3/1',
  },

  'joker sets': {
    name: 'Joker Sets',
    aliases: ['joker set', 'jokers', 'sets extras wendler'],
    primaryMuscles: ['depende do exercício'],
    secondaryMuscles: ['força máxima'],
    movementPattern: 'séries extras pesadas',
    equipment: 'barra',
    difficulty: 'avançado',
    biomechanics: {
      activation: 'PR potenciais após AMRAP',
      rom: 'Mesmo movimento principal',
      joint: 'Depende do lift',
    },
    progressions: ['Adicionar 5-10% por set'],
    variations: ['Singles', 'Doubles', 'Triples'],
    commonMistakes: ['Usar toda sessão', 'Não estar pronto'],
    scientificSource: 'Jim Wendler - T-Nation 5/3/1 Beyond',
  },

  // ============================================================
  // EXERCÍCIOS CLÁSSICOS DO T-NATION
  // ============================================================

  'renegade row': {
    name: 'Remada Renegade',
    aliases: ['renegade row', 'plank row', 'remada em prancha'],
    primaryMuscles: ['latíssimo do dorso', 'core'],
    secondaryMuscles: ['bíceps', 'deltóide posterior', 'oblíquos'],
    movementPattern: 'puxada horizontal anti-rotação',
    equipment: 'halteres ou kettlebells',
    difficulty: 'avançado',
    biomechanics: {
      activation: 'Core 90% + lat - estabilização máxima',
      rom: 'Remada alternada em posição de prancha',
      joint: 'Ombro + cotovelo + core',
    },
    progressions: ['Aumentar carga', 'Adicionar pushup'],
    variations: ['Com pushup', 'Pés largos', 'Pés juntos'],
    commonMistakes: ['Quadril girando', 'Não estabilizar core'],
    scientificSource: 'T-Nation - Dr. Joel Seedman',
  },

  'pullover': {
    name: 'Pullover',
    aliases: ['dumbbell pullover', 'pullover com halter', 'pull over'],
    primaryMuscles: ['latíssimo do dorso', 'peitoral maior'],
    secondaryMuscles: ['serrátil anterior', 'tríceps'],
    movementPattern: 'extensão de ombro deitado',
    equipment: 'halter ou barra EZ',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Lat + peitoral - único exercício que trabalha ambos',
      rom: 'De trás da cabeça até acima do peito',
      joint: 'Ombro',
    },
    progressions: ['Aumentar carga', 'Cross-bench'],
    variations: ['No banco reto', 'Cross-bench', 'Na máquina'],
    commonMistakes: ['Dobrar demais os cotovelos', 'Amplitude excessiva'],
    scientificSource: 'T-Nation - Underrated Exercises',
  },

  'single arm plank': {
    name: 'Prancha Unilateral',
    aliases: ['one arm plank', 'prancha um braco', 'single arm plank hold'],
    primaryMuscles: ['core', 'oblíquos'],
    secondaryMuscles: ['ombros', 'glúteo'],
    movementPattern: 'anti-rotação isométrica',
    equipment: 'corpo livre',
    difficulty: 'avançado',
    biomechanics: {
      activation: 'Core 100% - melhor exercício de core segundo Seedman',
      rom: 'Isométrico - manter posição',
      joint: 'Core + ombro',
    },
    progressions: ['Aumentar tempo', 'Adicionar movimento'],
    variations: ['Braço estendido', 'Braço sob corpo', 'Com elevação de perna'],
    commonMistakes: ['Quadril caindo', 'Girar o tronco'],
    scientificSource: 'T-Nation - Dr. Joel Seedman "Best Core Exercise"',
  },

  'z press': {
    name: 'Z Press',
    aliases: ['z press', 'seated floor press', 'press sentado no chao'],
    primaryMuscles: ['deltóide anterior', 'deltóide medial'],
    secondaryMuscles: ['tríceps', 'core'],
    movementPattern: 'empurrar vertical sem apoio',
    equipment: 'barra ou halteres',
    difficulty: 'avançado',
    biomechanics: {
      activation: 'Deltóides + core máximo - sem compensação de pernas',
      rom: 'Overhead press sentado no chão',
      joint: 'Ombro + cotovelo',
    },
    progressions: ['Aumentar carga gradualmente'],
    variations: ['Com barra', 'Com halteres', 'Com kettlebells'],
    commonMistakes: ['Inclinar para trás', 'Não manter postura'],
    scientificSource: 'T-Nation',
  },

  'zercher squat': {
    name: 'Agachamento Zercher',
    aliases: ['zercher squat', 'agachamento zercher', 'zercher'],
    primaryMuscles: ['quadríceps', 'glúteo'],
    secondaryMuscles: ['bíceps', 'core', 'lombar'],
    movementPattern: 'agachamento frontal diferenciado',
    equipment: 'barra',
    difficulty: 'avançado',
    biomechanics: {
      activation: 'Quads + core intenso - barra na dobra dos cotovelos',
      rom: 'Agachamento profundo possível',
      joint: 'Joelhos + quadril + cotovelos',
    },
    progressions: ['Aumentar carga', 'Adicionar pausa'],
    variations: ['Do rack', 'Do chão', 'Com pausa'],
    commonMistakes: ['Inclinar demais', 'Barra machucando cotovelos'],
    scientificSource: 'T-Nation',
  },

  'trap bar deadlift': {
    name: 'Levantamento Terra na Trap Bar',
    aliases: ['trap bar deadlift', 'hex bar deadlift', 'terra hexagonal'],
    primaryMuscles: ['quadríceps', 'isquiotibiais', 'glúteo'],
    secondaryMuscles: ['trapézio', 'lombar', 'core'],
    movementPattern: 'híbrido agachamento/deadlift',
    equipment: 'trap bar (hexagonal)',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Menor stress lombar que convencional',
      rom: 'Similar ao deadlift com centro de gravidade melhor',
      joint: 'Joelhos + quadril',
    },
    progressions: ['Aumentar carga', 'Déficit', 'Jump shrug'],
    variations: ['High handles', 'Low handles', 'Com salto'],
    commonMistakes: ['Usar como agachamento', 'Não travar no topo'],
    scientificSource: 'T-Nation',
  },

  'landmine press': {
    name: 'Press na Landmine',
    aliases: ['landmine press', 'press landmine', 'press angular'],
    primaryMuscles: ['deltóide anterior', 'peitoral superior'],
    secondaryMuscles: ['tríceps', 'serrátil anterior'],
    movementPattern: 'empurrar diagonal',
    equipment: 'barra + landmine',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Deltóide + peitoral superior - ombro-friendly',
      rom: 'Press em arco natural',
      joint: 'Ombro + cotovelo',
    },
    progressions: ['Aumentar carga', 'Versão unilateral'],
    variations: ['Bilateral', 'Unilateral', 'Ajoelhado'],
    commonMistakes: ['Usar demais o peitoral', 'Não controlar descida'],
    scientificSource: 'T-Nation',
  },

  'landmine row': {
    name: 'Remada na Landmine',
    aliases: ['landmine row', 'remada landmine', 't-bar row landmine'],
    primaryMuscles: ['latíssimo do dorso'],
    secondaryMuscles: ['bíceps', 'trapézio', 'romboides'],
    movementPattern: 'puxada horizontal',
    equipment: 'barra + landmine',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Lat 88% - arco natural de movimento',
      rom: 'Puxada completa com cotovelos junto ao corpo',
      joint: 'Ombro + cotovelo',
    },
    progressions: ['Aumentar carga', 'Unilateral'],
    variations: ['Bilateral', 'Unilateral', 'Com alça V'],
    commonMistakes: ['Usar impulso', 'Cotovelos abrindo'],
    scientificSource: 'T-Nation',
  },

  'floor press': {
    name: 'Supino no Chão',
    aliases: ['floor press', 'supino no chao', 'press no chao'],
    primaryMuscles: ['peitoral maior', 'tríceps'],
    secondaryMuscles: ['deltóide anterior'],
    movementPattern: 'empurrar horizontal limitado',
    equipment: 'barra ou halteres',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Tríceps 85% + peitoral - elimina impulso de pernas',
      rom: 'Limitado pelo chão - protege ombros',
      joint: 'Ombro + cotovelo',
    },
    progressions: ['Aumentar carga', 'Pausa no chão'],
    variations: ['Com barra', 'Com halteres', 'Close grip'],
    commonMistakes: ['Deixar cotovelos batendo forte', 'Não pausar'],
    scientificSource: 'T-Nation - Westside Barbell',
  },

  'deficit deadlift': {
    name: 'Levantamento Terra em Déficit',
    aliases: ['deficit deadlift', 'terra deficit', 'deadlift elevado'],
    primaryMuscles: ['isquiotibiais', 'glúteo', 'lombar'],
    secondaryMuscles: ['quadríceps', 'trapézio'],
    movementPattern: 'hip hinge com ROM aumentado',
    equipment: 'barra + plataforma',
    difficulty: 'avançado',
    biomechanics: {
      activation: 'Posterior chain 95% - força na saída do chão',
      rom: 'Aumentado em 2-4 polegadas',
      joint: 'Quadril + joelhos',
    },
    progressions: ['Aumentar déficit gradualmente'],
    variations: ['1 polegada', '2 polegadas', '4 polegadas'],
    commonMistakes: ['Déficit muito alto', 'Arredondar lombar'],
    scientificSource: 'T-Nation - Powerlifting',
  },

  'paused squat': {
    name: 'Agachamento com Pausa',
    aliases: ['pause squat', 'squat pausa', 'agachamento pausado'],
    primaryMuscles: ['quadríceps', 'glúteo'],
    secondaryMuscles: ['core', 'isquiotibiais'],
    movementPattern: 'agachamento com isométrico',
    equipment: 'barra',
    difficulty: 'avançado',
    biomechanics: {
      activation: 'Elimina reflexo de estiramento - força pura',
      rom: 'Completo com pausa de 2-3s no fundo',
      joint: 'Joelhos + quadril',
    },
    progressions: ['Aumentar tempo de pausa', 'Aumentar carga'],
    variations: ['Pausa no fundo', 'Pausa paralelo', 'Double pause'],
    commonMistakes: ['Pausa muito curta', 'Relaxar no fundo'],
    scientificSource: 'T-Nation',
  },

  'tempo squat': {
    name: 'Agachamento Tempo',
    aliases: ['tempo squat', 'squat controlado', 'agachamento lento'],
    primaryMuscles: ['quadríceps', 'glúteo'],
    secondaryMuscles: ['core', 'isquiotibiais'],
    movementPattern: 'agachamento com cadência controlada',
    equipment: 'barra',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'TUT aumentado - hipertrofia máxima',
      rom: 'Completo com cadência 4-1-2-0',
      joint: 'Joelhos + quadril',
    },
    progressions: ['Aumentar tempo negativo', 'Aumentar carga'],
    variations: ['3-1-3-0', '4-2-2-0', '5-0-1-0'],
    commonMistakes: ['Perder o tempo', 'Peso muito pesado'],
    scientificSource: 'T-Nation - Charles Poliquin',
  },

  // ============================================================
  // PEITO - T-NATION DEEP DIVE (Thibaudeau, Waterbury, etc.)
  // ============================================================

  'flye press': {
    name: 'Flye Press (Crucifixo-Supino)',
    aliases: ['flye press', 'fly press', 'crucifixo supino', 'hybrid fly', 'squeeze press'],
    primaryMuscles: ['peitoral maior'],
    secondaryMuscles: ['deltóide anterior', 'tríceps'],
    movementPattern: 'empurrar + adução horizontal',
    equipment: 'halteres',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Maximiza dano muscular + ativação mTOR - melhor que supino para peito',
      rom: 'Combina abertura de crucifixo com empurrar do supino',
      joint: 'Ombro + cotovelo',
    },
    progressions: ['Aumentar carga', 'Cadência lenta', 'Pausa no alongamento'],
    variations: ['Inclinado', 'Declinado', 'No banco reto'],
    commonMistakes: ['Fazer só crucifixo', 'Fazer só supino', 'Peso muito pesado'],
    scientificSource: 'Christian Thibaudeau - T-Nation "Flye Press: Best Chest Exercise Ever?"',
  },

  't-bench fly': {
    name: 'Crucifixo T-Bench',
    aliases: ['t bench fly', 't-bench dumbbell fly', 'crucifixo em T', 'bridge fly'],
    primaryMuscles: ['peitoral maior'],
    secondaryMuscles: ['deltóide anterior', 'glúteo', 'core'],
    movementPattern: 'adução horizontal com ponte',
    equipment: 'halteres + banco',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Ombros travados na escápula - protege articulação + ativa glúteo',
      rom: 'Crucifixo com quadril em ponte (formato T)',
      joint: 'Ombro + quadril',
    },
    progressions: ['Aumentar carga', 'Pausa no alongamento'],
    variations: ['Com ponte alta', 'Com ponte baixa'],
    commonMistakes: ['Não manter ponte', 'Ombros para frente'],
    scientificSource: 'T-Nation - Functional Training',
  },

  'decline bench press': {
    name: 'Supino Declinado',
    aliases: ['decline bench', 'supino declinado', 'decline press', 'bench declinado'],
    primaryMuscles: ['peitoral maior inferior'],
    secondaryMuscles: ['tríceps', 'deltóide anterior'],
    movementPattern: 'empurrar horizontal declinado',
    equipment: 'barra + banco declinado',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Diminui contribuição do deltóide - mais peitoral para braços curtos',
      rom: 'Supino em ângulo de -15 a -30 graus',
      joint: 'Ombro + cotovelo',
    },
    progressions: ['Aumentar carga', 'Com halteres'],
    variations: ['Com barra', 'Com halteres', 'Close grip'],
    commonMistakes: ['Ângulo muito íngreme', 'Não ter segurança'],
    scientificSource: 'T-Nation "Not the King of Exercises: Bench Press"',
  },

  'cable crossover unilateral': {
    name: 'Crossover de Cabo Unilateral',
    aliases: ['single arm cable fly', 'crossover unilateral', 'cabo cruzado uma mao'],
    primaryMuscles: ['peitoral maior'],
    secondaryMuscles: ['deltóide anterior', 'serrátil anterior'],
    movementPattern: 'adução horizontal unilateral',
    equipment: 'cabo/polia',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Escápula retraída - squeeze máximo no esterno',
      rom: 'Maior que bilateral - cruza linha média do corpo',
      joint: 'Ombro',
    },
    progressions: ['Aumentar carga', 'Pausas no pico'],
    variations: ['Alto para baixo', 'Baixo para alto', 'Horizontal'],
    commonMistakes: ['Não retrair escápula', 'Usar momentum'],
    scientificSource: 'T-Nation Forums - Chest Training',
  },

  'machine chest fly': {
    name: 'Peck Deck (Voador)',
    aliases: ['pec deck', 'peck deck', 'voador', 'machine fly', 'butterfly'],
    primaryMuscles: ['peitoral maior'],
    secondaryMuscles: ['deltóide anterior'],
    movementPattern: 'adução horizontal na máquina',
    equipment: 'máquina peck deck',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Mais seguro que crucifixo livre - sem risco de ombro',
      rom: 'Controlado pela máquina - squeeze no centro',
      joint: 'Ombro',
    },
    progressions: ['Aumentar carga', 'Drop sets', 'Cadência lenta'],
    variations: ['Braços retos', 'Cotovelos dobrados'],
    commonMistakes: ['Peso muito pesado', 'Não pausar no centro'],
    scientificSource: 'T-Nation - Bodybuilding Exercises',
  },

  // ============================================================
  // OMBROS - T-NATION (Lateral Raise, Overhead Press)
  // ============================================================

  'lateral raise correta': {
    name: 'Elevação Lateral (Técnica Correta)',
    aliases: ['lateral raise', 'elevacao lateral', 'abdução de ombro', 'side raise'],
    primaryMuscles: ['deltóide medial'],
    secondaryMuscles: ['trapézio superior', 'deltóide anterior'],
    movementPattern: 'abdução de ombro',
    equipment: 'halteres',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Deltóide lateral máximo com polegar levemente para BAIXO no topo',
      rom: 'Até ombro - cotovelo sempre acima do punho no topo',
      joint: 'Ombro (glenoumeral)',
    },
    progressions: ['Aumentar carga', 'Pausas no topo', 'Excêntrico lento'],
    variations: ['Sentado', 'Em pé', 'No cabo', 'Inclinado lateral'],
    commonMistakes: ['Polegar para cima no topo', 'Punho acima do cotovelo', 'Usar trapézio'],
    scientificSource: 'T-Nation "Complete Guide to Shoulder Training"',
  },

  'mclean lateral raise': {
    name: 'Elevação Lateral McLean',
    aliases: ['mclean raise', 'mclean lateral', 'leaning lateral raise'],
    primaryMuscles: ['deltóide medial'],
    secondaryMuscles: ['trapézio'],
    movementPattern: 'abdução de ombro inclinada',
    equipment: 'halter + suporte',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Deltóide lateral isolado - elimina impulso corporal',
      rom: 'Inclinado segurando em algo - aumenta tensão constante',
      joint: 'Ombro',
    },
    progressions: ['Aumentar carga', 'Pausas'],
    variations: ['Inclinado para frente', 'Inclinado para lado'],
    commonMistakes: ['Não inclinar o suficiente', 'Usar impulso'],
    scientificSource: 'T-Nation "Best Shoulder Exercises Youve Never Seen"',
  },

  'delt triad': {
    name: 'Tríade de Deltóides',
    aliases: ['delt triad', 'shoulder triad', 'triade ombros', 'delt superset'],
    primaryMuscles: ['deltóide anterior', 'deltóide medial', 'deltóide posterior'],
    secondaryMuscles: ['trapézio', 'tríceps'],
    movementPattern: 'tri-set de ombros',
    equipment: 'halteres',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Todas as 3 cabeças do deltóide em sequência',
      rom: 'Lateral 12-15 + Frontal 12-15 + Press 12-15',
      joint: 'Ombro',
    },
    progressions: ['Aumentar carga', 'Reduzir descanso'],
    variations: ['Ordem diferente', 'Com cabos'],
    commonMistakes: ['Descansar muito entre exercícios', 'Pular uma cabeça'],
    scientificSource: 'T-Nation "The Delt Triad"',
  },

  'overhead press strict': {
    name: 'Press Overhead Estrito',
    aliases: ['strict press', 'military press', 'press militar', 'ohp', 'shoulder press'],
    primaryMuscles: ['deltóide anterior', 'deltóide medial'],
    secondaryMuscles: ['tríceps', 'trapézio', 'core'],
    movementPattern: 'empurrar vertical',
    equipment: 'barra',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Deltóides 85% - sem impulso de pernas',
      rom: 'Do queixo até lockout overhead',
      joint: 'Ombro + cotovelo',
    },
    progressions: ['4x6-10', '5x5', '3x8-12'],
    variations: ['Com barra', 'Com halteres', 'Push press', 'Z press'],
    commonMistakes: ['Usar impulso de pernas', 'Hiperextender lombar', 'Barra na frente do rosto'],
    scientificSource: 'T-Nation "Complete Guide to Shoulder Training"',
  },

  'pre exhaust shoulders': {
    name: 'Pré-Exaustão de Ombros',
    aliases: ['pre exhaust deltoid', 'pre exaustao ombros', 'shoulder pre exhaust'],
    primaryMuscles: ['deltóide medial', 'deltóide anterior'],
    secondaryMuscles: ['tríceps'],
    movementPattern: 'isolamento + composto em sequência',
    equipment: 'barra + halteres',
    difficulty: 'avançado',
    biomechanics: {
      activation: 'Fadiga deltóide antes do press - máxima ativação',
      rom: 'Press estrito → Lateral raise → Press solto',
      joint: 'Ombro + cotovelo',
    },
    progressions: ['Aumentar carga do press'],
    variations: ['Com diferentes ordens'],
    commonMistakes: ['Descansar entre exercícios', 'Peso muito leve no isolamento'],
    scientificSource: 'T-Nation - Classic Pre-Exhaust Method',
  },

  // ============================================================
  // TRAPÉZIO - T-NATION (Farmer Walk Combos, Deadlift Shrugs)
  // ============================================================

  'farmer walk shrug combo': {
    name: 'Farmer Walk + Shrug Combo',
    aliases: ['farmer shrug', 'walk shrug', 'caminhada com encolhimento'],
    primaryMuscles: ['trapézio'],
    secondaryMuscles: ['antebraço', 'core', 'ombros'],
    movementPattern: 'carregamento + encolhimento',
    equipment: 'halteres ou farmer handles',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Trap burn do inferno - TUT extremo',
      rom: '20m walk com shrug leve → 5 shrugs 3s hold → repetir',
      joint: 'Ombro (elevação escapular) + todo corpo',
    },
    progressions: ['Aumentar distância', 'Aumentar peso', 'Mais shrugs'],
    variations: ['50-60% do peso normal de farmer walk'],
    commonMistakes: ['Peso muito pesado', 'Não segurar no topo do shrug'],
    scientificSource: 'T-Nation "The Best Way to Build Traps"',
  },

  'trap bar deadlift shrug': {
    name: 'Deadlift-Shrug na Trap Bar',
    aliases: ['deadlift shrug', 'terra com encolhimento', 'trap bar shrug'],
    primaryMuscles: ['trapézio', 'isquiotibiais', 'glúteo'],
    secondaryMuscles: ['lombar', 'quadríceps', 'core'],
    movementPattern: 'hip hinge + encolhimento',
    equipment: 'trap bar (hexagonal)',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Isométrico + concêntrico + excêntrico do trapézio',
      rom: 'Deadlift completo → 3-5 shrugs no topo com 1s hold cada',
      joint: 'Quadril + ombros',
    },
    progressions: ['Aumentar carga', 'Mais shrugs por set'],
    variations: ['Com barra convencional', 'Só shrugs no topo'],
    commonMistakes: ['Não pausar no topo', 'Momentum nos shrugs'],
    scientificSource: 'T-Nation "Tip: For Big Traps, Do the Deadlift-Shrug"',
  },

  'power clean': {
    name: 'Power Clean (Arremesso)',
    aliases: ['power clean', 'clean', 'arremesso', 'arranque'],
    primaryMuscles: ['trapézio', 'quadríceps', 'glúteo'],
    secondaryMuscles: ['isquiotibiais', 'deltóides', 'bíceps', 'core'],
    movementPattern: 'puxada explosiva olímpica',
    equipment: 'barra olímpica',
    difficulty: 'avançado',
    biomechanics: {
      activation: 'Trapézio máximo no shrug explosivo - melhor exercício para trap total',
      rom: 'Do chão até front rack em movimento explosivo',
      joint: 'Quadril + joelhos + ombros + cotovelos',
    },
    progressions: ['Hang clean', 'Power clean', 'Full clean'],
    variations: ['Do chão', 'Hang', 'Block'],
    commonMistakes: ['Puxar com os braços', 'Não fazer extensão tripla', 'Não receber corretamente'],
    scientificSource: 'T-Nation "Total Trap Training" - 4-5 sets trabalhando até 3RM',
  },

  'snatch grip deadlift': {
    name: 'Levantamento Terra Pegada Snatch',
    aliases: ['snatch grip deadlift', 'terra snatch', 'wide grip deadlift'],
    primaryMuscles: ['trapézio superior', 'isquiotibiais', 'glúteo'],
    secondaryMuscles: ['lombar', 'latíssimo do dorso', 'romboides'],
    movementPattern: 'hip hinge com pegada larga',
    equipment: 'barra olímpica',
    difficulty: 'avançado',
    biomechanics: {
      activation: 'Trapézio superior overdrive - TUT muito maior que shrugs',
      rom: 'Deadlift com pegada larga (snatch width) - maior ROM',
      joint: 'Quadril + ombros',
    },
    progressions: ['Aumentar carga gradualmente'],
    variations: ['Déficit', 'Paused', 'Tempo'],
    commonMistakes: ['Pegada muito larga', 'Arredondar costas', 'Não manter trapézio ativo'],
    scientificSource: 'T-Nation - Trap Training',
  },

  'one arm barbell shrug': {
    name: 'Encolhimento de Ombros Unilateral na Barra',
    aliases: ['one arm shrug', 'landmine shrug', 'encolhimento unilateral'],
    primaryMuscles: ['trapézio'],
    secondaryMuscles: ['oblíquos', 'antebraço'],
    movementPattern: 'elevação escapular unilateral',
    equipment: 'barra + landmine',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Trapézio unilateral com anti-flexão lateral',
      rom: 'Encolhimento com rotação natural da escápula',
      joint: 'Escapulotorácica',
    },
    progressions: ['Aumentar carga', 'Pausas no topo'],
    variations: ['Na landmine', 'Com barra em T'],
    commonMistakes: ['Usar momentum', 'Não pausar no topo'],
    scientificSource: 'T-Nation - Charles Poliquin',
  },

  // ============================================================
  // CORE - T-NATION (Pallof Press, Ab Rollout, Anti-Rotation)
  // ============================================================

  'pallof press': {
    name: 'Pallof Press',
    aliases: ['pallof', 'anti rotation press', 'press anti rotacao', 'cable anti rotation'],
    primaryMuscles: ['oblíquos', 'transverso abdominal'],
    secondaryMuscles: ['reto abdominal', 'eretores da espinha'],
    movementPattern: 'anti-rotação',
    equipment: 'cabo/polia ou elástico',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Core anti-rotação - estabilização funcional máxima',
      rom: 'Estender braços resistindo rotação do tronco',
      joint: 'Coluna (estabilização)',
    },
    progressions: ['Aumentar peso', 'Mais tempo', 'Ajoelhado', 'Single leg'],
    variations: ['Em pé', 'Ajoelhado', 'Half-kneeling', 'Single leg'],
    commonMistakes: ['Girar o tronco', 'Braços muito dobrados', 'Peso muito leve'],
    scientificSource: 'T-Nation "Do the Pallof Press for a Strong Core" - John Pallof',
  },

  'vertical pallof press': {
    name: 'Pallof Press Vertical',
    aliases: ['linear pallof', 'overhead pallof', 'pallof vertical'],
    primaryMuscles: ['core', 'oblíquos'],
    secondaryMuscles: ['deltóides', 'serrátil anterior'],
    movementPattern: 'anti-extensão + anti-rotação',
    equipment: 'cabo/polia',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Como ab rollout em pé - anti-extensão vertical',
      rom: 'Estender braços para cima resistindo extensão lombar',
      joint: 'Coluna + ombros',
    },
    progressions: ['Aumentar peso', 'Mais tempo sob tensão'],
    variations: ['Ajoelhado', 'Em pé'],
    commonMistakes: ['Arquear lombar', 'Não manter core contraído'],
    scientificSource: 'T-Nation "Vertical Pallof Press"',
  },

  'ab rollout': {
    name: 'Rollout Abdominal',
    aliases: ['ab wheel', 'roda abdominal', 'ab rollout', 'wheel rollout'],
    primaryMuscles: ['reto abdominal'],
    secondaryMuscles: ['oblíquos', 'latíssimo do dorso', 'serrátil anterior'],
    movementPattern: 'anti-extensão dinâmico',
    equipment: 'roda abdominal ou barra',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Rei dos exercícios anti-extensão - carga excêntrica intensa',
      rom: 'Estender corpo resistindo extensão lombar até limite',
      joint: 'Ombros + coluna (estabilização)',
    },
    progressions: ['Ajoelhado → Em pé', 'Com banda', 'Com colete', 'Hamstring-activated'],
    variations: ['Ajoelhado', 'Em pé', 'Com barra', 'Single arm'],
    commonMistakes: ['Deixar lombar cair', 'Não contrair glúteo', 'Amplitude muito curta'],
    scientificSource: 'T-Nation "Adamantium Abs: 6 Core Exercises You Need"',
  },

  'dead bug': {
    name: 'Dead Bug (Inseto Morto)',
    aliases: ['dead bug', 'inseto morto', 'bicho morto'],
    primaryMuscles: ['reto abdominal', 'transverso abdominal'],
    secondaryMuscles: ['oblíquos', 'flexores de quadril'],
    movementPattern: 'anti-extensão com movimento',
    equipment: 'corpo livre',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Core anti-extensão com movimento contralateral',
      rom: 'Estender braço e perna opostos mantendo lombar no chão',
      joint: 'Coluna + quadril + ombros',
    },
    progressions: ['Com elástico', 'Com peso', 'Cadência lenta'],
    variations: ['Básico', 'Com kettlebell', 'Com elástico', 'Banded'],
    commonMistakes: ['Lombar saindo do chão', 'Movimento rápido demais'],
    scientificSource: 'T-Nation - Core Training for Lifters',
  },

  'side plank': {
    name: 'Prancha Lateral',
    aliases: ['side plank', 'prancha lateral', 'plank lateral'],
    primaryMuscles: ['oblíquos', 'quadrado lombar'],
    secondaryMuscles: ['glúteo médio', 'core'],
    movementPattern: 'anti-flexão lateral isométrica',
    equipment: 'corpo livre',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Anti-flexão lateral - oblíquos + quadrado lombar',
      rom: 'Isométrico - manter alinhamento lateral',
      joint: 'Coluna lateral',
    },
    progressions: ['Aumentar tempo', 'Adicionar elevação de quadril', 'Com peso'],
    variations: ['Básico', 'Com elevação', 'Star side plank', 'Copenhagen plank'],
    commonMistakes: ['Quadril caindo', 'Não alinhar corpo'],
    scientificSource: 'T-Nation "Total Core Training for Lifters"',
  },

  'half kneeling chop': {
    name: 'Chop Ajoelhado',
    aliases: ['half kneeling chop', 'cable chop', 'chop no cabo'],
    primaryMuscles: ['oblíquos'],
    secondaryMuscles: ['core', 'deltóides', 'latíssimo do dorso'],
    movementPattern: 'rotação resistida',
    equipment: 'cabo/polia',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Anti-rotação dinâmica - movimento diagonal',
      rom: 'De cima para baixo em diagonal cruzando corpo',
      joint: 'Coluna + ombros',
    },
    progressions: ['Aumentar carga', 'Velocidade controlada'],
    variations: ['Alto para baixo', 'Baixo para alto (lift)', 'Em pé'],
    commonMistakes: ['Girar demais o tronco', 'Usar só braços'],
    scientificSource: 'T-Nation "Core Training"',
  },

  // ============================================================
  // ISQUIOTIBIAIS - T-NATION (Nordic, GHR, RDL)
  // ============================================================

  'nordic curl': {
    name: 'Nordic Curl (Rosca Nórdica)',
    aliases: ['nordic hamstring curl', 'nordic curl', 'rosca nordica', 'natural ghr'],
    primaryMuscles: ['isquiotibiais'],
    secondaryMuscles: ['glúteo', 'panturrilha'],
    movementPattern: 'flexão de joelho excêntrica',
    equipment: 'corpo livre + suporte para pés',
    difficulty: 'avançado',
    biomechanics: {
      activation: 'Semitendinoso > bíceps femoral - excêntrico intenso',
      rom: 'Controlar descida com joelhos no chão',
      joint: 'Joelho',
    },
    progressions: ['Negativas apenas', 'Com banda assistida', 'Full nordic'],
    variations: ['Assistido', 'Negativo apenas', 'Com banda'],
    commonMistakes: ['Dobrar no quadril', 'Não controlar excêntrico', 'Pular a fase difícil'],
    scientificSource: 'T-Nation Research + PubMed Hamstring Activation Studies',
  },

  'glute ham raise': {
    name: 'Glute-Ham Raise (GHR)',
    aliases: ['ghr', 'glute ham raise', 'glute ham developer', 'ghd raise'],
    primaryMuscles: ['isquiotibiais'],
    secondaryMuscles: ['glúteo', 'eretores da espinha'],
    movementPattern: 'flexão de joelho + extensão de quadril',
    equipment: 'máquina GHD',
    difficulty: 'avançado',
    biomechanics: {
      activation: 'Ativação máxima de isquiotibiais - superior a leg curl',
      rom: 'Joelhos no pad - maior ROM que nordic',
      joint: 'Joelho + quadril',
    },
    progressions: ['Negativas', 'Sem peso', 'Com peso', 'Com banda'],
    variations: ['Só negativo', 'Com peso no peito', 'Com banda'],
    commonMistakes: ['Usar muito impulso', 'Não controlar o excêntrico'],
    scientificSource: 'T-Nation "4 Hamstring Exercises for Athletic Performance"',
  },

  'romanian deadlift': {
    name: 'Levantamento Terra Romeno',
    aliases: ['rdl', 'romanian deadlift', 'stiff leg deadlift', 'terra romeno'],
    primaryMuscles: ['isquiotibiais'],
    secondaryMuscles: ['glúteo', 'lombar'],
    movementPattern: 'hip hinge',
    equipment: 'barra ou halteres',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Isquiotibiais máximo na fase excêntrica - superior para hipertrofia',
      rom: 'Até sentir alongamento máximo de isquios',
      joint: 'Quadril (hinge)',
    },
    progressions: ['Aumentar carga', 'Déficit', 'Single leg'],
    variations: ['Com barra', 'Com halteres', 'Unilateral', 'Com déficit'],
    commonMistakes: ['Arredondar lombar', 'Dobrar joelhos demais', 'Descer pouco'],
    scientificSource: 'T-Nation + PubMed "Hamstring Activation During Various Exercises"',
  },

  'single leg rdl': {
    name: 'Levantamento Terra Romeno Unilateral',
    aliases: ['single leg rdl', 'one leg rdl', 'rdl unilateral', 'terra romeno uma perna'],
    primaryMuscles: ['isquiotibiais', 'glúteo'],
    secondaryMuscles: ['lombar', 'core'],
    movementPattern: 'hip hinge unilateral',
    equipment: 'halter ou kettlebell',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Isquios + glúteo com estabilização unilateral',
      rom: 'Hinge com perna de trás estendendo para equilíbrio',
      joint: 'Quadril',
    },
    progressions: ['Aumentar carga', 'Sem apoio', 'Com déficit'],
    variations: ['Contralateral', 'Ipsilateral', 'B-stance'],
    commonMistakes: ['Girar quadril', 'Perder equilíbrio', 'ROM curto'],
    scientificSource: 'T-Nation - Ben Bruno',
  },

  'stability ball hamstring curl': {
    name: 'Leg Curl na Bola Suíça',
    aliases: ['swiss ball curl', 'ball hamstring curl', 'leg curl bola'],
    primaryMuscles: ['isquiotibiais'],
    secondaryMuscles: ['glúteo', 'core'],
    movementPattern: 'flexão de joelho instável',
    equipment: 'bola suíça',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Isquios + core - estabilização dinâmica',
      rom: 'Puxar bola com calcanhares em ponte',
      joint: 'Joelho + quadril',
    },
    progressions: ['Bilateral', 'Single leg', 'Com pausa'],
    variations: ['Bilateral', 'Unilateral', 'Com elevação de quadril'],
    commonMistakes: ['Quadril caindo', 'Não estender quadril'],
    scientificSource: 'T-Nation "Hamstring Exercise Research"',
  },

  'seated leg curl': {
    name: 'Leg Curl Sentado',
    aliases: ['seated hamstring curl', 'leg curl sentado', 'flexora sentado'],
    primaryMuscles: ['isquiotibiais'],
    secondaryMuscles: ['panturrilha'],
    movementPattern: 'flexão de joelho isolada',
    equipment: 'máquina leg curl',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Isquiotibiais em posição alongada de quadril',
      rom: 'Flexão completa do joelho',
      joint: 'Joelho',
    },
    progressions: ['Aumentar carga', 'Excêntrico lento', 'Unilateral'],
    variations: ['Bilateral', 'Unilateral', 'Drop sets'],
    commonMistakes: ['Levantar glúteo do assento', 'Peso muito pesado'],
    scientificSource: 'T-Nation - Leg Training',
  },

  'lying leg curl': {
    name: 'Leg Curl Deitado',
    aliases: ['lying hamstring curl', 'leg curl deitado', 'flexora deitado', 'prone curl'],
    primaryMuscles: ['isquiotibiais'],
    secondaryMuscles: ['panturrilha'],
    movementPattern: 'flexão de joelho isolada',
    equipment: 'máquina leg curl',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Bíceps femoral em posição de quadril neutro',
      rom: 'Flexão completa do joelho deitado',
      joint: 'Joelho',
    },
    progressions: ['Aumentar carga', 'Cadência lenta', 'Drop sets'],
    variations: ['Bilateral', 'Unilateral', 'Com pausa'],
    commonMistakes: ['Levantar quadril', 'Usar impulso', 'Amplitude parcial'],
    scientificSource: 'T-Nation - Hamstring Research',
  },

  // ============================================================
  // QUADRÍCEPS - T-NATION (Sissy Squat, Hack Squat, Leg Press)
  // ============================================================

  'sissy squat': {
    name: 'Agachamento Sissy',
    aliases: ['sissy squat', 'agachamento sissy', 'sissy'],
    primaryMuscles: ['quadríceps', 'reto femoral'],
    secondaryMuscles: ['core', 'flexores de quadril'],
    movementPattern: 'extensão de joelho com quadril estendido',
    equipment: 'corpo livre ou pad sissy',
    difficulty: 'avançado',
    biomechanics: {
      activation: 'Reto femoral em alongamento máximo - único exercício que trabalha assim',
      rom: 'Joelhos para frente, tronco inclinado para trás',
      joint: 'Joelhos (extensão extrema)',
    },
    progressions: ['Assistido', 'Livre', 'Com peso', 'Com halter'],
    variations: ['No pad', 'Livre segurando algo', 'Com peso no peito'],
    commonMistakes: ['Flexionar quadril', 'Não ir fundo', 'Perder equilíbrio'],
    scientificSource: 'T-Nation "The Forgotten Exercise for Big Quads"',
  },

  'gironda hack slide': {
    name: 'Hack Slide Gironda',
    aliases: ['gironda hack', 'hack squat gironda', 'vince gironda hack'],
    primaryMuscles: ['quadríceps'],
    secondaryMuscles: ['glúteo'],
    movementPattern: 'agachamento hack modificado',
    equipment: 'máquina hack squat',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Quads isolados - calcanhares juntos, na ponta dos pés',
      rom: 'Joelhos para fora na descida, quadris altos',
      joint: 'Joelhos',
    },
    progressions: ['Aumentar carga', 'Cadência lenta'],
    variations: ['Calcanhares juntos', 'Stance estreito'],
    commonMistakes: ['Calcanhares no chão', 'Joelhos para dentro'],
    scientificSource: 'T-Nation "Bulk Up, Cut Up: Quads and Tris" - Vince Gironda',
  },

  'narrow stance hack squat': {
    name: 'Hack Squat Estreito',
    aliases: ['narrow hack', 'hack squat estreito', 'close stance hack'],
    primaryMuscles: ['quadríceps'],
    secondaryMuscles: ['glúteo'],
    movementPattern: 'agachamento hack com pés juntos',
    equipment: 'máquina hack squat',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Vasto lateral e medial - ênfase diferente do stance normal',
      rom: 'Agachamento profundo com pés juntos',
      joint: 'Joelhos + quadril',
    },
    progressions: ['Aumentar carga', 'Pausas no fundo'],
    variations: ['Pés totalmente juntos', 'Pés levemente separados'],
    commonMistakes: ['Joelhos colapsando', 'Não ir fundo'],
    scientificSource: 'T-Nation - Quad Training',
  },

  'leg press': {
    name: 'Leg Press',
    aliases: ['leg press', 'prensa de pernas', 'press de perna'],
    primaryMuscles: ['quadríceps'],
    secondaryMuscles: ['glúteo', 'isquiotibiais'],
    movementPattern: 'empurrar com pernas',
    equipment: 'máquina leg press',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Varia com posição dos pés - baixo = mais quads',
      rom: 'Controlado pela máquina - profundidade ajustável',
      joint: 'Joelhos + quadril',
    },
    progressions: ['Aumentar carga', 'Unilateral', 'Diferentes posições'],
    variations: ['Pés altos', 'Pés baixos', 'Stance largo', 'Unilateral'],
    commonMistakes: ['Lombar sair do encosto', 'Travar joelhos', 'Amplitude muito curta'],
    scientificSource: 'T-Nation "Make These 4 Leg Machines Work Even Better"',
  },

  'hack squat': {
    name: 'Hack Squat',
    aliases: ['hack squat', 'agachamento hack', 'hack'],
    primaryMuscles: ['quadríceps'],
    secondaryMuscles: ['glúteo', 'isquiotibiais'],
    movementPattern: 'agachamento guiado',
    equipment: 'máquina hack squat',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Quads 85% - menor stress lombar que back squat',
      rom: 'Agachamento profundo com costas apoiadas',
      joint: 'Joelhos + quadril',
    },
    progressions: ['Aumentar carga', 'Pausas', 'Tempo'],
    variations: ['Stance largo', 'Stance estreito', 'Pés altos', 'Pés baixos'],
    commonMistakes: ['Joelhos colapsando', 'Não ir paralelo', 'Travar joelhos'],
    scientificSource: 'T-Nation - Leg Training',
  },

  'leg extension': {
    name: 'Extensão de Pernas (Cadeira Extensora)',
    aliases: ['leg extension', 'cadeira extensora', 'extensora', 'knee extension'],
    primaryMuscles: ['quadríceps'],
    secondaryMuscles: [],
    movementPattern: 'extensão de joelho isolada',
    equipment: 'máquina extensora',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Reto femoral pode ser treinado adequadamente aqui',
      rom: 'Extensão completa do joelho sentado',
      joint: 'Joelho',
    },
    progressions: ['Aumentar carga', 'Unilateral', 'Excêntrico lento'],
    variations: ['Bilateral', 'Unilateral', 'Pausa no topo', 'Drop sets'],
    commonMistakes: ['Usar impulso', 'Não estender completamente', 'Peso muito pesado'],
    scientificSource: 'T-Nation "The Forgotten Exercise for Big Quads"',
  },

  // ============================================================
  // BÍCEPS - T-NATION (Curls, Preacher, Concentration)
  // ============================================================

  'preacher curl': {
    name: 'Rosca Scott (Preacher Curl)',
    aliases: ['preacher curl', 'rosca scott', 'scott curl', 'banco scott'],
    primaryMuscles: ['bíceps braquial'],
    secondaryMuscles: ['braquial', 'braquiorradial'],
    movementPattern: 'flexão de cotovelo com suporte',
    equipment: 'banco scott + barra ou halteres',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Cabeça longa do bíceps - alongamento no início do movimento',
      rom: 'Extensão completa importante - hipertrofia distal do bíceps',
      joint: 'Cotovelo',
    },
    progressions: ['Aumentar carga', 'Unilateral', 'Excêntrico lento'],
    variations: ['Com barra EZ', 'Com halteres', 'Unilateral', 'Com cabo'],
    commonMistakes: ['Não estender completamente', 'Usar impulso do corpo', 'Peso muito pesado'],
    scientificSource: 'T-Nation "The 10 Best Biceps Training Tips"',
  },

  'concentration curl': {
    name: 'Rosca Concentrada',
    aliases: ['concentration curl', 'rosca concentrada', 'curl concentrado'],
    primaryMuscles: ['bíceps braquial'],
    secondaryMuscles: ['braquial'],
    movementPattern: 'flexão de cotovelo isolada',
    equipment: 'halter',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Bíceps isolado - impossível fazer "cheat" - cotovelo contra coxa',
      rom: 'Flexão completa com contração no pico',
      joint: 'Cotovelo',
    },
    progressions: ['Aumentar carga', 'Pausa no topo', 'Excêntrico lento'],
    variations: ['Sentado', 'Em pé inclinado', 'Com parede'],
    commonMistakes: ['Mover o cotovelo', 'Peso muito pesado', 'Não contrair no topo'],
    scientificSource: 'T-Nation "How to Build Dangerous Biceps"',
  },

  'hammer curl': {
    name: 'Rosca Martelo',
    aliases: ['hammer curl', 'rosca martelo', 'curl martelo', 'neutral grip curl'],
    primaryMuscles: ['braquial', 'braquiorradial'],
    secondaryMuscles: ['bíceps braquial'],
    movementPattern: 'flexão de cotovelo grip neutro',
    equipment: 'halteres',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Braquial > bíceps - gera mais força de flexão do cotovelo',
      rom: 'Flexão completa com grip neutro (polegar para cima)',
      joint: 'Cotovelo',
    },
    progressions: ['Aumentar carga', 'Cross-body', 'Alternado'],
    variations: ['Alternado', 'Simultâneo', 'Cross-body', 'No cabo com corda'],
    commonMistakes: ['Girar o punho', 'Usar impulso', 'Cotovelos se movendo'],
    scientificSource: 'T-Nation - "Start biceps work with hammer curls"',
  },

  'incline dumbbell curl': {
    name: 'Rosca Inclinada',
    aliases: ['incline curl', 'rosca inclinada', 'incline dumbbell curl'],
    primaryMuscles: ['bíceps braquial'],
    secondaryMuscles: ['braquial'],
    movementPattern: 'flexão de cotovelo em alongamento',
    equipment: 'halteres + banco inclinado',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Cabeça longa do bíceps - máximo alongamento na posição inicial',
      rom: 'Braços pendurados para trás - maior ROM possível',
      joint: 'Cotovelo',
    },
    progressions: ['Aumentar carga', 'Cadência lenta', 'Drop sets'],
    variations: ['45 graus', '30 graus', 'Alternado', 'Simultâneo'],
    commonMistakes: ['Inclinar muito o banco', 'Mover ombros para frente', 'Peso muito pesado'],
    scientificSource: 'T-Nation - Biceps Training',
  },

  'spider curl': {
    name: 'Rosca Spider',
    aliases: ['spider curl', 'rosca spider', 'rosca aranha'],
    primaryMuscles: ['bíceps braquial'],
    secondaryMuscles: ['braquial'],
    movementPattern: 'flexão de cotovelo em contração',
    equipment: 'halteres ou barra EZ + banco inclinado',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Bíceps na contração máxima - oposto da incline curl',
      rom: 'Deitado de bruços no banco inclinado - braços pendurados',
      joint: 'Cotovelo',
    },
    progressions: ['Aumentar carga', 'Pausas no topo'],
    variations: ['Com halteres', 'Com barra EZ', 'No banco preacher invertido'],
    commonMistakes: ['Usar impulso', 'Não contrair no pico'],
    scientificSource: 'T-Nation - Alternative to preacher curls',
  },

  'barbell curl': {
    name: 'Rosca Direta com Barra',
    aliases: ['barbell curl', 'rosca direta', 'standing curl', 'curl com barra'],
    primaryMuscles: ['bíceps braquial'],
    secondaryMuscles: ['braquial', 'braquiorradial', 'deltóide anterior'],
    movementPattern: 'flexão de cotovelo em pé',
    equipment: 'barra reta ou EZ',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Bíceps bilateral - permite cargas pesadas',
      rom: 'Flexão completa do cotovelo',
      joint: 'Cotovelo',
    },
    progressions: ['Aumentar carga', 'Cheat curls controlados', 'Cadência lenta'],
    variations: ['Barra reta', 'Barra EZ', 'Wide grip', 'Close grip'],
    commonMistakes: ['Usar muito impulso', 'Cotovelos se movendo para frente', 'ROM incompleto'],
    scientificSource: 'T-Nation - "Finish with heavy barbell curls when biceps are pumped"',
  },

  'cable curl': {
    name: 'Rosca no Cabo',
    aliases: ['cable curl', 'rosca no cabo', 'curl no cabo', 'cable bicep curl'],
    primaryMuscles: ['bíceps braquial'],
    secondaryMuscles: ['braquial'],
    movementPattern: 'flexão de cotovelo com tensão constante',
    equipment: 'cabo/polia',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Tensão constante em todo ROM - diferente de pesos livres',
      rom: 'Flexão completa do cotovelo',
      joint: 'Cotovelo',
    },
    progressions: ['Aumentar carga', 'Unilateral', 'Drop sets'],
    variations: ['Barra reta', 'Barra EZ', 'Corda', 'Unilateral'],
    commonMistakes: ['Ficar muito longe da polia', 'Usar impulso'],
    scientificSource: 'T-Nation - Cable Training',
  },

  // ============================================================
  // TRÍCEPS - T-NATION (Skullcrusher, Pushdown, Dip)
  // ============================================================

  'skullcrusher': {
    name: 'Tríceps Testa (Skullcrusher)',
    aliases: ['skull crusher', 'skullcrusher', 'triceps testa', 'lying triceps extension', 'french press'],
    primaryMuscles: ['tríceps'],
    secondaryMuscles: ['antebraço'],
    movementPattern: 'extensão de cotovelo deitado',
    equipment: 'barra EZ ou halteres',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Cabeça longa do tríceps - alongamento profundo - mais subestimado',
      rom: 'Extensão completa - barra desce até testa ou atrás da cabeça',
      joint: 'Cotovelo',
    },
    progressions: ['Aumentar carga', 'Cadência lenta', 'Para trás da cabeça'],
    variations: ['Com barra EZ', 'Com halteres', 'No banco inclinado', 'Para trás da cabeça'],
    commonMistakes: ['Cotovelos abrindo', 'ROM curto', 'Peso muito pesado'],
    scientificSource: 'T-Nation - "Skull crushers are the most famous triceps exercise"',
  },

  'triceps pushdown': {
    name: 'Tríceps Pushdown (Puxada de Tríceps)',
    aliases: ['triceps pushdown', 'pushdown', 'triceps puxada', 'cable pushdown'],
    primaryMuscles: ['tríceps'],
    secondaryMuscles: [],
    movementPattern: 'extensão de cotovelo no cabo',
    equipment: 'cabo/polia',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '74% ativação com corda - espalhar no fundo aumenta',
      rom: 'Extensão completa do cotovelo',
      joint: 'Cotovelo',
    },
    progressions: ['Aumentar carga', 'Unilateral', 'Drop sets'],
    variations: ['Corda', 'Barra reta', 'Barra V', 'Unilateral'],
    commonMistakes: ['Cotovelos se movendo', 'Inclinar demais', 'ROM incompleto'],
    scientificSource: 'T-Nation "The Very Best Way to Build Triceps"',
  },

  'rope triceps pushdown': {
    name: 'Tríceps na Corda',
    aliases: ['rope pushdown', 'triceps corda', 'rope tricep extension'],
    primaryMuscles: ['tríceps'],
    secondaryMuscles: [],
    movementPattern: 'extensão de cotovelo com rotação',
    equipment: 'cabo/polia + corda',
    difficulty: 'iniciante',
    biomechanics: {
      activation: '74% ativação - espalhar a corda no fundo ativa mais',
      rom: 'Extensão completa com rotação externa no fundo',
      joint: 'Cotovelo',
    },
    progressions: ['Aumentar carga', 'Pausas na extensão'],
    variations: ['Overhead', 'Pushdown', 'Unilateral'],
    commonMistakes: ['Não espalhar a corda no fundo', 'Cotovelos se movendo'],
    scientificSource: 'T-Nation - Triceps Training',
  },

  'close grip bench press': {
    name: 'Supino Pegada Fechada',
    aliases: ['close grip bench', 'supino fechado', 'cgbp', 'close grip press'],
    primaryMuscles: ['tríceps'],
    secondaryMuscles: ['peitoral maior', 'deltóide anterior'],
    movementPattern: 'empurrar horizontal fechado',
    equipment: 'barra + banco',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Tríceps composto - permite cargas pesadas',
      rom: 'Supino com mãos na largura dos ombros ou mais fechadas',
      joint: 'Cotovelo + ombro',
    },
    progressions: ['Aumentar carga', 'Pausas', 'Tempo'],
    variations: ['Com pausa', 'No Smith', 'No floor press'],
    commonMistakes: ['Pegada muito fechada', 'Cotovelos muito abertos', 'Bouncing'],
    scientificSource: 'T-Nation - Triceps vs Skullcrushers forum discussion',
  },

  'triceps dip': {
    name: 'Mergulho de Tríceps',
    aliases: ['tricep dip', 'dip triceps', 'mergulho', 'parallel bar dip'],
    primaryMuscles: ['tríceps'],
    secondaryMuscles: ['peitoral maior', 'deltóide anterior'],
    movementPattern: 'empurrar vertical para baixo',
    equipment: 'paralelas',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Cabeça medial e lateral - composto eficiente para tríceps',
      rom: 'Cotovelos para trás, tronco ereto - foco em tríceps',
      joint: 'Cotovelo + ombro',
    },
    progressions: ['Peso corporal', 'Com peso', 'Cadência lenta'],
    variations: ['Corpo ereto (tríceps)', 'Inclinado (peito)', 'Com peso', 'Assistido'],
    commonMistakes: ['Inclinar demais (vira exercício de peito)', 'Não descer o suficiente'],
    scientificSource: 'T-Nation - "Dips are third most effective triceps exercise"',
  },

  'overhead triceps extension': {
    name: 'Extensão de Tríceps Overhead',
    aliases: ['overhead extension', 'french press overhead', 'triceps overhead', 'extensao triceps acima'],
    primaryMuscles: ['tríceps'],
    secondaryMuscles: ['ombros'],
    movementPattern: 'extensão de cotovelo overhead',
    equipment: 'halter, barra EZ ou cabo',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Cabeça longa do tríceps em alongamento máximo',
      rom: 'Extensão overhead - maior alongamento possível',
      joint: 'Cotovelo',
    },
    progressions: ['Aumentar carga', 'Unilateral', 'No cabo'],
    variations: ['Com halter', 'Com barra EZ', 'No cabo', 'Unilateral'],
    commonMistakes: ['Cotovelos abrindo', 'Usar ombros', 'ROM curto'],
    scientificSource: 'T-Nation - Triceps Long Head Training',
  },

  'diamond pushup': {
    name: 'Flexão Diamante',
    aliases: ['diamond pushup', 'flexao diamante', 'close grip pushup', 'triangle pushup'],
    primaryMuscles: ['tríceps'],
    secondaryMuscles: ['peitoral maior', 'deltóide anterior'],
    movementPattern: 'empurrar horizontal corpo livre',
    equipment: 'corpo livre',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Tríceps 90%+ - mãos formando diamante',
      rom: 'Flexão completa com mãos juntas',
      joint: 'Cotovelo + ombro',
    },
    progressions: ['Aumentar reps', 'Com elevação de pés', 'Com colete'],
    variations: ['No chão', 'Elevado', 'Com colete', 'Declinado'],
    commonMistakes: ['Cotovelos muito abertos', 'Quadril caindo', 'ROM incompleto'],
    scientificSource: 'T-Nation - Bodyweight Triceps',
  },

  // ============================================================
  // PANTURRILHA - T-NATION
  // ============================================================

  'standing calf raise': {
    name: 'Elevação de Panturrilha em Pé',
    aliases: ['calf raise', 'panturrilha em pe', 'standing calf', 'gêmeos em pé'],
    primaryMuscles: ['gastrocnêmio'],
    secondaryMuscles: ['sóleo'],
    movementPattern: 'flexão plantar em pé',
    equipment: 'máquina ou step',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Gastrocnêmio - maior com joelhos estendidos',
      rom: 'Alongamento profundo → contração máxima na ponta dos pés',
      joint: 'Tornozelo',
    },
    progressions: ['Aumentar carga', 'Unilateral', 'Pausa no alongamento'],
    variations: ['Na máquina', 'No Smith', 'Unilateral', 'Com halter'],
    commonMistakes: ['ROM curto', 'Bouncing', 'Joelhos dobrados'],
    scientificSource: 'T-Nation - Calf Training',
  },

  'seated calf raise': {
    name: 'Elevação de Panturrilha Sentado',
    aliases: ['seated calf', 'panturrilha sentado', 'soleo', 'calf sentado'],
    primaryMuscles: ['sóleo'],
    secondaryMuscles: ['gastrocnêmio'],
    movementPattern: 'flexão plantar sentado',
    equipment: 'máquina calf sentado',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Sóleo - joelhos dobrados encurta gastrocnêmio',
      rom: 'Alongamento profundo → contração máxima',
      joint: 'Tornozelo',
    },
    progressions: ['Aumentar carga', 'Pausa no alongamento', 'Drop sets'],
    variations: ['Na máquina', 'Com barra nos joelhos'],
    commonMistakes: ['ROM curto', 'Peso muito leve', 'Bouncing'],
    scientificSource: 'T-Nation - Complete Calf Development',
  },

  'donkey calf raise': {
    name: 'Elevação de Panturrilha Burro',
    aliases: ['donkey calf', 'panturrilha burro', 'donkey raise'],
    primaryMuscles: ['gastrocnêmio'],
    secondaryMuscles: ['sóleo'],
    movementPattern: 'flexão plantar inclinado',
    equipment: 'máquina ou parceiro',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Gastrocnêmio em maior alongamento - quadril dobrado',
      rom: 'Maior ROM do que calf raise tradicional',
      joint: 'Tornozelo',
    },
    progressions: ['Aumentar carga', 'Pausas'],
    variations: ['Na máquina', 'Com parceiro', 'Na leg press'],
    commonMistakes: ['ROM curto', 'Joelhos dobrando'],
    scientificSource: 'T-Nation - Arnold Era Training',
  },

  // ============================================================
  // ANTEBRAÇO - T-NATION
  // ============================================================

  'wrist curl': {
    name: 'Rosca de Punho',
    aliases: ['wrist curl', 'rosca de punho', 'flexao de punho', 'forearm curl'],
    primaryMuscles: ['flexores do antebraço'],
    secondaryMuscles: [],
    movementPattern: 'flexão de punho',
    equipment: 'barra ou halteres',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Flexores do antebraço isolados',
      rom: 'Extensão → flexão completa do punho',
      joint: 'Punho',
    },
    progressions: ['Aumentar carga', 'Mais reps'],
    variations: ['Com barra', 'Com halteres', 'No cabo'],
    commonMistakes: ['Usar momentum', 'ROM curto'],
    scientificSource: 'T-Nation - Forearm Training',
  },

  'reverse wrist curl': {
    name: 'Rosca de Punho Reversa',
    aliases: ['reverse wrist curl', 'rosca de punho reversa', 'extensao de punho'],
    primaryMuscles: ['extensores do antebraço'],
    secondaryMuscles: [],
    movementPattern: 'extensão de punho',
    equipment: 'barra ou halteres',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Extensores do antebraço isolados',
      rom: 'Flexão → extensão completa do punho',
      joint: 'Punho',
    },
    progressions: ['Aumentar carga', 'Mais reps'],
    variations: ['Com barra', 'Com halteres'],
    commonMistakes: ['Peso muito pesado', 'ROM curto'],
    scientificSource: 'T-Nation - Forearm Training',
  },

  'reverse curl': {
    name: 'Rosca Reversa',
    aliases: ['reverse curl', 'rosca reversa', 'overhand curl'],
    primaryMuscles: ['braquiorradial', 'extensores do antebraço'],
    secondaryMuscles: ['bíceps braquial'],
    movementPattern: 'flexão de cotovelo pronada',
    equipment: 'barra ou halteres',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Braquiorradial + extensores - pegada pronada',
      rom: 'Flexão completa do cotovelo com palmas para baixo',
      joint: 'Cotovelo + punho',
    },
    progressions: ['Aumentar carga', 'Com barra EZ'],
    variations: ['Com barra reta', 'Com barra EZ', 'No cabo'],
    commonMistakes: ['Usar impulso', 'Punho dobrando'],
    scientificSource: 'T-Nation - Complete Arm Development',
  },

  // ============================================================
  // COSTAS - T-NATION DEEP DIVE (Pulldown, Rows, Pull-ups)
  // ============================================================

  'lat pulldown': {
    name: 'Puxada na Polia Alta (Lat Pulldown)',
    aliases: ['lat pulldown', 'puxada alta', 'pulldown', 'puxada frontal'],
    primaryMuscles: ['latíssimo do dorso'],
    secondaryMuscles: ['bíceps', 'romboides', 'trapézio inferior'],
    movementPattern: 'puxada vertical',
    equipment: 'cabo/polia',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Lat isolado - 75% do peso corporal indica capacidade para pull-up',
      rom: 'De cima até abaixo do queixo com escápula retraída',
      joint: 'Ombro + cotovelo',
    },
    progressions: ['Aumentar carga', 'Diferentes pegadas', 'Unilateral'],
    variations: ['Wide grip', 'Close grip', 'Supinada', 'Neutra', 'Unilateral'],
    commonMistakes: ['Puxar com os braços', 'Inclinar demais para trás', 'ROM incompleto'],
    scientificSource: 'T-Nation "Best of Back" - pulldowns podem ser excelentes para lat pump',
  },

  'kneeling lat pulldown': {
    name: 'Lat Pulldown Ajoelhado',
    aliases: ['kneeling pulldown', 'pulldown ajoelhado', 'cable pulldown kneeling'],
    primaryMuscles: ['latíssimo do dorso'],
    secondaryMuscles: ['bíceps', 'romboides', 'glúteo'],
    movementPattern: 'puxada vertical com quadril em extensão',
    equipment: 'cabo/polia',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Lat + glúteo - quadril em extensão aumenta ativação',
      rom: 'Puxada completa ajoelhado no foam roller',
      joint: 'Ombro + cotovelo + quadril',
    },
    progressions: ['Aumentar carga', 'Single arm'],
    variations: ['Bilateral', 'Unilateral'],
    commonMistakes: ['Sentar nos calcanhares', 'Não manter extensão de quadril'],
    scientificSource: 'T-Nation - "Skip the seat and get on your knees"',
  },

  'chin up': {
    name: 'Barra Fixa Supinada (Chin-Up)',
    aliases: ['chin up', 'chinup', 'barra supinada', 'pull up supinado'],
    primaryMuscles: ['latíssimo do dorso', 'bíceps'],
    secondaryMuscles: ['romboides', 'trapézio inferior', 'core'],
    movementPattern: 'puxada vertical supinada',
    equipment: 'barra fixa',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Maior ativação de lat que pulldown - palmas viradas para você',
      rom: 'De braços estendidos até queixo acima da barra',
      joint: 'Ombro + cotovelo',
    },
    progressions: ['Assistido', 'Peso corporal', 'Com peso', 'Archer chin-up'],
    variations: ['Close grip', 'Wide grip', 'Com peso', 'Negative'],
    commonMistakes: ['Kipping', 'ROM incompleto', 'Não descer completamente'],
    scientificSource: 'T-Nation - "Chin-ups are one of the best overall back builders"',
  },

  'pull up': {
    name: 'Barra Fixa Pronada (Pull-Up)',
    aliases: ['pull up', 'pullup', 'barra fixa', 'dominada'],
    primaryMuscles: ['latíssimo do dorso'],
    secondaryMuscles: ['bíceps', 'romboides', 'trapézio inferior', 'core'],
    movementPattern: 'puxada vertical pronada',
    equipment: 'barra fixa',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Maior ativação de lat que pulldown - palmas viradas para frente',
      rom: 'De braços estendidos até queixo acima da barra',
      joint: 'Ombro + cotovelo',
    },
    progressions: ['Assistido', 'Peso corporal', 'Com peso', 'Muscle-up'],
    variations: ['Wide grip', 'Close grip', 'Com peso', 'Archer', 'L-sit'],
    commonMistakes: ['Kipping excessivo', 'ROM incompleto', 'Não descer completamente'],
    scientificSource: 'T-Nation EMG Study - "Greatest lat activation was found with pull-ups"',
  },

  'seated cable row': {
    name: 'Remada Sentado no Cabo',
    aliases: ['seated row', 'remada sentada', 'cable row', 'remada no cabo'],
    primaryMuscles: ['latíssimo do dorso', 'romboides'],
    secondaryMuscles: ['bíceps', 'trapézio médio', 'eretor da espinha'],
    movementPattern: 'puxada horizontal',
    equipment: 'cabo/polia',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Retração escapular + lat - usar wide grip para menos subscapularis',
      rom: 'Braços estendidos → barra no abdômen inferior',
      joint: 'Ombro + cotovelo',
    },
    progressions: ['Aumentar carga', 'Diferentes pegadas', 'Unilateral'],
    variations: ['Close grip', 'Wide grip', 'Rope', 'Unilateral'],
    commonMistakes: ['Usar impulso do tronco', 'Não retrair escápula', 'Arredondar costas'],
    scientificSource: 'T-Nation "Best of Back" - wide grip overhand reduz envolvimento de subscapularis',
  },

  'barbell row': {
    name: 'Remada Curvada com Barra',
    aliases: ['barbell row', 'bent over row', 'remada curvada', 'remada com barra'],
    primaryMuscles: ['latíssimo do dorso', 'romboides'],
    secondaryMuscles: ['bíceps', 'trapézio', 'eretor da espinha'],
    movementPattern: 'puxada horizontal livre',
    equipment: 'barra',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Costas completas - lat, romboides, trapézio médio',
      rom: 'Barra do chão até abdômen mantendo tronco inclinado',
      joint: 'Ombro + cotovelo + quadril (estabilização)',
    },
    progressions: ['Aumentar carga', 'Pendlay row', 'Yates row'],
    variations: ['Pronada', 'Supinada', 'Pendlay', 'Yates'],
    commonMistakes: ['Tronco subindo demais', 'Usar impulso', 'Arredondar lombar'],
    scientificSource: 'T-Nation - "9 Exercises for a Complete Back"',
  },

  'one arm dumbbell row': {
    name: 'Remada Unilateral com Halter',
    aliases: ['one arm row', 'dumbbell row', 'remada unilateral', 'remada com halter'],
    primaryMuscles: ['latíssimo do dorso'],
    secondaryMuscles: ['bíceps', 'romboides', 'trapézio'],
    movementPattern: 'puxada horizontal unilateral',
    equipment: 'halter + banco',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Lat unilateral com maior ROM - rotação do tronco permitida',
      rom: 'Braço estendido → cotovelo acima das costas',
      joint: 'Ombro + cotovelo',
    },
    progressions: ['Aumentar carga', 'Kroc rows', 'Meadows row'],
    variations: ['No banco', 'Em pé', 'Kroc row (alto rep)'],
    commonMistakes: ['Girar demais o tronco', 'Usar impulso', 'ROM curto'],
    scientificSource: 'T-Nation - Back Training',
  },

  'chest supported row': {
    name: 'Remada com Apoio de Peito',
    aliases: ['chest supported row', 'incline row', 'remada com apoio', 'seal row'],
    primaryMuscles: ['latíssimo do dorso', 'romboides'],
    secondaryMuscles: ['bíceps', 'trapézio médio'],
    movementPattern: 'puxada horizontal com suporte',
    equipment: 'halteres ou barra + banco inclinado',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Lat isolado - elimina momentum e stress lombar',
      rom: 'Braços estendidos → retração escapular completa',
      joint: 'Ombro + cotovelo',
    },
    progressions: ['Aumentar carga', 'Pausas', 'Unilateral'],
    variations: ['Com halteres', 'Com barra', 'Na máquina T-bar'],
    commonMistakes: ['Levantar peito do apoio', 'ROM curto'],
    scientificSource: 'T-Nation - "9 Exercises for a Complete Back"',
  },

  'inverted row': {
    name: 'Remada Invertida (Australian Pull-up)',
    aliases: ['inverted row', 'body row', 'australian pull up', 'remada invertida'],
    primaryMuscles: ['latíssimo do dorso', 'romboides'],
    secondaryMuscles: ['bíceps', 'trapézio', 'core'],
    movementPattern: 'puxada horizontal corpo livre',
    equipment: 'barra baixa ou TRX',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Similar ao bent-over row mas mais seguro para iniciantes',
      rom: 'Corpo reto → peito na barra',
      joint: 'Ombro + cotovelo',
    },
    progressions: ['Pés no chão', 'Pés elevados', 'Com colete', 'One arm'],
    variations: ['Pronada', 'Supinada', 'Wide grip', 'No TRX'],
    commonMistakes: ['Quadril caindo', 'ROM incompleto', 'Não tocar peito na barra'],
    scientificSource: 'T-Nation EMG - "High infraspinatus activation"',
  },

  'straight arm pulldown': {
    name: 'Pulldown Braços Retos',
    aliases: ['straight arm pulldown', 'stiff arm pulldown', 'pullover no cabo'],
    primaryMuscles: ['latíssimo do dorso'],
    secondaryMuscles: ['peitoral maior', 'tríceps', 'core'],
    movementPattern: 'extensão de ombro no cabo',
    equipment: 'cabo/polia',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Lat isolado sem envolvimento de bíceps',
      rom: 'Braços acima da cabeça → coxas com cotovelos retos',
      joint: 'Ombro',
    },
    progressions: ['Aumentar carga', 'Cadência lenta'],
    variations: ['Com barra', 'Com corda', 'Unilateral'],
    commonMistakes: ['Dobrar cotovelos', 'Usar impulso', 'ROM curto'],
    scientificSource: 'T-Nation - Dani Shugart',
  },

  // ============================================================
  // DELTÓIDE POSTERIOR - T-NATION
  // ============================================================

  'face pull': {
    name: 'Face Pull',
    aliases: ['face pull', 'puxada facial', 'cable face pull'],
    primaryMuscles: ['deltóide posterior', 'trapézio médio'],
    secondaryMuscles: ['romboides', 'infraespinhal', 'redondo menor'],
    movementPattern: 'puxada horizontal + rotação externa',
    equipment: 'cabo/polia + corda',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Deltóide posterior + rotadores externos - saúde do ombro',
      rom: 'Puxar corda até altura do rosto com rotação externa',
      joint: 'Ombro (rotação externa + abdução horizontal)',
    },
    progressions: ['Aumentar carga', 'Pausas', 'Single arm'],
    variations: ['Em pé', 'Sentado', 'Inclinado', 'Com band'],
    commonMistakes: ['Cotovelos baixos (vira row)', 'Encolher ombros', 'Não fazer rotação externa'],
    scientificSource: 'T-Nation - "Face Pulls target rear delts, traps, and rotator cuff"',
  },

  'bent over reverse fly': {
    name: 'Crucifixo Invertido Curvado',
    aliases: ['reverse fly', 'bent over fly', 'crucifixo invertido', 'rear delt fly'],
    primaryMuscles: ['deltóide posterior'],
    secondaryMuscles: ['trapézio médio', 'romboides'],
    movementPattern: 'abdução horizontal curvado',
    equipment: 'halteres',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Deltóide posterior isolado - evitar retração escapular no início',
      rom: 'Braços para baixo → abdução horizontal mantendo cotovelos leves',
      joint: 'Ombro',
    },
    progressions: ['Aumentar carga', 'Pausas no topo', 'No cabo'],
    variations: ['Em pé curvado', 'Sentado', 'No cabo', 'Na máquina'],
    commonMistakes: ['Usar trapézio em vez de deltóide', 'Cotovelos muito dobrados', 'Impulso do corpo'],
    scientificSource: 'T-Nation Forum - "Bent over reverse flyes for rear delt development"',
  },

  'cable rear delt fly': {
    name: 'Crucifixo Invertido no Cabo',
    aliases: ['cable reverse fly', 'cable rear delt', 'reverse cable fly'],
    primaryMuscles: ['deltóide posterior'],
    secondaryMuscles: ['trapézio médio', 'romboides'],
    movementPattern: 'abdução horizontal no cabo',
    equipment: 'cabo/polia',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Tensão constante no deltóide posterior',
      rom: 'Cruzar braços na frente → abduzir até linha dos ombros',
      joint: 'Ombro',
    },
    progressions: ['Aumentar carga', 'Pausas'],
    variations: ['Cruzado', 'Unilateral', 'Alto', 'Baixo'],
    commonMistakes: ['Usar trapézio', 'ROM incompleto'],
    scientificSource: 'T-Nation - "High cable flyes for rear delts"',
  },

  'machine reverse fly': {
    name: 'Peck Deck Invertido (Crucifixo Posterior)',
    aliases: ['reverse pec deck', 'machine rear delt', 'peck deck invertido'],
    primaryMuscles: ['deltóide posterior'],
    secondaryMuscles: ['trapézio médio', 'romboides'],
    movementPattern: 'abdução horizontal na máquina',
    equipment: 'máquina peck deck',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Deltóide posterior isolado - movimento guiado',
      rom: 'Controlado pela máquina - squeeze no final',
      joint: 'Ombro',
    },
    progressions: ['Aumentar carga', 'Drop sets', 'Pausas'],
    variations: ['Pronado', 'Neutro'],
    commonMistakes: ['Usar impulso', 'Não squeeze no final'],
    scientificSource: 'T-Nation - Machine Training',
  },

  // ============================================================
  // EXERCÍCIOS COMPOSTOS ESPECIAIS - T-NATION
  // ============================================================

  'clean and press': {
    name: 'Clean and Press (Arremesso e Press)',
    aliases: ['clean and press', 'clean press', 'arremesso e press'],
    primaryMuscles: ['deltóides', 'trapézio', 'quadríceps', 'glúteo'],
    secondaryMuscles: ['core', 'tríceps', 'isquiotibiais'],
    movementPattern: 'puxada explosiva + empurrar vertical',
    equipment: 'barra ou kettlebells',
    difficulty: 'avançado',
    biomechanics: {
      activation: 'Full body - explosão + força overhead',
      rom: 'Do chão até overhead em dois movimentos',
      joint: 'Quadril + joelhos + ombros + cotovelos',
    },
    progressions: ['Hang clean and press', 'Full clean and press'],
    variations: ['Com barra', 'Com kettlebells', 'Com halteres'],
    commonMistakes: ['Separar muito os movimentos', 'Não usar quadris no press'],
    scientificSource: 'T-Nation - Total Body Training',
  },

  'hang clean': {
    name: 'Hang Clean (Arremesso Suspenso)',
    aliases: ['hang clean', 'arremesso suspenso', 'clean do hang'],
    primaryMuscles: ['trapézio', 'quadríceps', 'glúteo'],
    secondaryMuscles: ['isquiotibiais', 'core', 'deltóides'],
    movementPattern: 'puxada explosiva do hang',
    equipment: 'barra olímpica',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Extensão tripla explosiva - quadril, joelhos, tornozelos',
      rom: 'Do hang (acima dos joelhos) até front rack',
      joint: 'Quadril + joelhos + ombros',
    },
    progressions: ['High hang', 'Above knee', 'Below knee'],
    variations: ['High hang', 'Low hang', 'Muscle clean'],
    commonMistakes: ['Puxar com braços', 'Não fazer extensão tripla', 'Não receber corretamente'],
    scientificSource: 'T-Nation - Olympic Lifting',
  },

  'thruster': {
    name: 'Thruster',
    aliases: ['thruster', 'squat press', 'agachamento com press'],
    primaryMuscles: ['quadríceps', 'glúteo', 'deltóides'],
    secondaryMuscles: ['tríceps', 'core', 'isquiotibiais'],
    movementPattern: 'agachamento + press em um movimento',
    equipment: 'barra ou kettlebells ou halteres',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Full body - potência de pernas transferida para press',
      rom: 'Agachamento frontal completo → press overhead usando momentum',
      joint: 'Joelhos + quadril + ombros',
    },
    progressions: ['Aumentar carga', 'Aumentar velocidade'],
    variations: ['Com barra', 'Com kettlebells', 'Com halteres', 'Single arm'],
    commonMistakes: ['Separar os movimentos', 'Não usar impulso das pernas', 'Press antes de estender'],
    scientificSource: 'T-Nation - CrossFit Exercises',
  },

  'push press': {
    name: 'Push Press',
    aliases: ['push press', 'press com impulso', 'power press'],
    primaryMuscles: ['deltóides', 'quadríceps'],
    secondaryMuscles: ['tríceps', 'glúteo', 'core'],
    movementPattern: 'empurrar vertical com impulso de pernas',
    equipment: 'barra ou halteres',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Deltóides + potência de pernas - permite cargas maiores que strict press',
      rom: 'Dip leve → extensão explosiva → press overhead',
      joint: 'Joelhos + quadril + ombros',
    },
    progressions: ['Strict press', 'Push press', 'Push jerk'],
    variations: ['Com barra', 'Com halteres', 'Com kettlebells'],
    commonMistakes: ['Dip muito profundo', 'Press antes de estender', 'Inclinar para trás'],
    scientificSource: 'T-Nation - Overhead Training',
  },

  'sumo deadlift': {
    name: 'Levantamento Terra Sumo',
    aliases: ['sumo deadlift', 'terra sumo', 'sumo'],
    primaryMuscles: ['quadríceps', 'glúteo', 'adutores'],
    secondaryMuscles: ['isquiotibiais', 'lombar', 'trapézio'],
    movementPattern: 'hip hinge com stance largo',
    equipment: 'barra',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Mais quadríceps e adutores que convencional - menor stress lombar',
      rom: 'ROM reduzido comparado ao convencional - vantagem mecânica',
      joint: 'Quadril + joelhos',
    },
    progressions: ['Aumentar carga', 'Paused', 'Déficit'],
    variations: ['Convencional', 'Semi-sumo', 'Déficit'],
    commonMistakes: ['Joelhos colapsando', 'Quadril subindo antes da barra', 'Stance muito largo'],
    scientificSource: 'T-Nation - Deadlift Variations',
  },

  'jefferson deadlift': {
    name: 'Levantamento Terra Jefferson',
    aliases: ['jefferson deadlift', 'terra jefferson', 'jefferson lift'],
    primaryMuscles: ['quadríceps', 'glúteo', 'adutores'],
    secondaryMuscles: ['isquiotibiais', 'lombar', 'oblíquos'],
    movementPattern: 'hip hinge assimétrico',
    equipment: 'barra',
    difficulty: 'avançado',
    biomechanics: {
      activation: 'Trabalho anti-rotacional intenso - assimetria funcional',
      rom: 'Barra passa entre as pernas',
      joint: 'Quadril + joelhos + core (anti-rotação)',
    },
    progressions: ['Aumentar carga gradualmente'],
    variations: ['Trocar lado de frente'],
    commonMistakes: ['Girar o tronco', 'Não alternar lados'],
    scientificSource: 'T-Nation - Unconventional Deadlifts',
  },

  // ============================================================
  // HIP THRUST VARIATIONS - BRET CONTRERAS
  // ============================================================

  'hip thrust unilateral': {
    name: 'Hip Thrust Unilateral',
    aliases: ['single leg hip thrust', 'hip thrust uma perna', 'elevacao pelvica unilateral'],
    primaryMuscles: ['glúteo máximo'],
    secondaryMuscles: ['isquiotibiais', 'core', 'glúteo médio'],
    movementPattern: 'extensão de quadril unilateral',
    equipment: 'banco + peso opcional',
    difficulty: 'intermediário',
    biomechanics: {
      activation: '95% glúteo máximo - maior que bilateral',
      rom: 'Extensão completa de quadril com uma perna',
      joint: 'Coxofemoral (quadril)',
    },
    progressions: ['Adicionar peso', 'Pausa no topo', 'Banda no joelho'],
    variations: ['Com halter', 'Com barra', 'Peso corporal'],
    commonMistakes: ['Quadril caindo para o lado', 'Não manter pelve neutra', 'Impulso excessivo'],
    scientificSource: 'Bret Contreras - "Best glute exercise for home workouts"',
  },

  'hip thrust com banda': {
    name: 'Hip Thrust com Banda',
    aliases: ['banded hip thrust', 'hip thrust band', 'elevacao pelvica elastico'],
    primaryMuscles: ['glúteo máximo', 'glúteo médio'],
    secondaryMuscles: ['isquiotibiais', 'core'],
    movementPattern: 'extensão de quadril com resistência variável',
    equipment: 'banco + banda elástica + barra opcional',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Glúteo máximo + abdução - tensão máxima no lockout',
      rom: 'Extensão completa com banda nos joelhos ativando glúteo médio',
      joint: 'Coxofemoral',
    },
    progressions: ['Banda mais forte', 'Adicionar barra', 'Pausa no topo'],
    variations: ['Banda só', 'Banda + barra', 'Banda nos joelhos'],
    commonMistakes: ['Joelhos colapsando', 'Não fazer squeeze no topo'],
    scientificSource: 'Bret Contreras - "Band tension is highest at top where glute activation is highest"',
  },

  'hip thrust pes elevados': {
    name: 'Hip Thrust com Pés Elevados',
    aliases: ['feet elevated hip thrust', 'hip thrust elevado', 'elevated hip thrust'],
    primaryMuscles: ['glúteo máximo', 'isquiotibiais'],
    secondaryMuscles: ['core'],
    movementPattern: 'extensão de quadril com ROM aumentado',
    equipment: 'banco + step/plataforma',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Maior ROM = maior ativação de isquiotibiais',
      rom: 'Extensão aumentada pela elevação dos pés',
      joint: 'Coxofemoral',
    },
    progressions: ['Aumentar altura', 'Adicionar peso', 'Versão unilateral'],
    variations: ['Altura baixa', 'Altura média', 'Altura alta'],
    commonMistakes: ['Pés muito elevados', 'Hiperextender lombar'],
    scientificSource: 'Bret Contreras - "Feet elevated has largest ROM variation"',
  },

  'tall kneeling hip thrust': {
    name: 'Hip Thrust Ajoelhado Alto',
    aliases: ['kneeling hip thrust', 'tall kneeling thrust', 'hip thrust de joelhos'],
    primaryMuscles: ['glúteo máximo'],
    secondaryMuscles: ['quadríceps', 'core'],
    movementPattern: 'extensão de quadril ajoelhado',
    equipment: 'cabo ou banda',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Isolamento de glúteo sem assistência de isquiotibiais',
      rom: 'Extensão de quadril partindo de flexão ajoelhado',
      joint: 'Coxofemoral',
    },
    progressions: ['Aumentar resistência', 'Pausas'],
    variations: ['Com cabo', 'Com banda', 'Com peso'],
    commonMistakes: ['Inclinar tronco', 'Não contrair glúteo no topo'],
    scientificSource: 'Bret Contreras - "High rep finisher for glutes"',
  },

  'hip thrust gluteo medio': {
    name: 'Hip Thrust para Glúteo Médio',
    aliases: ['glute medius hip thrust', 'abduction hip thrust', 'hip thrust abdução'],
    primaryMuscles: ['glúteo médio', 'glúteo máximo'],
    secondaryMuscles: ['tensor da fáscia lata', 'core'],
    movementPattern: 'extensão + abdução de quadril',
    equipment: 'banco + banda',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Glúteo médio 85% com abdução no topo',
      rom: 'Hip thrust + abduzir joelhos no lockout',
      joint: 'Coxofemoral',
    },
    progressions: ['Banda mais forte', 'Adicionar peso', 'Pausa com abdução'],
    variations: ['Com mini band', 'Com banda pesada'],
    commonMistakes: ['Não abduzir o suficiente', 'Perder extensão'],
    scientificSource: 'BC Strength - "The Glute Medius Hip Thrust"',
  },

  // ============================================================
  // EXERCÍCIOS UNILATERAIS DE PERNA - T-NATION
  // ============================================================

  'bulgarian split squat': {
    name: 'Agachamento Búlgaro',
    aliases: ['bulgarian squat', 'split squat elevado', 'agachamento bulgaro', 'rear foot elevated split squat'],
    primaryMuscles: ['quadríceps', 'glúteo'],
    secondaryMuscles: ['isquiotibiais', 'core', 'adutores'],
    movementPattern: 'agachamento unilateral',
    equipment: 'banco + halteres ou barra',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Quad 90% + Glúteo 85% - similar ao back squat com menos carga',
      rom: 'Joelho da perna de trás quase toca o chão',
      joint: 'Joelhos + quadril',
    },
    progressions: ['Peso corporal', 'Halteres', 'Barra', 'Déficit'],
    variations: ['Foco em quads (stance curto)', 'Foco em glúteos (stance longo)'],
    commonMistakes: ['Joelho passando muito do pé', 'Pé de trás muito longe', 'Inclinar demais'],
    scientificSource: 'T-Nation - "The 4 Mandatory One-Legged Exercises"',
  },

  'split squat': {
    name: 'Split Squat (Afundo Estático)',
    aliases: ['split squat', 'afundo estatico', 'lunge estatico'],
    primaryMuscles: ['quadríceps', 'glúteo'],
    secondaryMuscles: ['isquiotibiais', 'core'],
    movementPattern: 'agachamento dividido',
    equipment: 'corpo livre ou halteres',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Fundação para Bulgarian - quad e glúteo balanceados',
      rom: 'Joelho de trás desce até quase tocar o chão',
      joint: 'Joelhos + quadril',
    },
    progressions: ['Peso corporal', 'Halteres', 'Evoluir para Bulgarian'],
    variations: ['Stance curto', 'Stance longo', 'Elevado'],
    commonMistakes: ['Stance muito curto', 'Peso na perna de trás'],
    scientificSource: 'T-Nation - "Start with split squat before Bulgarian"',
  },

  'reverse lunge': {
    name: 'Afundo Reverso',
    aliases: ['reverse lunge', 'lunge reverso', 'afundo para tras'],
    primaryMuscles: ['quadríceps', 'glúteo'],
    secondaryMuscles: ['isquiotibiais', 'core'],
    movementPattern: 'afundo para trás',
    equipment: 'corpo livre ou halteres ou barra',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Mais glúteo que forward lunge - menos stress no joelho',
      rom: 'Passo para trás, joelho quase toca o chão',
      joint: 'Joelhos + quadril',
    },
    progressions: ['Peso corporal', 'Halteres', 'Barra', 'Déficit'],
    variations: ['Alternado', 'Mesmo lado', 'Com pausa'],
    commonMistakes: ['Passo muito curto', 'Joelho da frente colapsando'],
    scientificSource: 'T-Nation - Gareth Sapstead "Reverse Lunges, But Better"',
  },

  'deficit reverse lunge': {
    name: 'Afundo Reverso em Déficit',
    aliases: ['deficit lunge', 'lunge deficit', 'afundo elevado'],
    primaryMuscles: ['glúteo', 'quadríceps'],
    secondaryMuscles: ['isquiotibiais', 'core'],
    movementPattern: 'afundo reverso com ROM aumentado',
    equipment: 'step/plataforma + halteres opcional',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Glúteo 95% - joelho desce "abaixo do chão" para maior ROM',
      rom: 'Maior extensão de quadril que lunge normal',
      joint: 'Quadril + joelhos',
    },
    progressions: ['Altura baixa', 'Altura média', 'Adicionar peso'],
    variations: ['Com halteres', 'Com barra', 'Com banda'],
    commonMistakes: ['Déficit muito alto no início', 'Peso demais na perna de trás'],
    scientificSource: 'T-Nation Archive - "Banded Deficit Reverse Lunge"',
  },

  'walking lunge': {
    name: 'Afundo Caminhando',
    aliases: ['walking lunge', 'lunge caminhando', 'afundo dinamico'],
    primaryMuscles: ['quadríceps', 'glúteo'],
    secondaryMuscles: ['isquiotibiais', 'core', 'panturrilha'],
    movementPattern: 'afundo dinâmico',
    equipment: 'corpo livre ou halteres',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Stretch profundo nos glúteos - quad dominante na subida',
      rom: 'Passos contínuos com joelho quase tocando chão',
      joint: 'Joelhos + quadril',
    },
    progressions: ['Peso corporal', 'Halteres leves', 'Halteres pesados', 'Barra'],
    variations: ['Passos curtos (quads)', 'Passos longos (glúteos)', 'Overhead'],
    commonMistakes: ['Passos muito curtos', 'Velocidade excessiva', 'Joelhos colapsando'],
    scientificSource: 'Bret Contreras - "Walking lunges provide deeper glute stretch than hip thrusts"',
  },

  'step up': {
    name: 'Step Up',
    aliases: ['subida no banco', 'step up', 'subida step'],
    primaryMuscles: ['quadríceps', 'glúteo'],
    secondaryMuscles: ['isquiotibiais', 'panturrilha'],
    movementPattern: 'subida unilateral',
    equipment: 'banco ou step + halteres opcional',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Quad 85% + Glúteo 75% - depende da altura',
      rom: 'Subir completamente no banco, descer controlado',
      joint: 'Joelhos + quadril',
    },
    progressions: ['Altura baixa', 'Altura alta', 'Adicionar peso'],
    variations: ['Lateral step up', 'Crossover step up', 'Com salto'],
    commonMistakes: ['Impulso da perna de baixo', 'Altura inadequada'],
    scientificSource: 'T-Nation - "The 4 Mandatory One-Legged Exercises"',
  },

  'lateral step up': {
    name: 'Step Up Lateral',
    aliases: ['side step up', 'step up lateral', 'subida lateral'],
    primaryMuscles: ['glúteo médio', 'quadríceps'],
    secondaryMuscles: ['adutores', 'glúteo máximo'],
    movementPattern: 'subida lateral unilateral',
    equipment: 'banco ou step + halteres opcional',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Glúteo médio 90% - movimento no plano frontal',
      rom: 'Subir lateralmente, controlar descida',
      joint: 'Joelhos + quadril (abdução)',
    },
    progressions: ['Peso corporal', 'Halteres', 'Altura maior'],
    variations: ['Baixo', 'Médio', 'Alto'],
    commonMistakes: ['Empurrar com perna de baixo', 'Inclinar tronco'],
    scientificSource: 'T-Nation - Unilateral Training',
  },

  // ============================================================
  // EXERCÍCIOS DE CABO ESPECIAIS - T-NATION
  // ============================================================

  'dante row': {
    name: 'Remada Dante',
    aliases: ['dante row', 'dante trudel row', 'doggcrapp row'],
    primaryMuscles: ['latíssimo do dorso'],
    secondaryMuscles: ['bíceps', 'romboides'],
    movementPattern: 'puxada vertical modificada',
    equipment: 'máquina de remada sentado ou cabo',
    difficulty: 'avançado',
    biomechanics: {
      activation: 'Lat isolado - similar ao Nautilus pullover antigo',
      rom: 'Stretch total → cotovelos para joelhos, arredondar costas, squeeze',
      joint: 'Ombro + cotovelo',
    },
    progressions: ['Aprender o padrão', 'Aumentar carga', 'Usar straps'],
    variations: ['Com alça', 'Com corda', 'Com straps Flexsolate'],
    commonMistakes: ['Fazer como pulldown normal', 'Não arredondar costas no squeeze', 'ROM curto'],
    scientificSource: 'T-Nation - Mark Dugdale "The Dante Row" (Dante Trudel/Doggcrapp)',
  },

  'low cable row handles': {
    name: 'Remada Baixa com Alças Separadas',
    aliases: ['low cable row', 'remada baixa alças', 'seated cable row handles'],
    primaryMuscles: ['latíssimo do dorso', 'romboides'],
    secondaryMuscles: ['bíceps', 'trapézio médio'],
    movementPattern: 'puxada horizontal',
    equipment: 'cabo baixo + duas alças',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Lat + romboides - alças permitem melhor posição do ombro',
      rom: 'Braços estendidos → puxar até abdômen',
      joint: 'Ombro + cotovelo + escápula',
    },
    progressions: ['Aumentar carga', 'Pausas', 'Unilateral'],
    variations: ['Alças separadas', 'Alça V', 'Barra reta'],
    commonMistakes: ['Inclinar demais', 'Usar impulso'],
    scientificSource: 'T-Nation Archive - "Tip: Master the Low Cable Row"',
  },

  'cable pull through': {
    name: 'Pull Through no Cabo',
    aliases: ['cable pull through', 'pull through', 'puxada entre pernas'],
    primaryMuscles: ['glúteo máximo', 'isquiotibiais'],
    secondaryMuscles: ['lombar', 'core'],
    movementPattern: 'hip hinge com cabo',
    equipment: 'cabo baixo + corda',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Glúteo 80% - ensina hip hinge sem carga espinal',
      rom: 'Flexão de quadril → extensão completa com squeeze',
      joint: 'Quadril',
    },
    progressions: ['Aprender padrão', 'Aumentar carga', 'Evoluir para RDL'],
    variations: ['Com corda', 'Com alça'],
    commonMistakes: ['Agachar em vez de hip hinge', 'Não contrair glúteo no topo'],
    scientificSource: 'T-Nation - Hip Hinge Training',
  },

  'cable woodchop': {
    name: 'Woodchop no Cabo (Lenhador)',
    aliases: ['cable woodchop', 'wood chop', 'lenhador', 'rotação no cabo'],
    primaryMuscles: ['oblíquos', 'core'],
    secondaryMuscles: ['ombros', 'quadríceps'],
    movementPattern: 'rotação diagonal',
    equipment: 'cabo alto ou baixo',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Oblíquos 90% - rotação funcional anti-rotacional controlada',
      rom: 'Diagonal de cima para baixo ou vice-versa',
      joint: 'Coluna (rotação) + quadril',
    },
    progressions: ['Baixo para alto', 'Alto para baixo', 'Aumentar carga'],
    variations: ['High to low', 'Low to high', 'Ajoelhado'],
    commonMistakes: ['Usar braços demais', 'Não girar quadril', 'Velocidade excessiva'],
    scientificSource: 'T-Nation - Functional Core Training',
  },

  'cable kickback': {
    name: 'Coice no Cabo (Glúteo)',
    aliases: ['cable glute kickback', 'kickback cable', 'extensao quadril cabo'],
    primaryMuscles: ['glúteo máximo'],
    secondaryMuscles: ['isquiotibiais'],
    movementPattern: 'extensão de quadril isolada',
    equipment: 'cabo baixo + tornozeleira',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Glúteo isolado 75% - tensão constante do cabo',
      rom: 'Perna estendida para trás, squeeze no topo',
      joint: 'Quadril',
    },
    progressions: ['Aumentar carga', 'Pausas no topo', 'Pulsos no final'],
    variations: ['Em pé', 'Inclinado', 'No chão'],
    commonMistakes: ['Hiperextender lombar', 'Usar impulso', 'ROM excessivo'],
    scientificSource: 'T-Nation - Glute Training',
  },

  // ============================================================
  // EXERCÍCIOS DE MOBILIDADE E ATIVAÇÃO - T-NATION
  // ============================================================

  'hip airplane': {
    name: 'Hip Airplane',
    aliases: ['airplane', 'aviao quadril', 'hip rotation airplane'],
    primaryMuscles: ['glúteo médio', 'glúteo máximo'],
    secondaryMuscles: ['core', 'isquiotibiais'],
    movementPattern: 'rotação de quadril unilateral',
    equipment: 'corpo livre',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Glúteo médio 85% - controle rotacional',
      rom: 'Rotação interna e externa do quadril em apoio unilateral',
      joint: 'Quadril (rotação)',
    },
    progressions: ['Apoiado', 'Livre', 'Com peso'],
    variations: ['Com apoio na parede', 'Sem apoio', 'Com caneleira'],
    commonMistakes: ['Perder equilíbrio', 'ROM insuficiente', 'Quadril caindo'],
    scientificSource: 'T-Nation - Hip Mobility',
  },

  'banded clamshell': {
    name: 'Clamshell com Banda',
    aliases: ['clamshell', 'conchinha', 'banded clam', 'abdução deitado banda'],
    primaryMuscles: ['glúteo médio'],
    secondaryMuscles: ['glúteo mínimo', 'tensor da fáscia lata'],
    movementPattern: 'abdução de quadril deitado',
    equipment: 'mini band',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Glúteo médio isolado 70% - ativação',
      rom: 'Rotação externa com quadril flexionado',
      joint: 'Quadril',
    },
    progressions: ['Sem banda', 'Mini band leve', 'Mini band pesada'],
    variations: ['Deitado', 'Side plank clamshell'],
    commonMistakes: ['Rolar o quadril para trás', 'Banda muito forte', 'ROM excessivo'],
    scientificSource: 'T-Nation - Glute Activation',
  },

  'fire hydrant': {
    name: 'Fire Hydrant (Hidrante)',
    aliases: ['fire hydrant', 'hidrante', 'abducao 4 apoios'],
    primaryMuscles: ['glúteo médio', 'glúteo máximo'],
    secondaryMuscles: ['core'],
    movementPattern: 'abdução de quadril em 4 apoios',
    equipment: 'corpo livre ou mini band',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Glúteo médio 75% + máximo',
      rom: 'Abdução lateral mantendo joelho flexionado',
      joint: 'Quadril',
    },
    progressions: ['Peso corporal', 'Mini band', 'Caneleira'],
    variations: ['Sem banda', 'Com banda', 'Com círculos'],
    commonMistakes: ['Girar quadril', 'Inclinar tronco', 'ROM excessivo'],
    scientificSource: 'T-Nation - Glute Activation Series',
  },

  'bird dog': {
    name: 'Bird Dog',
    aliases: ['bird dog', 'cachorro passaro', 'extensao cruzada'],
    primaryMuscles: ['core', 'glúteo'],
    secondaryMuscles: ['ombros', 'isquiotibiais', 'lombar'],
    movementPattern: 'extensão cruzada anti-rotação',
    equipment: 'corpo livre',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Core 85% - estabilização anti-rotacional',
      rom: 'Braço e perna opostos estendem simultaneamente',
      joint: 'Quadril + ombro + coluna (estabilização)',
    },
    progressions: ['Básico', 'Com pausa', 'Com banda', 'Com peso'],
    variations: ['Básico', 'Bird dog row', 'Bird dog com círculos'],
    commonMistakes: ['Arquear lombar', 'Girar quadril', 'Velocidade excessiva'],
    scientificSource: 'T-Nation - McGill Big 3 for Core Stability',
  },

  'cat cow': {
    name: 'Cat Cow (Gato Vaca)',
    aliases: ['cat cow', 'gato vaca', 'mobilidade coluna'],
    primaryMuscles: ['core', 'lombar'],
    secondaryMuscles: ['abdominais'],
    movementPattern: 'mobilidade de coluna',
    equipment: 'corpo livre',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Mobilidade segmentar da coluna',
      rom: 'Flexão e extensão completa da coluna',
      joint: 'Coluna vertebral',
    },
    progressions: ['Movimentos lentos', 'Segmentar', 'Com respiração'],
    variations: ['Básico', 'Segmentar', 'Seated'],
    commonMistakes: ['Movimento muito rápido', 'Pular segmentos', 'Não respirar'],
    scientificSource: 'T-Nation - Mobility for Lifters',
  },

  'worlds greatest stretch': {
    name: 'World\'s Greatest Stretch',
    aliases: ['worlds greatest stretch', 'melhor alongamento mundo', 'spiderman stretch'],
    primaryMuscles: ['flexores de quadril', 'adutores', 'torácica'],
    secondaryMuscles: ['isquiotibiais', 'glúteos', 'ombros'],
    movementPattern: 'mobilidade multi-articular',
    equipment: 'corpo livre',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Mobilidade total - quadril, torácica, ombros',
      rom: 'Afundo + rotação torácica + extensão de quadril',
      joint: 'Quadril + coluna torácica',
    },
    progressions: ['Estático', 'Dinâmico', 'Com overhead reach'],
    variations: ['Básico', 'Com rotação', 'Com hamstring stretch'],
    commonMistakes: ['Pular componentes', 'Não rotacionar torácica', 'Rush'],
    scientificSource: 'T-Nation - Warm-Up Routines',
  },

  'couch stretch': {
    name: 'Couch Stretch (Alongamento de Sofá)',
    aliases: ['couch stretch', 'alongamento sofa', 'flexor de quadril stretch'],
    primaryMuscles: ['flexores de quadril', 'reto femoral'],
    secondaryMuscles: ['quadríceps'],
    movementPattern: 'alongamento de flexor de quadril',
    equipment: 'parede ou sofá',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Alongamento intenso de flexores - corrige postura',
      rom: 'Extensão máxima de quadril com joelho flexionado',
      joint: 'Quadril',
    },
    progressions: ['Longe da parede', 'Perto da parede', 'Com contração'],
    variations: ['Na parede', 'No sofá', 'No chão'],
    commonMistakes: ['Arquear lombar', 'Não contrair glúteo', 'Forçar demais'],
    scientificSource: 'T-Nation - Fixing Hip Flexor Tightness',
  },

  '90 90 stretch': {
    name: '90/90 Stretch (Alongamento 90/90)',
    aliases: ['90 90 stretch', 'noventa noventa', 'hip 90 90'],
    primaryMuscles: ['glúteo', 'piriforme'],
    secondaryMuscles: ['flexores de quadril', 'adutores'],
    movementPattern: 'mobilidade de rotação de quadril',
    equipment: 'corpo livre',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Rotação interna e externa de quadril',
      rom: 'Ambos os quadris em 90° de flexão com rotação',
      joint: 'Quadril (rotação)',
    },
    progressions: ['Estático', 'Transições', 'Com inclinação'],
    variations: ['Estático', 'Dinâmico', 'Com peso'],
    commonMistakes: ['Joelho saindo do chão', 'Forçar rotação', 'Não respirar'],
    scientificSource: 'T-Nation - Hip Mobility for Squatting',
  },

  // ============================================================
  // EXERCÍCIOS COM KETTLEBELL - T-NATION / DAN JOHN
  // ============================================================

  'kettlebell swing': {
    name: 'Kettlebell Swing',
    aliases: ['kb swing', 'swing', 'russian swing', 'balanço com kettlebell'],
    primaryMuscles: ['glúteo máximo', 'isquiotibiais'],
    secondaryMuscles: ['core', 'lombar', 'deltóides', 'antebraço'],
    movementPattern: 'hip hinge balístico',
    equipment: 'kettlebell',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Explosão de quadril - glúteo 95% no snap',
      rom: 'Hip hinge → extensão explosiva → kettlebell até ombros',
      joint: 'Quadril (dominante)',
    },
    progressions: ['Two hand', 'One hand', 'American swing', 'Double KB'],
    variations: ['Russian (altura dos ombros)', 'American (overhead)', 'Single arm', 'Alternating'],
    commonMistakes: ['Agachar em vez de hip hinge', 'Usar braços para levantar', 'Extensão incompleta'],
    scientificSource: 'Dan John / Pavel Tsatsouline - "75-250 swings per day"',
  },

  'goblet squat': {
    name: 'Goblet Squat',
    aliases: ['agachamento goblet', 'goblet', 'agachamento calice', 'kb squat'],
    primaryMuscles: ['quadríceps', 'glúteo'],
    secondaryMuscles: ['core', 'adutores', 'bíceps'],
    movementPattern: 'agachamento frontal carregado',
    equipment: 'kettlebell ou halter',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Quad 85% + Glúteo 80% - ensina padrão de agachamento perfeito',
      rom: 'Agachamento profundo - cotovelos entre joelhos',
      joint: 'Joelhos + quadril',
    },
    progressions: ['Peso leve', 'Peso pesado', 'Com pausa', 'Evoluir para front squat'],
    variations: ['Com kettlebell', 'Com halter', 'Com pausa no fundo'],
    commonMistakes: ['Não ir fundo', 'Joelhos colapsando', 'Inclinar tronco'],
    scientificSource: 'Dan John - "15-25 goblet squats per day"',
  },

  'turkish get up': {
    name: 'Turkish Get Up (Levantamento Turco)',
    aliases: ['tgu', 'get up', 'levantamento turco', 'turkish getup'],
    primaryMuscles: ['core', 'ombros', 'glúteo'],
    secondaryMuscles: ['tríceps', 'quadríceps', 'isquiotibiais', 'trapézio'],
    movementPattern: 'movimento funcional completo',
    equipment: 'kettlebell ou halter',
    difficulty: 'avançado',
    biomechanics: {
      activation: 'Full body - coordenação total, estabilidade de ombro 100%',
      rom: 'Do chão deitado até em pé com peso overhead',
      joint: 'Todas - ombro, quadril, joelhos, core',
    },
    progressions: ['Sem peso', 'Sapato na mão', 'KB leve', 'KB pesado'],
    variations: ['Completo', 'Half get up', 'Com barra'],
    commonMistakes: ['Pular etapas', 'Perder contato visual com KB', 'Braço dobrando'],
    scientificSource: 'Pavel Tsatsouline - "1-10 each side per day - functional training"',
  },

  'kettlebell clean': {
    name: 'Kettlebell Clean',
    aliases: ['kb clean', 'clean kettlebell', 'arremesso kb'],
    primaryMuscles: ['glúteo', 'isquiotibiais', 'deltóides'],
    secondaryMuscles: ['core', 'antebraço', 'trapézio'],
    movementPattern: 'puxada explosiva para rack',
    equipment: 'kettlebell',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Extensão de quadril explosiva → recepção suave',
      rom: 'Do chão ou hang → rack position',
      joint: 'Quadril + ombro',
    },
    progressions: ['Dead clean', 'Swing clean', 'Double KB'],
    variations: ['Single', 'Double', 'Alternating'],
    commonMistakes: ['KB batendo no pulso', 'Usar braço demais', 'Não inserir mão'],
    scientificSource: 'StrongFirst / T-Nation - Kettlebell Training',
  },

  'kettlebell snatch': {
    name: 'Kettlebell Snatch',
    aliases: ['kb snatch', 'snatch kettlebell', 'arranco kb'],
    primaryMuscles: ['glúteo', 'isquiotibiais', 'deltóides'],
    secondaryMuscles: ['core', 'trapézio', 'tríceps'],
    movementPattern: 'puxada explosiva para overhead',
    equipment: 'kettlebell',
    difficulty: 'avançado',
    biomechanics: {
      activation: 'Full body explosivo - potência máxima',
      rom: 'Do chão → overhead em um movimento',
      joint: 'Quadril + ombro',
    },
    progressions: ['High pull', 'Snatch com pausa', 'Snatch completo'],
    variations: ['Single', 'Double', 'Half snatch'],
    commonMistakes: ['KB batendo no antebraço', 'Usar braço demais', 'Punch tardio'],
    scientificSource: 'StrongFirst - "Czar of Kettlebell Lifts"',
  },

  'kettlebell windmill': {
    name: 'Kettlebell Windmill',
    aliases: ['windmill', 'moinho', 'kb windmill'],
    primaryMuscles: ['oblíquos', 'glúteo médio'],
    secondaryMuscles: ['isquiotibiais', 'ombros', 'core'],
    movementPattern: 'flexão lateral com rotação',
    equipment: 'kettlebell',
    difficulty: 'avançado',
    biomechanics: {
      activation: 'Oblíquos 90% + estabilidade de ombro',
      rom: 'Inclinação lateral profunda com peso overhead',
      joint: 'Quadril (lateral) + ombro',
    },
    progressions: ['Sem peso', 'Bottom up', 'Com peso'],
    variations: ['Low windmill', 'High windmill', 'Double windmill'],
    commonMistakes: ['Dobrar joelhos', 'Perder peso overhead', 'Rotação insuficiente'],
    scientificSource: 'StrongFirst / T-Nation - Kettlebell Mobility',
  },

  // ============================================================
  // RACK PULLS E BLOCK PULLS - T-NATION POWERLIFTING
  // ============================================================

  'rack pull': {
    name: 'Rack Pull (Puxada do Rack)',
    aliases: ['rack pull', 'pin pull', 'puxada do rack', 'deadlift parcial'],
    primaryMuscles: ['trapézio', 'lombar', 'glúteo'],
    secondaryMuscles: ['isquiotibiais', 'antebraço'],
    movementPattern: 'hip hinge parcial (lockout)',
    equipment: 'barra + power rack',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Trapézio 95% + lockout strength',
      rom: 'Do joelho ou acima até lockout',
      joint: 'Quadril + coluna',
    },
    progressions: ['Abaixo do joelho', 'No joelho', 'Acima do joelho'],
    variations: ['Low pins', 'High pins', 'Com pausa'],
    commonMistakes: ['Posição muito alta', 'Não travar no topo', 'Usar bounce'],
    scientificSource: 'T-Nation - "Rack Em Up - Rack Pull Variations"',
  },

  'block pull': {
    name: 'Block Pull (Puxada do Bloco)',
    aliases: ['block pull', 'block deadlift', 'terra do bloco', 'deficit invertido'],
    primaryMuscles: ['glúteo', 'isquiotibiais', 'lombar'],
    secondaryMuscles: ['trapézio', 'quadríceps'],
    movementPattern: 'hip hinge do bloco',
    equipment: 'barra + blocos ou steps',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Posterior chain - melhor carryover para deadlift que rack pull',
      rom: 'Barra em blocos → lockout (similar ao deadlift real)',
      joint: 'Quadril + joelhos',
    },
    progressions: ['2 polegadas', '4 polegadas', '6 polegadas'],
    variations: ['Baixo', 'Médio', 'Alto', 'Sumo block pull'],
    commonMistakes: ['Blocos muito altos', 'Perder tensão na descida'],
    scientificSource: 'T-Nation Forum - "Block pulls have better carryover to deadlift"',
  },

  // ============================================================
  // HIP HINGE VARIATIONS - T-NATION
  // ============================================================

  'romanian deadlift': {
    name: 'Levantamento Terra Romeno',
    aliases: ['rdl', 'romanian deadlift', 'stiff leg', 'terra romeno'],
    primaryMuscles: ['isquiotibiais', 'glúteo'],
    secondaryMuscles: ['lombar', 'trapézio', 'core'],
    movementPattern: 'hip hinge puro',
    equipment: 'barra ou halteres',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Isquiotibiais 90% + Glúteo 85% - ênfase excêntrica',
      rom: 'Em pé → barra desce até meio da canela mantendo pernas quase retas',
      joint: 'Quadril (flexão/extensão)',
    },
    progressions: ['Peso leve', 'Peso moderado', 'Peso pesado', 'Déficit'],
    variations: ['Bilateral', 'Single leg', 'Com halteres', 'Snatch grip'],
    commonMistakes: ['Arredondar lombar', 'Dobrar joelhos demais', 'ROM insuficiente'],
    scientificSource: 'T-Nation Archive - "The Romanian Deadlift, Improved"',
  },

  'single leg rdl': {
    name: 'Levantamento Terra Romeno Unilateral',
    aliases: ['single leg rdl', 'one leg rdl', 'rdl unilateral', 'terra romeno uma perna'],
    primaryMuscles: ['isquiotibiais', 'glúteo'],
    secondaryMuscles: ['glúteo médio', 'core', 'lombar'],
    movementPattern: 'hip hinge unilateral',
    equipment: 'halter ou kettlebell',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Isquiotibiais + estabilidade de quadril - reduz dor lombar',
      rom: 'Hip hinge em uma perna, outra estende para trás',
      joint: 'Quadril + estabilizadores',
    },
    progressions: ['Com apoio', 'Sem apoio', 'Com peso', 'Peso contralateral'],
    variations: ['Contralateral (peso oposto)', 'Ipsilateral', 'Kickstand'],
    commonMistakes: ['Perder equilíbrio', 'Quadril abrindo', 'Lombar arredondando'],
    scientificSource: 'T-Nation - "Tip: Single-Legged Romanian Deadlift"',
  },

  'good morning': {
    name: 'Good Morning (Bom Dia)',
    aliases: ['good morning', 'bom dia', 'gm'],
    primaryMuscles: ['isquiotibiais', 'glúteo', 'lombar'],
    secondaryMuscles: ['core'],
    movementPattern: 'hip hinge com barra nas costas',
    equipment: 'barra',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Posterior chain - braço de alavanca longo aumenta demanda lombar',
      rom: 'Barra nas costas → hip hinge até tronco quase paralelo',
      joint: 'Quadril',
    },
    progressions: ['Barra vazia', 'Peso leve', 'Peso moderado'],
    variations: ['Seated', 'Wide stance', 'Cambered bar', 'SSB'],
    commonMistakes: ['Arredondar costas', 'Ir muito baixo', 'Peso excessivo'],
    scientificSource: 'T-Nation Archive - "Hardcore Hinging for Hamstrings"',
  },

  'goat belly swing': {
    name: 'Goat Belly Swing',
    aliases: ['goat belly', 'zercher good morning', 'kb good morning'],
    primaryMuscles: ['isquiotibiais', 'glúteo'],
    secondaryMuscles: ['core', 'lombar', 'bíceps'],
    movementPattern: 'hip hinge estilo Zercher',
    equipment: 'kettlebell ou halter',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Ensina hip hinge perfeito - peso na frente do corpo',
      rom: 'KB na frente da barriga → hip hinge → extensão',
      joint: 'Quadril',
    },
    progressions: ['Peso leve', 'Peso moderado'],
    variations: ['Com KB', 'Com halter', 'Com medicinebal'],
    commonMistakes: ['Agachar em vez de hip hinge', 'Peso nos dedos', 'Arredondar costas'],
    scientificSource: 'T-Nation - "Great way to teach the hinge to beginners"',
  },

  // ============================================================
  // BENCH PRESS VARIATIONS - T-NATION
  // ============================================================

  'close grip bench press': {
    name: 'Supino Pegada Fechada',
    aliases: ['close grip bench', 'supino fechado', 'cgbp', 'bench pegada estreita'],
    primaryMuscles: ['tríceps', 'peitoral'],
    secondaryMuscles: ['deltóide anterior'],
    movementPattern: 'empurrar horizontal com ênfase em tríceps',
    equipment: 'barra + banco',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Tríceps 90% - menos stress no ombro que pegada larga',
      rom: 'Pegada na largura dos ombros ou ligeiramente menor',
      joint: 'Ombro + cotovelo',
    },
    progressions: ['Barra vazia', 'Peso leve', 'Peso moderado', 'Peso pesado'],
    variations: ['Flat', 'Incline', 'Decline', 'Com pausa'],
    commonMistakes: ['Pegada muito fechada', 'Cotovelos abrindo', 'Não pausar'],
    scientificSource: 'T-Nation - "Close grip reduces AC joint compression"',
  },

  'spoto press': {
    name: 'Spoto Press',
    aliases: ['spoto press', 'paused bench 1 inch', 'supino spoto'],
    primaryMuscles: ['peitoral', 'tríceps'],
    secondaryMuscles: ['deltóide anterior'],
    movementPattern: 'supino com pausa fora do peito',
    equipment: 'barra + banco',
    difficulty: 'avançado',
    biomechanics: {
      activation: 'Tensão máxima - elimina bounce, força pura',
      rom: 'Descer até ~2cm do peito → pausar → subir',
      joint: 'Ombro + cotovelo',
    },
    progressions: ['Peso leve com pausa longa', 'Aumentar carga gradualmente'],
    variations: ['Flat', 'Close grip spoto', 'Incline spoto'],
    commonMistakes: ['Tocar no peito', 'Pausa muito curta', 'Perder tensão'],
    scientificSource: 'Eric Spoto - T-Nation "722lb raw bench press technique"',
  },

  'incline bench press': {
    name: 'Supino Inclinado',
    aliases: ['incline bench', 'supino inclinado', 'incline press'],
    primaryMuscles: ['peitoral superior', 'deltóide anterior'],
    secondaryMuscles: ['tríceps'],
    movementPattern: 'empurrar inclinado',
    equipment: 'barra ou halteres + banco inclinado',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Peitoral superior 70% + deltóide anterior',
      rom: 'Barra desce até clavícula → sobe em linha reta',
      joint: 'Ombro + cotovelo',
    },
    progressions: ['Halteres', 'Barra', 'Aumentar inclinação'],
    variations: ['30 graus', '45 graus', '60 graus', 'Com halteres'],
    commonMistakes: ['Inclinação muito alta', 'Barra descendo muito baixo', 'Arco excessivo'],
    scientificSource: 'T-Nation - Bench Press Variations',
  },

  'decline bench press': {
    name: 'Supino Declinado',
    aliases: ['decline bench', 'supino declinado', 'decline press'],
    primaryMuscles: ['peitoral inferior', 'tríceps'],
    secondaryMuscles: ['deltóide anterior'],
    movementPattern: 'empurrar declinado',
    equipment: 'barra + banco declinado',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Peitoral inferior + maior ativação de tríceps que flat',
      rom: 'ROM ligeiramente reduzido, menos stress no ombro',
      joint: 'Ombro + cotovelo',
    },
    progressions: ['Peso leve', 'Peso moderado', 'Peso pesado'],
    variations: ['Com barra', 'Com halteres', 'Close grip decline'],
    commonMistakes: ['Declínio muito acentuado', 'Não usar spotter', 'Descer muito rápido'],
    scientificSource: 'T-Nation - "Close grip decline has higher tricep activation"',
  },

  'larsen press': {
    name: 'Larsen Press',
    aliases: ['larsen press', 'legs up bench', 'supino sem pernas'],
    primaryMuscles: ['peitoral', 'deltóide anterior'],
    secondaryMuscles: ['tríceps', 'core'],
    movementPattern: 'supino sem leg drive',
    equipment: 'barra + banco',
    difficulty: 'avançado',
    biomechanics: {
      activation: 'Upper body puro - elimina leg drive completamente',
      rom: 'Supino normal com pernas estendidas flutuando',
      joint: 'Ombro + cotovelo',
    },
    progressions: ['Peso leve', 'Aumentar gradualmente'],
    variations: ['Pernas retas', 'Pernas dobradas no ar'],
    commonMistakes: ['Perder estabilidade', 'Arquear lombar', 'Peso muito pesado'],
    scientificSource: 'T-Nation - Raw Bench Press Training',
  },

  'tempo bench press': {
    name: 'Supino com Tempo',
    aliases: ['tempo bench', 'supino tempo', 'eccentric bench'],
    primaryMuscles: ['peitoral', 'tríceps'],
    secondaryMuscles: ['deltóide anterior'],
    movementPattern: 'supino com cadência controlada',
    equipment: 'barra + banco',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'TUT aumentado - hipertrofia e controle',
      rom: 'Supino normal com descida de 3-5 segundos',
      joint: 'Ombro + cotovelo',
    },
    progressions: ['3-0-1-0', '4-1-2-0', '5-2-1-0'],
    variations: ['Eccentric only', 'Paused tempo', 'Full tempo'],
    commonMistakes: ['Perder o tempo', 'Peso muito pesado para o tempo'],
    scientificSource: 'T-Nation - Time Under Tension Training',
  },

  // ============================================================
  // EXERCÍCIOS AVANÇADOS DE COSTAS - T-NATION
  // ============================================================

  'meadows row': {
    name: 'Remada Meadows',
    aliases: ['meadows row', 'landmine row unilateral', 'john meadows row'],
    primaryMuscles: ['latíssimo do dorso'],
    secondaryMuscles: ['trapézio', 'bíceps', 'romboides'],
    movementPattern: 'puxada horizontal unilateral',
    equipment: 'barra + landmine',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Lat 92% - puxada perpendicular ao corpo',
      rom: 'Stance perpendicular → puxar com uma mão',
      joint: 'Ombro + cotovelo',
    },
    progressions: ['Peso leve', 'Peso moderado', 'Pausa no topo'],
    variations: ['Overhand', 'Underhand', 'Com pausa'],
    commonMistakes: ['Usar impulso', 'Não estabilizar core', 'ROM incompleto'],
    scientificSource: 'John Meadows - T-Nation "Mountain Dog Training"',
  },

  'kroc row': {
    name: 'Remada Kroc',
    aliases: ['kroc row', 'high rep dumbbell row', 'remada pesada'],
    primaryMuscles: ['latíssimo do dorso'],
    secondaryMuscles: ['bíceps', 'trapézio', 'antebraço'],
    movementPattern: 'remada unilateral pesada com reps altas',
    equipment: 'halter pesado',
    difficulty: 'avançado',
    biomechanics: {
      activation: 'Lat + grip - permite cheat controlado para mais reps',
      rom: 'ROM completo com impulso controlado nas últimas reps',
      joint: 'Ombro + cotovelo',
    },
    progressions: ['15 reps', '20 reps', '25+ reps'],
    variations: ['Strict no início', 'Cheat nas últimas'],
    commonMistakes: ['Cheat desde o início', 'Peso muito leve', 'ROM curto'],
    scientificSource: 'Matt Kroczaleski / T-Nation - High Rep Rows',
  },

  'seal row': {
    name: 'Remada Seal (Prone Row)',
    aliases: ['seal row', 'prone row', 'remada deitado', 'chest supported barbell row'],
    primaryMuscles: ['latíssimo do dorso', 'romboides'],
    secondaryMuscles: ['bíceps', 'trapézio médio'],
    movementPattern: 'puxada horizontal sem stress lombar',
    equipment: 'barra + banco elevado',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Lat puro - zero compensação de lombar',
      rom: 'Deitado em banco elevado → puxar barra do chão',
      joint: 'Ombro + cotovelo',
    },
    progressions: ['Peso leve', 'Peso moderado', 'Com pausa'],
    variations: ['Com barra', 'Com halteres', 'Com pegada larga/fechada'],
    commonMistakes: ['Banco muito baixo', 'Usar impulso do corpo'],
    scientificSource: 'T-Nation - "Zero low back stress rowing"',
  },

  'pendlay row': {
    name: 'Remada Pendlay',
    aliases: ['pendlay row', 'dead stop row', 'remada do chao'],
    primaryMuscles: ['latíssimo do dorso', 'trapézio'],
    secondaryMuscles: ['bíceps', 'lombar', 'romboides'],
    movementPattern: 'puxada horizontal explosiva',
    equipment: 'barra',
    difficulty: 'avançado',
    biomechanics: {
      activation: 'Lat + explosão - cada rep do chão',
      rom: 'Barra no chão → puxar explosivo até peito → descer completamente',
      joint: 'Ombro + cotovelo + quadril (estabilização)',
    },
    progressions: ['Peso leve com técnica', 'Aumentar carga mantendo explosão'],
    variations: ['Overhand', 'Underhand', 'Wide grip'],
    commonMistakes: ['Usar impulso do corpo', 'Não pausar no chão', 'Torso subindo'],
    scientificSource: 'Glenn Pendlay / T-Nation - "Dead stop for power"',
  },

  // ============================================================
  // VARIAÇÕES DE AGACHAMENTO - T-NATION DEEP DIVE
  // ============================================================

  'box squat': {
    name: 'Agachamento no Caixote (Box Squat)',
    aliases: ['box squat', 'agachamento caixa', 'squat box', 'westside squat'],
    primaryMuscles: ['quadríceps', 'glúteo'],
    secondaryMuscles: ['isquiotibiais', 'core', 'lombar'],
    movementPattern: 'agachamento com pausa no caixote',
    equipment: 'barra + caixote',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Glúteo 90% - elimina reflexo de estiramento, força concêntrica pura',
      rom: 'Sentar completamente no caixote → levantar com força',
      joint: 'Joelhos + quadril',
    },
    progressions: ['Caixa alta', 'Caixa paralela', 'Caixa baixa', 'Adicionar correntes/bandas'],
    variations: ['Wide stance', 'Close stance', 'Com bandas', 'Com correntes'],
    commonMistakes: ['Relaxar no caixote', 'Bouncing no caixote', 'Não manter tensão nas costas'],
    scientificSource: 'Louie Simmons / Westside Barbell - T-Nation "Box Squat Secrets"',
  },

  'front squat': {
    name: 'Agachamento Frontal',
    aliases: ['front squat', 'agachamento frontal', 'squat frontal', 'olympic squat'],
    primaryMuscles: ['quadríceps'],
    secondaryMuscles: ['glúteo', 'core', 'torácica'],
    movementPattern: 'agachamento com barra na frente',
    equipment: 'barra',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Quadríceps 95% - posição mais vertical do tronco',
      rom: 'Barra no front rack → agachamento profundo → subir',
      joint: 'Joelhos + quadril + tornozelos',
    },
    progressions: ['Cross arm grip', 'Clean grip', 'Aumentar profundidade', 'Aumentar carga'],
    variations: ['Clean grip', 'Cross arm', 'Zombie squat', 'Com pausa'],
    commonMistakes: ['Cotovelos caindo', 'Inclinar muito para frente', 'Joelhos colapsando'],
    scientificSource: 'T-Nation - "Front Squat: More knee-dominant than back squat"',
  },

  'safety bar squat': {
    name: 'Agachamento com Barra Safety (SSB)',
    aliases: ['ssb squat', 'safety squat bar', 'yoke bar squat', 'agachamento ssb'],
    primaryMuscles: ['quadríceps', 'glúteo'],
    secondaryMuscles: ['core', 'lombar', 'trapézio'],
    movementPattern: 'agachamento com barra especial',
    equipment: 'safety squat bar',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Similar ao front squat - menos stress em ombros e cotovelos',
      rom: 'Barra com almofada no pescoço → agachamento completo',
      joint: 'Joelhos + quadril',
    },
    progressions: ['Peso leve', 'Peso moderado', 'Peso pesado', 'Com pausa'],
    variations: ['Hatfield squat (mãos no rack)', 'Good morning SSB', 'Paused'],
    commonMistakes: ['Deixar a barra puxar para frente', 'Não estabilizar core'],
    scientificSource: 'T-Nation - "Safety Bar Squat for shoulder-friendly squatting"',
  },

  'zercher squat': {
    name: 'Agachamento Zercher',
    aliases: ['zercher squat', 'agachamento zercher', 'squat zercher'],
    primaryMuscles: ['quadríceps', 'glúteo'],
    secondaryMuscles: ['bíceps', 'core', 'lombar', 'torácica'],
    movementPattern: 'agachamento com barra no cotovelo',
    equipment: 'barra',
    difficulty: 'avançado',
    biomechanics: {
      activation: 'Core extremo + quads - posição única de carregamento',
      rom: 'Barra na dobra dos cotovelos → agachamento profundo',
      joint: 'Joelhos + quadril + cotovelos',
    },
    progressions: ['Peso leve', 'Almofada na barra', 'Aumentar carga'],
    variations: ['Do rack', 'Do chão', 'Zercher carry', 'Zercher lunge'],
    commonMistakes: ['Inclinar demais', 'Cotovelos abrindo', 'Não proteger os braços'],
    scientificSource: 'T-Nation - "Zercher Squat for raw strength and core"',
  },

  'anderson squat': {
    name: 'Agachamento Anderson (Pin Squat)',
    aliases: ['anderson squat', 'pin squat', 'bottom up squat', 'dead squat'],
    primaryMuscles: ['quadríceps', 'glúteo'],
    secondaryMuscles: ['core', 'lombar'],
    movementPattern: 'agachamento do fundo (concêntrico puro)',
    equipment: 'barra + power rack',
    difficulty: 'avançado',
    biomechanics: {
      activation: 'Força concêntrica pura - elimina ciclo alongamento-encurtamento',
      rom: 'Começa do fundo apoiado nos pinos → subir → descer controlado',
      joint: 'Joelhos + quadril',
    },
    progressions: ['Pins altos', 'Pins paralelos', 'Pins baixos'],
    variations: ['Paralelo', 'Below parallel', 'Com pausa'],
    commonMistakes: ['Relaxar no fundo', 'Bouncing nos pinos', 'Perder tensão'],
    scientificSource: 'Paul Anderson / T-Nation - "Bottom-up squats for raw power"',
  },

  'belt squat': {
    name: 'Agachamento com Cinto (Belt Squat)',
    aliases: ['belt squat', 'hip squat', 'agachamento cinto', 'squat belt'],
    primaryMuscles: ['quadríceps', 'glúteo'],
    secondaryMuscles: ['adutores'],
    movementPattern: 'agachamento sem carga espinal',
    equipment: 'máquina belt squat ou landmine',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Quads + glúteo sem stress na coluna - perfeito para volume',
      rom: 'Cinto no quadril → agachamento profundo',
      joint: 'Joelhos + quadril',
    },
    progressions: ['Peso leve', 'Peso pesado', 'Com pausa', 'Unilateral'],
    variations: ['Na máquina', 'Com landmine', 'Com cabo', 'Unilateral'],
    commonMistakes: ['Inclinar para frente', 'Não ir fundo'],
    scientificSource: 'T-Nation - "Sparing the spine for high volume leg work"',
  },

  'heels elevated squat': {
    name: 'Agachamento com Calcanhares Elevados',
    aliases: ['heels elevated squat', 'squat calcanhares elevados', 'elevated heel squat'],
    primaryMuscles: ['quadríceps'],
    secondaryMuscles: ['glúteo'],
    movementPattern: 'agachamento quad dominante',
    equipment: 'anilhas ou calço + barra ou halteres',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Quadríceps 95% - reduz demanda de mobilidade de tornozelo',
      rom: 'Calcanhares em anilhas → agachamento mais vertical',
      joint: 'Joelhos (dominante)',
    },
    progressions: ['Com halteres', 'Com barra', 'Aumentar elevação'],
    variations: ['Com goblet', 'Com barra frontal', 'Com barra nas costas'],
    commonMistakes: ['Elevação muito alta', 'Joelhos colapsando'],
    scientificSource: 'T-Nation - "Heel elevation shifts focus to quads"',
  },

  '1 and half squat': {
    name: 'Agachamento 1 e Meio',
    aliases: ['1.5 squat', 'one and a half squat', 'agachamento 1.5', 'squat 1 e meio'],
    primaryMuscles: ['quadríceps', 'glúteo'],
    secondaryMuscles: ['core', 'isquiotibiais'],
    movementPattern: 'agachamento com rep parcial adicional',
    equipment: 'barra ou halteres',
    difficulty: 'avançado',
    biomechanics: {
      activation: 'Tempo sob tensão dobrado no ponto mais difícil',
      rom: 'Descer completo → subir até paralelo → descer de novo → subir completo',
      joint: 'Joelhos + quadril',
    },
    progressions: ['Peso leve', 'Aumentar carga gradualmente'],
    variations: ['1.5 front squat', '1.5 goblet', '1.5 back squat'],
    commonMistakes: ['Encurtar a meia rep', 'Peso muito pesado', 'Perder padrão'],
    scientificSource: 'T-Nation - "Time under tension for quad hypertrophy"',
  },

  // ============================================================
  // VARIAÇÕES DE PULL-UP E CHIN-UP - T-NATION DEEP DIVE
  // ============================================================

  'neutral grip pull up': {
    name: 'Barra Fixa Pegada Neutra',
    aliases: ['neutral grip pullup', 'parallel grip pullup', 'barra neutra', 'hammer grip pullup'],
    primaryMuscles: ['latíssimo do dorso', 'braquial'],
    secondaryMuscles: ['bíceps', 'romboides', 'trapézio inferior'],
    movementPattern: 'puxada vertical pegada neutra',
    equipment: 'barra com pegadas paralelas',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Lat + braquial - posição mais amigável para ombros',
      rom: 'De braços estendidos até queixo acima das mãos',
      joint: 'Ombro + cotovelo',
    },
    progressions: ['Assistido', 'Peso corporal', 'Com peso'],
    variations: ['Close grip', 'Wide grip', 'Com peso'],
    commonMistakes: ['Kipping', 'ROM incompleto', 'Não descer completamente'],
    scientificSource: 'T-Nation - "Neutral grip is most shoulder-friendly"',
  },

  'archer pull up': {
    name: 'Archer Pull-Up',
    aliases: ['archer pullup', 'barra arqueiro', 'one arm assisted pullup'],
    primaryMuscles: ['latíssimo do dorso'],
    secondaryMuscles: ['bíceps', 'core', 'romboides'],
    movementPattern: 'puxada vertical assimétrica',
    equipment: 'barra fixa larga',
    difficulty: 'avançado',
    biomechanics: {
      activation: 'Lat unilateral - progressão para one arm pull-up',
      rom: 'Puxar para um lado enquanto outro braço estende',
      joint: 'Ombro + cotovelo',
    },
    progressions: ['Assistido', 'Parcial', 'Completo', 'One arm negative'],
    variations: ['Alternado', 'Mesmo lado', 'Com pausa'],
    commonMistakes: ['Não estender braço de assistência', 'Usar momentum'],
    scientificSource: 'T-Nation - "Progression to one-arm pull-up"',
  },

  'sternum pull up': {
    name: 'Sternum Pull-Up (Gironda)',
    aliases: ['sternum pullup', 'gironda pullup', 'leaning back pullup', 'barra no peito'],
    primaryMuscles: ['latíssimo do dorso', 'romboides'],
    secondaryMuscles: ['bíceps', 'trapézio médio', 'deltóide posterior'],
    movementPattern: 'puxada vertical com inclinação',
    equipment: 'barra fixa',
    difficulty: 'avançado',
    biomechanics: {
      activation: 'Lat inferior + romboides - puxar até o esterno tocar a barra',
      rom: 'Inclinar para trás → puxar esterno até a barra',
      joint: 'Ombro + cotovelo + escápula',
    },
    progressions: ['Chin-up normal', 'Inclinação parcial', 'Esterno na barra'],
    variations: ['Supinado', 'Pronado'],
    commonMistakes: ['Não inclinar o suficiente', 'ROM curto', 'Usar impulso'],
    scientificSource: 'Vince Gironda - T-Nation "The Swan Pull-Up"',
  },

  'weighted pull up': {
    name: 'Barra Fixa com Peso',
    aliases: ['weighted pullup', 'barra com peso', 'pull up lastrado'],
    primaryMuscles: ['latíssimo do dorso'],
    secondaryMuscles: ['bíceps', 'romboides', 'trapézio inferior', 'core'],
    movementPattern: 'puxada vertical com carga externa',
    equipment: 'barra fixa + cinto de peso ou halter entre pernas',
    difficulty: 'avançado',
    biomechanics: {
      activation: 'Lat máximo - sobrecarga progressiva para força',
      rom: 'De braços estendidos até queixo acima da barra',
      joint: 'Ombro + cotovelo',
    },
    progressions: ['2.5kg', '5kg', '10kg', '20kg+'],
    variations: ['Com cinto', 'Halter entre pernas', 'Com colete', 'Com corrente'],
    commonMistakes: ['Peso excessivo', 'ROM incompleto', 'Kipping'],
    scientificSource: 'T-Nation - "5-3-1 Weighted Pull-up Protocol"',
  },

  'l sit pull up': {
    name: 'L-Sit Pull-Up',
    aliases: ['l-sit pullup', 'barra L', 'hanging L pullup'],
    primaryMuscles: ['latíssimo do dorso', 'core'],
    secondaryMuscles: ['bíceps', 'flexores de quadril', 'romboides'],
    movementPattern: 'puxada vertical com core isométrico',
    equipment: 'barra fixa',
    difficulty: 'avançado',
    biomechanics: {
      activation: 'Lat + core extremo - pernas em L durante toda a rep',
      rom: 'Manter pernas paralelas ao chão → puxar',
      joint: 'Ombro + cotovelo + quadril (isométrico)',
    },
    progressions: ['Knee raise pullup', 'Tuck L pullup', 'L-sit completo'],
    variations: ['Pronado', 'Supinado', 'Neutro'],
    commonMistakes: ['Pernas caindo', 'Perder o L', 'Swing'],
    scientificSource: 'T-Nation - "Gymnastics-Based Strength Training"',
  },

  'commando pull up': {
    name: 'Commando Pull-Up',
    aliases: ['commando pullup', 'barra commando', 'side to side pullup'],
    primaryMuscles: ['latíssimo do dorso'],
    secondaryMuscles: ['bíceps', 'oblíquos', 'romboides'],
    movementPattern: 'puxada vertical perpendicular à barra',
    equipment: 'barra fixa',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Lat + oblíquos - puxar com corpo perpendicular à barra',
      rom: 'Mãos uma atrás da outra → alternar lado do queixo',
      joint: 'Ombro + cotovelo',
    },
    progressions: ['Assistido', 'Peso corporal', 'Com peso'],
    variations: ['Alternando lados', 'Mesmo lado'],
    commonMistakes: ['Não alternar lados', 'Usar impulso', 'ROM curto'],
    scientificSource: 'T-Nation - "Military Pull-Up Variations"',
  },

  'typewriter pull up': {
    name: 'Typewriter Pull-Up',
    aliases: ['typewriter pullup', 'barra maquina de escrever', 'side to side pullup'],
    primaryMuscles: ['latíssimo do dorso'],
    secondaryMuscles: ['bíceps', 'core', 'deltóides'],
    movementPattern: 'puxada vertical com deslocamento lateral',
    equipment: 'barra fixa larga',
    difficulty: 'avançado',
    biomechanics: {
      activation: 'Lat + movimento lateral - deslizar de um lado ao outro no topo',
      rom: 'Puxar → deslizar para esquerda → deslizar para direita → descer',
      joint: 'Ombro + cotovelo',
    },
    progressions: ['Archer pull-up', 'Partial typewriter', 'Full typewriter'],
    variations: ['Wide grip', 'Com pausa em cada lado'],
    commonMistakes: ['Descer no meio do movimento', 'ROM lateral curto'],
    scientificSource: 'T-Nation - "Advanced Bodyweight Training"',
  },

  'muscle up': {
    name: 'Muscle-Up',
    aliases: ['muscle up', 'subida na barra', 'bar muscle up'],
    primaryMuscles: ['latíssimo do dorso', 'peitoral', 'tríceps'],
    secondaryMuscles: ['deltóides', 'core', 'bíceps'],
    movementPattern: 'puxada + empurrar em transição',
    equipment: 'barra fixa',
    difficulty: 'avançado',
    biomechanics: {
      activation: 'Full upper body - pull-up explosivo + dip no topo',
      rom: 'Puxada explosiva → transição → dip → lockout',
      joint: 'Ombro + cotovelo + punho',
    },
    progressions: ['Chest to bar pull-ups', 'Negative muscle-up', 'Banded muscle-up'],
    variations: ['Strict', 'Kipping', 'Ring muscle-up'],
    commonMistakes: ['Não puxar alto o suficiente', 'Transição lenta', 'Cotovelos não passando'],
    scientificSource: 'T-Nation - "The Muscle-Up Progression"',
  },

  // ============================================================
  // VARIAÇÕES DE REMADA - T-NATION
  // ============================================================

  'yates row': {
    name: 'Remada Yates',
    aliases: ['yates row', 'underhand row', 'remada supinada', 'dorian yates row'],
    primaryMuscles: ['latíssimo do dorso', 'bíceps'],
    secondaryMuscles: ['trapézio', 'romboides', 'lombar'],
    movementPattern: 'puxada horizontal supinada',
    equipment: 'barra',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Lat inferior + bíceps - tronco mais ereto que bent over row',
      rom: 'Pegada supinada → puxar até abdômen baixo',
      joint: 'Ombro + cotovelo',
    },
    progressions: ['Peso leve', 'Peso moderado', 'Peso pesado'],
    variations: ['Close grip', 'Medium grip', 'Com straps'],
    commonMistakes: ['Inclinar demais', 'Usar impulso', 'Peso nos bíceps'],
    scientificSource: 'Dorian Yates - T-Nation "Yates Row for Back Mass"',
  },

  't bar row': {
    name: 'Remada Cavalinho (T-Bar Row)',
    aliases: ['t bar row', 'remada cavalinho', 't-bar', 'landmine row bilateral'],
    primaryMuscles: ['latíssimo do dorso', 'romboides'],
    secondaryMuscles: ['bíceps', 'trapézio', 'lombar'],
    movementPattern: 'puxada horizontal com barra em T',
    equipment: 'máquina T-bar ou landmine',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Lat 88% + romboides - arco natural de movimento',
      rom: 'Puxar barra até abdômen → squeeze escapular',
      joint: 'Ombro + cotovelo',
    },
    progressions: ['Peso leve', 'Peso moderado', 'Peso pesado', 'Drop sets'],
    variations: ['Pegada fechada', 'Pegada larga', 'Chest supported'],
    commonMistakes: ['Usar impulso do corpo', 'ROM incompleto', 'Arredondar costas'],
    scientificSource: 'T-Nation - "T-Bar Row for Thickness"',
  },

  'helms row': {
    name: 'Remada Helms (Seal Row no Banco)',
    aliases: ['helms row', 'chest supported dumbbell row', 'prone incline row'],
    primaryMuscles: ['latíssimo do dorso', 'romboides'],
    secondaryMuscles: ['bíceps', 'trapézio médio'],
    movementPattern: 'puxada horizontal com suporte total',
    equipment: 'halteres + banco inclinado',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Costas puras - zero stress lombar, zero cheating',
      rom: 'Peito no banco → retrair escápulas → puxar',
      joint: 'Ombro + cotovelo + escápula',
    },
    progressions: ['Peso leve', 'Peso moderado', 'Com pausa no topo'],
    variations: ['Pronada', 'Neutra', 'Supinada'],
    commonMistakes: ['Levantar peito do banco', 'ROM curto', 'Não retrair escápulas'],
    scientificSource: 'Eric Helms / T-Nation - "Chest Supported Row for Pure Back Work"',
  },

  // ============================================================
  // EXERCÍCIOS DE OMBRO EXTRAS - T-NATION
  // ============================================================

  'lu raise': {
    name: 'Lu Raise (Elevação em Y)',
    aliases: ['lu raise', 'y raise', 'prone y raise', 'elevacao y'],
    primaryMuscles: ['deltóide posterior', 'trapézio inferior'],
    secondaryMuscles: ['romboides', 'manguito rotador'],
    movementPattern: 'elevação em Y deitado',
    equipment: 'halteres leves + banco inclinado',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Trap inferior + deltóide posterior - posição Y',
      rom: 'Deitado de bruços → elevar braços em Y até linha do corpo',
      joint: 'Ombro + escápula',
    },
    progressions: ['Sem peso', 'Peso leve', 'Com pausa'],
    variations: ['No banco', 'No chão', 'De pé inclinado'],
    commonMistakes: ['Peso muito pesado', 'Usar trapézio superior', 'ROM curto'],
    scientificSource: 'Lu Xiaojun / T-Nation - "Olympic Shoulder Health"',
  },

  'scott press': {
    name: 'Scott Press',
    aliases: ['scott press', 'rotational shoulder press', 'press rotacional'],
    primaryMuscles: ['deltóide anterior', 'deltóide medial'],
    secondaryMuscles: ['tríceps', 'serrátil anterior'],
    movementPattern: 'empurrar vertical com rotação',
    equipment: 'halteres',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Deltóides com rotação interna no topo - Larry Scott',
      rom: 'Press normal → girar halteres para dentro no topo',
      joint: 'Ombro + cotovelo',
    },
    progressions: ['Peso leve', 'Peso moderado', 'Cadência lenta'],
    variations: ['Sentado', 'Em pé'],
    commonMistakes: ['Não rotacionar', 'Usar impulso', 'Peso muito pesado'],
    scientificSource: 'Larry Scott - T-Nation "Old School Shoulder Training"',
  },

  'behind neck press': {
    name: 'Desenvolvimento por Trás (Cervical)',
    aliases: ['behind neck press', 'behind the neck press', 'desenvolvimento atras'],
    primaryMuscles: ['deltóide medial', 'deltóide posterior'],
    secondaryMuscles: ['tríceps', 'trapézio'],
    movementPattern: 'empurrar vertical por trás',
    equipment: 'barra',
    difficulty: 'avançado',
    biomechanics: {
      activation: 'Deltóide medial 90% - requer boa mobilidade de ombro',
      rom: 'Barra atrás do pescoço → overhead (não descer muito)',
      joint: 'Ombro + cotovelo',
    },
    progressions: ['Só se tiver mobilidade adequada', 'ROM parcial', 'ROM completo'],
    variations: ['Sentado', 'Em pé', 'Smith machine'],
    commonMistakes: ['Falta de mobilidade', 'Descer muito', 'Peso excessivo'],
    scientificSource: 'T-Nation - "Behind Neck Press if you have the mobility"',
  },

  'bradford press': {
    name: 'Bradford Press',
    aliases: ['bradford press', 'around the world press', 'press bradford'],
    primaryMuscles: ['deltóide anterior', 'deltóide medial', 'deltóide posterior'],
    secondaryMuscles: ['tríceps', 'trapézio'],
    movementPattern: 'press que alterna frente e trás',
    equipment: 'barra',
    difficulty: 'avançado',
    biomechanics: {
      activation: 'Todas as cabeças do deltóide - tensão constante',
      rom: 'Frente → acima da cabeça → atrás → repetir (sem lockout)',
      joint: 'Ombro',
    },
    progressions: ['Barra vazia', 'Peso leve', 'Aumentar reps'],
    variations: ['Parcial', 'Completo'],
    commonMistakes: ['Fazer lockout', 'Peso muito pesado', 'Velocidade excessiva'],
    scientificSource: 'T-Nation - "Non-stop tension for shoulder growth"',
  },

  'high pull': {
    name: 'High Pull (Puxada Alta)',
    aliases: ['high pull', 'puxada alta', 'upright row explosiva'],
    primaryMuscles: ['trapézio', 'deltóides'],
    secondaryMuscles: ['bíceps', 'quadríceps', 'glúteo'],
    movementPattern: 'puxada vertical explosiva',
    equipment: 'barra ou kettlebell',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Trapézio + deltóides - versão explosiva e segura da upright row',
      rom: 'Extensão de quadril → puxar alto com cotovelos elevados',
      joint: 'Quadril + ombros',
    },
    progressions: ['Hang high pull', 'Power high pull', 'Com mais peso'],
    variations: ['Com barra', 'Com kettlebell', 'Com halteres'],
    commonMistakes: ['Não usar quadril', 'Cotovelos baixos', 'Peso muito pesado'],
    scientificSource: 'T-Nation - "High Pull: Safer Than Upright Row"',
  },

  // ============================================================
  // CORE EXTRAS - T-NATION / STUART MCGILL
  // ============================================================

  'mcgill crunch': {
    name: 'McGill Crunch (Curl-Up)',
    aliases: ['mcgill curl up', 'mcgill crunch', 'abdominal mcgill'],
    primaryMuscles: ['reto abdominal'],
    secondaryMuscles: ['oblíquos'],
    movementPattern: 'flexão de tronco mínima',
    equipment: 'corpo livre',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Abdominal sem stress na coluna - apenas cabeça/ombros saem do chão',
      rom: 'Uma mão sob a lombar → elevar apenas cabeça e ombros',
      joint: 'Coluna (mínimo)',
    },
    progressions: ['Básico', 'Com pausa', 'Com mais reps'],
    variations: ['Mãos sob a lombar', 'Mãos no peito'],
    commonMistakes: ['Subir demais', 'Puxar pescoço', 'Achatar lombar'],
    scientificSource: 'Stuart McGill - T-Nation "Big 3 for Core Stability"',
  },

  'dead bug': {
    name: 'Dead Bug (Besouro Morto)',
    aliases: ['dead bug', 'besouro morto', 'dying bug'],
    primaryMuscles: ['core', 'reto abdominal'],
    secondaryMuscles: ['flexores de quadril', 'oblíquos'],
    movementPattern: 'anti-extensão dinâmica',
    equipment: 'corpo livre',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Core 90% - anti-extensão com movimento de membros',
      rom: 'Braço e perna opostos estendem enquanto core estabiliza',
      joint: 'Quadril + ombro + coluna (estabilização)',
    },
    progressions: ['Básico', 'Com banda', 'Com peso', 'Com kettlebell'],
    variations: ['Básico', 'Com banda nos pés', 'Com medicinebal'],
    commonMistakes: ['Lombar saindo do chão', 'Velocidade excessiva', 'Não respirar'],
    scientificSource: 'T-Nation - "Dead Bug for Anti-Extension Strength"',
  },

  'pallof press': {
    name: 'Pallof Press',
    aliases: ['pallof press', 'anti rotation press', 'press anti rotacao'],
    primaryMuscles: ['core', 'oblíquos'],
    secondaryMuscles: ['glúteo médio', 'deltóides'],
    movementPattern: 'anti-rotação isométrica',
    equipment: 'cabo ou banda',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Anti-rotação - core trabalha para resistir rotação',
      rom: 'Empurrar à frente → pausar → voltar resistindo rotação',
      joint: 'Coluna (anti-rotação)',
    },
    progressions: ['Mais leve', 'Mais pesado', 'Com pausa', 'Com overhead'],
    variations: ['Em pé', 'Half kneeling', 'Tall kneeling', 'Overhead'],
    commonMistakes: ['Girar o tronco', 'Muito perto do cabo', 'Sem pausa'],
    scientificSource: 'T-Nation - "Pallof Press for Rotational Core Stability"',
  },

  'hollow body hold': {
    name: 'Hollow Body Hold',
    aliases: ['hollow hold', 'hollow body', 'posicao de banana'],
    primaryMuscles: ['reto abdominal', 'core'],
    secondaryMuscles: ['flexores de quadril', 'serrátil anterior'],
    movementPattern: 'anti-extensão isométrica total',
    equipment: 'corpo livre',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Core 100% - posição de ginástica fundamental',
      rom: 'Lombar no chão → braços e pernas estendidos e elevados',
      joint: 'Coluna (estabilização total)',
    },
    progressions: ['Tuck', 'Single leg', 'Completo', 'Com peso'],
    variations: ['Tuck', 'Straddle', 'Full', 'Hollow rock'],
    commonMistakes: ['Lombar saindo do chão', 'Pernas muito altas', 'Braços muito altos'],
    scientificSource: 'T-Nation - "Gymnastics Core for Strength Athletes"',
  },

  'ab wheel rollout': {
    name: 'Ab Wheel Rollout',
    aliases: ['ab roller', 'roda abdominal', 'rollout', 'ab wheel'],
    primaryMuscles: ['reto abdominal', 'core'],
    secondaryMuscles: ['latíssimo do dorso', 'tríceps', 'serrátil anterior'],
    movementPattern: 'anti-extensão dinâmica',
    equipment: 'roda abdominal',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Anti-extensão extrema - lat e core trabalham juntos',
      rom: 'De joelhos → estender até braços retos → voltar',
      joint: 'Ombro + coluna',
    },
    progressions: ['Parcial', 'Completo de joelhos', 'Em pé', 'Com peso'],
    variations: ['De joelhos', 'Standing', 'Single arm', 'Diagonal'],
    commonMistakes: ['Quadril caindo', 'ROM curto', 'Arco lombar'],
    scientificSource: 'T-Nation - "Ab Wheel: King of Anti-Extension"',
  },

  'hanging leg raise': {
    name: 'Elevação de Pernas Pendurado',
    aliases: ['hanging leg raise', 'leg raise pendurado', 'elevacao pernas barra'],
    primaryMuscles: ['reto abdominal', 'flexores de quadril'],
    secondaryMuscles: ['oblíquos', 'antebraço'],
    movementPattern: 'flexão de quadril pendurado',
    equipment: 'barra fixa',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Abdominal inferior + hip flexors - maior ROM que no chão',
      rom: 'Pendurado → elevar pernas retas até paralelo ou mais',
      joint: 'Quadril',
    },
    progressions: ['Knee raise', 'Leg raise paralelo', 'Toes to bar'],
    variations: ['Joelhos', 'Pernas retas', 'Com rotação', 'Toes to bar'],
    commonMistakes: ['Swing excessivo', 'Usar impulso', 'ROM curto'],
    scientificSource: 'T-Nation - "Hanging Ab Work for Lower Abs"',
  },

  'dragon flag': {
    name: 'Dragon Flag',
    aliases: ['dragon flag', 'bandeira do dragao', 'bruce lee flag'],
    primaryMuscles: ['reto abdominal', 'core'],
    secondaryMuscles: ['oblíquos', 'latíssimo do dorso', 'glúteo'],
    movementPattern: 'anti-extensão extrema',
    equipment: 'banco ou suporte fixo',
    difficulty: 'avançado',
    biomechanics: {
      activation: 'Core total - apenas ombros tocam o banco',
      rom: 'Corpo reto como tábua → descer controlado → subir',
      joint: 'Coluna total',
    },
    progressions: ['Tuck', 'Single leg', 'Straddle', 'Completo'],
    variations: ['Negativas', 'Tuck', 'Full'],
    commonMistakes: ['Dobrar no quadril', 'Não ter força para controlar'],
    scientificSource: 'T-Nation - "Dragon Flag: Ultimate Core Test"',
  },

  // ============================================================
  // EXERCÍCIOS DE PERNA EXTRAS - T-NATION
  // ============================================================

  'spanish squat': {
    name: 'Agachamento Espanhol',
    aliases: ['spanish squat', 'squat espanhol', 'banded knee squat'],
    primaryMuscles: ['quadríceps'],
    secondaryMuscles: ['core'],
    movementPattern: 'agachamento com tração nos joelhos',
    equipment: 'banda elástica forte + rack ou poste',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'VMO 95% - banda puxa joelhos permitindo tronco mais vertical',
      rom: 'Banda atrás dos joelhos → agachamento profundo → subir',
      joint: 'Joelhos (dominante)',
    },
    progressions: ['Peso corporal', 'Segurando peso', 'Mais fundo'],
    variations: ['Bilateral', 'Unilateral', 'Isométrico'],
    commonMistakes: ['Banda muito leve', 'Não ir fundo', 'Joelhos não tracking'],
    scientificSource: 'T-Nation - "Spanish Squat for VMO and Knee Health"',
  },

  'cyclist squat': {
    name: 'Agachamento de Ciclista',
    aliases: ['cyclist squat', 'quad squat', 'squat ciclista', 'heel elevated narrow squat'],
    primaryMuscles: ['quadríceps'],
    secondaryMuscles: ['glúteo'],
    movementPattern: 'agachamento estreito com calcanhar elevado',
    equipment: 'halteres + calço para calcanhares',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Quads isolados - stance estreito + calcanhares altos = quads puros',
      rom: 'Pés juntos em calço → agachamento profundo vertical',
      joint: 'Joelhos (dominante)',
    },
    progressions: ['Peso corporal', 'Halteres', 'Barra', 'Mais elevação'],
    variations: ['Com halteres', 'Com barra frontal', 'Goblet'],
    commonMistakes: ['Stance muito largo', 'Inclinar para frente'],
    scientificSource: 'T-Nation - "Cyclist Squat for Pure Quad Work"',
  },

  'reverse nordic curl': {
    name: 'Nordic Curl Reverso (Quad)',
    aliases: ['reverse nordic', 'nordic reverso', 'quad nordic', 'sissy squat assistido'],
    primaryMuscles: ['quadríceps', 'reto femoral'],
    secondaryMuscles: ['core'],
    movementPattern: 'extensão de joelho reversa',
    equipment: 'corpo livre + suporte para tornozelos',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Reto femoral em alongamento máximo - oposto do nordic curl',
      rom: 'De joelhos → inclinar para trás → voltar',
      joint: 'Joelhos',
    },
    progressions: ['Parcial', 'Completo', 'Com peso no peito'],
    variations: ['Assistido', 'Livre', 'Com peso'],
    commonMistakes: ['Flexionar quadril', 'Não controlar descida', 'ROM curto'],
    scientificSource: 'T-Nation - "Reverse Nordic for Quad Strength and Flexibility"',
  },

  'hip thrust machine': {
    name: 'Hip Thrust na Máquina',
    aliases: ['hip thrust machine', 'glute drive', 'maquina de gluteo hip thrust'],
    primaryMuscles: ['glúteo máximo'],
    secondaryMuscles: ['isquiotibiais', 'core'],
    movementPattern: 'extensão de quadril guiada',
    equipment: 'máquina de hip thrust/glute drive',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Glúteo 90% - setup mais fácil que barra livre',
      rom: 'Extensão completa de quadril na máquina',
      joint: 'Coxofemoral',
    },
    progressions: ['Peso leve', 'Peso moderado', 'Peso pesado', 'Pausa no topo'],
    variations: ['Bilateral', 'Unilateral', 'Com banda'],
    commonMistakes: ['Hiperextender lombar', 'ROM curto', 'Peso excessivo'],
    scientificSource: 'Bret Contreras - "Glute Drive Machine Design"',
  },

  'pendulum squat': {
    name: 'Agachamento Pendulum',
    aliases: ['pendulum squat', 'squat pendulo', 'pendulum machine'],
    primaryMuscles: ['quadríceps', 'glúteo'],
    secondaryMuscles: ['isquiotibiais'],
    movementPattern: 'agachamento em arco pendular',
    equipment: 'máquina pendulum squat',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Quads + glúteo - arco do pendulum mantém tensão constante',
      rom: 'Agachamento profundo no arco da máquina',
      joint: 'Joelhos + quadril',
    },
    progressions: ['Peso leve', 'Peso moderado', 'Peso pesado'],
    variations: ['Pés altos', 'Pés baixos', 'Stance largo', 'Stance estreito'],
    commonMistakes: ['Peso muito no calcanhar', 'ROM curto', 'Joelhos colapsando'],
    scientificSource: 'T-Nation - "Pendulum Squat for Constant Tension"',
  },

  'cossack squat': {
    name: 'Agachamento Cossaco',
    aliases: ['cossack squat', 'squat cossaco', 'lateral squat', 'side squat'],
    primaryMuscles: ['adutores', 'quadríceps', 'glúteo'],
    secondaryMuscles: ['isquiotibiais', 'core'],
    movementPattern: 'agachamento lateral profundo',
    equipment: 'corpo livre ou kettlebell',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Adutores + mobilidade de quadril - agachamento para o lado',
      rom: 'Stance largo → agachar para um lado → perna oposta reta',
      joint: 'Joelhos + quadril + tornozelo',
    },
    progressions: ['Peso corporal', 'Com kettlebell', 'Com barra'],
    variations: ['Sem peso', 'Goblet', 'Com barra nas costas'],
    commonMistakes: ['Não ir fundo', 'Calcanhar levantando', 'Joelho colapsando'],
    scientificSource: 'T-Nation - "Cossack Squat for Hip Mobility and Adductors"',
  },

  // ============================================================
  // VARIAÇÕES DE DEADLIFT AVANÇADAS - T-NATION
  // ============================================================

  'snatch grip deadlift': {
    name: 'Levantamento Terra Pegada Snatch',
    aliases: ['snatch grip deadlift', 'terra pegada larga', 'wide grip deadlift'],
    primaryMuscles: ['posterior de coxa', 'glúteo', 'costas superiores'],
    secondaryMuscles: ['trapézio', 'latíssimo do dorso', 'lombar', 'antebraço'],
    movementPattern: 'levantamento terra com pegada extra-larga',
    equipment: 'barra olímpica',
    difficulty: 'avançado',
    biomechanics: {
      activation: 'Trapézio superior 95% - pegada larga força postura mais baixa e maior ROM',
      rom: 'Pegada na marca do snatch → levantar até extensão completa',
      joint: 'Quadril + joelhos + coluna',
    },
    progressions: ['Peso leve', 'Peso moderado', 'Com déficit', 'Peso pesado'],
    variations: ['Do chão', 'Com déficit', 'Com pausa'],
    commonMistakes: ['Arredondar costas', 'Pegada muito estreita', 'Puxar com braços'],
    scientificSource: 'T-Nation - Christian Thibaudeau "Snatch Grip Deadlift for Upper Back"',
  },

  'jefferson deadlift': {
    name: 'Levantamento Terra Jefferson',
    aliases: ['jefferson deadlift', 'terra jefferson', 'straddle deadlift'],
    primaryMuscles: ['quadríceps', 'glúteo', 'adutores'],
    secondaryMuscles: ['core', 'oblíquos', 'lombar'],
    movementPattern: 'levantamento terra com barra entre as pernas',
    equipment: 'barra olímpica',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Core anti-rotacional 90% - barra entre pernas cria torque único',
      rom: 'Uma perna na frente, outra atrás da barra → levantar',
      joint: 'Quadril + joelhos + anti-rotação',
    },
    progressions: ['Peso leve', 'Peso moderado', 'Alternar lado', 'Peso pesado'],
    variations: ['Lado esquerdo na frente', 'Lado direito na frente', 'Com déficit'],
    commonMistakes: ['Rotacionar o tronco', 'Não alternar lados', 'Posição assimétrica'],
    scientificSource: 'T-Nation - "Jefferson Deadlift for Anti-Rotation Strength"',
  },

  'trap bar deadlift': {
    name: 'Levantamento Terra na Trap Bar',
    aliases: ['trap bar deadlift', 'hex bar deadlift', 'terra na barra hexagonal'],
    primaryMuscles: ['quadríceps', 'glúteo', 'posterior de coxa'],
    secondaryMuscles: ['lombar', 'trapézio', 'antebraço'],
    movementPattern: 'levantamento terra com centro de gravidade neutro',
    equipment: 'trap bar / hex bar',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Quads 85% + Glúteo 85% - posição mais vertical que barra reta',
      rom: 'Pegar nas alças laterais → extensão completa de quadril e joelhos',
      joint: 'Quadril + joelhos',
    },
    progressions: ['Alças altas', 'Alças baixas', 'Peso pesado', 'Com pausa'],
    variations: ['High handle', 'Low handle', 'Com jump'],
    commonMistakes: ['Arredondar costas', 'Não travar no topo', 'Joelhos para dentro'],
    scientificSource: 'T-Nation - "Trap Bar Deadlift: Safer and More Athletic"',
  },

  'deficit deadlift': {
    name: 'Levantamento Terra com Déficit',
    aliases: ['deficit deadlift', 'terra com deficit', 'deadlift em plataforma'],
    primaryMuscles: ['posterior de coxa', 'glúteo', 'lombar'],
    secondaryMuscles: ['quadríceps', 'core', 'latíssimo do dorso'],
    movementPattern: 'levantamento terra com ROM aumentado',
    equipment: 'barra olímpica + plataforma/anilhas para subir',
    difficulty: 'avançado',
    biomechanics: {
      activation: 'Posterior de coxa 95% - déficit de 5-10cm aumenta demanda do início do movimento',
      rom: 'De pé na plataforma → barra começa mais baixa → extensão completa',
      joint: 'Quadril + joelhos',
    },
    progressions: ['Déficit pequeno (5cm)', 'Déficit médio (7cm)', 'Déficit alto (10cm)'],
    variations: ['Convencional', 'Sumo', 'Snatch grip'],
    commonMistakes: ['Déficit muito alto', 'Arredondar lombar', 'Perder posição'],
    scientificSource: 'T-Nation - "Deficit Deadlift for Explosive Starting Strength"',
  },

  'rack pull': {
    name: 'Rack Pull (Terra Parcial)',
    aliases: ['rack pull', 'terra parcial', 'deadlift from pins', 'block pull'],
    primaryMuscles: ['trapézio', 'lombar', 'glúteo'],
    secondaryMuscles: ['posterior de coxa', 'antebraço'],
    movementPattern: 'levantamento terra parcial do rack',
    equipment: 'barra olímpica + rack',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Trapézio 100% - permite cargas muito mais pesadas que terra completo',
      rom: 'Barra nos pinos (abaixo/acima do joelho) → extensão completa',
      joint: 'Quadril + coluna',
    },
    progressions: ['Abaixo do joelho', 'Na altura do joelho', 'Acima do joelho'],
    variations: ['Below knee', 'At knee', 'Above knee'],
    commonMistakes: ['Hiperextender lombar', 'Puxar com lombar', 'Não travar glúteo'],
    scientificSource: 'T-Nation - "Rack Pulls for Massive Traps and Lockout Strength"',
  },

  // ============================================================
  // EXERCÍCIOS DE TRAPÉZIO E DELTÓIDE POSTERIOR - T-NATION
  // ============================================================

  'face pull': {
    name: 'Face Pull',
    aliases: ['face pull', 'puxada para rosto', 'rope face pull'],
    primaryMuscles: ['deltóide posterior', 'trapézio médio', 'romboide'],
    secondaryMuscles: ['manguito rotador', 'bíceps'],
    movementPattern: 'puxada horizontal para o rosto',
    equipment: 'cabo com corda',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Deltóide posterior 90% + rotação externa - essencial para saúde do ombro',
      rom: 'Puxar corda para o rosto → separar no final → rotação externa',
      joint: 'Ombro (rotação externa)',
    },
    progressions: ['Peso leve', 'Peso moderado', 'Com pausa', 'Superset com push'],
    variations: ['Em pé', 'Ajoelhado', 'Inclinado', 'High pull face'],
    commonMistakes: ['Usar momentum', 'Não fazer rotação externa', 'Peso muito pesado'],
    scientificSource: 'T-Nation - John Meadows "Face Pulls for Shoulder Health"',
  },

  'powell raise': {
    name: 'Powell Raise',
    aliases: ['powell raise', 'lying rear delt raise', 'powell delt raise'],
    primaryMuscles: ['deltóide posterior'],
    secondaryMuscles: ['trapézio médio', 'romboide'],
    movementPattern: 'elevação lateral deitado em banco inclinado',
    equipment: 'halter + banco inclinado',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Deltóide posterior 95% - posição elimina momentum completamente',
      rom: 'Deitado de lado no banco → elevar halter até paralelo ao solo',
      joint: 'Ombro (abdução horizontal)',
    },
    progressions: ['Peso leve', 'Peso moderado', 'Com pausa', 'Drop set'],
    variations: ['No banco', 'No chão', 'Com rotação'],
    commonMistakes: ['Usar momentum', 'Levantar muito alto', 'Não controlar descida'],
    scientificSource: 'T-Nation - "Powell Raise: Best Rear Delt Exercise"',
  },

  'prone y raise': {
    name: 'Y Raise Pronado',
    aliases: ['y raise', 'prone y raise', 'y deitado', 'incline y raise'],
    primaryMuscles: ['trapézio inferior', 'deltóide posterior'],
    secondaryMuscles: ['serrátil anterior', 'romboide'],
    movementPattern: 'elevação em Y deitado de bruços',
    equipment: 'halteres leves + banco',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Trapézio inferior 90% - essencial para estabilidade escapular',
      rom: 'Deitado de bruços → elevar braços em Y (45°) com polegares para cima',
      joint: 'Escápula + ombro',
    },
    progressions: ['Sem peso', 'Peso leve', 'Com pausa no topo'],
    variations: ['Y', 'T', 'W', 'I'],
    commonMistakes: ['Peso muito pesado', 'Não fazer retração escapular', 'Elevar ombros'],
    scientificSource: 'T-Nation - Eric Cressey "Y-T-W-I for Shoulder Health"',
  },

  'prone t raise': {
    name: 'T Raise Pronado',
    aliases: ['t raise', 'prone t raise', 't deitado', 'incline t raise'],
    primaryMuscles: ['trapézio médio', 'romboide'],
    secondaryMuscles: ['deltóide posterior'],
    movementPattern: 'elevação em T deitado de bruços',
    equipment: 'halteres leves + banco',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Trapézio médio 90% + romboide - retração escapular pura',
      rom: 'Deitado de bruços → elevar braços lateralmente em T',
      joint: 'Escápula + ombro',
    },
    progressions: ['Sem peso', 'Peso leve', 'Com pausa no topo'],
    variations: ['Y', 'T', 'W', 'I'],
    commonMistakes: ['Peso muito pesado', 'Elevar ombros', 'Não retrair escápulas'],
    scientificSource: 'T-Nation - Eric Cressey "Y-T-W-I for Shoulder Health"',
  },

  'barbell shrug': {
    name: 'Encolhimento com Barra',
    aliases: ['barbell shrug', 'encolhimento barra', 'shrug com barra'],
    primaryMuscles: ['trapézio superior'],
    secondaryMuscles: ['levantador da escápula', 'romboide'],
    movementPattern: 'elevação de escápulas com barra',
    equipment: 'barra olímpica',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Trapézio superior 95% - movimento simples e efetivo',
      rom: 'Segurar barra na frente → elevar ombros até as orelhas → baixar controlado',
      joint: 'Escápula',
    },
    progressions: ['Peso moderado', 'Peso pesado', 'Com pausa', 'Straps'],
    variations: ['Pegada pronada', 'Pegada supinada', 'Atrás das costas'],
    commonMistakes: ['Rotacionar ombros', 'ROM curto', 'Usar momentum'],
    scientificSource: 'T-Nation - "Build Massive Traps with Proper Shrugging"',
  },

  'dumbbell shrug': {
    name: 'Encolhimento com Halteres',
    aliases: ['dumbbell shrug', 'encolhimento halteres', 'shrug com halteres'],
    primaryMuscles: ['trapézio superior'],
    secondaryMuscles: ['levantador da escápula', 'antebraço'],
    movementPattern: 'elevação de escápulas com halteres',
    equipment: 'halteres',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Trapézio superior 95% - halteres permitem ROM mais natural',
      rom: 'Halteres ao lado → elevar ombros verticalmente → baixar controlado',
      joint: 'Escápula',
    },
    progressions: ['Peso moderado', 'Peso pesado', 'Com pausa', 'Unilateral'],
    variations: ['Bilateral', 'Unilateral', 'Inclinado'],
    commonMistakes: ['Rotacionar ombros', 'Flexionar cotovelos', 'Momentum'],
    scientificSource: 'T-Nation - "Dumbbell Shrugs for Natural Trap Development"',
  },

  'farmers walk': {
    name: 'Farmer Walk (Caminhada do Fazendeiro)',
    aliases: ['farmers walk', 'caminhada fazendeiro', 'farmer carry', 'loaded carry'],
    primaryMuscles: ['trapézio', 'antebraço', 'core'],
    secondaryMuscles: ['quadríceps', 'glúteo', 'panturrilha', 'deltóide'],
    movementPattern: 'carregamento e caminhada com peso',
    equipment: 'halteres pesados ou farmer handles',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Grip 100% + Core 90% + Trapézio 85% - exercício funcional completo',
      rom: 'Pegar pesos pesados → caminhar com postura ereta',
      joint: 'Corpo inteiro',
    },
    progressions: ['Peso moderado curta distância', 'Peso pesado', 'Distância maior'],
    variations: ['Bilateral', 'Unilateral (suitcase)', 'Overhead', 'Rack position'],
    commonMistakes: ['Inclinar para os lados', 'Passos muito largos', 'Postura curvada'],
    scientificSource: 'T-Nation - Dan John "Loaded Carries: The Missing Link"',
  },

  // ============================================================
  // EXERCÍCIOS DE ANTEBRAÇO - T-NATION
  // ============================================================

  'wrist curl': {
    name: 'Rosca de Punho',
    aliases: ['wrist curl', 'rosca punho', 'flexao de punho', 'forearm curl'],
    primaryMuscles: ['flexores do punho', 'flexor ulnar do carpo'],
    secondaryMuscles: ['braquiorradial'],
    movementPattern: 'flexão de punho',
    equipment: 'barra ou halteres + banco',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Flexores do antebraço 95% - isola face anterior do antebraço',
      rom: 'Antebraço apoiado → deixar punho estender → flexionar até contração',
      joint: 'Punho',
    },
    progressions: ['Peso leve', 'Peso moderado', 'Com pausa'],
    variations: ['Com barra', 'Com halteres', 'Atrás das costas'],
    commonMistakes: ['ROM curto', 'Levantar antebraço', 'Peso muito pesado'],
    scientificSource: 'T-Nation - "Complete Forearm Development"',
  },

  'reverse wrist curl': {
    name: 'Rosca de Punho Reversa',
    aliases: ['reverse wrist curl', 'rosca punho reversa', 'extensao de punho'],
    primaryMuscles: ['extensores do punho', 'extensor radial do carpo'],
    secondaryMuscles: ['braquiorradial'],
    movementPattern: 'extensão de punho',
    equipment: 'barra ou halteres + banco',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Extensores do antebraço 95% - isola face posterior do antebraço',
      rom: 'Antebraço apoiado pegada pronada → estender punho para cima',
      joint: 'Punho',
    },
    progressions: ['Peso leve', 'Peso moderado', 'Com pausa'],
    variations: ['Com barra', 'Com halteres', 'Em pé'],
    commonMistakes: ['ROM curto', 'Peso muito pesado', 'Mover antebraço'],
    scientificSource: 'T-Nation - "Complete Forearm Development"',
  },

  'plate pinch': {
    name: 'Pinça de Anilha',
    aliases: ['plate pinch', 'pinca de anilha', 'pinch grip'],
    primaryMuscles: ['flexores dos dedos', 'polegar'],
    secondaryMuscles: ['antebraço'],
    movementPattern: 'segurar anilhas com dedos em pinça',
    equipment: 'anilhas lisas',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Grip de pinça 100% - trabalha polegar e dedos especificamente',
      rom: 'Segurar duas anilhas com face lisa para fora → manter pelo tempo',
      joint: 'Dedos + polegar',
    },
    progressions: ['Anilhas leves', 'Anilhas mais pesadas', 'Mais tempo'],
    variations: ['Estático', 'Caminhando', 'Uma mão'],
    commonMistakes: ['Deixar cair', 'Não usar polegar corretamente', 'Tempo muito curto'],
    scientificSource: 'T-Nation - "Grip Training for Real World Strength"',
  },

  'dead hang': {
    name: 'Dead Hang (Suspensão)',
    aliases: ['dead hang', 'suspensao', 'barra fixa hang', 'passive hang'],
    primaryMuscles: ['antebraço', 'flexores dos dedos'],
    secondaryMuscles: ['latíssimo do dorso', 'ombros'],
    movementPattern: 'suspensão estática na barra',
    equipment: 'barra fixa',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Grip 100% + descompressão de coluna - simples mas efetivo',
      rom: 'Segurar na barra → relaxar corpo → manter',
      joint: 'Ombro (passivo) + mãos',
    },
    progressions: ['30 segundos', '1 minuto', '2 minutos', 'Uma mão'],
    variations: ['Duas mãos', 'Uma mão', 'Com peso'],
    commonMistakes: ['Soltar muito cedo', 'Não relaxar ombros', 'Balançar'],
    scientificSource: 'T-Nation - "Dead Hang for Grip and Shoulder Health"',
  },

  // ============================================================
  // EXERCÍCIOS DE PANTURRILHA AVANÇADOS - T-NATION
  // ============================================================

  'donkey calf raise': {
    name: 'Elevação de Panturrilha Donkey',
    aliases: ['donkey calf raise', 'panturrilha donkey', 'donkey raise'],
    primaryMuscles: ['gastrocnêmio'],
    secondaryMuscles: ['sóleo'],
    movementPattern: 'elevação de panturrilha com quadril flexionado',
    equipment: 'máquina donkey ou parceiro nas costas',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Gastrocnêmio 100% - flexão de quadril alonga o gastrocnêmio maximamente',
      rom: 'Inclinado 90° no quadril → elevar calcanhares → alongar embaixo',
      joint: 'Tornozelo',
    },
    progressions: ['Peso corporal', 'Com peso', 'Unilateral'],
    variations: ['Na máquina', 'Com parceiro', 'No smith'],
    commonMistakes: ['ROM curto', 'Não alongar embaixo', 'Velocidade alta'],
    scientificSource: 'Arnold Schwarzenegger / T-Nation "Golden Era Calf Training"',
  },

  'tibialis raise': {
    name: 'Elevação de Tibial',
    aliases: ['tibialis raise', 'elevacao tibial', 'tib raise', 'dorsiflexion'],
    primaryMuscles: ['tibial anterior'],
    secondaryMuscles: [],
    movementPattern: 'dorsiflexão do tornozelo',
    equipment: 'máquina tibial ou peso nos pés',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Tibial anterior 95% - músculo negligenciado mas crucial para atletas',
      rom: 'Calcanhares apoiados → levantar ponta dos pés → baixar controlado',
      joint: 'Tornozelo',
    },
    progressions: ['Peso corporal', 'Com anilha nos pés', 'Na máquina'],
    variations: ['Sentado', 'Em pé', 'Na máquina'],
    commonMistakes: ['ROM curto', 'Velocidade alta', 'Negligenciar completamente'],
    scientificSource: 'T-Nation - "Tibialis Training for Bulletproof Shins"',
  },

  // ============================================================
  // EXERCÍCIOS DE PEITO EXTRAS - T-NATION
  // ============================================================

  'guillotine press': {
    name: 'Supino Guilhotina',
    aliases: ['guillotine press', 'supino guilhotina', 'neck press', 'supino no pescoco'],
    primaryMuscles: ['peitoral maior (porção clavicular)'],
    secondaryMuscles: ['deltóide anterior', 'tríceps'],
    movementPattern: 'supino com barra descendo para o pescoço',
    equipment: 'barra + banco reto',
    difficulty: 'avançado',
    biomechanics: {
      activation: 'Peitoral superior 95% - posição mais alongada do peitoral',
      rom: 'Barra desce em direção ao pescoço (não toca) → empurrar verticalmente',
      joint: 'Ombro + cotovelo',
    },
    progressions: ['Peso leve', 'Peso moderado', 'Nunca ir pesado'],
    variations: ['Com halteres', 'Na máquina smith'],
    commonMistakes: ['Peso pesado demais', 'Deixar barra tocar pescoço', 'Sem spotter'],
    scientificSource: 'Vince Gironda / T-Nation "Guillotine Press for Upper Chest"',
  },

  'svend press': {
    name: 'Svend Press',
    aliases: ['svend press', 'plate squeeze press', 'pressing anilhas'],
    primaryMuscles: ['peitoral maior (linha média)'],
    secondaryMuscles: ['deltóide anterior', 'tríceps'],
    movementPattern: 'pressionando anilhas uma contra outra',
    equipment: 'anilhas',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Peitoral medial 90% - contração isométrica constante',
      rom: 'Apertar anilhas no peito → estender braços → manter apertando → voltar',
      joint: 'Ombro + cotovelo',
    },
    progressions: ['Anilha leve', 'Anilha pesada', 'Com pausa'],
    variations: ['Em pé', 'Deitado', 'Inclinado'],
    commonMistakes: ['Não apertar forte', 'Soltar tensão', 'Peso muito pesado'],
    scientificSource: 'T-Nation - "Svend Press for Inner Chest Development"',
  },

  'hex press': {
    name: 'Hex Press',
    aliases: ['hex press', 'squeeze press halteres', 'crush press'],
    primaryMuscles: ['peitoral maior', 'tríceps'],
    secondaryMuscles: ['deltóide anterior'],
    movementPattern: 'supino com halteres pressionados um contra o outro',
    equipment: 'halteres hexagonais',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Peitoral medial 85% + Tríceps 80% - tensão constante no peito',
      rom: 'Halteres juntos no peito → empurrar mantendo pressionados → baixar',
      joint: 'Ombro + cotovelo',
    },
    progressions: ['Peso leve', 'Peso moderado', 'Com pausa'],
    variations: ['Reto', 'Inclinado', 'Declinado'],
    commonMistakes: ['Separar os halteres', 'Perder tensão', 'ROM curto'],
    scientificSource: 'T-Nation - "Hex Press for Chest Activation"',
  },

  'floor press': {
    name: 'Supino no Chão',
    aliases: ['floor press', 'supino no chao', 'press no solo'],
    primaryMuscles: ['tríceps', 'peitoral maior'],
    secondaryMuscles: ['deltóide anterior'],
    movementPattern: 'supino com ROM limitado pelo chão',
    equipment: 'barra ou halteres',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Tríceps 90% - elimina impulso das pernas e limita contribuição do peito',
      rom: 'Deitado no chão → barra desce até cotovelos tocarem → empurrar',
      joint: 'Cotovelo + ombro',
    },
    progressions: ['Peso moderado', 'Peso pesado', 'Com pausa'],
    variations: ['Com barra', 'Com halteres', 'Unilateral'],
    commonMistakes: ['Deixar cotovelos baterem forte', 'Não fazer pausa', 'Arquear costas'],
    scientificSource: 'T-Nation - "Floor Press for Lockout Strength"',
  },

  // ============================================================
  // MOVIMENTOS FUNCIONAIS E EXPLOSIVOS - T-NATION
  // ============================================================

  'power clean': {
    name: 'Power Clean',
    aliases: ['power clean', 'arranco em pe', 'clean olimpico'],
    primaryMuscles: ['posterior de coxa', 'glúteo', 'trapézio'],
    secondaryMuscles: ['quadríceps', 'deltóide', 'core', 'antebraço'],
    movementPattern: 'movimento olímpico explosivo',
    equipment: 'barra olímpica',
    difficulty: 'avançado',
    biomechanics: {
      activation: 'Corpo inteiro explosivo - tripla extensão (tornozelo, joelho, quadril)',
      rom: 'Barra no chão → puxar explosivamente → receber na posição de rack',
      joint: 'Corpo inteiro',
    },
    progressions: ['Hang clean', 'Power clean', 'Full clean'],
    variations: ['Do chão', 'Do hang', 'Dos blocos'],
    commonMistakes: ['Puxar com braços', 'Não fazer tripla extensão', 'Recepção ruim'],
    scientificSource: 'T-Nation - "Power Clean for Athletic Performance"',
  },

  'hang clean': {
    name: 'Hang Clean',
    aliases: ['hang clean', 'clean do hang', 'arranco suspenso'],
    primaryMuscles: ['posterior de coxa', 'glúteo', 'trapézio'],
    secondaryMuscles: ['quadríceps', 'deltóide', 'core'],
    movementPattern: 'clean começando da posição suspensa',
    equipment: 'barra olímpica',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Explosão de quadril 95% - foco na segunda puxada',
      rom: 'Barra na altura do joelho → explosão de quadril → receber em rack',
      joint: 'Quadril + joelhos + ombros',
    },
    progressions: ['Hang alto', 'Hang no joelho', 'Hang abaixo joelho'],
    variations: ['High hang', 'Knee hang', 'Below knee'],
    commonMistakes: ['Não usar quadril', 'Puxar com braços cedo', 'Recepção desalinhada'],
    scientificSource: 'T-Nation - "Hang Clean for Explosive Hip Power"',
  },

  'push press': {
    name: 'Push Press',
    aliases: ['push press', 'desenvolvimento empurrado', 'press com impulsao'],
    primaryMuscles: ['deltóide', 'tríceps'],
    secondaryMuscles: ['quadríceps', 'glúteo', 'core'],
    movementPattern: 'desenvolvimento com impulso de pernas',
    equipment: 'barra olímpica',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Deltóide 85% + potência de pernas - permite cargas maiores que strict press',
      rom: 'Barra em rack → leve flexão de joelhos → extensão explosiva → empurrar overhead',
      joint: 'Joelhos + quadril + ombros',
    },
    progressions: ['Peso moderado', 'Peso pesado', 'Push jerk'],
    variations: ['Com barra', 'Com halteres', 'Com kettlebells'],
    commonMistakes: ['Dip muito fundo', 'Não sincronizar pernas e braços', 'Inclinar para trás'],
    scientificSource: 'T-Nation - "Push Press for Overhead Strength"',
  },

  'kettlebell swing': {
    name: 'Swing com Kettlebell',
    aliases: ['kettlebell swing', 'balanco kettlebell', 'russian swing', 'kb swing'],
    primaryMuscles: ['glúteo', 'posterior de coxa'],
    secondaryMuscles: ['core', 'deltóide', 'lombar', 'antebraço'],
    movementPattern: 'balanço com extensão explosiva de quadril',
    equipment: 'kettlebell',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Glúteo 95% + posterior de coxa 90% - movimento balístico de hip hinge',
      rom: 'Kettlebell entre pernas → extensão explosiva de quadril → até altura dos ombros',
      joint: 'Quadril',
    },
    progressions: ['KB leve', 'KB moderado', 'KB pesado', 'One-arm swing'],
    variations: ['Russian (até ombros)', 'American (overhead)', 'Single-arm'],
    commonMistakes: ['Usar braços para levantar', 'Agachar em vez de hip hinge', 'Lombar arredondada'],
    scientificSource: 'Pavel Tsatsouline / T-Nation "Enter the Kettlebell"',
  },

  'turkish get up': {
    name: 'Turkish Get-Up',
    aliases: ['turkish get up', 'levantada turca', 'tgu', 'get up'],
    primaryMuscles: ['core', 'deltóide', 'glúteo'],
    secondaryMuscles: ['quadríceps', 'tríceps', 'estabilizadores do ombro'],
    movementPattern: 'sequência complexa de levantar do chão com peso overhead',
    equipment: 'kettlebell ou halter',
    difficulty: 'avançado',
    biomechanics: {
      activation: 'Estabilidade total - cada fase trabalha diferentes músculos',
      rom: 'Deitado → para o cotovelo → para a mão → ponte → ajoelhado → de pé → reverso',
      joint: 'Corpo inteiro',
    },
    progressions: ['Sem peso', 'KB leve', 'KB moderado', 'KB pesado'],
    variations: ['Só metade', 'Completo', 'Com pausa em cada fase'],
    commonMistakes: ['Perder olho no peso', 'Pular fases', 'Velocidade alta'],
    scientificSource: 'Pavel Tsatsouline / T-Nation "Turkish Get-Up Mastery"',
  },

  'sled push': {
    name: 'Empurrar Trenó',
    aliases: ['sled push', 'prowler push', 'empurrar prowler', 'push sled'],
    primaryMuscles: ['quadríceps', 'glúteo', 'panturrilha'],
    secondaryMuscles: ['core', 'deltóide', 'tríceps'],
    movementPattern: 'empurrar trenó pesado',
    equipment: 'trenó/prowler',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Quads 90% + condicionamento - concêntrico puro sem fase excêntrica',
      rom: 'Posição de sprint → empurrar mantendo posição baixa',
      joint: 'Quadril + joelhos + tornozelos',
    },
    progressions: ['Peso leve', 'Peso moderado', 'Peso pesado', 'Sprints'],
    variations: ['Posição alta', 'Posição baixa', 'Com corrente'],
    commonMistakes: ['Posição muito vertical', 'Passos curtos', 'Não usar core'],
    scientificSource: 'T-Nation - "Prowler: The Ultimate Conditioning Tool"',
  },

  'sled drag': {
    name: 'Puxar Trenó',
    aliases: ['sled drag', 'prowler drag', 'puxar prowler', 'backward sled drag'],
    primaryMuscles: ['quadríceps', 'glúteo'],
    secondaryMuscles: ['panturrilha', 'core', 'posterior de coxa'],
    movementPattern: 'puxar trenó caminhando para trás',
    equipment: 'trenó + cinto ou corda',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Quads 95% - caminhada reversa com resistência',
      rom: 'Preso ao trenó → caminhar para trás mantendo postura',
      joint: 'Quadril + joelhos',
    },
    progressions: ['Peso leve', 'Peso moderado', 'Peso pesado'],
    variations: ['Para trás', 'Para frente', 'Lateral'],
    commonMistakes: ['Inclinar para frente', 'Passos muito grandes', 'Velocidade errada'],
    scientificSource: 'T-Nation - "Sled Drags for Knee Health and Conditioning"',
  },

  'battle ropes': {
    name: 'Battle Ropes',
    aliases: ['battle ropes', 'cordas de batalha', 'battling ropes', 'rope training'],
    primaryMuscles: ['deltóide', 'core'],
    secondaryMuscles: ['bíceps', 'tríceps', 'antebraço', 'peitoral'],
    movementPattern: 'criar ondas com cordas pesadas',
    equipment: 'cordas de batalha',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Ombros 90% + Core 85% + cardio intenso',
      rom: 'Segurar cordas → criar ondas alternadas ou simultâneas',
      joint: 'Ombros + corpo inteiro',
    },
    progressions: ['Ondas básicas', 'Ondas intensas', 'Combinações'],
    variations: ['Alternating waves', 'Double waves', 'Slams', 'Circles'],
    commonMistakes: ['Ondas muito pequenas', 'Não usar core', 'Postura ruim'],
    scientificSource: 'T-Nation - "Battle Ropes for Conditioning and Shoulder Work"',
  },

  'box jump': {
    name: 'Salto na Caixa',
    aliases: ['box jump', 'salto caixa', 'pliometrico caixa', 'jump box'],
    primaryMuscles: ['quadríceps', 'glúteo', 'panturrilha'],
    secondaryMuscles: ['core', 'posterior de coxa'],
    movementPattern: 'salto vertical explosivo',
    equipment: 'caixa pliométrica',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Potência de pernas - ciclo alongamento-encurtamento',
      rom: 'Posição atlética → agachar rápido → saltar → aterrissar na caixa',
      joint: 'Quadril + joelhos + tornozelos',
    },
    progressions: ['Caixa baixa', 'Caixa média', 'Caixa alta', 'Com peso'],
    variations: ['Step down', 'Rebounding', 'Single leg', 'Lateral'],
    commonMistakes: ['Aterrissagem dura', 'Caixa muito alta', 'Não usar braços'],
    scientificSource: 'T-Nation - "Box Jumps for Explosive Power"',
  },

  'depth jump': {
    name: 'Salto em Profundidade',
    aliases: ['depth jump', 'salto profundidade', 'drop jump', 'shock method'],
    primaryMuscles: ['quadríceps', 'glúteo', 'panturrilha'],
    secondaryMuscles: ['core', 'posterior de coxa'],
    movementPattern: 'salto reativo após queda de altura',
    equipment: 'caixa pliométrica',
    difficulty: 'avançado',
    biomechanics: {
      activation: 'Potência reativa máxima - método de choque de Verkhoshansky',
      rom: 'Cair da caixa → aterrissar → saltar imediatamente (mínimo contato)',
      joint: 'Quadril + joelhos + tornozelos',
    },
    progressions: ['Altura baixa', 'Altura média', 'Altura alta'],
    variations: ['Vertical', 'Horizontal', 'Com obstáculo'],
    commonMistakes: ['Caixa muito alta', 'Muito tempo no solo', 'Joelhos colapsando'],
    scientificSource: 'Verkhoshansky / T-Nation "Shock Method for Explosive Power"',
  },

  'broad jump': {
    name: 'Salto em Distância',
    aliases: ['broad jump', 'standing long jump', 'salto distancia', 'salto horizontal'],
    primaryMuscles: ['quadríceps', 'glúteo', 'panturrilha'],
    secondaryMuscles: ['core', 'posterior de coxa'],
    movementPattern: 'salto horizontal máximo',
    equipment: 'corpo livre',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Potência horizontal - medida comum de atletismo',
      rom: 'Posição atlética → contramovimento → saltar para frente → aterrissar',
      joint: 'Quadril + joelhos + tornozelos',
    },
    progressions: ['Técnica', 'Distância progressiva', 'Múltiplos saltos'],
    variations: ['Single', 'Consecutivos', 'Com obstáculos'],
    commonMistakes: ['Não usar braços', 'Aterrissagem ruim', 'Ângulo de saída errado'],
    scientificSource: 'T-Nation - "Broad Jump for Horizontal Power"',
  },

  // ============================================================
  // EXERCÍCIOS DE BÍCEPS EXTRAS - T-NATION
  // ============================================================

  'spider curl': {
    name: 'Rosca Spider',
    aliases: ['spider curl', 'rosca spider', 'rosca aranha', 'prone incline curl'],
    primaryMuscles: ['bíceps braquial', 'braquial'],
    secondaryMuscles: ['braquiorradial'],
    movementPattern: 'rosca com peito apoiado em banco inclinado',
    equipment: 'halteres ou barra + banco inclinado',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Bíceps 95% - tensão máxima na contração, elimina momentum completamente',
      rom: 'Braços pendurados verticais → rosca completa → contração no topo',
      joint: 'Cotovelo',
    },
    progressions: ['Peso leve', 'Peso moderado', 'Com pausa no topo'],
    variations: ['Com halteres', 'Com barra', 'Com barra EZ'],
    commonMistakes: ['Usar momentum', 'Não ir até contração completa', 'Mover cotovelos'],
    scientificSource: 'T-Nation - "Spider Curls: Ultimate Biceps Builder"',
  },

  'bayesian curl': {
    name: 'Rosca Bayesian',
    aliases: ['bayesian curl', 'rosca bayesian', 'incline curl behind', 'drag curl inclinado'],
    primaryMuscles: ['bíceps braquial (cabeça longa)'],
    secondaryMuscles: ['braquial'],
    movementPattern: 'rosca com ombro em extensão',
    equipment: 'halteres + banco inclinado',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Cabeça longa do bíceps 98% - ombro estendido alonga maximamente',
      rom: 'Deitado inclinado, braços atrás → rosca mantendo ombro fixo',
      joint: 'Cotovelo (ombro em extensão)',
    },
    progressions: ['Peso leve', 'Peso moderado', 'Negativas lentas'],
    variations: ['Bilateral', 'Unilateral', 'Com cabo'],
    commonMistakes: ['Levantar cotovelos', 'Ombro saindo da posição', 'Peso muito pesado'],
    scientificSource: 'Menno Henselmans / T-Nation "Bayesian Curl for Long Head"',
  },

  'concentration curl': {
    name: 'Rosca Concentrada',
    aliases: ['concentration curl', 'rosca concentrada', 'seated concentration curl'],
    primaryMuscles: ['bíceps braquial'],
    secondaryMuscles: ['braquial'],
    movementPattern: 'rosca unilateral com cotovelo apoiado na coxa',
    equipment: 'halter',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Bíceps 90% - pico de bíceps, isolamento máximo',
      rom: 'Cotovelo na coxa → rosca completa → squeeze no topo',
      joint: 'Cotovelo',
    },
    progressions: ['Peso leve', 'Peso moderado', 'Com pausa'],
    variations: ['Sentado', 'Em pé inclinado'],
    commonMistakes: ['Usar momentum do corpo', 'ROM incompleto', 'Cotovelo saindo da coxa'],
    scientificSource: 'T-Nation - "Concentration Curl for Biceps Peak"',
  },

  'zottman curl': {
    name: 'Rosca Zottman',
    aliases: ['zottman curl', 'rosca zottman', 'rotational curl'],
    primaryMuscles: ['bíceps braquial', 'braquiorradial'],
    secondaryMuscles: ['extensores do antebraço'],
    movementPattern: 'rosca com rotação no topo',
    equipment: 'halteres',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Bíceps + antebraço - supinado subindo, pronado descendo',
      rom: 'Rosca supinada → rotar para pronado no topo → descer pronado',
      joint: 'Cotovelo + rotação do antebraço',
    },
    progressions: ['Peso leve', 'Peso moderado', 'Mais lento'],
    variations: ['Em pé', 'Sentado', 'Alternado'],
    commonMistakes: ['Rotação incompleta', 'Descer rápido demais', 'Peso muito pesado'],
    scientificSource: 'T-Nation - "Zottman Curl: Old School Forearm Builder"',
  },

  // ============================================================
  // EXERCÍCIOS DE TRÍCEPS EXTRAS - T-NATION
  // ============================================================

  'jm press': {
    name: 'JM Press',
    aliases: ['jm press', 'jm bench press', 'triceps jm press'],
    primaryMuscles: ['tríceps'],
    secondaryMuscles: ['peitoral', 'deltóide anterior'],
    movementPattern: 'híbrido entre supino fechado e tríceps testa',
    equipment: 'barra + banco reto',
    difficulty: 'avançado',
    biomechanics: {
      activation: 'Tríceps 95% - inventado por JM Blakley para lockout de supino',
      rom: 'Barra desce em direção ao queixo (cotovelos dobram e vão para frente) → empurrar',
      joint: 'Cotovelo + ombro',
    },
    progressions: ['Peso leve técnica', 'Peso moderado', 'Peso pesado'],
    variations: ['Com barra reta', 'Com barra EZ', 'Com halteres'],
    commonMistakes: ['Transformar em supino fechado', 'Transformar em testa', 'Peso muito pesado'],
    scientificSource: 'JM Blakley / T-Nation "JM Press for Triceps Mass"',
  },

  'tate press': {
    name: 'Tate Press',
    aliases: ['tate press', 'elbows out extension', 'triceps tate'],
    primaryMuscles: ['tríceps (cabeça lateral)'],
    secondaryMuscles: ['peitoral'],
    movementPattern: 'extensão de tríceps com cotovelos para fora',
    equipment: 'halteres + banco reto',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Cabeça lateral do tríceps 90% - cotovelos apontando para fora',
      rom: 'Halteres no peito (cotovelos para fora) → estender até braços retos',
      joint: 'Cotovelo',
    },
    progressions: ['Peso leve', 'Peso moderado', 'Com pausa'],
    variations: ['No banco reto', 'No banco inclinado'],
    commonMistakes: ['Cotovelos muito fechados', 'Usar ombro', 'ROM incompleto'],
    scientificSource: 'Dave Tate / T-Nation "Tate Press for Lateral Head"',
  },

  'california press': {
    name: 'California Press',
    aliases: ['california press', 'cal press', 'hybrid triceps press'],
    primaryMuscles: ['tríceps'],
    secondaryMuscles: ['peitoral', 'deltóide anterior'],
    movementPattern: 'combinação de supino fechado com extensão',
    equipment: 'barra + banco reto',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Tríceps 88% - movimento contínuo sem parar na transição',
      rom: 'Supino fechado → no meio do caminho → extensão de tríceps → empurrar',
      joint: 'Cotovelo + ombro',
    },
    progressions: ['Peso leve', 'Peso moderado', 'Peso pesado'],
    variations: ['Com barra reta', 'Com barra EZ'],
    commonMistakes: ['Separar os dois movimentos', 'Peso muito pesado', 'ROM incompleto'],
    scientificSource: 'T-Nation - "California Press: Best Triceps Exercise?"',
  },

  'rolling triceps extension': {
    name: 'Extensão de Tríceps Rolling',
    aliases: ['rolling triceps extension', 'rolling extension', 'pullover to extension'],
    primaryMuscles: ['tríceps'],
    secondaryMuscles: ['latíssimo do dorso', 'peitoral'],
    movementPattern: 'extensão de tríceps com fase de pullover',
    equipment: 'halteres ou barra EZ + banco reto',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Tríceps 90% - fase de pullover pré-alonga o tríceps',
      rom: 'Descer atrás da cabeça (pullover) → rolar para frente → extensão',
      joint: 'Ombro + cotovelo',
    },
    progressions: ['Peso leve', 'Peso moderado', 'Amplitude maior'],
    variations: ['Com halteres', 'Com barra EZ', 'Com cabo'],
    commonMistakes: ['Não fazer fase de pullover', 'Cotovelos abrindo', 'Peso muito pesado'],
    scientificSource: 'John Meadows / T-Nation "Rolling Triceps Extension"',
  },

  // ============================================================
  // UNILATERAIS E ESTABILIDADE - T-NATION
  // ============================================================

  'single leg rdl': {
    name: 'Stiff Unilateral',
    aliases: ['single leg rdl', 'single leg deadlift', 'stiff unilateral', 'one leg rdl'],
    primaryMuscles: ['posterior de coxa', 'glúteo'],
    secondaryMuscles: ['core', 'lombar', 'estabilizadores de tornozelo'],
    movementPattern: 'hip hinge unilateral',
    equipment: 'halter ou kettlebell',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Glúteo 95% + equilíbrio - trabalha assimetrias e estabilidade',
      rom: 'Uma perna no chão → inclinar corpo para frente → perna traseira sobe → voltar',
      joint: 'Quadril',
    },
    progressions: ['Sem peso', 'Peso leve', 'Peso moderado', 'Olhos fechados'],
    variations: ['Com halter ipsilateral', 'Com halter contralateral', 'Com kettlebell'],
    commonMistakes: ['Quadril rotacionando', 'Joelho dobrando', 'Lombar arredondando'],
    scientificSource: 'T-Nation - "Single-Leg RDL for Glute and Hamstring Development"',
  },

  'pistol squat': {
    name: 'Pistol Squat',
    aliases: ['pistol squat', 'agachamento pistola', 'single leg squat full', 'one leg squat'],
    primaryMuscles: ['quadríceps', 'glúteo'],
    secondaryMuscles: ['core', 'flexores do quadril', 'estabilizadores'],
    movementPattern: 'agachamento unilateral completo',
    equipment: 'corpo livre',
    difficulty: 'avançado',
    biomechanics: {
      activation: 'Quad unilateral 100% - requer força, mobilidade e equilíbrio',
      rom: 'Uma perna estendida à frente → agachar completamente → subir',
      joint: 'Joelho + quadril + tornozelo',
    },
    progressions: ['Assistido', 'No caixote', 'Parcial', 'Completo', 'Com peso'],
    variations: ['Assistido TRX', 'Box pistol', 'Com peso'],
    commonMistakes: ['Joelho colapsando', 'Calcanhar levantando', 'Lombar arredondando'],
    scientificSource: 'T-Nation - "Pistol Squat: Ultimate Leg Strength Test"',
  },

  'single arm row': {
    name: 'Remada Unilateral',
    aliases: ['single arm row', 'one arm row', 'remada unilateral', 'dumbbell row'],
    primaryMuscles: ['latíssimo do dorso'],
    secondaryMuscles: ['romboide', 'bíceps', 'trapézio', 'core'],
    movementPattern: 'remada horizontal unilateral',
    equipment: 'halter + banco',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Lat 90% + rotação anti-rotacional do core',
      rom: 'Braço estendido → puxar cotovelo para o quadril → squeeze → baixar',
      joint: 'Ombro + escápula',
    },
    progressions: ['Peso leve', 'Peso moderado', 'Peso pesado', 'Kroc row'],
    variations: ['No banco', 'Tripod', 'Meadows row', 'Kroc row'],
    commonMistakes: ['Rotacionar tronco', 'Usar momentum', 'ROM curto'],
    scientificSource: 'T-Nation - "One-Arm Row: The Ultimate Back Builder"',
  },

  'meadows row': {
    name: 'Meadows Row',
    aliases: ['meadows row', 'remada meadows', 'landmine row', 'one arm landmine row'],
    primaryMuscles: ['latíssimo do dorso', 'trapézio inferior'],
    secondaryMuscles: ['romboide', 'bíceps', 'antebraço'],
    movementPattern: 'remada unilateral na landmine com stance perpendicular',
    equipment: 'barra olímpica + landmine attachment',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Lat 95% - arco da barra cria ângulo único de puxada',
      rom: 'Perpendicular à barra → puxar em arco → squeeze nas costas → baixar',
      joint: 'Ombro + escápula',
    },
    progressions: ['Peso leve', 'Peso moderado', 'Peso pesado'],
    variations: ['Overhand', 'Underhand', 'Com straps'],
    commonMistakes: ['Posição errada', 'Usar corpo demais', 'Não fazer squeeze'],
    scientificSource: 'John Meadows / T-Nation "Meadows Row for Lat Sweep"',
  },

  'single leg leg press': {
    name: 'Leg Press Unilateral',
    aliases: ['single leg leg press', 'leg press unilateral', 'one leg press'],
    primaryMuscles: ['quadríceps', 'glúteo'],
    secondaryMuscles: ['posterior de coxa'],
    movementPattern: 'leg press com uma perna',
    equipment: 'máquina leg press',
    difficulty: 'intermediário',
    biomechanics: {
      activation: 'Quad + glúteo unilateral - identifica e corrige assimetrias',
      rom: 'Uma perna na plataforma → descer controlado → empurrar',
      joint: 'Joelho + quadril',
    },
    progressions: ['Peso leve', 'Peso moderado', 'Peso pesado'],
    variations: ['Pé alto', 'Pé baixo', 'Pé central'],
    commonMistakes: ['Peso muito alto', 'ROM curto', 'Quadril levantando'],
    scientificSource: 'T-Nation - "Single-Leg Press for Fixing Imbalances"',
  },

  // ============================================================
  // MANGUITO ROTADOR E ESTABILIDADE - T-NATION
  // ============================================================

  'external rotation': {
    name: 'Rotação Externa de Ombro',
    aliases: ['external rotation', 'rotacao externa', 'shoulder external rotation', 'cuban rotation'],
    primaryMuscles: ['infraespinhal', 'redondo menor'],
    secondaryMuscles: ['deltóide posterior'],
    movementPattern: 'rotação externa do úmero',
    equipment: 'halter leve ou cabo',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Manguito rotador 90% - essencial para saúde do ombro',
      rom: 'Cotovelo a 90° → rotar para fora → voltar controlado',
      joint: 'Ombro (rotação)',
    },
    progressions: ['Sem peso', 'Peso leve', 'Banda', 'Cabo'],
    variations: ['Deitado de lado', 'Em pé com cabo', 'No banco inclinado'],
    commonMistakes: ['Peso muito pesado', 'Usar corpo', 'ROM incompleto'],
    scientificSource: 'Eric Cressey / T-Nation "Rotator Cuff Training"',
  },

  'internal rotation': {
    name: 'Rotação Interna de Ombro',
    aliases: ['internal rotation', 'rotacao interna', 'shoulder internal rotation'],
    primaryMuscles: ['subescapular'],
    secondaryMuscles: ['peitoral', 'latíssimo do dorso'],
    movementPattern: 'rotação interna do úmero',
    equipment: 'cabo ou banda',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Subescapular 90% - músculo do manguito frequentemente negligenciado',
      rom: 'Cotovelo a 90° → rotar para dentro → voltar controlado',
      joint: 'Ombro (rotação)',
    },
    progressions: ['Banda leve', 'Banda média', 'Cabo'],
    variations: ['Em pé', 'Deitado', 'Com cotovelo apoiado'],
    commonMistakes: ['Peso muito pesado', 'Compensar com corpo', 'Velocidade alta'],
    scientificSource: 'Eric Cressey / T-Nation "Complete Rotator Cuff Training"',
  },

  'band pull apart': {
    name: 'Band Pull Apart',
    aliases: ['band pull apart', 'puxada de banda', 'rear delt pull apart'],
    primaryMuscles: ['deltóide posterior', 'romboide'],
    secondaryMuscles: ['trapézio médio', 'manguito rotador'],
    movementPattern: 'abdução horizontal com banda',
    equipment: 'banda elástica',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Deltóide posterior 85% + retração escapular - aquecimento ideal',
      rom: 'Banda à frente → puxar para os lados até tocar o peito → voltar',
      joint: 'Ombro + escápula',
    },
    progressions: ['Banda leve', 'Banda média', 'Banda pesada', 'Alto volume'],
    variations: ['Pronado', 'Supinado', 'Diagonal', 'Overhead'],
    commonMistakes: ['Banda muito pesada', 'ROM curto', 'Usar momentum'],
    scientificSource: 'T-Nation - "Band Pull-Aparts: Do 100 Every Day"',
  },

  'bird dog': {
    name: 'Bird Dog',
    aliases: ['bird dog', 'cachorro passaro', 'quadruped arm leg raise'],
    primaryMuscles: ['core', 'lombar', 'glúteo'],
    secondaryMuscles: ['deltóide', 'posterior de coxa'],
    movementPattern: 'extensão contralateral de braço e perna',
    equipment: 'corpo livre',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Core anti-extensão + estabilidade - exercício de McGill',
      rom: 'Quatro apoios → estender braço e perna opostos → manter → alternar',
      joint: 'Coluna + quadril + ombro',
    },
    progressions: ['Básico', 'Com pausa', 'Com movimento', 'Com resistência'],
    variations: ['Estático', 'Dinâmico', 'Com banda', 'No banco'],
    commonMistakes: ['Rotacionar quadril', 'Hiperextender lombar', 'Não manter neutro'],
    scientificSource: 'Stuart McGill / T-Nation "Big 3 for Low Back"',
  },

  'side plank': {
    name: 'Prancha Lateral',
    aliases: ['side plank', 'prancha lateral', 'lateral plank', 'side bridge'],
    primaryMuscles: ['oblíquos', 'quadrado lombar'],
    secondaryMuscles: ['glúteo médio', 'deltóide'],
    movementPattern: 'isometria lateral',
    equipment: 'corpo livre',
    difficulty: 'iniciante',
    biomechanics: {
      activation: 'Oblíquos 90% - exercício de McGill para estabilidade lateral',
      rom: 'De lado, apoiado no cotovelo → elevar quadril → manter alinhado',
      joint: 'Coluna (estabilidade)',
    },
    progressions: ['Joelhos dobrados', 'Pernas estendidas', 'Com elevação de perna', 'Com rotação'],
    variations: ['No cotovelo', 'Na mão', 'Com hip dip', 'Copenhagen'],
    commonMistakes: ['Quadril caindo', 'Rotacionar tronco', 'Não manter alinhamento'],
    scientificSource: 'Stuart McGill / T-Nation "Big 3 for Low Back"',
  },

  'copenhagen plank': {
    name: 'Prancha Copenhagen',
    aliases: ['copenhagen plank', 'copenhagen adductor', 'prancha copenhagen'],
    primaryMuscles: ['adutores', 'oblíquos'],
    secondaryMuscles: ['core', 'glúteo médio'],
    movementPattern: 'prancha lateral com adução',
    equipment: 'banco ou caixa',
    difficulty: 'avançado',
    biomechanics: {
      activation: 'Adutores 95% - isometria + adução simultânea',
      rom: 'Prancha lateral com perna de cima no banco → perna de baixo suspensa',
      joint: 'Quadril (adução) + coluna',
    },
    progressions: ['Joelho no banco', 'Pé no banco short lever', 'Pé no banco long lever', 'Dinâmico'],
    variations: ['Isométrico', 'Com raise', 'Com dip'],
    commonMistakes: ['Quadril caindo', 'Posição errada no banco', 'Tempo muito longo'],
    scientificSource: 'T-Nation - "Copenhagen Plank for Adductor Strength"',
  },

};

// ==========================================
// FUNÇÕES DE BUSCA
// ==========================================

/**
 * Busca exercício por nome (fuzzy matching)
 */
export function findExercise(query: string): ExerciseData | null {
  const normalizedQuery = query.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim();

  // 1. Busca exata por chave
  if (EXERCISE_DATABASE[normalizedQuery]) {
    return EXERCISE_DATABASE[normalizedQuery];
  }

  // 2. Busca em aliases (exata)
  for (const [key, exercise] of Object.entries(EXERCISE_DATABASE)) {
    const normalizedAliases = exercise.aliases.map(a =>
      a.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim()
    );
    if (normalizedAliases.includes(normalizedQuery)) {
      return exercise;
    }
  }

  // 3. Busca parcial em chaves
  for (const [key, exercise] of Object.entries(EXERCISE_DATABASE)) {
    const normalizedKey = key.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (normalizedKey.includes(normalizedQuery) || normalizedQuery.includes(normalizedKey)) {
      return exercise;
    }
  }

  // 4. Busca parcial em aliases
  for (const [key, exercise] of Object.entries(EXERCISE_DATABASE)) {
    for (const alias of exercise.aliases) {
      const normalizedAlias = alias.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (normalizedAlias.includes(normalizedQuery) || normalizedQuery.includes(normalizedAlias)) {
        return exercise;
      }
    }
  }

  // 5. Busca por palavras-chave (scoring)
  const queryWords = normalizedQuery.split(/\s+/).filter(w => w.length > 2);
  let bestMatch: { exercise: ExerciseData; score: number } | null = null;

  for (const [key, exercise] of Object.entries(EXERCISE_DATABASE)) {
    let score = 0;
    const exerciseText = [
      key,
      exercise.name,
      ...exercise.aliases,
      ...exercise.primaryMuscles,
    ].join(' ').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    for (const word of queryWords) {
      if (exerciseText.includes(word)) {
        score += word.length;
      }
    }

    if (score > 0 && (!bestMatch || score > bestMatch.score)) {
      bestMatch = { exercise, score };
    }
  }

  return bestMatch?.exercise || null;
}

/**
 * Encontra exercícios "irmãos" (mesmo grupo muscular principal)
 */
export function findSiblingExercises(exercise: ExerciseData, limit: number = 3): ExerciseData[] {
  const siblings: ExerciseData[] = [];
  const primaryMuscle = exercise.primaryMuscles[0];

  for (const [key, ex] of Object.entries(EXERCISE_DATABASE)) {
    if (ex.name !== exercise.name && ex.primaryMuscles[0] === primaryMuscle) {
      siblings.push(ex);
      if (siblings.length >= limit) break;
    }
  }

  return siblings;
}

/**
 * Busca exercícios por padrão de movimento
 */
export function findExercisesByPattern(pattern: string): ExerciseData[] {
  const normalizedPattern = pattern.toLowerCase();
  return Object.values(EXERCISE_DATABASE).filter(ex =>
    ex.movementPattern.toLowerCase().includes(normalizedPattern)
  );
}

/**
 * Busca exercícios por músculo
 */
export function findExercisesByMuscle(muscle: string): ExerciseData[] {
  const normalizedMuscle = muscle.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  return Object.values(EXERCISE_DATABASE).filter(ex => {
    const muscles = [...ex.primaryMuscles, ...ex.secondaryMuscles]
      .join(' ').toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return muscles.includes(normalizedMuscle);
  });
}

/**
 * Busca exercícios por equipamento
 */
export function findExercisesByEquipment(equipment: string): ExerciseData[] {
  const normalizedEquipment = equipment.toLowerCase();
  return Object.values(EXERCISE_DATABASE).filter(ex =>
    ex.equipment.toLowerCase().includes(normalizedEquipment)
  );
}

/**
 * Retorna todos os exercícios disponíveis
 */
export function getAvailableExercises(): string[] {
  return Object.values(EXERCISE_DATABASE).map(ex => ex.name);
}

/**
 * Estatísticas do banco de dados
 */
export function getExerciseStats(): {
  total: number;
  byDifficulty: Record<string, number>;
  byMuscleGroup: Record<string, number>;
} {
  const stats = {
    total: Object.keys(EXERCISE_DATABASE).length,
    byDifficulty: { iniciante: 0, intermediário: 0, avançado: 0 },
    byMuscleGroup: {} as Record<string, number>,
  };

  for (const ex of Object.values(EXERCISE_DATABASE)) {
    stats.byDifficulty[ex.difficulty]++;

    const muscle = ex.primaryMuscles[0] || 'outros';
    stats.byMuscleGroup[muscle] = (stats.byMuscleGroup[muscle] || 0) + 1;
  }

  return stats;
}

export default {
  EXERCISE_DATABASE,
  findExercise,
  findSiblingExercises,
  findExercisesByPattern,
  findExercisesByMuscle,
  findExercisesByEquipment,
  getAvailableExercises,
  getExerciseStats,
};
