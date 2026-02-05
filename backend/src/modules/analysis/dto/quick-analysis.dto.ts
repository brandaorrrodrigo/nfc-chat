import {
  IsString,
  IsArray,
  ValidateNested,
  IsNumber,
  Min,
  Max,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IFrame, IFrameAngles } from '../interfaces/frame.interface';

/**
 * DTO para ângulos de um frame
 */
export class FrameAnglesDto implements IFrameAngles {
  @ApiProperty({ description: 'Ângulo do joelho esquerdo em graus', example: 90 })
  @IsNumber()
  @Min(0)
  @Max(180)
  knee_left: number;

  @ApiProperty({ description: 'Ângulo do joelho direito em graus', example: 92 })
  @IsNumber()
  @Min(0)
  @Max(180)
  knee_right: number;

  @ApiProperty({ description: 'Ângulo do quadril em graus', example: 85 })
  @IsNumber()
  @Min(0)
  @Max(180)
  hip: number;

  @ApiProperty({ description: 'Ângulo do tronco em graus', example: 45 })
  @IsNumber()
  @Min(-90)
  @Max(90)
  trunk: number;

  @ApiProperty({ description: 'Ângulo do tornozelo esquerdo em graus', example: 70 })
  @IsNumber()
  @Min(0)
  @Max(180)
  ankle_left: number;

  @ApiProperty({ description: 'Ângulo do tornozelo direito em graus', example: 68 })
  @IsNumber()
  @Min(0)
  @Max(180)
  ankle_right: number;
}

/**
 * DTO para um frame de análise
 */
export class FrameDto implements IFrame {
  @ApiProperty({ description: 'Número do frame', example: 1 })
  @IsNumber()
  @Min(0)
  frame_number: number;

  @ApiProperty({ description: 'Timestamp em milissegundos', example: 500 })
  @IsNumber()
  @Min(0)
  timestamp_ms: number;

  @ApiProperty({ description: 'Fase do movimento', example: 'eccentric_mid' })
  @IsString()
  phase: string;

  @ApiProperty({ description: 'Ângulos articulares', type: FrameAnglesDto })
  @ValidateNested()
  @Type(() => FrameAnglesDto)
  angles: FrameAnglesDto;

  @ApiProperty({ description: 'Landmarks 3D do MediaPipe', type: [Object] })
  @IsArray()
  landmarks_3d: any[];
}

/**
 * DTO de entrada para análise rápida
 */
export class QuickAnalysisInputDto {
  @ApiProperty({ description: 'Caminho do vídeo', example: '/uploads/video_123.mp4' })
  @IsString()
  videoPath: string;

  @ApiProperty({ description: 'ID do exercício', example: 'back-squat' })
  @IsString()
  exerciseId: string;

  @ApiProperty({ description: 'ID do usuário', example: 'user_123' })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Frames extraídos do vídeo',
    type: [FrameDto],
    example: [],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FrameDto)
  frames: FrameDto[];
}

/**
 * Classificação do score
 */
export enum ScoreClassification {
  EXCELENTE = 'EXCELENTE',
  BOM = 'BOM',
  REGULAR = 'REGULAR',
  RUIM = 'RUIM',
  CRITICO = 'CRÍTICO',
}

/**
 * DTO de saída da análise rápida
 */
export class QuickAnalysisOutputDto {
  @ApiProperty({ description: 'ID da análise rápida', example: 'qa_123' })
  id: string;

  @ApiProperty({ description: 'Score global (0-10)', example: 7.5 })
  @IsNumber()
  @Min(0)
  @Max(10)
  overall_score: number;

  @ApiProperty({
    description: 'Classificação do score',
    enum: ScoreClassification,
    example: 'BOM',
  })
  @IsEnum(ScoreClassification)
  classification: ScoreClassification;

  @ApiProperty({
    description: 'Similaridade com gold standard (0-1)',
    example: 0.82,
  })
  @IsNumber()
  @Min(0)
  @Max(1)
  similarity_to_gold: number;

  @ApiProperty({
    description: 'Análise frame-a-frame',
    type: [Object],
  })
  frames_data: any[];

  @ApiProperty({
    description: 'Desvios detectados agregados',
    type: [Object],
  })
  deviations_detected: any[];

  @ApiProperty({
    description: 'Tempo de processamento em ms',
    example: 450,
  })
  @IsNumber()
  processing_time_ms: number;

  @ApiProperty({
    description: 'Data de criação',
    example: '2025-01-15T10:30:00Z',
  })
  created_at: Date;
}
