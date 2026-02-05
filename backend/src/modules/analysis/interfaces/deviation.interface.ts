/**
 * Severidade de um desvio biomecânico
 */
export type DeviationSeverity = 'mild' | 'moderate' | 'severe';

/**
 * Tipos de desvios catalogados
 */
export type DeviationType =
  | 'knee_valgus'
  | 'butt_wink'
  | 'forward_lean'
  | 'heel_rise'
  | 'asymmetric_loading';

/**
 * Tendência do desvio ao longo do tempo
 */
export type DeviationTrend = 'increasing' | 'decreasing' | 'stable';

/**
 * Desvio detectado em um frame específico
 */
export interface IDeviation {
  type: DeviationType;
  severity: DeviationSeverity;
  location: string;
  value: number;
  frame_number: number;
  description: string;
}

/**
 * Desvio agregado com estatísticas
 */
export interface IAggregatedDeviation {
  type: DeviationType;
  severity: DeviationSeverity;
  frames_affected: number[];
  percentage: number;
  average_value: number;
  trend: DeviationTrend;
}

/**
 * Regra de detecção de desvio do gold standard
 */
export interface IDeviationRule {
  id: string;
  description: string;
  severity_thresholds: {
    mild: {
      angle_deviation: string;
    };
    moderate: {
      angle_deviation: string;
    };
    severe: {
      angle_deviation: string;
    };
  };
}

/**
 * Compensação comum catalogada no gold standard
 */
export interface ICommonCompensation extends IDeviationRule {
  joint_affected: string[];
  risk_level: string;
  corrective_protocol?: string;
}
