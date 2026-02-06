/**
 * Interfaces para o sistema de protocolos corretivos
 */

export enum CacheLevel {
  L1_ANALYSIS = 'L1_ANALYSIS',
  L2_GOLD_STANDARD = 'L2_GOLD_STANDARD',
  L3_RAG = 'L3_RAG',
  L4_PROTOCOLS = 'L4_PROTOCOLS',
}

export interface GenerateProtocolsInput {
  deviations: DeviationInput[];
  userProfile: UserProfile;
  deepContext?: any;
}

export interface DeviationInput {
  type: string;
  severity: 'mild' | 'moderate' | 'severe';
  confidence: number;
  affectedJoint?: string;
  frameRange?: { start: number; end: number };
}

export interface UserProfile {
  userId: string;
  trainingAge: 'beginner' | 'intermediate' | 'advanced'; // <1yr, 1-5yr, >5yr
  trainingAgeYears?: number;
  injuryHistory?: InjuryRecord[];
  equipmentAvailable?: string[]; // ['barbell', 'dumbbell', 'resistance_band', 'bodyweight']
  weeklyFrequency?: number; // sessões por semana
  currentSymptoms?: Symptom[];
  age?: number;
  height?: number;
  weight?: number;
}

export interface InjuryRecord {
  location: string; // 'knee', 'hip', 'ankle', 'lower_back', etc.
  type: string; // 'strain', 'sprain', 'tear', 'chronic_pain'
  severity: 'mild' | 'moderate' | 'severe';
  dateOccurred: string;
  fullyRecovered: boolean;
}

export interface Symptom {
  location: string;
  type: 'pain' | 'discomfort' | 'stiffness' | 'weakness';
  severity: number; // 1-10
  occursWhen?: string; // 'during_exercise', 'after_exercise', 'at_rest'
}

export interface GeneratedProtocol {
  protocolId: string;
  deviationType: string;
  deviationSeverity: 'mild' | 'moderate' | 'severe';
  baseProtocol: BaseProtocol;
  personalizedProtocol: PersonalizedProtocol;
  personalizationLog: PersonalizationLog[];
  scientificRationale?: string;
  createdAt: Date;
}

export interface BaseProtocol {
  protocolId: string;
  version: string;
  deviationType: string;
  severity: 'mild' | 'moderate' | 'severe';
  description: string;
  phases: ProtocolPhase[];
  totalDurationWeeks: number;
  frequencyPerWeek: number;
  prerequisites?: string[];
  contraindications?: string[];
  expectedOutcomes: string[];
  evidenceLevel?: string;
  references?: string[];
}

export interface ProtocolPhase {
  phaseNumber: number;
  name: string;
  durationWeeks: number;
  goals: string[];
  exercises: Exercise[];
  advancementCriteria: AdvancementCriteria;
  progressionNotes?: string;
}

export interface Exercise {
  exerciseId: string;
  name: string;
  category: 'mobility' | 'activation' | 'strength' | 'integration';
  sets: number;
  reps: number | string; // "10" or "30s" for holds
  rest: number; // seconds
  tempo?: string; // "3-1-2" (eccentric-pause-concentric)
  load?: string; // "bodyweight", "light", "moderate", "heavy"
  equipment: string[];
  cues: string[];
  videoUrl?: string;
  alternatives?: AlternativeExercise[];
}

export interface AlternativeExercise {
  exerciseId: string;
  name: string;
  reason: 'easier' | 'harder' | 'different_equipment' | 'injury_modification';
  equipmentRequired: string[];
}

export interface AdvancementCriteria {
  requiredWeeks: number;
  qualitativeCriteria: string[];
  quantitativeCriteria?: Record<string, any>;
}

export interface PersonalizedProtocol extends BaseProtocol {
  modifiedPhases: ProtocolPhase[];
  modifiedDurationWeeks: number;
  modifiedFrequencyPerWeek: number;
  additionalNotes: string[];
  substitutedExercises?: Record<string, string>; // originalId -> newId
}

export interface PersonalizationLog {
  rule: string;
  applied: boolean;
  reason: string;
  changes: PersonalizationChange[];
}

export interface PersonalizationChange {
  field: string;
  originalValue: any;
  newValue: any;
  rationale: string;
}

export interface ProtocolPriority {
  deviationType: string;
  severity: 'mild' | 'moderate' | 'severe';
  priorityScore: number;
  injuryRisk: 'low' | 'moderate' | 'high';
}

export interface IntegratedProtocols {
  protocols: GeneratedProtocol[];
  integrationStrategy: 'sequential' | 'parallel' | 'hybrid';
  weeklySchedule?: WeeklySchedule;
  conflictResolutions: ConflictResolution[];
}

export interface WeeklySchedule {
  [day: string]: SessionPlan[];
}

export interface SessionPlan {
  protocolId: string;
  phase: number;
  exercises: string[]; // exerciseIds
  estimatedDuration: number; // minutes
}

export interface ConflictResolution {
  conflictType: 'exercise_overlap' | 'muscle_group_fatigue' | 'equipment_constraint';
  resolution: string;
  affectedProtocols: string[];
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}
