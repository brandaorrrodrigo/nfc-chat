import { IsBoolean, IsString, IsNumber, IsArray, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para decisão de análise profunda
 */
export class DeepAnalysisDecisionDto {
  @ApiProperty({
    description: 'Se análise profunda deve ser executada',
    example: true,
  })
  @IsBoolean()
  shouldRun: boolean;

  @ApiProperty({
    description: 'Razão da decisão',
    example: '3 critérios atingidos: necessária análise profunda',
  })
  @IsString()
  reason: string;

  @ApiProperty({
    description: 'Tempo estimado de análise profunda em ms',
    example: 45000,
  })
  @IsNumber()
  @Min(0)
  estimatedTime: number;

  @ApiProperty({
    description: 'Lista de triggers que ativaram a decisão',
    type: [String],
    example: ['score_low: 6.2/10', 'similarity_low: 65.0%', 'critical_deviations: 2x knee_valgus, butt_wink'],
  })
  @IsArray()
  @IsString({ each: true })
  triggers: string[];
}

/**
 * DTO para estratégia de cache
 */
export class CacheStrategyDto {
  @ApiProperty({
    description: 'Nível do cache (L1=análise idêntica, L2=gold standard, L3=RAG context)',
    example: 'L1',
  })
  @IsString()
  level: string;

  @ApiProperty({
    description: 'Time-to-live em segundos',
    example: 86400,
  })
  @IsNumber()
  @Min(0)
  ttl: number;

  @ApiProperty({
    description: 'Chave do cache',
    example: 'video_analysis:user_123:back-squat',
  })
  @IsString()
  key: string;
}
