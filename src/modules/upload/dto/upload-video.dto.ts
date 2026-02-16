import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  Matches
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UploadVideoDto {

  @ApiProperty({
    description: 'ID do usuário que está enviando o vídeo',
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
    description: 'Gerar thumbnail automaticamente',
    default: true
  })
  @IsOptional()
  @IsBoolean({ message: 'generateThumbnail deve ser um booleano' })
  generateThumbnail?: boolean = true;

  @ApiPropertyOptional({
    description: 'Validar metadados do vídeo',
    default: true
  })
  @IsOptional()
  @IsBoolean({ message: 'validateMetadata deve ser um booleano' })
  validateMetadata?: boolean = true;
}
