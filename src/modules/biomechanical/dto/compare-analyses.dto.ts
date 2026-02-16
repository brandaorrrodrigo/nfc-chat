import {
  IsString,
  IsNotEmpty,
  IsUUID,
  ArrayMinSize,
  ArrayMaxSize,
  IsArray
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CompareAnalysesDto {

  @ApiProperty({
    description: 'ID da análise baseline (referência)',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsString({ message: 'ID da análise baseline deve ser um texto' })
  @IsNotEmpty({ message: 'ID da análise baseline é obrigatório' })
  @IsUUID('4', { message: 'ID da análise baseline deve ser um UUID válido' })
  baselineId!: string;

  @ApiProperty({
    description: 'IDs das análises para comparar com baseline',
    type: [String],
    example: [
      '123e4567-e89b-12d3-a456-426614174001',
      '123e4567-e89b-12d3-a456-426614174002'
    ],
    minItems: 1,
    maxItems: 5
  })
  @IsArray({ message: 'IDs de comparação devem ser um array' })
  @ArrayMinSize(1, { message: 'Deve haver pelo menos 1 análise para comparar' })
  @ArrayMaxSize(5, { message: 'Máximo de 5 análises para comparar por vez' })
  @IsUUID('4', {
    each: true,
    message: 'Cada ID de análise deve ser um UUID válido'
  })
  compareIds!: string[];
}
