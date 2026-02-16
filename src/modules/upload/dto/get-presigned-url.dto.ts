import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  Max
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class GetPresignedUrlDto {

  @ApiProperty({
    description: 'Chave (key) do arquivo no storage',
    example: 'user123/video.mp4'
  })
  @IsString({ message: 'Key deve ser um texto' })
  @IsNotEmpty({ message: 'Key é obrigatória' })
  key!: string;

  @ApiPropertyOptional({
    description: 'Tempo de expiração da URL em segundos',
    example: 3600,
    default: 3600,
    minimum: 60,
    maximum: 604800
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'expiresIn deve ser um número inteiro' })
  @Min(60, { message: 'expiresIn mínimo é 60 segundos' })
  @Max(604800, { message: 'expiresIn máximo é 604800 segundos (7 dias)' })
  expiresIn?: number = 3600;
}
