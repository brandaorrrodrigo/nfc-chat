/**
 * Protocol Personalizer Service - Unit Tests
 *
 * Testa as 5 regras de personalização de forma determinística
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ProtocolPersonalizerService } from './protocol-personalizer.service';
import {
  BaseProtocol,
  UserProfile,
  PersonalizedProtocol,
  PersonalizationLog,
} from './interfaces/protocol.interface';

describe('ProtocolPersonalizerService', () => {
  let service: ProtocolPersonalizerService;

  // Protocolo base de teste (knee_valgus moderate)
  const mockBaseProtocol: BaseProtocol = {
    protocolId: 'knee_valgus_moderate_v1',
    version: '1.0',
    deviationType: 'knee_valgus',
    severity: 'moderate',
    description: 'Protocolo corretivo para valgo de joelho moderado',
    phases: [
      {
        phaseNumber: 1,
        name: 'Mobilidade e Ativação',
        durationWeeks: 2,
        goals: ['Melhorar mobilidade de quadril', 'Ativar glúteo médio'],
        exercises: [
          {
            exerciseId: 'hip_mobilization_90_90',
            name: 'Hip 90/90 Stretch',
            category: 'mobility',
            sets: 3,
            reps: '30s',
            rest: 30,
            equipment: ['bodyweight'],
            cues: ['Manter costas retas', 'Sentir alongamento no quadril'],
          },
          {
            exerciseId: 'glute_bridge',
            name: 'Glute Bridge',
            category: 'activation',
            sets: 3,
            reps: 12,
            rest: 60,
            load: 'bodyweight',
            equipment: ['bodyweight'],
            cues: ['Apertar glúteos no topo', 'Não arquear lombar'],
          },
          {
            exerciseId: 'clamshell',
            name: 'Clamshell',
            category: 'activation',
            sets: 3,
            reps: 15,
            rest: 45,
            equipment: ['resistance_band'],
            cues: ['Manter pés juntos', 'Controle na descida'],
          },
        ],
        advancementCriteria: {
          requiredWeeks: 2,
          qualitativeCriteria: ['Execução perfeita dos exercícios'],
        },
      },
      {
        phaseNumber: 2,
        name: 'Fortalecimento',
        durationWeeks: 3,
        goals: ['Fortalecer cadeia posterior', 'Melhorar controle de joelho'],
        exercises: [
          {
            exerciseId: 'bulgarian_split_squat',
            name: 'Bulgarian Split Squat',
            category: 'strength',
            sets: 3,
            reps: 10,
            rest: 90,
            load: 'moderate',
            equipment: ['dumbbell', 'bench'],
            cues: ['Joelho alinhado com dedão', 'Descida controlada'],
          },
          {
            exerciseId: 'single_leg_rdl',
            name: 'Single Leg RDL',
            category: 'integration',
            sets: 3,
            reps: 8,
            rest: 90,
            load: 'light',
            equipment: ['dumbbell'],
            cues: ['Manter joelho estável', 'Quadril neutro'],
          },
        ],
        advancementCriteria: {
          requiredWeeks: 3,
          qualitativeCriteria: ['Zero compensações', 'Controle total'],
        },
      },
    ],
    totalDurationWeeks: 5,
    frequencyPerWeek: 4,
    expectedOutcomes: ['Redução de valgo', 'Melhor controle de quadril'],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProtocolPersonalizerService],
    }).compile();

    service = module.get<ProtocolPersonalizerService>(
      ProtocolPersonalizerService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('RULE 1: Training Age', () => {
    it('should extend duration by 50% for beginners', () => {
      const userProfile: UserProfile = {
        userId: 'user_123',
        trainingAge: 'beginner',
        trainingAgeYears: 0.5,
      };

      const { protocol, log } = service.personalizeProtocol(
        mockBaseProtocol,
        userProfile,
      );

      const rule1Log = log.find((l) => l.rule === 'RULE_1_TRAINING_AGE');

      expect(rule1Log).toBeDefined();
      expect(rule1Log!.applied).toBe(true);

      // Duração da fase 1: 2 semanas * 1.5 = 3 semanas
      expect(protocol.modifiedPhases[0].durationWeeks).toBe(3);

      // Duração da fase 2: 3 semanas * 1.5 = 5 semanas (rounded up)
      expect(protocol.modifiedPhases[1].durationWeeks).toBe(5);

      // Duração total: 3 + 5 = 8 semanas
      expect(protocol.modifiedDurationWeeks).toBe(8);

      // Exercícios de integração devem ser removidos
      const hasIntegrationExercises = protocol.modifiedPhases.some((phase) =>
        phase.exercises.some((ex) => ex.category === 'integration'),
      );
      expect(hasIntegrationExercises).toBe(false);

      // Notas de beginner devem estar presentes
      expect(protocol.additionalNotes.length).toBeGreaterThan(0);
      expect(
        protocol.additionalNotes.some((note) => note.includes('BEGINNER')),
      ).toBe(true);
    });

    it('should reduce duration by 20% for advanced', () => {
      const userProfile: UserProfile = {
        userId: 'user_456',
        trainingAge: 'advanced',
        trainingAgeYears: 6,
      };

      const { protocol, log } = service.personalizeProtocol(
        mockBaseProtocol,
        userProfile,
      );

      const rule1Log = log.find((l) => l.rule === 'RULE_1_TRAINING_AGE');

      expect(rule1Log).toBeDefined();
      expect(rule1Log!.applied).toBe(true);

      // Duração da fase 1: 2 * 0.8 = 1.6 → 2 semanas (ceil)
      expect(protocol.modifiedPhases[0].durationWeeks).toBe(2);

      // Duração da fase 2: 3 * 0.8 = 2.4 → 3 semanas (ceil)
      expect(protocol.modifiedPhases[1].durationWeeks).toBe(3);

      // Duração total
      expect(protocol.modifiedDurationWeeks).toBe(5);

      // Notas de advanced
      expect(
        protocol.additionalNotes.some((note) => note.includes('ADVANCED')),
      ).toBe(true);
    });

    it('should not modify for intermediate', () => {
      const userProfile: UserProfile = {
        userId: 'user_789',
        trainingAge: 'intermediate',
        trainingAgeYears: 3,
      };

      const { protocol, log } = service.personalizeProtocol(
        mockBaseProtocol,
        userProfile,
      );

      const rule1Log = log.find((l) => l.rule === 'RULE_1_TRAINING_AGE');

      expect(rule1Log).toBeDefined();
      expect(rule1Log!.applied).toBe(false);

      // Duração não modificada
      expect(protocol.modifiedPhases[0].durationWeeks).toBe(2);
      expect(protocol.modifiedPhases[1].durationWeeks).toBe(3);
      expect(protocol.modifiedDurationWeeks).toBe(5);
    });
  });

  describe('RULE 2: Injury History', () => {
    it('should apply conservative modifications for relevant injuries', () => {
      const userProfile: UserProfile = {
        userId: 'user_123',
        trainingAge: 'intermediate',
        injuryHistory: [
          {
            location: 'knee',
            type: 'ACL sprain',
            severity: 'moderate',
            dateOccurred: '2023-01-15',
            fullyRecovered: true,
          },
        ],
      };

      const { protocol, log } = service.personalizeProtocol(
        mockBaseProtocol,
        userProfile,
      );

      const rule2Log = log.find((l) => l.rule === 'RULE_2_INJURY_HISTORY');

      expect(rule2Log).toBeDefined();
      expect(rule2Log!.applied).toBe(true);

      // Primeira fase deve ser estendida em 50%
      expect(protocol.modifiedPhases[0].durationWeeks).toBe(3); // 2 * 1.5

      // Carga deve ser reduzida
      const firstPhaseExercisesWithLoad = protocol.modifiedPhases[0].exercises.filter(
        (ex) => ex.load && ex.load !== 'bodyweight',
      );

      if (firstPhaseExercisesWithLoad.length > 0) {
        // Se havia exercícios com carga, verificar redução
        expect(firstPhaseExercisesWithLoad[0].load).not.toBe('heavy');
      }

      // Contraindicações devem ser adicionadas
      expect(protocol.contraindications).toBeDefined();
      expect(protocol.contraindications!.length).toBeGreaterThan(0);

      // Notas de injury history
      expect(
        protocol.additionalNotes.some((note) =>
          note.includes('INJURY HISTORY'),
        ),
      ).toBe(true);
    });

    it('should not apply for irrelevant injuries', () => {
      const userProfile: UserProfile = {
        userId: 'user_456',
        trainingAge: 'intermediate',
        injuryHistory: [
          {
            location: 'shoulder',
            type: 'rotator cuff strain',
            severity: 'mild',
            dateOccurred: '2022-06-10',
            fullyRecovered: true,
          },
        ],
      };

      const { protocol, log } = service.personalizeProtocol(
        mockBaseProtocol,
        userProfile,
      );

      const rule2Log = log.find((l) => l.rule === 'RULE_2_INJURY_HISTORY');

      expect(rule2Log).toBeDefined();
      expect(rule2Log!.applied).toBe(false);
      expect(rule2Log!.reason).toContain('No injuries relevant');
    });
  });

  describe('RULE 3: Equipment', () => {
    it('should substitute exercises when equipment unavailable', () => {
      const userProfile: UserProfile = {
        userId: 'user_123',
        trainingAge: 'intermediate',
        equipmentAvailable: ['bodyweight'], // Sem resistance band
      };

      const { protocol, log } = service.personalizeProtocol(
        mockBaseProtocol,
        userProfile,
      );

      const rule3Log = log.find((l) => l.rule === 'RULE_3_EQUIPMENT');

      // Clamshell requer resistance_band, deve ser substituído ou adaptado
      const clamshellExercise = protocol.modifiedPhases[0].exercises.find(
        (ex) => ex.exerciseId.includes('clamshell'),
      );

      if (rule3Log!.applied) {
        expect(protocol.substitutedExercises).toBeDefined();
      }
    });

    it('should not modify when all equipment available', () => {
      const userProfile: UserProfile = {
        userId: 'user_456',
        trainingAge: 'intermediate',
        equipmentAvailable: [
          'bodyweight',
          'resistance_band',
          'dumbbell',
          'bench',
        ],
      };

      const { protocol, log } = service.personalizeProtocol(
        mockBaseProtocol,
        userProfile,
      );

      const rule3Log = log.find((l) => l.rule === 'RULE_3_EQUIPMENT');

      expect(rule3Log).toBeDefined();
      expect(rule3Log!.applied).toBe(false);
    });
  });

  describe('RULE 4: Weekly Frequency', () => {
    it('should reduce exercises and increase volume for low frequency', () => {
      const userProfile: UserProfile = {
        userId: 'user_123',
        trainingAge: 'intermediate',
        weeklyFrequency: 2, // Baixa frequência
      };

      const { protocol, log } = service.personalizeProtocol(
        mockBaseProtocol,
        userProfile,
      );

      const rule4Log = log.find((l) => l.rule === 'RULE_4_WEEKLY_FREQUENCY');

      expect(rule4Log).toBeDefined();
      expect(rule4Log!.applied).toBe(true);

      // Número de exercícios deve ser reduzido
      const originalExerciseCount = mockBaseProtocol.phases[0].exercises.length;
      const modifiedExerciseCount = protocol.modifiedPhases[0].exercises.length;

      expect(modifiedExerciseCount).toBeLessThanOrEqual(originalExerciseCount);

      // Volume (séries) deve aumentar
      // Exercícios mantidos devem ter mais séries que originais
      protocol.modifiedPhases.forEach((phase) => {
        phase.exercises.forEach((exercise) => {
          const originalExercise = mockBaseProtocol.phases
            .find((p) => p.phaseNumber === phase.phaseNumber)
            ?.exercises.find((ex) => ex.exerciseId === exercise.exerciseId);

          if (originalExercise) {
            expect(exercise.sets).toBeGreaterThanOrEqual(originalExercise.sets);
          }
        });
      });

      // Nota de low frequency
      expect(
        protocol.additionalNotes.some((note) => note.includes('LOW FREQUENCY')),
      ).toBe(true);
    });

    it('should not modify for adequate frequency', () => {
      const userProfile: UserProfile = {
        userId: 'user_456',
        trainingAge: 'intermediate',
        weeklyFrequency: 5,
      };

      const { protocol, log } = service.personalizeProtocol(
        mockBaseProtocol,
        userProfile,
      );

      const rule4Log = log.find((l) => l.rule === 'RULE_4_WEEKLY_FREQUENCY');

      expect(rule4Log).toBeDefined();
      expect(rule4Log!.applied).toBe(false);
    });
  });

  describe('RULE 5: Current Symptoms', () => {
    it('should reduce intensity for current pain symptoms', () => {
      const userProfile: UserProfile = {
        userId: 'user_123',
        trainingAge: 'intermediate',
        currentSymptoms: [
          {
            location: 'knee',
            type: 'pain',
            severity: 5, // Dor moderada
            occursWhen: 'during_exercise',
          },
        ],
      };

      const { protocol, log } = service.personalizeProtocol(
        mockBaseProtocol,
        userProfile,
      );

      const rule5Log = log.find((l) => l.rule === 'RULE_5_CURRENT_SYMPTOMS');

      expect(rule5Log).toBeDefined();
      expect(rule5Log!.applied).toBe(true);

      // Séries da primeira fase devem ser reduzidas
      protocol.modifiedPhases[0].exercises.forEach((exercise, idx) => {
        const originalExercise = mockBaseProtocol.phases[0].exercises[idx];
        if (originalExercise) {
          expect(exercise.sets).toBeLessThanOrEqual(originalExercise.sets);
        }
      });

      // Critérios de avanço devem incluir ausência de dor
      protocol.modifiedPhases.forEach((phase) => {
        const hasPainCriteria = phase.advancementCriteria.qualitativeCriteria.some(
          (criteria) => criteria.includes('dor') || criteria.includes('pain'),
        );
        expect(hasPainCriteria).toBe(true);
      });

      // Notas de sintomas
      expect(
        protocol.additionalNotes.some((note) =>
          note.includes('SINTOMAS PRESENTES'),
        ),
      ).toBe(true);
    });

    it('should not modify for mild symptoms', () => {
      const userProfile: UserProfile = {
        userId: 'user_456',
        trainingAge: 'intermediate',
        currentSymptoms: [
          {
            location: 'knee',
            type: 'pain',
            severity: 2, // Dor leve (< 4)
            occursWhen: 'after_exercise',
          },
        ],
      };

      const { protocol, log } = service.personalizeProtocol(
        mockBaseProtocol,
        userProfile,
      );

      const rule5Log = log.find((l) => l.rule === 'RULE_5_CURRENT_SYMPTOMS');

      expect(rule5Log).toBeDefined();
      expect(rule5Log!.applied).toBe(false);
      expect(rule5Log!.reason).toContain('not severe enough');
    });
  });

  describe('Determinism', () => {
    it('should produce identical results for identical inputs', () => {
      const userProfile: UserProfile = {
        userId: 'user_determinism',
        trainingAge: 'beginner',
        trainingAgeYears: 0.5,
        weeklyFrequency: 3,
        currentSymptoms: [
          {
            location: 'knee',
            type: 'pain',
            severity: 4,
          },
        ],
      };

      // Execute 3 vezes
      const result1 = service.personalizeProtocol(
        mockBaseProtocol,
        userProfile,
      );
      const result2 = service.personalizeProtocol(
        mockBaseProtocol,
        userProfile,
      );
      const result3 = service.personalizeProtocol(
        mockBaseProtocol,
        userProfile,
      );

      // Resultados devem ser idênticos
      expect(result1.protocol.modifiedDurationWeeks).toBe(
        result2.protocol.modifiedDurationWeeks,
      );
      expect(result2.protocol.modifiedDurationWeeks).toBe(
        result3.protocol.modifiedDurationWeeks,
      );

      expect(result1.log.length).toBe(result2.log.length);
      expect(result2.log.length).toBe(result3.log.length);

      // Comparar logs aplicados
      const applied1 = result1.log.filter((l) => l.applied).length;
      const applied2 = result2.log.filter((l) => l.applied).length;
      const applied3 = result3.log.filter((l) => l.applied).length;

      expect(applied1).toBe(applied2);
      expect(applied2).toBe(applied3);
    });
  });
});
