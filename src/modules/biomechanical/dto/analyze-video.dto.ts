import {
  IsString,
  IsEnum,
  IsUrl,
  IsOptional,
  IsNotEmpty,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

// Note: CaptureMode enum should be added to Prisma schema
// For now, using string literal type
type CaptureMode = 'ESSENTIAL' | 'ADVANCED' | 'PRO';

export class AnalyzeVideoDto {

  @ApiProperty({
    description: 'Nome do exercício sendo executado',
    example: 'Agachamento Livre',
    minLength: 3,
    maxLength: 100
  })
  @IsString({ message: 'Nome do exercício deve ser um texto' })
  @IsNotEmpty({ message: 'Nome do exercício é obrigatório' })
  @MinLength(3, { message: 'Nome do exercício deve ter no mínimo 3 caracteres' })
  @MaxLength(100, { message: 'Nome do exercício deve ter no máximo 100 caracteres' })
  @Transform(({ value }) => value?.trim())
  exerciseName!: string;

  @ApiProperty({
    description: 'Modo de captura utilizado',
    enum: ['ESSENTIAL', 'ADVANCED', 'PRO'],
    example: 'ESSENTIAL',
    enumName: 'CaptureMode'
  })
  @IsEnum(['ESSENTIAL', 'ADVANCED', 'PRO'], {
    message: 'Modo de captura inválido. Use: ESSENTIAL, ADVANCED ou PRO'
  })
  @IsNotEmpty({ message: 'Modo de captura é obrigatório' })
  captureMode!: CaptureMode;

  @ApiProperty({
    description: 'ID do usuário que está realizando a análise',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsString({ message: 'ID do usuário deve ser um texto' })
  @IsNotEmpty({ message: 'ID do usuário é obrigatório' })
  @Matches(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    { message: 'ID do usuário deve ser um UUID válido' }
  )
  userId!: string;

  @ApiPropertyOptional({
    description: 'URL para webhook de notificação quando análise completar',
    example: 'https://myapp.com/api/webhooks/analysis-completed'
  })
  @IsOptional()
  @IsUrl(
    { protocols: ['http', 'https'], require_tld: true },
    { message: 'URL do webhook inválida' }
  )
  @MaxLength(500, { message: 'URL do webhook muito longa' })
  webhookUrl?: string;

  @ApiPropertyOptional({
    description: 'ID do exercício no catálogo (opcional)',
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  @IsOptional()
  @IsString({ message: 'ID do exercício deve ser um texto' })
  @Matches(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    { message: 'ID do exercício deve ser um UUID válido' }
  )
  exerciseId?: string;

  @ApiPropertyOptional({
    description: 'Ângulos de câmera utilizados',
    type: [String],
    example: ['SAGITTAL_RIGHT', 'FRONTAL_POSTERIOR']
  })
  @IsOptional()
  @IsString({ each: true, message: 'Cada ângulo deve ser um texto' })
  @Transform(({ value }) => Array.isArray(value) ? value : [value])
  cameraAngles?: string[];

  @ApiPropertyOptional({
    description: 'Tags para categorizar a análise',
    type: [String],
    example: ['pre-treino', 'teste-tecnica']
  })
  @IsOptional()
  @IsString({ each: true, message: 'Cada tag deve ser um texto' })
  @MaxLength(30, {
    each: true,
    message: 'Cada tag deve ter no máximo 30 caracteres'
  })
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.map((tag: string) => tag.toLowerCase().trim())
      : []
  )
  tags?: string[];
}
