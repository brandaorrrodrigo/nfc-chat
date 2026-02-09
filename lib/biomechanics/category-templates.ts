/**
 * Templates de categorias de movimento biomecânico
 * Define critérios, ranges e tópicos RAG para cada categoria
 * Suporte multilíngue PT/EN
 */

export interface CriterionRange {
  metric: string;
  label: string; // Nome em português para exibição
  note?: string;
  rag_topics: string[];
  // Flexible classification ranges
  [key: string]: string | string[] | undefined;
}

export interface CategoryTemplate {
  category: string;
  label: string; // Nome em português para exibição
  key_joints: string[];
  key_alignments: string[];
  key_positions: string[];
  phases: string[];
  criteria: Record<string, CriterionRange>;
  safety_critical_criteria: string[];
  rom_dependent_criteria: string[]; // Critérios que dependem de amplitude (informativos quando constraint ativo)
}

// ============================
// Equipment Constraints
// ============================

export type EquipmentConstraint =
  | 'none'
  | 'safety_bars'
  | 'machine_guided'
  | 'space_limited'
  | 'pain_limited'
  | 'rehab';

export const CONSTRAINT_LABELS: Record<EquipmentConstraint, string> = {
  none: 'Nenhuma',
  safety_bars: 'Barras de segurança',
  machine_guided: 'Máquina guiada (Smith)',
  space_limited: 'Espaço limitado',
  pain_limited: 'Dor limitando amplitude',
  rehab: 'Em reabilitação',
};

// ============================
// Tradução multilíngue centralizada
// ============================

/** Tradução dos níveis de classificação */
export const CLASSIFICATION_LABELS: Record<string, string> = {
  excellent: 'Excelente',
  good: 'Bom',
  acceptable: 'Aceitável',
  warning: 'Alerta',
  danger: 'Perigo',
  // Custom levels usados em alguns templates
  complete: 'Completo',
  partial: 'Parcial',
  incomplete: 'Incompleto',
  controlled: 'Controlado',
  stable: 'Estável',
  neutral: 'Neutro',
  optimal: 'Ótimo',
  compensating: 'Compensando',
  significant: 'Significativo',
  unstable: 'Instável',
  aligned: 'Alinhado',
  medial: 'Medial',
  lateral: 'Lateral',
  beyond_toe: 'Além do pé',
  forward: 'À frente',
  behind: 'Atrás',
};

/** Tradução dos nomes de categoria */
export const CATEGORY_LABELS: Record<string, string> = {
  squat: 'Agachamento',
  hinge: 'Levantamento Terra / Posterior',
  horizontal_press: 'Supino / Press Horizontal',
  vertical_press: 'Desenvolvimento / Press Vertical',
  pull: 'Remada / Puxada',
  unilateral: 'Unilateral (Afundo / Step-up)',
  core: 'Core / Estabilização',
};

/** Traduz um nível de classificação para PT */
export function translateClassification(level: string): string {
  return CLASSIFICATION_LABELS[level] || level;
}

/** Traduz o nome de uma categoria para PT */
export function translateCategory(category: string): string {
  return CATEGORY_LABELS[category] || category;
}

/**
 * SQUAT - Agachamento
 */
export const SQUAT_TEMPLATE: CategoryTemplate = {
  category: 'squat',
  label: 'Agachamento',
  key_joints: ['knee', 'hip', 'ankle', 'trunk', 'lumbar', 'thoracic'],
  key_alignments: ['knee_valgus', 'bar_tilt', 'hip_level', 'shoulder_level'],
  key_positions: ['heel_contact', 'hip_below_knee', 'weight_distribution'],
  phases: ['eccentric_descent', 'bottom_position', 'concentric_ascent'],
  safety_critical_criteria: ['knee_valgus', 'lumbar_control'],
  rom_dependent_criteria: ['depth', 'ankle_mobility', 'tempo'],
  criteria: {
    depth: {
      metric: 'hip_angle_at_bottom',
      label: 'Profundidade',
      excellent: '< 70°',
      good: '70-90°',
      acceptable: '70-100°',
      warning: '100-120°',
      danger: '> 120°',
      note: 'Quadril abaixo da linha do joelho = ângulo quadril < ~80°',
      rag_topics: ['profundidade agachamento', 'amplitude de movimento agachamento', 'ângulo do quadril'],
    },
    knee_valgus: {
      metric: 'knee_medial_displacement_cm',
      label: 'Valgo de Joelho',
      acceptable: '< 3cm',
      warning: '3-6cm',
      danger: '> 6cm',
      note: 'Deslocamento medial do joelho em cm (projeção frontal)',
      rag_topics: ['valgo dinâmico', 'insuficiência glúteo médio', 'ativação VMO', 'valgo de joelho'],
    },
    trunk_control: {
      metric: 'trunk_inclination_degrees',
      label: 'Controle de Tronco',
      acceptable: '< 45° (back squat) / < 30° (front squat)',
      warning: '45-55° (back squat)',
      danger: '> 55° (back squat)',
      note: 'Ângulo do tronco em relação à vertical',
      rag_topics: ['inclinação anterior tronco agachamento', 'controle core', 'ângulo do tronco agachamento'],
    },
    ankle_mobility: {
      metric: 'ankle_dorsiflexion_degrees',
      label: 'Mobilidade de Tornozelo',
      excellent: '> 35°',
      good: '30-35°',
      acceptable: '25-30°',
      warning: '20-25°',
      danger: '< 20°',
      note: 'Dorsiflexão do tornozelo em graus',
      rag_topics: ['mobilidade tornozelo', 'dorsiflexão', 'limitação gastrocnêmio'],
    },
    lumbar_control: {
      metric: 'lumbar_flexion_change_degrees',
      label: 'Controle Lombar',
      acceptable: '< 10°',
      warning: '10-20°',
      danger: '> 20°',
      note: 'Mudança de flexão lombar do início até o fundo (butt wink)',
      rag_topics: ['retroversão pélvica agachamento', 'butt wink', 'flexão lombar'],
    },
    asymmetry: {
      metric: 'bilateral_angle_difference',
      label: 'Assimetria Bilateral',
      acceptable: '< 5°',
      warning: '5-10°',
      danger: '> 10°',
      note: 'Diferença entre ângulos de joelho/quadril direito e esquerdo',
      rag_topics: ['assimetria bilateral', 'desequilíbrio muscular', 'compensação assimétrica'],
    },
    tempo: {
      metric: 'eccentric_concentric_ratio',
      label: 'Tempo do Movimento',
      excellent: '> 1.5:1',
      acceptable: '1:1 a 1.5:1',
      warning: '0.8:1 a 1:1',
      danger: '< 0.8:1',
      note: 'Razão entre tempo excêntrico e concêntrico',
      rag_topics: ['controle excêntrico', 'tempo agachamento', 'velocidade movimento'],
    },
  },
};

/**
 * HINGE - Levantamento terra / RDL / Stiff
 */
export const HINGE_TEMPLATE: CategoryTemplate = {
  category: 'hinge',
  label: 'Levantamento Terra / Posterior',
  key_joints: ['hip', 'knee', 'lumbar', 'thoracic', 'shoulder'],
  key_alignments: ['bar_path_deviation', 'hip_level', 'shoulder_over_bar'],
  key_positions: ['bar_contact_shins', 'lockout_complete', 'neutral_spine'],
  phases: ['setup', 'pull_floor_to_knee', 'pull_knee_to_lockout', 'eccentric_return'],
  safety_critical_criteria: ['lumbar_neutrality', 'bar_path'],
  rom_dependent_criteria: ['hip_hinge_depth', 'tempo_hinge'],
  criteria: {
    lumbar_neutrality: {
      metric: 'lumbar_flexion_degrees',
      label: 'Neutralidade Lombar',
      acceptable: '10-30°',
      warning: '30-40°',
      danger: '> 40°',
      note: 'Lordose fisiológica mantida (10-30°) = bom. Acima disso = risco de lesão',
      rag_topics: ['flexão lombar levantamento terra', 'coluna neutra levantamento terra', 'proteção disco'],
    },
    hip_hinge_dominance: {
      metric: 'hip_angle_vs_knee_angle_ratio',
      label: 'Dominância de Quadril',
      excellent: '> 2:1',
      good: '1.5:1 a 2:1',
      acceptable: '1:1 a 1.5:1',
      warning: '0.8:1 a 1:1',
      danger: '< 0.8:1',
      note: 'Quadril deve fechar muito mais que joelho. Ratio < 1 = está agachando',
      rag_topics: ['padrão dobradiça de quadril', 'dominância quadril', 'cadeia posterior', 'ativação glúteo'],
    },
    bar_path: {
      metric: 'horizontal_bar_deviation_cm',
      label: 'Trajetória da Barra',
      excellent: '< 2cm',
      acceptable: '2-4cm',
      warning: '4-6cm',
      danger: '> 6cm',
      note: 'Desvio horizontal da barra em relação à linha vertical',
      rag_topics: ['trajetória barra levantamento terra', 'eficiência mecânica', 'posição da barra'],
    },
    thoracic_extension: {
      metric: 'thoracic_flexion_degrees',
      label: 'Extensão Torácica',
      good: '< 30°',
      warning: '30-45°',
      danger: '> 45°',
      note: 'Cifose torácica - deve manter extensão torácica',
      rag_topics: ['cifose torácica levantamento terra', 'extensão torácica', 'posição escapular'],
    },
    lockout: {
      metric: 'hip_extension_at_top',
      label: 'Lockout (Extensão Final)',
      complete: '> 170°',
      partial: '160-170°',
      incomplete: '< 160°',
      note: 'Extensão completa do quadril no topo = lockout',
      rag_topics: ['lockout levantamento terra', 'extensão quadril completa', 'ativação glúteo máximo'],
    },
  },
};

/**
 * HORIZONTAL PRESS - Supino
 */
export const HORIZONTAL_PRESS_TEMPLATE: CategoryTemplate = {
  category: 'horizontal_press',
  label: 'Supino / Press Horizontal',
  key_joints: ['shoulder', 'elbow', 'wrist', 'thoracic'],
  key_alignments: ['bar_path', 'elbow_flare', 'wrist_alignment', 'shoulder_retraction'],
  key_positions: ['scapula_retracted', 'arch_maintained', 'feet_flat'],
  phases: ['setup', 'eccentric_descent', 'bottom_position', 'concentric_press'],
  safety_critical_criteria: ['wrist_alignment', 'elbow_flare'],
  rom_dependent_criteria: ['rom_press', 'tempo_press'],
  criteria: {
    elbow_angle_bottom: {
      metric: 'elbow_angle_at_chest',
      label: 'Ângulo do Cotovelo (Base)',
      excellent: '< 80°',
      good: '80-90°',
      acceptable: '90-110°',
      warning: '110-130°',
      danger: '> 130°',
      note: 'Ângulo do cotovelo na base do supino',
      rag_topics: ['amplitude supino', 'ROM completo supino', 'ângulo cotovelo supino'],
    },
    elbow_flare: {
      metric: 'elbow_abduction_angle',
      label: 'Abdução do Cotovelo',
      optimal: '45-60°',
      acceptable: '60-75°',
      warning: '75-85°',
      danger: '> 85°',
      note: 'Ângulo de abdução do cotovelo (afastamento do corpo)',
      rag_topics: ['abdução ombro supino', 'impacto subacromial', 'saúde ombro supino'],
    },
    wrist_alignment: {
      metric: 'wrist_extension_degrees',
      label: 'Alinhamento do Punho',
      neutral: '< 10°',
      warning: '10-25°',
      danger: '> 25°',
      note: 'Extensão do punho - deve ficar neutra (< 10°)',
      rag_topics: ['posição punho supino', 'alinhamento punho barra', 'estabilidade punho'],
    },
    bar_path: {
      metric: 'bar_path_efficiency',
      label: 'Trajetória da Barra',
      excellent: 'Arco suave, atinge mid-chest',
      acceptable: 'Trajetória consistente',
      warning: 'Desvios laterais 3-5cm',
      danger: '> 5cm desvio',
      rag_topics: ['trajetória barra supino', 'eficiência mecânica supino'],
    },
  },
};

/**
 * VERTICAL PRESS - Overhead press
 */
export const VERTICAL_PRESS_TEMPLATE: CategoryTemplate = {
  category: 'vertical_press',
  label: 'Desenvolvimento / Press Vertical',
  key_joints: ['shoulder', 'elbow', 'wrist', 'lumbar', 'thoracic'],
  key_alignments: ['bar_over_midfoot', 'elbow_under_wrist', 'lumbar_extension'],
  key_positions: ['full_lockout', 'rib_cage_down', 'glutes_engaged'],
  phases: ['setup', 'press_to_forehead', 'press_to_lockout', 'eccentric_return'],
  safety_critical_criteria: ['lumbar_compensation', 'overhead_lockout'],
  rom_dependent_criteria: ['shoulder_rom', 'tempo_overhead'],
  criteria: {
    overhead_lockout: {
      metric: 'shoulder_flexion_at_top',
      label: 'Lockout Overhead',
      complete: '> 170°',
      partial: '150-170°',
      incomplete: '< 150°',
      note: 'Flexão de ombro no lockout final',
      rag_topics: ['mobilidade overhead', 'flexão ombro overhead', 'lockout desenvolvimento'],
    },
    lumbar_compensation: {
      metric: 'lumbar_extension_increase_degrees',
      label: 'Compensação Lombar',
      controlled: '< 5°',
      warning: '5-15°',
      danger: '> 15°',
      note: 'Aumento de extensão lombar durante press (hiperextensão = risco)',
      rag_topics: ['hiperextensão lombar desenvolvimento', 'compensação lombar overhead', 'estabilidade core overhead'],
    },
    rib_flare: {
      metric: 'rib_cage_angle_change',
      label: 'Abertura de Costelas',
      controlled: '< 5°',
      warning: '5-15°',
      danger: '> 15°',
      note: 'Abertura de costelas (rib flare) durante movimento',
      rag_topics: ['abertura costelas overhead', 'controle costelas', 'core desenvolvimento'],
    },
    elbow_position: {
      metric: 'elbow_under_wrist_alignment',
      label: 'Posição do Cotovelo',
      optimal: 'Cotovelo diretamente abaixo do punho',
      forward: 'Cotovelo à frente (perde força)',
      behind: 'Cotovelo atrás (estresse ombro)',
      note: 'Alinhamento cotovelo-punho no plano sagital',
      rag_topics: ['posição cotovelo desenvolvimento', 'momento de força ombro overhead'],
    },
  },
};

/**
 * PULL - Remada e puxada
 */
export const PULL_TEMPLATE: CategoryTemplate = {
  category: 'pull',
  label: 'Remada / Puxada',
  key_joints: ['shoulder', 'elbow', 'scapula', 'lumbar', 'thoracic'],
  key_alignments: ['scapular_movement', 'elbow_path', 'torso_stability'],
  key_positions: ['full_stretch', 'full_contraction', 'neutral_spine'],
  phases: ['start_position', 'concentric_pull', 'peak_contraction', 'eccentric_return'],
  safety_critical_criteria: ['torso_stability_row', 'lumbar_position_row'],
  rom_dependent_criteria: ['contraction_rom', 'tempo_pull'],
  criteria: {
    scapular_retraction: {
      metric: 'scapular_distance_change_cm',
      label: 'Retração Escapular',
      excellent: '> 4cm',
      good: '2-4cm',
      acceptable: '1-2cm',
      warning: '< 1cm',
      danger: '0cm',
      note: 'Aproximação das escápulas durante movimento (distância em cm)',
      rag_topics: ['retração escapular remada', 'ativação romboides trapézio', 'movimento escapular'],
    },
    rom_pull: {
      metric: 'elbow_angle_at_contraction',
      label: 'Amplitude da Puxada',
      excellent: '< 90°',
      good: '90-110°',
      acceptable: '110-130°',
      warning: '> 130°',
      danger: 'Sem contração (ROM zero)',
      note: 'Ângulo do cotovelo na contração máxima',
      rag_topics: ['amplitude remada', 'ROM puxada completo'],
    },
    torso_stability_row: {
      metric: 'trunk_angle_variation_degrees',
      label: 'Estabilidade do Tronco',
      stable: '< 5°',
      good: '5-10°',
      warning: '10-15°',
      danger: '> 15°',
      note: 'Variação do ângulo do tronco durante série (indica momentum)',
      rag_topics: ['estabilidade tronco remada', 'uso de impulso remada'],
    },
    lumbar_position_row: {
      metric: 'lumbar_flexion_degrees',
      label: 'Posição Lombar',
      neutral: '15-30°',
      warning: '30-40°',
      danger: '> 40°',
      note: 'Flexão lombar mantendo lordose fisiológica',
      rag_topics: ['posição lombar remada', 'coluna neutra puxada'],
    },
  },
};

/**
 * UNILATERAL - Lunge, step-up, etc
 */
export const UNILATERAL_TEMPLATE: CategoryTemplate = {
  category: 'unilateral',
  label: 'Unilateral (Afundo / Step-up)',
  key_joints: ['knee', 'hip', 'ankle', 'trunk', 'pelvis'],
  key_alignments: ['knee_over_toe', 'pelvic_drop', 'trunk_lateral_lean', 'knee_valgus'],
  key_positions: ['front_knee_tracking', 'rear_knee_position', 'weight_distribution'],
  phases: ['setup', 'eccentric_descent', 'bottom_position', 'concentric_ascent'],
  safety_critical_criteria: ['knee_valgus_unilateral', 'pelvic_stability'],
  rom_dependent_criteria: ['depth_unilateral', 'tempo_unilateral'],
  criteria: {
    knee_valgus_unilateral: {
      metric: 'knee_medial_displacement_cm',
      label: 'Valgo de Joelho (Unilateral)',
      acceptable: '< 2cm',
      warning: '2-4cm',
      danger: '> 4cm',
      note: 'Threshold menor que bilateral - base menor amplifica valgo',
      rag_topics: ['valgo unilateral', 'estabilidade joelho perna única', 'valgo de joelho'],
    },
    pelvic_stability: {
      metric: 'contralateral_pelvic_drop_degrees',
      label: 'Estabilidade Pélvica',
      stable: '< 5°',
      warning: '5-10°',
      danger: '> 10°',
      note: 'Queda pélvica do lado oposto (Trendelenburg positivo)',
      rag_topics: ['sinal Trendelenburg', 'queda pélvica', 'fraqueza glúteo médio'],
    },
    trunk_lateral_lean: {
      metric: 'trunk_lateral_deviation_degrees',
      label: 'Inclinação Lateral do Tronco',
      stable: '< 5°',
      compensating: '5-10°',
      significant: '> 10°',
      note: 'Inclinação lateral do tronco (compensação de fraqueza)',
      rag_topics: ['inclinação lateral tronco', 'compensação Duchenne', 'estabilidade lateral'],
    },
    knee_tracking: {
      metric: 'knee_over_foot_alignment',
      label: 'Alinhamento do Joelho',
      aligned: 'Joelho sobre 2º-3º dedo',
      medial: 'Joelho medial (valgo)',
      lateral: 'Joelho lateral (varo)',
      beyond_toe: 'Muito além do pé',
      note: 'Alinhamento joelho em relação ao pé no plano frontal',
      rag_topics: ['alinhamento joelho afundo', 'rastreamento joelho'],
    },
  },
};

/**
 * CORE - Prancha, Pallof, Dead bug
 */
export const CORE_TEMPLATE: CategoryTemplate = {
  category: 'core',
  label: 'Core / Estabilização',
  key_joints: ['lumbar', 'thoracic', 'hip', 'pelvis'],
  key_alignments: ['spinal_neutral', 'pelvic_tilt', 'rib_position'],
  key_positions: ['alignment_head_to_heel', 'hip_sag', 'hip_pike'],
  phases: ['setup', 'hold_or_movement', 'fatigue_compensation'],
  safety_critical_criteria: ['spinal_alignment', 'pelvic_control'],
  rom_dependent_criteria: ['hold_duration'],
  criteria: {
    spinal_alignment: {
      metric: 'deviation_from_neutral_line',
      label: 'Alinhamento Espinal',
      neutral: '< 5°',
      warning: '5-10°',
      danger: '> 10°',
      note: 'Desvio da linha neutra (sagging = extensão, piking = flexão)',
      rag_topics: ['alinhamento neutro prancha', 'estabilidade lombar core'],
    },
    pelvic_control: {
      metric: 'anterior_posterior_tilt_change',
      label: 'Controle Pélvico',
      stable: '< 5°',
      warning: '5-10°',
      unstable: '> 10°',
      note: 'Mudança de inclinação pélvica durante exercício',
      rag_topics: ['controle pélvico', 'inclinação pélvica', 'estabilidade core'],
    },
    rib_cage_control: {
      metric: 'rib_flare_angle',
      label: 'Controle de Costelas',
      controlled: '< 5° abertura',
      warning: '5-15°',
      danger: '> 15°',
      note: 'Abertura de costelas (rib flare)',
      rag_topics: ['abertura costelas core', 'controle costelas', 'zona de aposição'],
    },
  },
};

/**
 * Mapa de exercício para categoria
 */
export const EXERCISE_CATEGORY_MAP: Record<string, string> = {
  // Squat
  back_squat: 'squat',
  front_squat: 'squat',
  goblet_squat: 'squat',
  overhead_squat: 'squat',
  hack_squat: 'squat',
  leg_press: 'squat',
  smith_squat: 'squat',

  // Hinge
  deadlift_conventional: 'hinge',
  deadlift_sumo: 'hinge',
  stiff_leg_deadlift: 'hinge',
  rdl: 'hinge',
  good_morning: 'hinge',
  hip_thrust: 'hinge',

  // Horizontal Press
  bench_press: 'horizontal_press',
  incline_press: 'horizontal_press',
  dumbbell_press: 'horizontal_press',
  push_up: 'horizontal_press',

  // Vertical Press
  overhead_press: 'vertical_press',
  push_press: 'vertical_press',
  arnold_press: 'vertical_press',

  // Pull
  barbell_row: 'pull',
  dumbbell_row: 'pull',
  lat_pulldown: 'pull',
  pull_up: 'pull',
  chin_up: 'pull',

  // Unilateral
  lunge_forward: 'unilateral',
  bulgarian_split_squat: 'unilateral',
  step_up: 'unilateral',

  // Core
  plank: 'core',
  side_plank: 'core',
  dead_bug: 'core',

  // ===== Português - Squat =====
  agachamento: 'squat',
  agachamento_com_barra: 'squat',
  agachamento_barra_alta: 'squat',
  agachamento_barra_baixa: 'squat',
  agachamento_frontal: 'squat',
  agachamento_goblet: 'squat',
  agachamento_overhead: 'squat',
  agachamento_hack: 'squat',
  agachamento_smith: 'squat',
  agachamento_livre: 'squat',
  agachamento_calice: 'squat',

  // ===== Português - Hinge =====
  levantamento_terra: 'hinge',
  levantamento_terra_convencional: 'hinge',
  levantamento_terra_sumo: 'hinge',
  terra_convencional: 'hinge',
  terra_sumo: 'hinge',
  stiff: 'hinge',
  romeno: 'hinge',
  bom_dia: 'hinge',
  elevacao_de_quadril: 'hinge',
  elevacao_pelvica: 'hinge',

  // ===== Português - Horizontal Press =====
  supino: 'horizontal_press',
  supino_reto: 'horizontal_press',
  supino_inclinado: 'horizontal_press',
  supino_declinado: 'horizontal_press',
  supino_com_halteres: 'horizontal_press',
  flexao_de_braco: 'horizontal_press',
  flexao: 'horizontal_press',

  // ===== Português - Vertical Press =====
  desenvolvimento: 'vertical_press',
  desenvolvimento_com_barra: 'vertical_press',
  desenvolvimento_militar: 'vertical_press',
  press_militar: 'vertical_press',
  desenvolvimento_com_halteres: 'vertical_press',

  // ===== Português - Pull =====
  remada: 'pull',
  remada_curvada: 'pull',
  remada_com_barra: 'pull',
  remada_com_halter: 'pull',
  remada_cavaleiro: 'pull',
  puxada: 'pull',
  puxada_frontal: 'pull',
  puxada_alta: 'pull',
  barra_fixa: 'pull',

  // ===== Português - Unilateral =====
  afundo: 'unilateral',
  afundo_frontal: 'unilateral',
  passada: 'unilateral',
  bulgaro: 'unilateral',
  agachamento_bulgaro: 'unilateral',

  // ===== Português - Core =====
  prancha: 'core',
  prancha_lateral: 'core',
  abdominal: 'core',
};

/**
 * Obter template por categoria
 */
export function getCategoryTemplate(category: string): CategoryTemplate {
  const templates: Record<string, CategoryTemplate> = {
    squat: SQUAT_TEMPLATE,
    hinge: HINGE_TEMPLATE,
    horizontal_press: HORIZONTAL_PRESS_TEMPLATE,
    vertical_press: VERTICAL_PRESS_TEMPLATE,
    pull: PULL_TEMPLATE,
    unilateral: UNILATERAL_TEMPLATE,
    core: CORE_TEMPLATE,
  };

  return templates[category] || SQUAT_TEMPLATE; // Default to squat
}

/**
 * Obter categoria de um exercício
 */
export function getExerciseCategory(exerciseName: string): string {
  const normalized = exerciseName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[-\s]+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
  return EXERCISE_CATEGORY_MAP[normalized] || 'squat'; // Default
}
