import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  MaxLength,
  MinLength,
  IsArray,
  ValidateNested,
  IsEnum,
  ArrayMinSize,
  ArrayMaxSize
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';

// Enums temporários (devem ser adicionados ao Prisma schema depois)
export enum CorrectiveActionPriority {
  BAIXA = 'BAIXA',
  MEDIA = 'MEDIA',
  ALTA = 'ALTA',
  CRITICA = 'CRITICA'
}

export enum CorrectiveActionCategory {
  MOBILIDADE = 'MOBILIDADE',
  ESTABILIDADE = 'ESTABILIDADE',
  CONTROLE_MOTOR = 'CONTROLE_MOTOR',
  FORCA = 'FORCA',
  TECNICA = 'TECNICA',
  OUTRO = 'OUTRO'
}

export class CorrectiveActionDto {

  @ApiProperty({
    description: 'Prioridade da ação corretiva',
    enum: CorrectiveActionPriority,
    example: 'ALTA'
  })
  @IsEnum(CorrectiveActionPriority, { message: 'Prioridade inválida' })
  priority!: CorrectiveActionPriority;

  @ApiProperty({
    description: 'Categoria da ação',
    enum: CorrectiveActionCategory,
    example: 'MOBILIDADE'
  })
  @IsEnum(CorrectiveActionCategory, { message: 'Categoria inválida' })
  category!: CorrectiveActionCategory;

  @ApiProperty({
    description: 'Descrição da ação corretiva',
    example: 'Mobilização de torácica e liberação miofascial'
  })
  @IsString({ message: 'Descrição deve ser um texto' })
  @IsNotEmpty({ message: 'Descrição é obrigatória' })
  @MinLength(10, { message: 'Descrição deve ter no mínimo 10 caracteres' })
  @MaxLength(500, { message: 'Descrição deve ter no máximo 500 caracteres' })
  @Transform(({ value }) => value?.trim())
  description!: string;

  @ApiProperty({
    description: 'Lista de exercícios recomendados',
    type: [String],
    example: ['Open book torácico', 'Extensão em foam roller']
  })
  @IsArray({ message: 'Exercícios devem ser um array' })
  @IsString({ each: true, message: 'Cada exercício deve ser um texto' })
  @MaxLength(200, {
    each: true,
    message: 'Nome do exercício muito longo'
  })
  exercises!: string[];

  @ApiProperty({
    description: 'Duração recomendada',
    example: '2-3 semanas, diariamente'
  })
  @IsString({ message: 'Duração deve ser um texto' })
  @IsNotEmpty({ message: 'Duração é obrigatória' })
  @MaxLength(100, { message: 'Duração muito longa' })
  duration!: string;
}

export class CreateCorrectivePlanDto {

  @ApiProperty({
    description: 'ID da análise biomecânica de referência',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsString({ message: 'ID da análise deve ser um texto' })
  @IsNotEmpty({ message: 'ID da análise é obrigatório' })
  @IsUUID('4', { message: 'ID da análise deve ser um UUID válido' })
  analysisId!: string;

  @ApiProperty({
    description: 'Título do plano corretivo',
    example: 'Correção de compensação rotacional - Agachamento'
  })
  @IsString({ message: 'Título deve ser um texto' })
  @IsNotEmpty({ message: 'Título é obrigatório' })
  @MinLength(5, { message: 'Título deve ter no mínimo 5 caracteres' })
  @MaxLength(200, { message: 'Título deve ter no máximo 200 caracteres' })
  @Transform(({ value }) => value?.trim())
  title!: string;

  @ApiPropertyOptional({
    description: 'Descrição detalhada do plano',
    example: 'Plano focado em correção de mobilidade torácica e fortalecimento de core'
  })
  @IsOptional()
  @IsString({ message: 'Descrição deve ser um texto' })
  @MaxLength(1000, { message: 'Descrição deve ter no máximo 1000 caracteres' })
  @Transform(({ value }) => value?.trim())
  description?: string;

  @ApiProperty({
    description: 'Duração estimada do plano',
    example: '4-6 semanas'
  })
  @IsString({ message: 'Duração deve ser um texto' })
  @IsNotEmpty({ message: 'Duração é obrigatória' })
  @MaxLength(50, { message: 'Duração muito longa' })
  duration!: string;

  @ApiProperty({
    description: 'Lista de ações corretivas',
    type: [CorrectiveActionDto],
    minItems: 1,
    maxItems: 10
  })
  @IsArray({ message: 'Ações devem ser um array' })
  @ArrayMinSize(1, { message: 'Deve haver pelo menos 1 ação corretiva' })
  @ArrayMaxSize(10, { message: 'Máximo de 10 ações corretivas por plano' })
  @ValidateNested({ each: true })
  @Type(() => CorrectiveActionDto)
  actions!: CorrectiveActionDto[];
}
