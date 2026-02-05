/**
 * Testes unitários para DeepAnalysisService
 */

import { Test, TestingModule } from '@nestjs/testing';
import { DeepAnalysisService } from './deep-analysis.service';
import { RagService } from './rag/rag.service';
import { OllamaService } from './ollama/ollama.service';

describe('DeepAnalysisService', () => {
  let service: DeepAnalysisService;
  let ragService: RagService;
  let ollamaService: OllamaService;

  const mockRagService = {
    searchMultipleDeviations: jest.fn(),
  };

  const mockOllamaService = {
    generate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeepAnalysisService,
        {
          provide: RagService,
          useValue: mockRagService,
        },
        {
          provide: OllamaService,
          useValue: mockOllamaService,
        },
      ],
    }).compile();

    service = module.get<DeepAnalysisService>(DeepAnalysisService);
    ragService = module.get<RagService>(RagService);
    ollamaService = module.get<OllamaService>(OllamaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('analyze', () => {
    const mockQuickAnalysis = {
      overall_score: 6.5,
      similarity_to_gold: 0.65,
      classification: 'REGULAR',
      deviations_detected: JSON.stringify([
        {
          type: 'knee_valgus',
          severity: 'moderate',
          percentage: 60,
          average_value: 15,
        },
        {
          type: 'butt_wink',
          severity: 'severe',
          percentage: 80,
          average_value: 20,
        },
      ]),
    };

    const mockInput = {
      quickAnalysis: mockQuickAnalysis,
      exerciseId: 'back-squat',
      userId: 'user_123',
      estimatedTime: 35000,
    };

    const mockScientificContext = {
      sources: [
        {
          title: 'Test Study 1',
          authors: 'Smith J, Doe J',
          year: 2020,
          journal: 'Test Journal',
          doi: '10.1234/test1',
          evidence_level: 'rct',
          excerpt: 'Test excerpt 1...',
          relevance: 0.92,
        },
        {
          title: 'Test Study 2',
          authors: 'Brown A',
          year: 2021,
          journal: 'Test Journal 2',
          doi: '10.1234/test2',
          evidence_level: 'systematic-review',
          excerpt: 'Test excerpt 2...',
          relevance: 0.88,
        },
      ],
      chunks: [],
      totalChunks: 6,
      relevanceScores: [0.92, 0.88, 0.85, 0.82, 0.80, 0.78],
      averageRelevance: 0.84,
    };

    const mockNarrative = {
      text: '## Resumo Executivo\n\nTest narrative...',
      model: 'llama3.1:8b',
      created_at: '2025-01-01T00:00:00Z',
      done: true,
    };

    it('should successfully perform deep analysis with critical deviations', async () => {
      mockRagService.searchMultipleDeviations.mockResolvedValue(mockScientificContext);
      mockOllamaService.generate.mockResolvedValue(mockNarrative);

      const result = await service.analyze(mockInput);

      expect(result).toBeDefined();
      expect(result.llm_narrative).toBe(mockNarrative.text);
      expect(result.rag_sources_used).toHaveLength(2);
      expect(result.scientific_context.deviations_analyzed).toHaveLength(2);
      expect(result.scientific_context.total_chunks).toBe(6);
      expect(result.processing_time_ms).toBeGreaterThan(0);

      expect(mockRagService.searchMultipleDeviations).toHaveBeenCalledWith(
        [
          { type: 'knee_valgus', severity: 'moderate' },
          { type: 'butt_wink', severity: 'severe' },
        ],
        'back-squat',
        3,
      );

      expect(mockOllamaService.generate).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'llama3.1:8b',
          prompt: expect.any(String),
          options: {
            temperature: 0.3,
            top_p: 0.9,
            max_tokens: 1500,
          },
        }),
      );
    });

    it('should return null if no critical deviations', async () => {
      const inputNoCritical = {
        ...mockInput,
        quickAnalysis: {
          ...mockQuickAnalysis,
          deviations_detected: JSON.stringify([
            { type: 'some_deviation', severity: 'mild', percentage: 20, average_value: 5 },
          ]),
        },
      };

      const result = await service.analyze(inputNoCritical);

      expect(result).toBeNull();
      expect(mockRagService.searchMultipleDeviations).not.toHaveBeenCalled();
      expect(mockOllamaService.generate).not.toHaveBeenCalled();
    });

    it('should handle empty scientific context gracefully', async () => {
      mockRagService.searchMultipleDeviations.mockResolvedValue({
        sources: [],
        chunks: [],
        totalChunks: 0,
        relevanceScores: [],
        averageRelevance: 0,
      });

      mockOllamaService.generate.mockResolvedValue(mockNarrative);

      const result = await service.analyze(mockInput);

      expect(result).toBeDefined();
      expect(result.scientific_context.total_chunks).toBe(0);
      expect(result.rag_sources_used).toHaveLength(0);

      // Deve ainda gerar narrativa
      expect(mockOllamaService.generate).toHaveBeenCalled();
    });

    it('should throw error if RAG search fails', async () => {
      mockRagService.searchMultipleDeviations.mockRejectedValue(new Error('RAG search failed'));

      await expect(service.analyze(mockInput)).rejects.toThrow('RAG search failed');
    });

    it('should throw error if LLM generation fails', async () => {
      mockRagService.searchMultipleDeviations.mockResolvedValue(mockScientificContext);
      mockOllamaService.generate.mockRejectedValue(new Error('LLM generation failed'));

      await expect(service.analyze(mockInput)).rejects.toThrow('LLM generation failed');
    });
  });
});
