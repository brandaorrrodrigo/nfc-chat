import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { QuickAnalysisService } from '../quick-analysis.service';
import { PrismaService } from '../../prisma/prisma.service';
import { GoldStandardService } from '../../gold-standards/gold-standard.service';
import { SimilarityCalculatorService } from '../../gold-standards/similarity-calculator.service';
import { QuickAnalysisInputDto, ScoreClassification } from '../dto/quick-analysis.dto';

describe('QuickAnalysisService', () => {
  let service: QuickAnalysisService;
  let prismaService: jest.Mocked<PrismaService>;
  let goldStandardService: jest.Mocked<GoldStandardService>;
  let similarityCalculator: jest.Mocked<SimilarityCalculatorService>;

  const mockGoldStandard = {
    id: 'gs_123',
    exercise_id: 'back-squat',
    version: '1.0.0',
    phases_data: {
      eccentric_top: {
        phase_name: 'eccentric_top',
        angles: {
          knee_left: { ideal: 160, tolerance: 5 },
          knee_right: { ideal: 160, tolerance: 5 },
          hip: { ideal: 165, tolerance: 5 },
          trunk: { ideal: 5, tolerance: 3 },
          ankle_left: { ideal: 90, tolerance: 5 },
          ankle_right: { ideal: 90, tolerance: 5 },
        },
      },
      eccentric_mid: {
        phase_name: 'eccentric_mid',
        angles: {
          knee_left: { ideal: 120, tolerance: 5 },
          knee_right: { ideal: 120, tolerance: 5 },
          hip: { ideal: 100, tolerance: 5 },
          trunk: { ideal: 30, tolerance: 5 },
          ankle_left: { ideal: 75, tolerance: 5 },
          ankle_right: { ideal: 75, tolerance: 5 },
        },
      },
      isometric_bottom: {
        phase_name: 'isometric_bottom',
        angles: {
          knee_left: { ideal: 90, tolerance: 5 },
          knee_right: { ideal: 90, tolerance: 5 },
          hip: { ideal: 85, tolerance: 5 },
          trunk: { ideal: 45, tolerance: 5 },
          ankle_left: { ideal: 70, tolerance: 5 },
          ankle_right: { ideal: 70, tolerance: 5 },
        },
      },
      concentric: {
        phase_name: 'concentric',
        angles: {
          knee_left: { ideal: 130, tolerance: 5 },
          knee_right: { ideal: 130, tolerance: 5 },
          hip: { ideal: 110, tolerance: 5 },
          trunk: { ideal: 25, tolerance: 5 },
          ankle_left: { ideal: 80, tolerance: 5 },
          ankle_right: { ideal: 80, tolerance: 5 },
        },
      },
    },
    similarity_weights: {
      knee: 0.3,
      hip: 0.25,
      trunk: 0.2,
      ankle: 0.15,
      symmetry: 0.1,
    },
    common_compensations: [
      {
        id: 'knee_valgus',
        description: 'Valgo dinâmico dos joelhos',
        severity_thresholds: {
          mild: { angle_deviation: '5-10' },
          moderate: { angle_deviation: '10-20' },
          severe: { angle_deviation: '20+' },
        },
      },
      {
        id: 'butt_wink',
        description: 'Retroversão pélvica',
        severity_thresholds: {
          mild: { angle_deviation: '5-10' },
          moderate: { angle_deviation: '10-20' },
          severe: { angle_deviation: '20+' },
        },
      },
    ],
  };

  beforeEach(async () => {
    const mockPrisma = {
      quickAnalysisResult: {
        create: jest.fn(),
      },
    };

    const mockGoldService = {
      getByExercise: jest.fn(),
    };

    const mockSimilarityCalc = {
      calculateFrameSimilarity: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuickAnalysisService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: GoldStandardService, useValue: mockGoldService },
        { provide: SimilarityCalculatorService, useValue: mockSimilarityCalc },
      ],
    }).compile();

    service = module.get<QuickAnalysisService>(QuickAnalysisService);
    prismaService = module.get(PrismaService);
    goldStandardService = module.get(GoldStandardService);
    similarityCalculator = module.get(SimilarityCalculatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('analyze', () => {
    const mockInput: QuickAnalysisInputDto = {
      videoPath: '/uploads/video_123.mp4',
      exerciseId: 'back-squat',
      userId: 'user_123',
      frames: [
        {
          frame_number: 1,
          timestamp_ms: 500,
          phase: 'eccentric_top',
          angles: {
            knee_left: 160,
            knee_right: 160,
            hip: 165,
            trunk: 5,
            ankle_left: 90,
            ankle_right: 90,
          },
          landmarks_3d: [],
        },
        {
          frame_number: 2,
          timestamp_ms: 1000,
          phase: 'isometric_bottom',
          angles: {
            knee_left: 90,
            knee_right: 95, // Leve assimetria
            hip: 85,
            trunk: 45,
            ankle_left: 70,
            ankle_right: 70,
          },
          landmarks_3d: [],
        },
      ],
    };

    it('should throw NotFoundException if gold standard not found', async () => {
      goldStandardService.getByExercise.mockResolvedValue(null);

      await expect(service.analyze(mockInput)).rejects.toThrow(NotFoundException);
      expect(goldStandardService.getByExercise).toHaveBeenCalledWith('back-squat');
    });

    it('should complete analysis successfully with perfect execution', async () => {
      goldStandardService.getByExercise.mockResolvedValue(mockGoldStandard as any);

      // Mock perfect similarity for all frames
      similarityCalculator.calculateFrameSimilarity.mockReturnValue({
        overall: 1.0,
        byJoint: {
          knee: 1.0,
          hip: 1.0,
          trunk: 1.0,
          ankle: 1.0,
          symmetry: 1.0,
        },
      });

      const mockSavedResult = {
        id: 'qa_123',
        overall_score: 10.0,
        classification: 'EXCELENTE',
        similarity_to_gold: 1.0,
        frames_data: JSON.stringify([]),
        deviations_detected: JSON.stringify([]),
        processing_time_ms: 300,
        created_at: new Date(),
      };

      prismaService.quickAnalysisResult.create.mockResolvedValue(mockSavedResult as any);

      const result = await service.analyze(mockInput);

      expect(result.overall_score).toBeCloseTo(10.0, 1);
      expect(result.classification).toBe(ScoreClassification.EXCELENTE);
      expect(result.similarity_to_gold).toBeCloseTo(1.0, 2);
      expect(goldStandardService.getByExercise).toHaveBeenCalledWith('back-squat');
      expect(similarityCalculator.calculateFrameSimilarity).toHaveBeenCalledTimes(2);
    });

    it('should detect knee valgus deviation', async () => {
      const inputWithValgus = {
        ...mockInput,
        frames: [
          {
            frame_number: 1,
            timestamp_ms: 500,
            phase: 'isometric_bottom',
            angles: {
              knee_left: 90,
              knee_right: 115, // 25° diferença = severe valgus
              hip: 85,
              trunk: 45,
              ankle_left: 70,
              ankle_right: 70,
            },
            landmarks_3d: [],
          },
        ],
      };

      goldStandardService.getByExercise.mockResolvedValue(mockGoldStandard as any);

      similarityCalculator.calculateFrameSimilarity.mockReturnValue({
        overall: 0.65,
        byJoint: {
          knee: 0.5,
          hip: 1.0,
          trunk: 1.0,
          ankle: 1.0,
          symmetry: 0.3, // Baixa simetria
        },
      });

      const mockSavedResult = {
        id: 'qa_124',
        overall_score: 5.0,
        classification: 'REGULAR',
        similarity_to_gold: 0.65,
        frames_data: JSON.stringify([]),
        deviations_detected: JSON.stringify([
          {
            type: 'knee_valgus',
            severity: 'severe',
            location: 'knee_right',
            frames_affected: [1],
            percentage: 100,
          },
        ]),
        processing_time_ms: 350,
        created_at: new Date(),
      };

      prismaService.quickAnalysisResult.create.mockResolvedValue(mockSavedResult as any);

      const result = await service.analyze(inputWithValgus);

      expect(result.overall_score).toBeLessThan(7.0);
      expect(result.deviations_detected.length).toBeGreaterThan(0);
    });

    it('should calculate scores and classifications correctly', async () => {
      goldStandardService.getByExercise.mockResolvedValue(mockGoldStandard as any);

      // Mock moderate similarity
      similarityCalculator.calculateFrameSimilarity.mockReturnValue({
        overall: 0.75,
        byJoint: {
          knee: 0.7,
          hip: 0.8,
          trunk: 0.7,
          ankle: 0.8,
          symmetry: 0.75,
        },
      });

      const mockSavedResult = {
        id: 'qa_125',
        overall_score: 7.5,
        classification: 'BOM',
        similarity_to_gold: 0.75,
        frames_data: JSON.stringify([]),
        deviations_detected: JSON.stringify([]),
        processing_time_ms: 320,
        created_at: new Date(),
      };

      prismaService.quickAnalysisResult.create.mockResolvedValue(mockSavedResult as any);

      const result = await service.analyze(mockInput);

      expect(result.classification).toBe(ScoreClassification.BOM);
      expect(result.overall_score).toBeGreaterThanOrEqual(7.0);
      expect(result.overall_score).toBeLessThan(8.0);
    });

    it('should aggregate multiple deviations of same type', async () => {
      const inputWithMultipleDeviations = {
        ...mockInput,
        frames: [
          {
            frame_number: 1,
            timestamp_ms: 500,
            phase: 'isometric_bottom',
            angles: {
              knee_left: 90,
              knee_right: 100, // 10° = moderate valgus
              hip: 85,
              trunk: 45,
              ankle_left: 70,
              ankle_right: 70,
            },
            landmarks_3d: [],
          },
          {
            frame_number: 2,
            timestamp_ms: 1000,
            phase: 'isometric_bottom',
            angles: {
              knee_left: 90,
              knee_right: 105, // 15° = moderate valgus
              hip: 85,
              trunk: 45,
              ankle_left: 70,
              ankle_right: 70,
            },
            landmarks_3d: [],
          },
        ],
      };

      goldStandardService.getByExercise.mockResolvedValue(mockGoldStandard as any);

      similarityCalculator.calculateFrameSimilarity.mockReturnValue({
        overall: 0.7,
        byJoint: { knee: 0.6, hip: 0.9, trunk: 0.9, ankle: 0.9, symmetry: 0.4 },
      });

      const mockSavedResult = {
        id: 'qa_126',
        overall_score: 6.5,
        classification: 'REGULAR',
        similarity_to_gold: 0.7,
        frames_data: JSON.stringify([]),
        deviations_detected: JSON.stringify([
          {
            type: 'knee_valgus',
            severity: 'moderate',
            frames_affected: [1, 2],
            percentage: 100, // 2/2 frames
            average_value: 12.5,
            trend: 'increasing',
          },
        ]),
        processing_time_ms: 380,
        created_at: new Date(),
      };

      prismaService.quickAnalysisResult.create.mockResolvedValue(mockSavedResult as any);

      const result = await service.analyze(inputWithMultipleDeviations);

      expect(result.deviations_detected.length).toBe(1);
      expect(result.deviations_detected[0].type).toBe('knee_valgus');
      expect(result.deviations_detected[0].frames_affected).toHaveLength(2);
    });

    it('should handle errors gracefully', async () => {
      goldStandardService.getByExercise.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.analyze(mockInput)).rejects.toThrow();
    });

    it('should log processing time', async () => {
      goldStandardService.getByExercise.mockResolvedValue(mockGoldStandard as any);

      similarityCalculator.calculateFrameSimilarity.mockReturnValue({
        overall: 0.9,
        byJoint: { knee: 0.9, hip: 0.9, trunk: 0.9, ankle: 0.9, symmetry: 0.9 },
      });

      const mockSavedResult = {
        id: 'qa_127',
        overall_score: 9.0,
        classification: 'EXCELENTE',
        similarity_to_gold: 0.9,
        frames_data: JSON.stringify([]),
        deviations_detected: JSON.stringify([]),
        processing_time_ms: 250,
        created_at: new Date(),
      };

      prismaService.quickAnalysisResult.create.mockResolvedValue(mockSavedResult as any);

      const result = await service.analyze(mockInput);

      expect(result.processing_time_ms).toBeGreaterThan(0);
      expect(result.processing_time_ms).toBeLessThan(10000); // Reasonable time
    });
  });

  describe('Score Classification', () => {
    beforeEach(() => {
      goldStandardService.getByExercise.mockResolvedValue(mockGoldStandard as any);
      similarityCalculator.calculateFrameSimilarity.mockReturnValue({
        overall: 0.8,
        byJoint: { knee: 0.8, hip: 0.8, trunk: 0.8, ankle: 0.8, symmetry: 0.8 },
      });
    });

    const testClassification = async (score: number, expected: ScoreClassification) => {
      const mockSavedResult = {
        id: 'qa_test',
        overall_score: score,
        classification: expected,
        similarity_to_gold: 0.8,
        frames_data: JSON.stringify([]),
        deviations_detected: JSON.stringify([]),
        processing_time_ms: 300,
        created_at: new Date(),
      };

      prismaService.quickAnalysisResult.create.mockResolvedValue(mockSavedResult as any);

      const input: QuickAnalysisInputDto = {
        videoPath: '/test',
        exerciseId: 'back-squat',
        userId: 'user_123',
        frames: [
          {
            frame_number: 1,
            timestamp_ms: 500,
            phase: 'eccentric_top',
            angles: {
              knee_left: 160,
              knee_right: 160,
              hip: 165,
              trunk: 5,
              ankle_left: 90,
              ankle_right: 90,
            },
            landmarks_3d: [],
          },
        ],
      };

      const result = await service.analyze(input);
      expect(result.classification).toBe(expected);
    };

    it('should classify score 8+ as EXCELENTE', async () => {
      await testClassification(8.5, ScoreClassification.EXCELENTE);
    });

    it('should classify score 7-8 as BOM', async () => {
      await testClassification(7.3, ScoreClassification.BOM);
    });

    it('should classify score 5-7 as REGULAR', async () => {
      await testClassification(6.0, ScoreClassification.REGULAR);
    });

    it('should classify score 3-5 as RUIM', async () => {
      await testClassification(4.2, ScoreClassification.RUIM);
    });

    it('should classify score < 3 as CRÍTICO', async () => {
      await testClassification(2.5, ScoreClassification.CRITICO);
    });
  });
});
