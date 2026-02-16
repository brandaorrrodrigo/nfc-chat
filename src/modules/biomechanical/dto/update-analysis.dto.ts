import {
  IsOptional,
  IsString,
  IsArray,
  MaxLength
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UpdateAnalysisDto {

  @ApiPropertyOptional({
    description: 'Atualizar tags da análise',
    type: [String],
    example: ['revisado', 'aprovado']
  })
  @IsOptional()
  @IsArray({ message: 'Tags devem ser um array' })
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

  @ApiPropertyOptional({
    description: 'Notas adicionais sobre a análise',
    example: 'Análise realizada após correção de técnica'
  })
  @IsOptional()
  @IsString({ message: 'Notas devem ser um texto' })
  @MaxLength(1000, { message: 'Notas devem ter no máximo 1000 caracteres' })
  @Transform(({ value }) => value?.trim())
  notes?: string;
}
