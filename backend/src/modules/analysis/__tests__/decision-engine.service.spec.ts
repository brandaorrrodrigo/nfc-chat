import { Test, TestingModule } from '@nestjs/testing';
import { DecisionEngineService } from '../decision-engine.service';
import { QuickAnalysisResult, User } from '@prisma/client';

describe('DecisionEngineService', () => {
  let service: DecisionEngineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DecisionEngineService],
    }).compile();

    service = module.get<DecisionEngineService>(DecisionEngineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('shouldRunDeepAnalysis', () => {
    const mockUser: User = {
      id: 'user_123',
      email: 'test@example.com',
      subscription_tier: 'free',
      created_at: new Date(),
      updated_at: new Date(),
    } as User;

    it('should trigger deep analysis for premium users regardless of score', async () => {
      const premiumUser = { ...mockUser, subscription_tier: 'pro' };

      const quickResult: QuickAnalysisResult = {
        id: 'qa_123',
        overall_score: 9.5, // Score alto
        similarity_to_gold: 0.95, // Similaridade alta
        deviations_detected: JSON.stringify([]),
        classification: 'EXCELENTE',
        frames_data: '[]',
        processing_time_ms: 300,
        created_at: new Date(),
        updated_at: new Date(),
      } as QuickAnalysisResult;

      const decision = await service.shouldRunDeepAnalysis(quickResult, premiumUser);

      expect(decision.shouldRun).toBe(true);
      expect(decision.triggers).toContain(expect.stringContaining('premium_tier'));
      expect(decision.reason).toContain('Premium');
    });

    it('should trigger deep analysis for low score (< 7.0)', async () => {
      const quickResult: QuickAnalysisResult = {
        id: 'qa_124',
        overall_score: 6.0,
        similarity_to_gold: 0.75,
        deviations_detected: JSON.stringify([]),
        classification: 'REGULAR',
        frames_data: '[]',
        processing_time_ms: 300,
        created_at: new Date(),
        updated_at: new Date(),
      } as QuickAnalysisResult;

      const decision = await service.shouldRunDeepAnalysis(quickResult, mockUser);

      expect(decision.triggers).toContain(expect.stringContaining('score_low'));
    });

    it('should trigger deep analysis for low similarity (< 70%)', async () => {
      const quickResult: QuickAnalysisResult = {
        id: 'qa_125',
        overall_score: 8.0,
        similarity_to_gold: 0.65, // < 70%
        deviations_detected: JSON.stringify([]),
        classification: 'BOM',
        frames_data: '[]',
        processing_time_ms: 300,
        created_at: new Date(),
        updated_at: new Date(),
      } as QuickAnalysisResult;

      const decision = await service.shouldRunDeepAnalysis(quickResult, mockUser);

      expect(decision.triggers).toContain(expect.stringContaining('similarity_low'));
    });

    it('should trigger deep analysis for critical deviations', async () => {
      const deviations = [
        { type: 'knee_valgus', severity: 'severe' },
        { type: 'butt_wink', severity: 'moderate' },
      ];

      const quickResult: QuickAnalysisResult = {
        id: 'qa_126',
        overall_score: 8.0,
        similarity_to_gold: 0.80,
        deviations_detected: JSON.stringify(deviations),
        classification: 'BOM',
        frames_data: '[]',
        processing_time_ms: 300,
        created_at: new Date(),
        updated_at: new Date(),
      } as QuickAnalysisResult;

      const decision = await service.shouldRunDeepAnalysis(quickResult, mockUser);

      expect(decision.triggers).toContain(expect.stringContaining('critical_deviations'));
    });

    it('should trigger deep analysis for multiple deviations (≥3)', async () => {
      const deviations = [
        { type: 'knee_valgus', severity: 'mild' },
        { type: 'butt_wink', severity: 'mild' },
        { type: 'forward_lean', severity: 'mild' },
      ];

      const quickResult: QuickAnalysisResult = {
        id: 'qa_127',
        overall_score: 8.0,
        similarity_to_gold: 0.80,
        deviations_detected: JSON.stringify(deviations),
        classification: 'BOM',
        frames_data: '[]',
        processing_time_ms: 300,
        created_at: new Date(),
        updated_at: new Date(),
      } as QuickAnalysisResult;

      const decision = await service.shouldRunDeepAnalysis(quickResult, mockUser);

      expect(decision.triggers).toContain(expect.stringContaining('multiple_deviations'));
    });

    it('should NOT run deep analysis if triggers < 2 (free tier)', async () => {
      const quickResult: QuickAnalysisResult = {
        id: 'qa_128',
        overall_score: 8.5, // Bom score
        similarity_to_gold: 0.85, // Boa similaridade
        deviations_detected: JSON.stringify([]), // Sem desvios
        classification: 'BOM',
        frames_data: '[]',
        processing_time_ms: 300,
        created_at: new Date(),
        updated_at: new Date(),
      } as QuickAnalysisResult;

      const decision = await service.shouldRunDeepAnalysis(quickResult, mockUser);

      expect(decision.shouldRun).toBe(false);
      expect(decision.reason).toContain('Análise rápida suficiente');
    });

    it('should estimate time correctly based on deviations', async () => {
      const deviations = [
        { type: 'knee_valgus', severity: 'severe' },
        { type: 'butt_wink', severity: 'moderate' },
      ];

      const quickResult: QuickAnalysisResult = {
        id: 'qa_129',
        overall_score: 6.0,
        similarity_to_gold: 0.65,
        deviations_detected: JSON.stringify(deviations),
        classification: 'REGULAR',
        frames_data: '[]',
        processing_time_ms: 300,
        created_at: new Date(),
        updated_at: new Date(),
      } as QuickAnalysisResult;

      const decision = await service.shouldRunDeepAnalysis(quickResult, mockUser);

      // 30s base + (2 desvios * 10s) = 50s
      expect(decision.estimatedTime).toBe(50000);
    });
  });

  describe('getCacheStrategy', () => {
    it('should return L1 strategy with video hash', () => {
      const strategy = service.getCacheStrategy('back-squat', 'user_123', 'abc123');

      expect(strategy.level).toBe('L1');
      expect(strategy.ttl).toBe(86400); // 24h
      expect(strategy.key).toContain('abc123');
    });

    it('should return L2 strategy without video hash', () => {
      const strategy = service.getCacheStrategy('back-squat', 'user_123');

      expect(strategy.level).toBe('L2');
      expect(strategy.ttl).toBe(604800); // 7 dias
      expect(strategy.key).toContain('gold_standard');
    });
  });

  describe('getRagCacheStrategy', () => {
    it('should return L3 strategy for RAG context', () => {
      const strategy = service.getRagCacheStrategy('knee_valgus', 'severe');

      expect(strategy.level).toBe('L3');
      expect(strategy.ttl).toBe(2592000); // 30 dias
      expect(strategy.key).toContain('knee_valgus');
      expect(strategy.key).toContain('severe');
    });
  });

  describe('evaluateCostBenefit', () => {
    it('should always approve for premium users', () => {
      const decision = {
        shouldRun: true,
        reason: 'Premium',
        estimatedTime: 30000,
        triggers: ['premium_tier: pro - análise completa incluída'],
      };

      const result = service.evaluateCostBenefit(decision, 1000);
      expect(result).toBe(true);
    });

    it('should approve for critical cases with affordable cost', () => {
      const decision = {
        shouldRun: true,
        reason: 'Critical',
        estimatedTime: 30000,
        triggers: ['score_low: 5.0/10', 'critical_deviations: 2x knee_valgus'],
      };

      const result = service.evaluateCostBenefit(decision, 50);
      expect(result).toBe(true);
    });

    it('should reject for high cost non-critical cases', () => {
      const decision = {
        shouldRun: true,
        reason: 'Multiple triggers',
        estimatedTime: 30000,
        triggers: ['similarity_low: 65%'],
      };

      const result = service.evaluateCostBenefit(decision, 150);
      expect(result).toBe(false);
    });
  });

  describe('prioritizeAnalysisQueue', () => {
    it('should prioritize premium users first', () => {
      const analyses = [
        { id: 'a1', score: 8, isPremium: false, deviations: 1 },
        { id: 'a2', score: 7, isPremium: true, deviations: 1 },
        { id: 'a3', score: 9, isPremium: false, deviations: 0 },
      ];

      const result = service.prioritizeAnalysisQueue(analyses);

      expect(result[0]).toBe('a2'); // Premium primeiro
    });

    it('should prioritize critical scores (< 5) next', () => {
      const analyses = [
        { id: 'a1', score: 8, isPremium: false, deviations: 1 },
        { id: 'a2', score: 4, isPremium: false, deviations: 1 },
        { id: 'a3', score: 6, isPremium: false, deviations: 2 },
      ];

      const result = service.prioritizeAnalysisQueue(analyses);

      expect(result[0]).toBe('a2'); // Score crítico primeiro
    });

    it('should prioritize more deviations last', () => {
      const analyses = [
        { id: 'a1', score: 7, isPremium: false, deviations: 1 },
        { id: 'a2', score: 7, isPremium: false, deviations: 3 },
        { id: 'a3', score: 7, isPremium: false, deviations: 2 },
      ];

      const result = service.prioritizeAnalysisQueue(analyses);

      expect(result[0]).toBe('a2'); // Mais desvios primeiro
    });
  });

  describe('generateDecisionReport', () => {
    it('should generate accurate statistics', () => {
      const decisions = [
        {
          shouldRun: true,
          reason: 'Premium',
          estimatedTime: 30000,
          triggers: ['premium_tier: pro', 'score_low: 6.0/10'],
        },
        {
          shouldRun: false,
          reason: 'Sufficient',
          estimatedTime: 0,
          triggers: ['similarity_low: 65%'],
        },
        {
          shouldRun: true,
          reason: 'Critical',
          estimatedTime: 40000,
          triggers: ['score_low: 5.0/10', 'critical_deviations: 2x'],
        },
      ];

      const report = service.generateDecisionReport(decisions);

      expect(report.totalDecisions).toBe(3);
      expect(report.deepAnalysisExecuted).toBe(2);
      expect(report.quickAnalysisOnly).toBe(1);
      expect(report.avgTriggers).toBeCloseTo(1.67, 2);
      expect(report.mostCommonTrigger).toBe('score_low');
    });
  });
});
