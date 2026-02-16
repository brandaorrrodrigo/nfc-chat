import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsEnum,
  IsDateString,
  IsArray
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

// Enums temporários até serem adicionados ao Prisma
export enum AnalysisStatusEnum {
  PENDING_AI = 'PENDING_AI',
  AI_ANALYZED = 'AI_ANALYZED',
  PENDING_REVIEW = 'PENDING_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  REVISION_NEEDED = 'REVISION_NEEDED'
}

type CaptureMode = 'ESSENTIAL' | 'ADVANCED' | 'PRO';

export class GetAnalysisDto {

  @ApiPropertyOptional({
    description: 'ID do usuário para filtrar análises',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsOptional()
  @IsString({ message: 'ID do usuário deve ser um texto' })
  userId?: string;

  @ApiPropertyOptional({
    description: 'Número de resultados por página',
    example: 10,
    minimum: 1,
    maximum: 100,
    default: 10
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limite deve ser um número inteiro' })
  @Min(1, { message: 'Limite mínimo é 1' })
  @Max(100, { message: 'Limite máximo é 100' })
  @Transform(({ value }) => parseInt(value) || 10)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Número de resultados a pular (paginação)',
    example: 0,
    minimum: 0,
    default: 0
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Offset deve ser um número inteiro' })
  @Min(0, { message: 'Offset mínimo é 0' })
  @Transform(({ value }) => parseInt(value) || 0)
  offset?: number = 0;

  @ApiPropertyOptional({
    description: 'Filtrar por status da análise',
    enum: AnalysisStatusEnum,
    isArray: true,
    example: ['APPROVED', 'PENDING_REVIEW']
  })
  @IsOptional()
  @IsArray({ message: 'Status deve ser um array' })
  @IsEnum(AnalysisStatusEnum, {
    each: true,
    message: 'Status inválido'
  })
  @Transform(({ value }) => Array.isArray(value) ? value : [value])
  status?: AnalysisStatusEnum[];

  @ApiPropertyOptional({
    description: 'Filtrar por modo de captura',
    enum: ['ESSENTIAL', 'ADVANCED', 'PRO'],
    isArray: true,
    example: ['ESSENTIAL', 'ADVANCED']
  })
  @IsOptional()
  @IsArray({ message: 'Modos de captura devem ser um array' })
  @IsEnum(['ESSENTIAL', 'ADVANCED', 'PRO'], {
    each: true,
    message: 'Modo de captura inválido'
  })
  @Transform(({ value }) => Array.isArray(value) ? value : [value])
  captureMode?: CaptureMode[];

  @ApiPropertyOptional({
    description: 'Filtrar por nome do exercício (busca parcial)',
    example: 'agachamento'
  })
  @IsOptional()
  @IsString({ message: 'Nome do exercício deve ser um texto' })
  @Transform(({ value }) => value?.trim().toLowerCase())
  exerciseName?: string;

  @ApiPropertyOptional({
    description: 'Data de início do período (ISO 8601)',
    example: '2024-01-01T00:00:00Z'
  })
  @IsOptional()
  @IsDateString({}, { message: 'Data de início inválida (use formato ISO 8601)' })
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Data de fim do período (ISO 8601)',
    example: '2024-12-31T23:59:59Z'
  })
  @IsOptional()
  @IsDateString({}, { message: 'Data de fim inválida (use formato ISO 8601)' })
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por tags',
    type: [String],
    example: ['pre-treino', 'competicao']
  })
  @IsOptional()
  @IsArray({ message: 'Tags devem ser um array' })
  @IsString({ each: true, message: 'Cada tag deve ser um texto' })
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.map((tag: string) => tag.toLowerCase().trim())
      : []
  )
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Ordenar por campo',
    example: 'createdAt',
    enum: ['createdAt', 'completedAt', 'igpbScore', 'exerciseName']
  })
  @IsOptional()
  @IsString({ message: 'Campo de ordenação deve ser um texto' })
  @IsEnum(['createdAt', 'completedAt', 'igpbScore', 'exerciseName'], {
    message: 'Campo de ordenação inválido'
  })
  orderBy?: string = 'createdAt';

  @ApiPropertyOptional({
    description: 'Direção da ordenação',
    example: 'desc',
    enum: ['asc', 'desc']
  })
  @IsOptional()
  @IsEnum(['asc', 'desc'], { message: 'Direção deve ser "asc" ou "desc"' })
  orderDirection?: 'asc' | 'desc' = 'desc';
}
