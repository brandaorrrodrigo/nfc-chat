import { Test, TestingModule } from '@nestjs/testing';
import { SimilarityCalculatorService } from '../similarity-calculator.service';
import { IFrameAngles, IGoldAngles, ISimilarityWeights } from '../../analysis/interfaces/frame.interface';

describe('SimilarityCalculatorService', () => {
  let service: SimilarityCalculatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SimilarityCalculatorService],
    }).compile();

    service = module.get<SimilarityCalculatorService>(SimilarityCalculatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculateFrameSimilarity', () => {
    const goldAngles: IGoldAngles = {
      knee_left: { ideal: 90, tolerance: 5 },
      knee_right: { ideal: 90, tolerance: 5 },
      hip: { ideal: 85, tolerance: 5 },
      trunk: { ideal: 45, tolerance: 3 },
      ankle_left: { ideal: 70, tolerance: 5 },
      ankle_right: { ideal: 70, tolerance: 5 },
    };

    const weights: ISimilarityWeights = {
      knee: 0.3,
      hip: 0.25,
      trunk: 0.2,
      ankle: 0.15,
      symmetry: 0.1,
    };

    it('should return perfect similarity (1.0) for exact match', () => {
      const userAngles: IFrameAngles = {
        knee_left: 90,
        knee_right: 90,
        hip: 85,
        trunk: 45,
        ankle_left: 70,
        ankle_right: 70,
      };

      const result = service.calculateFrameSimilarity(userAngles, goldAngles, weights);

      expect(result.overall).toBeCloseTo(1.0, 2);
      expect(result.byJoint.knee).toBe(1.0);
      expect(result.byJoint.hip).toBe(1.0);
      expect(result.byJoint.trunk).toBe(1.0);
      expect(result.byJoint.ankle).toBe(1.0);
      expect(result.byJoint.symmetry).toBe(1.0);
    });

    it('should handle angles within tolerance', () => {
      const userAngles: IFrameAngles = {
        knee_left: 92, // +2° (within tolerance)
        knee_right: 88, // -2° (within tolerance)
        hip: 87, // +2° (within tolerance)
        trunk: 46, // +1° (within tolerance)
        ankle_left: 72, // +2° (within tolerance)
        ankle_right: 68, // -2° (within tolerance)
      };

      const result = service.calculateFrameSimilarity(userAngles, goldAngles, weights);

      expect(result.overall).toBeGreaterThan(0.95);
      expect(result.byJoint.knee).toBe(1.0);
      expect(result.byJoint.hip).toBe(1.0);
    });

    it('should penalize angles outside tolerance progressively', () => {
      const userAngles: IFrameAngles = {
        knee_left: 100, // +10° (2x tolerance)
        knee_right: 100,
        hip: 95, // +10° (2x tolerance)
        trunk: 50, // +5° (>tolerance)
        ankle_left: 80, // +10° (2x tolerance)
        ankle_right: 80,
      };

      const result = service.calculateFrameSimilarity(userAngles, goldAngles, weights);

      expect(result.overall).toBeLessThan(0.85);
      expect(result.overall).toBeGreaterThan(0.5);
    });

    it('should detect bilateral asymmetry', () => {
      const userAngles: IFrameAngles = {
        knee_left: 90,
        knee_right: 110, // 20° diferença (assimetria severa)
        hip: 85,
        trunk: 45,
        ankle_left: 70,
        ankle_right: 70,
      };

      const result = service.calculateFrameSimilarity(userAngles, goldAngles, weights);

      expect(result.byJoint.symmetry).toBeLessThan(0.3); // Baixa simetria
    });

    it('should handle missing gold angles gracefully', () => {
      const incompleteGold = {
        knee_left: { ideal: 90, tolerance: 5 },
        knee_right: { ideal: 90, tolerance: 5 },
      } as any;

      const userAngles: IFrameAngles = {
        knee_left: 90,
        knee_right: 90,
        hip: 85,
        trunk: 45,
        ankle_left: 70,
        ankle_right: 70,
      };

      expect(() => {
        service.calculateFrameSimilarity(userAngles, incompleteGold, weights);
      }).not.toThrow();
    });
  });

  describe('calculatePercentageDifference', () => {
    it('should calculate correct percentage difference', () => {
      expect(service.calculatePercentageDifference(100, 80)).toBeCloseTo(25, 1);
      expect(service.calculatePercentageDifference(50, 100)).toBeCloseTo(50, 1);
      expect(service.calculatePercentageDifference(90, 90)).toBe(0);
    });

    it('should handle division by zero', () => {
      const result = service.calculatePercentageDifference(50, 0);
      expect(result).toBe(100);
    });
  });

  describe('isAcceptableSimilarity', () => {
    it('should return true for similarity above threshold', () => {
      expect(service.isAcceptableSimilarity(0.8, 0.7)).toBe(true);
      expect(service.isAcceptableSimilarity(0.7, 0.7)).toBe(true);
    });

    it('should return false for similarity below threshold', () => {
      expect(service.isAcceptableSimilarity(0.6, 0.7)).toBe(false);
      expect(service.isAcceptableSimilarity(0.5, 0.7)).toBe(false);
    });

    it('should use default threshold of 0.7', () => {
      expect(service.isAcceptableSimilarity(0.75)).toBe(true);
      expect(service.isAcceptableSimilarity(0.65)).toBe(false);
    });
  });

  describe('classifySimilarity', () => {
    it('should classify similarity correctly', () => {
      expect(service.classifySimilarity(0.95)).toBe('EXCELENTE');
      expect(service.classifySimilarity(0.85)).toBe('MUITO BOM');
      expect(service.classifySimilarity(0.75)).toBe('BOM');
      expect(service.classifySimilarity(0.65)).toBe('REGULAR');
      expect(service.classifySimilarity(0.55)).toBe('RUIM');
      expect(service.classifySimilarity(0.45)).toBe('CRÍTICO');
    });

    it('should handle boundary values', () => {
      expect(service.classifySimilarity(0.9)).toBe('EXCELENTE');
      expect(service.classifySimilarity(0.8)).toBe('MUITO BOM');
      expect(service.classifySimilarity(0.7)).toBe('BOM');
      expect(service.classifySimilarity(0.6)).toBe('REGULAR');
      expect(service.classifySimilarity(0.5)).toBe('RUIM');
    });
  });
});
