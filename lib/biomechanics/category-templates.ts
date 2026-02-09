/**
 * Templates de categorias de movimento biomecânico
 * Define critérios, ranges e tópicos RAG para cada categoria
 */

export interface CriterionRange {
  metric: string;
  note?: string;
  rag_topics: string[];
  // Flexible classification ranges (can be excellent, good, acceptable, warning, danger, or custom like complete, optimal, neutral, etc)
  [key: string]: string | string[] | undefined;
}

export interface CategoryTemplate {
  category: string;
  key_joints: string[];
  key_alignments: string[];
  key_positions: string[];
  phases: string[];
  criteria: Record<string, CriterionRange>;
  safety_critical_criteria: string[];
}

/**
 * SQUAT - Agachamento
 */
export const SQUAT_TEMPLATE: CategoryTemplate = {
  category: 'squat',
  key_joints: ['knee', 'hip', 'ankle', 'trunk', 'lumbar', 'thoracic'],
  key_alignments: ['knee_valgus', 'bar_tilt', 'hip_level', 'shoulder_level'],
  key_positions: ['heel_contact', 'hip_below_knee', 'weight_distribution'],
  phases: ['eccentric_descent', 'bottom_position', 'concentric_ascent'],
  safety_critical_criteria: ['knee_valgus', 'lumbar_control'],
  criteria: {
    depth: {
      metric: 'hip_angle_at_bottom',
      excellent: '< 70°',
      good: '70-90°',
      acceptable: '70-100°',
      warning: '100-120°',
      danger: '> 120°',
      note: 'Quadril abaixo da linha do joelho = ângulo quadril < ~80°',
      rag_topics: ['profundidade agachamento', 'amplitude squat', 'hip angle'],
    },
    knee_valgus: {
      metric: 'knee_medial_displacement_cm',
      acceptable: '< 3cm',
      warning: '3-6cm',
      danger: '> 6cm',
      note: 'Deslocamento medial do joelho em cm (projeção frontal)',
      rag_topics: ['valgo dinâmico', 'insuficiência glúteo médio', 'ativação VMO', 'valgus joelho'],
    },
    trunk_control: {
      metric: 'trunk_inclination_degrees',
      acceptable: '< 45° (back squat) / < 30° (front squat)',
      warning: '45-55° (back squat)',
      danger: '> 55° (back squat)',
      note: 'Ângulo do tronco em relação à vertical',
      rag_topics: ['inclinação anterior tronco agachamento', 'controle core', 'torso angle squat'],
    },
    ankle_mobility: {
      metric: 'ankle_dorsiflexion_degrees',
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
      acceptable: '< 10°',
      warning: '10-20°',
      danger: '> 20°',
      note: 'Mudança de flexão lombar do início até o fundo (butt wink)',
      rag_topics: ['retroversão pélvica agachamento', 'butt wink', 'flexão lombar', 'lumbar rounding'],
    },
    asymmetry: {
      metric: 'bilateral_angle_difference',
      acceptable: '< 5°',
      warning: '5-10°',
      danger: '> 10°',
      note: 'Diferença entre ângulos de joelho/quadril direito e esquerdo',
      rag_topics: ['assimetria bilateral', 'desequilíbrio muscular', 'compensação asimétrica'],
    },
    tempo: {
      metric: 'eccentric_concentric_ratio',
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
  key_joints: ['hip', 'knee', 'lumbar', 'thoracic', 'shoulder'],
  key_alignments: ['bar_path_deviation', 'hip_level', 'shoulder_over_bar'],
  key_positions: ['bar_contact_shins', 'lockout_complete', 'neutral_spine'],
  phases: ['setup', 'pull_floor_to_knee', 'pull_knee_to_lockout', 'eccentric_return'],
  safety_critical_criteria: ['lumbar_neutrality', 'bar_path'],
  criteria: {
    lumbar_neutrality: {
      metric: 'lumbar_flexion_degrees',
      acceptable: '10-30°',
      warning: '30-40°',
      danger: '> 40°',
      note: 'Lordose fisiológica mantida (10-30°) = bom. Acima disso = risco de lesão',
      rag_topics: ['flexão lombar levantamento terra', 'neutro coluna deadlift', 'proteção disco'],
    },
    hip_hinge_dominance: {
      metric: 'hip_angle_vs_knee_angle_ratio',
      excellent: '> 2:1',
      good: '1.5:1 a 2:1',
      acceptable: '1:1 a 1.5:1',
      warning: '0.8:1 a 1:1',
      danger: '< 0.8:1',
      note: 'Quadril deve fechar muito mais que joelho. Ratio < 1 = está agachando',
      rag_topics: ['padrão hip hinge', 'dominância quadril', 'posterior chain', 'glute involvement'],
    },
    bar_path: {
      metric: 'horizontal_bar_deviation_cm',
      excellent: '< 2cm',
      acceptable: '2-4cm',
      warning: '4-6cm',
      danger: '> 6cm',
      note: 'Desvio horizontal da barra em relação à linha vertical',
      rag_topics: ['trajetória barra deadlift', 'eficiência mecânica', 'bar position deadlift'],
    },
    thoracic_extension: {
      metric: 'thoracic_flexion_degrees',
      good: '< 30°',
      warning: '30-45°',
      danger: '> 45°',
      note: 'Cifose torácica - deve manter extensão torácica',
      rag_topics: ['cifose torácica deadlift', 'extensão torácica', 'posição escapular'],
    },
    lockout: {
      metric: 'hip_extension_at_top',
      complete: '> 170°',
      partial: '160-170°',
      incomplete: '< 160°',
      note: 'Extensão completa do quadril no topo = lockout',
      rag_topics: ['lockout deadlift', 'extensão quadril completa', 'glute máximo ativação'],
    },
  },
};

/**
 * HORIZONTAL PRESS - Supino
 */
export const HORIZONTAL_PRESS_TEMPLATE: CategoryTemplate = {
  category: 'horizontal_press',
  key_joints: ['shoulder', 'elbow', 'wrist', 'thoracic'],
  key_alignments: ['bar_path', 'elbow_flare', 'wrist_alignment', 'shoulder_retraction'],
  key_positions: ['scapula_retracted', 'arch_maintained', 'feet_flat'],
  phases: ['setup', 'eccentric_descent', 'bottom_position', 'concentric_press'],
  safety_critical_criteria: ['wrist_alignment', 'elbow_flare'],
  criteria: {
    elbow_angle_bottom: {
      metric: 'elbow_angle_at_chest',
      excellent: '< 80°',
      good: '80-90°',
      acceptable: '90-110°',
      warning: '110-130°',
      danger: '> 130°',
      note: 'Ângulo do cotovelo na base do supino',
      rag_topics: ['amplitude supino', 'ROM supino bench', 'elbow angle'],
    },
    elbow_flare: {
      metric: 'elbow_abduction_angle',
      optimal: '45-60°',
      acceptable: '60-75°',
      warning: '75-85°',
      danger: '> 85°',
      note: 'Ângulo de abdução do cotovelo (afastamento do corpo)',
      rag_topics: ['abdução ombro supino', 'impingement subacromial', 'shoulder health bench'],
    },
    wrist_alignment: {
      metric: 'wrist_extension_degrees',
      neutral: '< 10°',
      warning: '10-25°',
      danger: '> 25°',
      note: 'Extensão do punho - deve ficar neutra (< 10°)',
      rag_topics: ['posição punho supino', 'alinhamento punho barra', 'wrist stability'],
    },
    bar_path: {
      metric: 'bar_path_efficiency',
      excellent: 'Arco suave, atinge mid-chest',
      acceptable: 'Trajetória consistente',
      warning: 'Desvios laterais 3-5cm',
      danger: '> 5cm desvio',
      rag_topics: ['trajetória barra supino', 'eficiência mecânica bench press'],
    },
  },
};

/**
 * VERTICAL PRESS - Overhead press
 */
export const VERTICAL_PRESS_TEMPLATE: CategoryTemplate = {
  category: 'vertical_press',
  key_joints: ['shoulder', 'elbow', 'wrist', 'lumbar', 'thoracic'],
  key_alignments: ['bar_over_midfoot', 'elbow_under_wrist', 'lumbar_extension'],
  key_positions: ['full_lockout', 'rib_cage_down', 'glutes_engaged'],
  phases: ['setup', 'press_to_forehead', 'press_to_lockout', 'eccentric_return'],
  safety_critical_criteria: ['lumbar_compensation', 'overhead_lockout'],
  criteria: {
    overhead_lockout: {
      metric: 'shoulder_flexion_at_top',
      complete: '> 170°',
      partial: '150-170°',
      incomplete: '< 150°',
      note: 'Flexão de ombro no lockout final',
      rag_topics: ['mobilidade overhead', 'flexão ombro overhead', 'lockout overhead press'],
    },
    lumbar_compensation: {
      metric: 'lumbar_extension_increase_degrees',
      controlled: '< 5°',
      warning: '5-15°',
      danger: '> 15°',
      note: 'Aumento de extensão lombar durante press (hiperextensão = risco)',
      rag_topics: ['hiperextensão lombar press', 'compensação lombar overhead', 'core stability overhead'],
    },
    rib_flare: {
      metric: 'rib_cage_angle_change',
      controlled: '< 5°',
      warning: '5-15°',
      danger: '> 15°',
      note: 'Abertura de costelas (rib flare) durante movimento',
      rag_topics: ['rib flare overhead', 'controle costelas', 'core overhead press'],
    },
    elbow_position: {
      metric: 'elbow_under_wrist_alignment',
      optimal: 'Cotovelo diretamente abaixo do punho',
      forward: 'Cotovelo à frente (perde força)',
      behind: 'Cotovelo atrás (estresse ombro)',
      note: 'Alinhamento cotovelo-punho no plano sagital',
      rag_topics: ['posição cotovelo press', 'momento de força ombro overhead'],
    },
  },
};

/**
 * PULL - Remada e puxada
 */
export const PULL_TEMPLATE: CategoryTemplate = {
  category: 'pull',
  key_joints: ['shoulder', 'elbow', 'scapula', 'lumbar', 'thoracic'],
  key_alignments: ['scapular_movement', 'elbow_path', 'torso_stability'],
  key_positions: ['full_stretch', 'full_contraction', 'neutral_spine'],
  phases: ['start_position', 'concentric_pull', 'peak_contraction', 'eccentric_return'],
  safety_critical_criteria: ['torso_stability_row', 'lumbar_position_row'],
  criteria: {
    scapular_retraction: {
      metric: 'scapular_distance_change_cm',
      excellent: '> 4cm',
      good: '2-4cm',
      acceptable: '1-2cm',
      warning: '< 1cm',
      danger: '0cm',
      note: 'Aproximação das escápulas durante movimento (distância em cm)',
      rag_topics: ['retração escapular remada', 'ativação romboides trapézio', 'scapular movement'],
    },
    rom_pull: {
      metric: 'elbow_angle_at_contraction',
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
      stable: '< 5°',
      good: '5-10°',
      warning: '10-15°',
      danger: '> 15°',
      note: 'Variação do ângulo do tronco durante série (indica momentum)',
      rag_topics: ['estabilidade tronco remada', 'momentum cheating row'],
    },
    lumbar_position_row: {
      metric: 'lumbar_flexion_degrees',
      neutral: '15-30°',
      warning: '30-40°',
      danger: '> 40°',
      note: 'Flexão lombar mantendo lordose fisiológica',
      rag_topics: ['posição lombar remada', 'neutro coluna pull'],
    },
  },
};

/**
 * UNILATERAL - Lunge, step-up, etc
 */
export const UNILATERAL_TEMPLATE: CategoryTemplate = {
  category: 'unilateral',
  key_joints: ['knee', 'hip', 'ankle', 'trunk', 'pelvis'],
  key_alignments: ['knee_over_toe', 'pelvic_drop', 'trunk_lateral_lean', 'knee_valgus'],
  key_positions: ['front_knee_tracking', 'rear_knee_position', 'weight_distribution'],
  phases: ['setup', 'eccentric_descent', 'bottom_position', 'concentric_ascent'],
  safety_critical_criteria: ['knee_valgus_unilateral', 'pelvic_stability'],
  criteria: {
    knee_valgus_unilateral: {
      metric: 'knee_medial_displacement_cm',
      acceptable: '< 2cm',
      warning: '2-4cm',
      danger: '> 4cm',
      note: 'Threshold menor que bilateral - base menor amplifica valgo',
      rag_topics: ['valgo unilateral', 'estabilidade joelho single leg', 'knee valgus'],
    },
    pelvic_stability: {
      metric: 'contralateral_pelvic_drop_degrees',
      stable: '< 5°',
      warning: '5-10°',
      danger: '> 10°',
      note: 'Queda pélvica do lado oposto (Trendelenburg positivo)',
      rag_topics: ['sinal Trendelenburg', 'queda pélvica', 'glúteo médio fraqueza'],
    },
    trunk_lateral_lean: {
      metric: 'trunk_lateral_deviation_degrees',
      stable: '< 5°',
      compensating: '5-10°',
      significant: '> 10°',
      note: 'Inclinação lateral do tronco (compensação de fraqueza)',
      rag_topics: ['inclinação lateral tronco', 'compensação Duchenne', 'estabilidade lateral'],
    },
    knee_tracking: {
      metric: 'knee_over_foot_alignment',
      aligned: 'Joelho sobre 2º-3º dedo',
      medial: 'Joelho medial (valgo)',
      lateral: 'Joelho lateral (varo)',
      beyond_toe: 'Muito além do pé',
      note: 'Alinhamento joelho em relação ao pé no plano frontal',
      rag_topics: ['tracking joelho lunge', 'alinhamento joelho'],
    },
  },
};

/**
 * CORE - Prancha, Pallof, Dead bug
 */
export const CORE_TEMPLATE: CategoryTemplate = {
  category: 'core',
  key_joints: ['lumbar', 'thoracic', 'hip', 'pelvis'],
  key_alignments: ['spinal_neutral', 'pelvic_tilt', 'rib_position'],
  key_positions: ['alignment_head_to_heel', 'hip_sag', 'hip_pike'],
  phases: ['setup', 'hold_or_movement', 'fatigue_compensation'],
  safety_critical_criteria: ['spinal_alignment', 'pelvic_control'],
  criteria: {
    spinal_alignment: {
      metric: 'deviation_from_neutral_line',
      neutral: '< 5°',
      warning: '5-10°',
      danger: '> 10°',
      note: 'Desvio da linha neutra (sagging = extensão, piking = flexão)',
      rag_topics: ['alinhamento neutro prancha', 'estabilidade lombar core'],
    },
    pelvic_control: {
      metric: 'anterior_posterior_tilt_change',
      stable: '< 5°',
      warning: '5-10°',
      unstable: '> 10°',
      note: 'Mudança de inclinação pélvica durante exercício',
      rag_topics: ['controle pélvico', 'inclinação pélvica', 'estabilidade core'],
    },
    rib_cage_control: {
      metric: 'rib_flare_angle',
      controlled: '< 5° abertura',
      warning: '5-15°',
      danger: '> 15°',
      note: 'Abertura de costelas (rib flare)',
      rag_topics: ['rib flare core', 'controle costelas', 'zona de aposição'],
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
