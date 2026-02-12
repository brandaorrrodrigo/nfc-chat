/**
 * Templates V2: Análise Biomecânica por Articulação (Motor vs Estabilizador)
 *
 * Paradigma:
 * - MOTORA: executa o movimento, mais ROM = melhor
 * - ESTABILIZADORA: deve permanecer firme, menos variação = melhor (INVERTIDO)
 * - Score: Motor 60% + Estabilizador 40%
 */

// ============================
// Interfaces
// ============================

export interface RomRanges {
  excellent?: { min?: number; max?: number };
  good?: { min?: number; max?: number };
  acceptable?: { min?: number; max?: number };
  warning?: { min?: number; max?: number };
  danger?: { min?: number; max?: number };
}

export interface MotorCriteria {
  rom: { metric: string; } & RomRanges;
  peakContraction?: { metric: string; } & RomRanges;
  symmetry?: { maxAcceptableDiff: number; unit: string };
  tempoControl?: { eccentricMinMs: number };
}

export interface StabilizerCriteria {
  maxVariation: {
    metric: string;
    acceptable: number;
    warning: number;
    danger: number;
    unit: string;
  };
}

export interface MotorJoint {
  joint: string;
  label: string;
  movement: string;
  side: 'bilateral' | 'right' | 'left';
  criteria: MotorCriteria;
  ragTopics: string[];
}

export interface StabilizerJoint {
  joint: string;
  label: string;
  expectedState: string;
  side: 'bilateral' | 'midline';
  criteria: StabilizerCriteria;
  instabilityMeaning: string;
  correctiveExercises: string[];
  ragTopics: string[];
}

export interface ExercisePhase {
  id: string;
  label: string;
  description?: string;
  keyFrame: 'first' | 'last' | 'min_angle' | 'max_angle' | 'custom';
  evaluateMotors: boolean;
  evaluateStabilizers: boolean;
}

export interface ExerciseTemplate {
  exerciseId: string;
  exerciseName: string;
  category: string;
  type: 'compound' | 'isolation';
  articulationType: 'biarticular' | 'monoarticular';
  motorJoints: MotorJoint[];
  stabilizerJoints: StabilizerJoint[];
  phases: ExercisePhase[];
  muscles: {
    primary: string[];
    secondary: string[];
    stabilizers: string[];
  };
}

// ============================
// Template: Back Squat
// ============================

const BACK_SQUAT_TEMPLATE: ExerciseTemplate = {
  exerciseId: 'back_squat',
  exerciseName: 'Agachamento Livre com Barra',
  category: 'squat',
  type: 'compound',
  articulationType: 'biarticular',

  motorJoints: [
    {
      joint: 'knee',
      label: 'Joelhos',
      movement: 'Flexão e extensão',
      side: 'bilateral',
      criteria: {
        rom: {
          metric: 'knee_flexion_at_bottom',
          excellent: { max: 70 },
          good: { min: 70, max: 85 },
          acceptable: { min: 85, max: 100 },
          warning: { min: 100, max: 120 },
          danger: { min: 120 },
        },
        symmetry: { maxAcceptableDiff: 5, unit: '°' },
      },
      ragTopics: ['flexão joelho agachamento', 'profundidade agachamento'],
    },
    {
      joint: 'hip',
      label: 'Quadril',
      movement: 'Flexão e extensão',
      side: 'bilateral',
      criteria: {
        rom: {
          metric: 'hip_flexion_at_bottom',
          excellent: { max: 70 },
          good: { min: 70, max: 80 },
          acceptable: { min: 80, max: 100 },
          warning: { min: 100, max: 120 },
          danger: { min: 120 },
        },
        symmetry: { maxAcceptableDiff: 5, unit: '°' },
      },
      ragTopics: ['flexão quadril agachamento', 'glúteos'],
    },
    {
      joint: 'ankle',
      label: 'Tornozelos',
      movement: 'Dorsiflexão',
      side: 'bilateral',
      criteria: {
        rom: {
          metric: 'ankle_dorsiflexion',
          excellent: { min: 38 },
          good: { min: 32, max: 38 },
          acceptable: { min: 25, max: 32 },
          warning: { min: 18, max: 25 },
          danger: { max: 18 },
        },
        symmetry: { maxAcceptableDiff: 3, unit: '°' },
      },
      ragTopics: ['dorsiflexão tornozelo', 'mobilidade tornozelo agachamento'],
    },
  ],

  stabilizerJoints: [
    {
      joint: 'lumbar',
      label: 'Coluna Lombar',
      expectedState: 'Lordose fisiológica mantida (sem butt wink)',
      side: 'midline',
      criteria: {
        maxVariation: { metric: 'lumbar_flexion_change', acceptable: 8, warning: 15, danger: 22, unit: '°' },
      },
      instabilityMeaning: 'Butt wink — retroversão pélvica. Risco de disco lombar.',
      correctiveExercises: ['90/90 hip stretch', 'dead bug', 'goblet squat com pausa'],
      ragTopics: ['butt wink', 'retroversão pélvica agachamento'],
    },
    {
      joint: 'trunk',
      label: 'Tronco',
      expectedState: 'Inclinação controlada proporcional à profundidade',
      side: 'midline',
      criteria: {
        maxVariation: { metric: 'trunk_inclination', acceptable: 40, warning: 52, danger: 60, unit: '°' },
      },
      instabilityMeaning: 'Inclinação excessiva — fraqueza de extensores torácicos ou core',
      correctiveExercises: ['front squat', 'goblet squat', 'extensão torácica foam roller'],
      ragTopics: ['inclinação anterior tronco agachamento'],
    },
    {
      joint: 'knee_alignment',
      label: 'Alinhamento Joelhos (Valgo/Varo)',
      expectedState: 'Joelhos sobre 2º-3º dedo do pé',
      side: 'bilateral',
      criteria: {
        maxVariation: { metric: 'knee_medial_displacement', acceptable: 2, warning: 5, danger: 8, unit: 'cm' },
      },
      instabilityMeaning: 'Valgo dinâmico — fraqueza de glúteo médio e rotadores externos',
      correctiveExercises: ['clamshell', 'monster walk com mini band', 'single leg glute bridge'],
      ragTopics: ['valgo dinâmico agachamento', 'glúteo médio'],
    },
  ],

  phases: [
    { id: 'setup', label: 'Posição Inicial', keyFrame: 'first', evaluateMotors: false, evaluateStabilizers: true },
    { id: 'eccentric', label: 'Excêntrica (Descida)', keyFrame: 'custom', evaluateMotors: true, evaluateStabilizers: true },
    { id: 'bottom', label: 'Fundo', keyFrame: 'min_angle', evaluateMotors: true, evaluateStabilizers: true },
    { id: 'concentric', label: 'Concêntrica (Subida)', keyFrame: 'custom', evaluateMotors: true, evaluateStabilizers: true },
  ],

  muscles: {
    primary: ['quadríceps', 'glúteo máximo'],
    secondary: ['adutores', 'isquiotibiais', 'sóleo'],
    stabilizers: ['eretor da espinha', 'transverso abdominal', 'oblíquos', 'glúteo médio'],
  },
};

// ============================
// Template: Deadlift Convencional
// ============================

const DEADLIFT_CONVENTIONAL_TEMPLATE: ExerciseTemplate = {
  exerciseId: 'deadlift_conventional',
  exerciseName: 'Levantamento Terra Convencional',
  category: 'hinge',
  type: 'compound',
  articulationType: 'biarticular',

  motorJoints: [
    {
      joint: 'hip',
      label: 'Quadril',
      movement: 'Extensão (hip hinge)',
      side: 'bilateral',
      criteria: {
        rom: {
          metric: 'hip_extension_range',
          excellent: { min: 100 },
          good: { min: 85, max: 100 },
          acceptable: { min: 70, max: 85 },
          warning: { min: 55, max: 70 },
          danger: { max: 55 },
        },
        peakContraction: {
          metric: 'hip_angle_at_lockout',
          excellent: { min: 175 },
          good: { min: 168, max: 175 },
          acceptable: { min: 160, max: 168 },
          warning: { max: 160 },
        },
        symmetry: { maxAcceptableDiff: 5, unit: '°' },
      },
      ragTopics: ['extensão quadril deadlift', 'hip hinge', 'glúteo máximo deadlift'],
    },
    {
      joint: 'knee',
      label: 'Joelhos',
      movement: 'Extensão (secundário)',
      side: 'bilateral',
      criteria: {
        rom: {
          metric: 'knee_extension_range',
          excellent: { min: 140 },
          acceptable: { min: 120, max: 140 },
          warning: { max: 120 },
        },
        symmetry: { maxAcceptableDiff: 5, unit: '°' },
      },
      ragTopics: ['joelhos deadlift'],
    },
  ],

  stabilizerJoints: [
    {
      joint: 'lumbar',
      label: 'Coluna Lombar',
      expectedState: 'NEUTRO ABSOLUTO do início ao fim',
      side: 'midline',
      criteria: {
        maxVariation: { metric: 'lumbar_flexion_variation', acceptable: 5, warning: 10, danger: 18, unit: '°' },
      },
      instabilityMeaning: 'Arredondamento lombar — RISCO ALTO de herniação discal. Critério mais importante do deadlift.',
      correctiveExercises: ['hip hinge com bastão', 'RDL leve', 'good morning com banda'],
      ragTopics: ['flexão lombar deadlift', 'neutro coluna', 'herniação discal'],
    },
    {
      joint: 'thoracic',
      label: 'Coluna Torácica',
      expectedState: 'Extensão mantida, peito aberto',
      side: 'midline',
      criteria: {
        maxVariation: { metric: 'thoracic_flexion_variation', acceptable: 8, warning: 15, danger: 25, unit: '°' },
      },
      instabilityMeaning: 'Cifose torácica — fraqueza de extensores ou carga excessiva',
      correctiveExercises: ['face pull', 'band pull-apart', 'extensão torácica foam roller'],
      ragTopics: ['cifose torácica deadlift', 'extensão torácica'],
    },
    {
      joint: 'shoulder_position',
      label: 'Posição dos Ombros',
      expectedState: 'Sobre ou ligeiramente à frente da barra',
      side: 'bilateral',
      criteria: {
        maxVariation: { metric: 'shoulder_bar_deviation', acceptable: 3, warning: 6, danger: 10, unit: 'cm' },
      },
      instabilityMeaning: 'Barra afastando do corpo — braço de momento aumentado',
      correctiveExercises: ['deadlift com pausa no joelho', 'block pulls'],
      ragTopics: ['trajetória barra deadlift', 'posição ombros deadlift'],
    },
  ],

  phases: [
    { id: 'setup', label: 'Setup', keyFrame: 'first', evaluateMotors: false, evaluateStabilizers: true },
    { id: 'pull_to_knee', label: 'Pull até Joelho', keyFrame: 'custom', evaluateMotors: true, evaluateStabilizers: true },
    { id: 'pull_to_lockout', label: 'Pull até Lockout', keyFrame: 'custom', evaluateMotors: true, evaluateStabilizers: true },
    { id: 'lockout', label: 'Lockout', keyFrame: 'max_angle', evaluateMotors: true, evaluateStabilizers: true },
  ],

  muscles: {
    primary: ['glúteo máximo', 'isquiotibiais', 'eretor da espinha'],
    secondary: ['quadríceps', 'adutores', 'trapézio'],
    stabilizers: ['transverso abdominal', 'oblíquos', 'romboides', 'flexores de punho'],
  },
};

// ============================
// Template: Chest Supported Row
// ============================

const CHEST_SUPPORTED_ROW_TEMPLATE: ExerciseTemplate = {
  exerciseId: 'chest_supported_row',
  exerciseName: 'Remada com Apoio de Peitoral',
  category: 'pull',
  type: 'compound',
  articulationType: 'biarticular',

  motorJoints: [
    {
      joint: 'shoulder',
      label: 'Ombro',
      movement: 'Retração escapular + Extensão',
      side: 'bilateral',
      criteria: {
        rom: {
          metric: 'shoulder_extension_rom',
          excellent: { min: 50 },
          good: { min: 40, max: 50 },
          acceptable: { min: 30, max: 40 },
          warning: { min: 20, max: 30 },
          danger: { max: 20 },
        },
        peakContraction: {
          metric: 'scapular_retraction_cm',
          excellent: { min: 4 },
          good: { min: 3, max: 4 },
          acceptable: { min: 2, max: 3 },
          warning: { max: 2 },
        },
        symmetry: { maxAcceptableDiff: 5, unit: '°' },
      },
      ragTopics: ['retração escapular remada', 'extensão ombro', 'romboides trapézio médio'],
    },
    {
      joint: 'elbow',
      label: 'Cotovelo',
      movement: 'Flexão',
      side: 'bilateral',
      criteria: {
        rom: {
          metric: 'elbow_flexion_at_peak',
          excellent: { max: 75 },
          good: { min: 75, max: 90 },
          acceptable: { min: 90, max: 110 },
          warning: { min: 110, max: 130 },
          danger: { min: 130 },
        },
        symmetry: { maxAcceptableDiff: 5, unit: '°' },
      },
      ragTopics: ['flexão cotovelo remada', 'bíceps braquial'],
    },
  ],

  stabilizerJoints: [
    {
      joint: 'lumbar',
      label: 'Coluna Lombar',
      expectedState: 'Lordose fisiológica mantida pelo apoio peitoral',
      side: 'midline',
      criteria: {
        maxVariation: { metric: 'lumbar_angle_variation', acceptable: 3, warning: 7, danger: 12, unit: '°' },
      },
      instabilityMeaning: 'Perda de apoio no pad, possível uso de impulso',
      correctiveExercises: ['prancha', 'dead bug', 'bird dog'],
      ragTopics: ['estabilidade lombar remada'],
    },
    {
      joint: 'wrist',
      label: 'Punhos',
      expectedState: 'Neutro ou leve flexão, sem desvio ulnar/radial',
      side: 'bilateral',
      criteria: {
        maxVariation: { metric: 'wrist_deviation', acceptable: 5, warning: 10, danger: 20, unit: '°' },
      },
      instabilityMeaning: 'Fraqueza de flexores/extensores de punho, grip inadequado',
      correctiveExercises: ['wrist curls', "farmer's walk", 'dead hang'],
      ragTopics: ['alinhamento punho remada'],
    },
    {
      joint: 'trunk',
      label: 'Tronco',
      expectedState: 'Firme no apoio peitoral, sem rotação',
      side: 'midline',
      criteria: {
        maxVariation: { metric: 'trunk_rotation_variation', acceptable: 3, warning: 8, danger: 15, unit: '°' },
      },
      instabilityMeaning: 'Uso de impulso rotacional, core fraco ou carga excessiva',
      correctiveExercises: ['pallof press', 'anti-rotação com cabo', 'prancha lateral'],
      ragTopics: ['estabilidade tronco remada', 'anti-rotação core'],
    },
  ],

  phases: [
    { id: 'stretch', label: 'Alongamento', description: 'Braços estendidos, escápulas protraídas', keyFrame: 'first', evaluateMotors: false, evaluateStabilizers: true },
    { id: 'concentric', label: 'Concêntrica', description: 'Puxada — retração + flexão cotovelo', keyFrame: 'custom', evaluateMotors: true, evaluateStabilizers: true },
    { id: 'peak', label: 'Pico de Contração', description: 'Escápulas retraídas, squeeze', keyFrame: 'min_angle', evaluateMotors: true, evaluateStabilizers: true },
    { id: 'eccentric', label: 'Excêntrica', description: 'Retorno controlado', keyFrame: 'custom', evaluateMotors: true, evaluateStabilizers: true },
  ],

  muscles: {
    primary: ['latíssimo do dorso', 'romboides', 'trapézio médio'],
    secondary: ['bíceps braquial', 'braquiorradial', 'trapézio inferior'],
    stabilizers: ['eretor da espinha', 'transverso abdominal', 'flexores de punho'],
  },
};

// ============================
// Template: Lateral Raise
// ============================

const LATERAL_RAISE_TEMPLATE: ExerciseTemplate = {
  exerciseId: 'lateral_raise',
  exerciseName: 'Elevação Lateral',
  category: 'isolation_shoulder',
  type: 'isolation',
  articulationType: 'monoarticular',

  motorJoints: [
    {
      joint: 'shoulder',
      label: 'Ombro (Abdução)',
      movement: 'Abdução no plano escapular',
      side: 'bilateral',
      criteria: {
        rom: {
          metric: 'shoulder_abduction',
          excellent: { min: 80, max: 90 },
          good: { min: 70, max: 80 },
          acceptable: { min: 60, max: 70 },
          warning: { max: 60 },
        },
        symmetry: { maxAcceptableDiff: 8, unit: '°' },
        tempoControl: { eccentricMinMs: 1500 },
      },
      ragTopics: ['abdução ombro elevação lateral', 'deltóide lateral', 'plano escapular'],
    },
  ],

  stabilizerJoints: [
    {
      joint: 'elbow',
      label: 'Cotovelos',
      expectedState: 'Leve flexão fixa (~15-20°), sem flexionar durante o movimento',
      side: 'bilateral',
      criteria: {
        maxVariation: { metric: 'elbow_angle_variation', acceptable: 5, warning: 12, danger: 20, unit: '°' },
      },
      instabilityMeaning: 'Flexionar cotovelo = usar bíceps como compensação, reduz braço de momento no deltóide',
      correctiveExercises: ['elevação lateral com pausa isométrica', 'elevação lateral no cabo'],
      ragTopics: ['posição cotovelo elevação lateral'],
    },
    {
      joint: 'wrist',
      label: 'Punhos',
      expectedState: 'Neutro, mindinho ligeiramente mais alto',
      side: 'bilateral',
      criteria: {
        maxVariation: { metric: 'wrist_deviation', acceptable: 8, warning: 15, danger: 25, unit: '°' },
      },
      instabilityMeaning: 'Punho caído = perda de tensão no deltóide lateral',
      correctiveExercises: ['wrist curls', 'consciência proprioceptiva'],
      ragTopics: ['posição punho elevação lateral'],
    },
    {
      joint: 'trunk',
      label: 'Tronco',
      expectedState: 'Ereto e firme, sem balanço nem inclinação lateral',
      side: 'midline',
      criteria: {
        maxVariation: { metric: 'trunk_lateral_sway', acceptable: 3, warning: 8, danger: 15, unit: '°' },
      },
      instabilityMeaning: 'Balanço = carga excessiva, usando impulso',
      correctiveExercises: ['elevação lateral sentado', 'elevação lateral unilateral no cabo', 'reduzir carga'],
      ragTopics: ['estabilidade tronco elevação lateral', 'cheating'],
    },
    {
      joint: 'shoulder_elevation',
      label: 'Trapézio (Encolhimento)',
      expectedState: 'Ombros deprimidos, NÃO subir (shrug)',
      side: 'bilateral',
      criteria: {
        maxVariation: { metric: 'shoulder_elevation_cm', acceptable: 1, warning: 3, danger: 5, unit: 'cm' },
      },
      instabilityMeaning: 'Encolher ombros = trapézio superior dominando sobre deltóide lateral',
      correctiveExercises: ['depressão escapular consciente', 'shrug reverso', 'elevação lateral com pausa'],
      ragTopics: ['trapézio superior elevação lateral', 'depressão escapular'],
    },
  ],

  phases: [
    { id: 'start', label: 'Posição Inicial', keyFrame: 'first', evaluateMotors: false, evaluateStabilizers: true },
    { id: 'concentric', label: 'Elevação', keyFrame: 'custom', evaluateMotors: true, evaluateStabilizers: true },
    { id: 'peak', label: 'Pico (Paralelo)', keyFrame: 'max_angle', evaluateMotors: true, evaluateStabilizers: true },
    { id: 'eccentric', label: 'Descida Controlada', keyFrame: 'custom', evaluateMotors: true, evaluateStabilizers: true },
  ],

  muscles: {
    primary: ['deltóide lateral'],
    secondary: ['deltóide anterior', 'supraespinhal'],
    stabilizers: ['trapézio (deve ser INIBIDO)', 'core', 'flexores de punho'],
  },
};

// ============================
// Template: Bench Press (Supino Reto)
// ============================

const BENCH_PRESS_TEMPLATE: ExerciseTemplate = {
  exerciseId: 'bench_press',
  exerciseName: 'Supino Reto com Barra',
  category: 'horizontal_press',
  type: 'compound',
  articulationType: 'biarticular',

  motorJoints: [
    {
      joint: 'shoulder',
      label: 'Ombros (Adução Horizontal)',
      movement: 'Adução horizontal + flexão',
      side: 'bilateral',
      criteria: {
        rom: {
          metric: 'horizontal_adduction_rom',
          excellent: { min: 100 },
          good: { min: 85, max: 100 },
          acceptable: { min: 70, max: 85 },
          warning: { min: 55, max: 70 },
          danger: { max: 55 },
        },
        peakContraction: {
          metric: 'bar_to_chest_distance_cm',
          excellent: { max: 2 },
          good: { min: 2, max: 5 },
          warning: { min: 5 },
        },
        symmetry: { maxAcceptableDiff: 5, unit: '°' },
      },
      ragTopics: ['supino reto amplitude ombro', 'adução horizontal', 'peitoral maior'],
    },
    {
      joint: 'elbow',
      label: 'Cotovelos (Extensão)',
      movement: 'Extensão no lockout',
      side: 'bilateral',
      criteria: {
        rom: {
          metric: 'extension_at_lockout',
          excellent: { min: 170 },
          good: { min: 160, max: 170 },
          acceptable: { min: 150, max: 160 },
          warning: { max: 150 },
        },
        symmetry: { maxAcceptableDiff: 5, unit: '°' },
      },
      ragTopics: ['extensão cotovelo supino', 'tríceps lockout'],
    },
  ],

  stabilizerJoints: [
    {
      joint: 'scapula',
      label: 'Escápulas',
      expectedState: 'Escápulas retraídas e deprimidas durante TODO o movimento',
      side: 'bilateral',
      criteria: {
        maxVariation: { metric: 'shoulder_blade_movement', acceptable: 3, warning: 8, danger: 15, unit: '°' },
      },
      instabilityMeaning: 'Protração escapular — perda de base estável, RISCO de impingement',
      correctiveExercises: ['face pull', 'band pull-apart', 'retração escapular no banco'],
      ragTopics: ['retração escapular supino', 'estabilidade escapular'],
    },
    {
      joint: 'wrist',
      label: 'Punhos',
      expectedState: 'Punho neutro, barra sobre antebraço',
      side: 'bilateral',
      criteria: {
        maxVariation: { metric: 'wrist_extension_angle', acceptable: 5, warning: 12, danger: 20, unit: '°' },
      },
      instabilityMeaning: 'Extensão excessiva do punho — risco de tendinite',
      correctiveExercises: ['wrist curls', 'grip mais largo'],
      ragTopics: ['posição punho supino', 'alinhamento antebraço'],
    },
    {
      joint: 'elbow_flare',
      label: 'Flare dos Cotovelos',
      expectedState: 'Cotovelos a ~45° do tronco (tucked)',
      side: 'bilateral',
      criteria: {
        maxVariation: { metric: 'elbow_abduction_angle', acceptable: 50, warning: 60, danger: 75, unit: '°' },
      },
      instabilityMeaning: 'Flare excessivo — estresse no manguito rotador',
      correctiveExercises: ['floor press', 'supino com pausa', 'consciência de tuck'],
      ragTopics: ['flare cotovelo supino', 'impingement ombro', 'ângulo cotovelo press'],
    },
    {
      joint: 'thoracic_arch',
      label: 'Arco Torácico',
      expectedState: 'Arco torácico mantido, estável',
      side: 'midline',
      criteria: {
        maxVariation: { metric: 'thoracic_arch_change', acceptable: 3, warning: 8, danger: 15, unit: '°' },
      },
      instabilityMeaning: 'Perda do arco — base instável, transferência de força comprometida',
      correctiveExercises: ['extensão torácica foam roller', 'trabalho de setup'],
      ragTopics: ['arco torácico supino', 'setup bench press'],
    },
    {
      joint: 'feet',
      label: 'Pés (Leg Drive)',
      expectedState: 'Pés firmes no chão, leg drive estável',
      side: 'bilateral',
      criteria: {
        maxVariation: { metric: 'foot_position_shift', acceptable: 1, warning: 3, danger: 5, unit: 'cm' },
      },
      instabilityMeaning: 'Pés escorregando — perda de leg drive e base',
      correctiveExercises: ['treinar leg drive isolado', 'calçado adequado'],
      ragTopics: ['leg drive supino', 'posição pés bench press'],
    },
  ],

  phases: [
    { id: 'setup', label: 'Setup', keyFrame: 'first', evaluateMotors: false, evaluateStabilizers: true },
    { id: 'eccentric', label: 'Excêntrica (Descida)', keyFrame: 'custom', evaluateMotors: true, evaluateStabilizers: true },
    { id: 'bottom', label: 'Fundo (Barra no Peito)', keyFrame: 'min_angle', evaluateMotors: true, evaluateStabilizers: true },
    { id: 'concentric', label: 'Concêntrica (Subida)', keyFrame: 'custom', evaluateMotors: true, evaluateStabilizers: true },
    { id: 'lockout', label: 'Lockout', keyFrame: 'max_angle', evaluateMotors: true, evaluateStabilizers: true },
  ],

  muscles: {
    primary: ['peitoral maior', 'tríceps braquial'],
    secondary: ['deltóide anterior', 'peitoral menor'],
    stabilizers: ['rotadores externos', 'serrátil anterior', 'core'],
  },
};

// ============================
// Template: Hip Thrust (Elevação Pélvica)
// ============================

const HIP_THRUST_TEMPLATE: ExerciseTemplate = {
  exerciseId: 'hip_thrust',
  exerciseName: 'Elevação Pélvica (Hip Thrust)',
  category: 'hip_dominant',
  type: 'compound',
  articulationType: 'monoarticular',

  motorJoints: [
    {
      joint: 'hip',
      label: 'Quadril (Extensão)',
      movement: 'Extensão de quadril',
      side: 'bilateral',
      criteria: {
        rom: {
          metric: 'hip_extension_rom',
          excellent: { min: 170 },
          good: { min: 155, max: 170 },
          acceptable: { min: 140, max: 155 },
          warning: { min: 120, max: 140 },
          danger: { max: 120 },
        },
        peakContraction: {
          metric: 'hip_angle_at_lockout',
          excellent: { min: 175 },
          good: { min: 168, max: 175 },
          acceptable: { min: 160, max: 168 },
          warning: { max: 160 },
        },
        symmetry: { maxAcceptableDiff: 5, unit: '°' },
      },
      ragTopics: ['extensão quadril hip thrust', 'glúteo máximo', 'ativação glútea'],
    },
  ],

  stabilizerJoints: [
    {
      joint: 'lumbar',
      label: 'Coluna Lombar',
      expectedState: 'Pelve em retroversão CONTROLADA no topo, sem hiperextensão lombar',
      side: 'midline',
      criteria: {
        maxVariation: { metric: 'lumbar_hyperextension_change', acceptable: 5, warning: 10, danger: 18, unit: '°' },
      },
      instabilityMeaning: 'Hiperextensão lombar — RISCO de compressão facetária',
      correctiveExercises: ['dead bug', 'prancha posterior', 'hip thrust com pausa'],
      ragTopics: ['hiperextensão lombar hip thrust', 'retroversão pélvica'],
    },
    {
      joint: 'rib_cage',
      label: 'Caixa Torácica',
      expectedState: 'Costelas deprimidas, core ativado',
      side: 'midline',
      criteria: {
        maxVariation: { metric: 'rib_flare_angle', acceptable: 5, warning: 12, danger: 20, unit: '°' },
      },
      instabilityMeaning: 'Rib flare — compensação por falta de core, extensão lombar excessiva',
      correctiveExercises: ['dead bug com exalação', 'prancha', '90/90 breathing'],
      ragTopics: ['rib flare hip thrust', 'controle costal'],
    },
    {
      joint: 'knee_alignment',
      label: 'Alinhamento Joelhos (Valgo)',
      expectedState: 'Joelhos sobre 2º-3º dedo do pé',
      side: 'bilateral',
      criteria: {
        maxVariation: { metric: 'knee_medial_displacement', acceptable: 2, warning: 5, danger: 8, unit: 'cm' },
      },
      instabilityMeaning: 'Valgo dinâmico — glúteo médio fraco',
      correctiveExercises: ['clamshell', 'monster walk', 'hip thrust com mini band'],
      ragTopics: ['valgo dinâmico hip thrust', 'glúteo médio'],
    },
    {
      joint: 'knee_angle',
      label: 'Ângulo dos Joelhos',
      expectedState: 'Joelhos a ~90°, canelas verticais',
      side: 'bilateral',
      criteria: {
        maxVariation: { metric: 'knee_angle_deviation', acceptable: 5, warning: 10, danger: 18, unit: '°' },
      },
      instabilityMeaning: 'Ângulo incorreto — transfere carga para quadríceps ou isquiotibiais',
      correctiveExercises: ['ajustar posição dos pés', 'hip thrust com pausa'],
      ragTopics: ['ângulo joelho hip thrust', 'posição pés hip thrust'],
    },
    {
      joint: 'cervical',
      label: 'Coluna Cervical',
      expectedState: 'Olhar para frente/baixo, queixo neutro',
      side: 'midline',
      criteria: {
        maxVariation: { metric: 'cervical_extension_change', acceptable: 5, warning: 12, danger: 20, unit: '°' },
      },
      instabilityMeaning: 'Hiperextensão cervical — estresse na coluna cervical',
      correctiveExercises: ['chin tuck', 'consciência cervical'],
      ragTopics: ['posição cervical hip thrust', 'extensão cervical'],
    },
  ],

  phases: [
    { id: 'setup', label: 'Posição Inicial', keyFrame: 'first', evaluateMotors: false, evaluateStabilizers: true },
    { id: 'concentric', label: 'Concêntrica (Subida)', keyFrame: 'custom', evaluateMotors: true, evaluateStabilizers: true },
    { id: 'lockout', label: 'Lockout (Topo)', keyFrame: 'max_angle', evaluateMotors: true, evaluateStabilizers: true },
    { id: 'eccentric', label: 'Excêntrica (Descida)', keyFrame: 'custom', evaluateMotors: true, evaluateStabilizers: true },
  ],

  muscles: {
    primary: ['glúteo máximo'],
    secondary: ['isquiotibiais', 'adutor magno'],
    stabilizers: ['transverso abdominal', 'glúteo médio', 'eretor da espinha'],
  },
};

// ============================
// Registry + Lookup
// ============================

const V2_TEMPLATES: Record<string, ExerciseTemplate> = {
  back_squat: BACK_SQUAT_TEMPLATE,
  deadlift_conventional: DEADLIFT_CONVENTIONAL_TEMPLATE,
  chest_supported_row: CHEST_SUPPORTED_ROW_TEMPLATE,
  lateral_raise: LATERAL_RAISE_TEMPLATE,
  bench_press: BENCH_PRESS_TEMPLATE,
  hip_thrust: HIP_THRUST_TEMPLATE,
};

/**
 * Mapeamento de aliases PT/EN para exerciseId V2
 * Normalizado: lowercase, sem acentos
 */
const V2_EXERCISE_ALIASES: Record<string, string> = {
  // Back Squat
  'back squat': 'back_squat',
  'agachamento': 'back_squat',
  'agachamento livre': 'back_squat',
  'agachamento com barra': 'back_squat',
  'agachamento livre com barra': 'back_squat',
  'squat': 'back_squat',
  'barbell squat': 'back_squat',
  'high bar squat': 'back_squat',
  'low bar squat': 'back_squat',

  // Deadlift
  'deadlift': 'deadlift_conventional',
  'deadlift convencional': 'deadlift_conventional',
  'levantamento terra': 'deadlift_conventional',
  'levantamento terra convencional': 'deadlift_conventional',
  'terra': 'deadlift_conventional',
  'conventional deadlift': 'deadlift_conventional',

  // Chest Supported Row
  'remada com apoio': 'chest_supported_row',
  'remada com apoio de peitoral': 'chest_supported_row',
  'remada apoio peitoral': 'chest_supported_row',
  'remada no banco inclinado': 'chest_supported_row',
  'chest supported row': 'chest_supported_row',
  'seal row': 'chest_supported_row',
  'incline dumbbell row': 'chest_supported_row',
  'remada apoio': 'chest_supported_row',
  'puxadas': 'chest_supported_row',

  // Bench Press
  'supino': 'bench_press',
  'supino reto': 'bench_press',
  'supino reto com barra': 'bench_press',
  'supino com barra': 'bench_press',
  'bench press': 'bench_press',
  'barbell bench press': 'bench_press',
  'flat bench': 'bench_press',
  'supino plano': 'bench_press',

  // Hip Thrust
  'hip thrust': 'hip_thrust',
  'elevacao pelvica': 'hip_thrust',
  'elevação pélvica': 'hip_thrust',
  'barbell hip thrust': 'hip_thrust',
  'glute bridge': 'hip_thrust',
  'ponte': 'hip_thrust',
  'elevacao de quadril': 'hip_thrust',
  'elevação de quadril': 'hip_thrust',

  // Lateral Raise
  'elevacao lateral': 'lateral_raise',
  'elevação lateral': 'lateral_raise',
  'lateral raise': 'lateral_raise',
  'side raise': 'lateral_raise',
  'abdução ombro': 'lateral_raise',
  'abducao ombro': 'lateral_raise',
  'dumbbell lateral raise': 'lateral_raise',
};

function normalizeExerciseName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[_-]/g, ' ')
    .trim();
}

/**
 * Busca template V2 por exerciseId ou nome do exercício
 * Retorna null se não encontrado (fallback para V1)
 */
export function getExerciseTemplateV2(exerciseNameOrId: string): ExerciseTemplate | null {
  // Direto por ID
  if (V2_TEMPLATES[exerciseNameOrId]) {
    return V2_TEMPLATES[exerciseNameOrId];
  }

  // Por alias
  const normalized = normalizeExerciseName(exerciseNameOrId);
  const exerciseId = V2_EXERCISE_ALIASES[normalized];
  if (exerciseId && V2_TEMPLATES[exerciseId]) {
    return V2_TEMPLATES[exerciseId];
  }

  // Busca parcial
  for (const [alias, id] of Object.entries(V2_EXERCISE_ALIASES)) {
    if (normalized.includes(alias) || alias.includes(normalized)) {
      if (V2_TEMPLATES[id]) return V2_TEMPLATES[id];
    }
  }

  return null;
}

/**
 * Lista todos os exercícios com template V2 disponível
 */
export function listV2Exercises(): { exerciseId: string; exerciseName: string; category: string }[] {
  return Object.values(V2_TEMPLATES).map(t => ({
    exerciseId: t.exerciseId,
    exerciseName: t.exerciseName,
    category: t.category,
  }));
}

/**
 * Coleta todos os RAG topics de um template V2 (motor + stabilizer)
 */
export function extractV2RAGTopics(template: ExerciseTemplate): string[] {
  const topics: string[] = [];
  for (const mj of template.motorJoints) {
    topics.push(...mj.ragTopics);
  }
  for (const sj of template.stabilizerJoints) {
    topics.push(...sj.ragTopics);
  }
  return [...new Set(topics)];
}

/**
 * Coleta RAG topics apenas das articulações com problema
 */
export function extractV2ProblemRAGTopics(
  motorResults: { joint: string; classification: string }[],
  stabilizerResults: { joint: string; classification: string }[],
  template: ExerciseTemplate,
): string[] {
  const topics: string[] = [];

  for (const mr of motorResults) {
    if (mr.classification === 'warning' || mr.classification === 'danger') {
      const mj = template.motorJoints.find(j => j.joint === mr.joint);
      if (mj) topics.push(...mj.ragTopics);
    }
  }

  for (const sr of stabilizerResults) {
    if (sr.classification === 'alerta' || sr.classification === 'compensação') {
      const sj = template.stabilizerJoints.find(j => j.joint === sr.joint);
      if (sj) topics.push(...sj.ragTopics);
    }
  }

  return [...new Set(topics)];
}
