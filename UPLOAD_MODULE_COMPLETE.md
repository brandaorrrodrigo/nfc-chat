# 📤 Upload Module - Implementação Completa

## ✅ Arquivos Já Criados

1. ✅ `storage/storage.interface.ts` - Interface abstrata
2. ✅ `storage/local-storage.service.ts` - Storage local
3. ✅ `storage/s3-storage.service.ts` - Storage AWS S3
4. ✅ `upload.module.ts` - Módulo principal
5. ✅ `upload.service.ts` - Service principal
6. ✅ `upload.controller.ts` - Controller REST

---

## 📂 Arquivos Restantes (Copiar e Criar)

### 1. processors/thumbnail.processor.ts

```typescript
import { Injectable, Logger } from '@nestjs/common';
import * as sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs-extra';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface ThumbnailOptions {
  videoPath: string;
  outputPath?: string;
  timestamp?: number;     // Segundos no vídeo
  width?: number;
  height?: number;
  quality?: number;
}

@Injectable()
export class ThumbnailProcessor {
  private readonly logger = new Logger(ThumbnailProcessor.name);

  /**
   * Gera thumbnail de vídeo usando FFmpeg
   */
  async generateVideoThumbnail(options: ThumbnailOptions): Promise<string> {
    try {
      const timestamp = options.timestamp || 1; // 1 segundo por padrão
      const outputPath = options.outputPath ||
        path.join(path.dirname(options.videoPath), 'thumbnail.jpg');

      const width = options.width || 640;
      const height = options.height || 360;

      // Comando FFmpeg para extrair frame
      const command = `ffmpeg -ss ${timestamp} -i "${options.videoPath}" -vframes 1 -vf scale=${width}:${height} -y "${outputPath}"`;

      await execAsync(command);

      // Otimizar thumbnail com sharp se quality especificado
      if (options.quality) {
        await sharp(outputPath)
          .jpeg({ quality: options.quality })
          .toFile(outputPath + '.tmp');

        await fs.move(outputPath + '.tmp', outputPath, { overwrite: true });
      }

      this.logger.log(`Thumbnail gerado: ${outputPath}`);
      return outputPath;

    } catch (error) {
      this.logger.error('Erro ao gerar thumbnail:', error);
      throw error;
    }
  }

  /**
   * Gera múltiplos thumbnails ao longo do vídeo
   */
  async generateMultipleThumbnails(
    videoPath: string,
    count: number = 5
  ): Promise<string[]> {
    // Obter duração do vídeo
    const duration = await this.getVideoDuration(videoPath);

    const interval = duration / (count + 1);
    const timestamps = Array.from({ length: count }, (_, i) => (i + 1) * interval);

    const thumbnails: string[] = [];

    for (let i = 0; i < timestamps.length; i++) {
      const outputPath = path.join(
        path.dirname(videoPath),
        `thumbnail_${i}.jpg`
      );

      const thumbnail = await this.generateVideoThumbnail({
        videoPath,
        timestamp: timestamps[i],
        outputPath,
        quality: 80
      });

      thumbnails.push(thumbnail);
    }

    return thumbnails;
  }

  private async getVideoDuration(videoPath: string): Promise<number> {
    try {
      const command = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${videoPath}"`;
      const { stdout } = await execAsync(command);
      return parseFloat(stdout.trim());
    } catch (error) {
      this.logger.error('Erro ao obter duração:', error);
      return 0;
    }
  }
}
```

---

### 2. processors/video-metadata.processor.ts

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface VideoMetadata {
  duration: number;        // segundos
  width: number;
  height: number;
  fps: number;
  codec: string;
  bitrate: number;         // kbps
  size: number;            // bytes
  format: string;
}

@Injectable()
export class VideoMetadataProcessor {
  private readonly logger = new Logger(VideoMetadataProcessor.name);

  async extractMetadata(videoPath: string): Promise<VideoMetadata> {
    try {
      // Comando FFprobe para extrair todos os metadados
      const command = `ffprobe -v quiet -print_format json -show_format -show_streams "${videoPath}"`;

      const { stdout } = await execAsync(command);
      const data = JSON.parse(stdout);

      const videoStream = data.streams.find((s: any) => s.codec_type === 'video');

      if (!videoStream) {
        throw new Error('Stream de vídeo não encontrado');
      }

      const result: VideoMetadata = {
        duration: parseFloat(data.format.duration) || 0,
        width: videoStream.width || 0,
        height: videoStream.height || 0,
        fps: this.parseFps(videoStream.r_frame_rate || '0/1'),
        codec: videoStream.codec_name || 'unknown',
        bitrate: Math.round(parseInt(data.format.bit_rate || '0') / 1000),
        size: parseInt(data.format.size || '0'),
        format: data.format.format_name || 'unknown'
      };

      this.logger.log(`Metadados extraídos: ${JSON.stringify(result)}`);
      return result;

    } catch (error) {
      this.logger.error('Erro ao extrair metadados:', error);
      throw error;
    }
  }

  /**
   * Valida se vídeo atende requisitos mínimos
   */
  async validateVideo(
    videoPath: string,
    requirements: {
      minDuration?: number;
      maxDuration?: number;
      minWidth?: number;
      minHeight?: number;
      minFps?: number;
      maxSize?: number;
      allowedCodecs?: string[];
    }
  ): Promise<{ valid: boolean; errors: string[] }> {
    const metadata = await this.extractMetadata(videoPath);
    const errors: string[] = [];

    if (requirements.minDuration && metadata.duration < requirements.minDuration) {
      errors.push(`Duração muito curta: ${metadata.duration}s (mín: ${requirements.minDuration}s)`);
    }

    if (requirements.maxDuration && metadata.duration > requirements.maxDuration) {
      errors.push(`Duração muito longa: ${metadata.duration}s (máx: ${requirements.maxDuration}s)`);
    }

    if (requirements.minWidth && metadata.width < requirements.minWidth) {
      errors.push(`Largura muito pequena: ${metadata.width}px (mín: ${requirements.minWidth}px)`);
    }

    if (requirements.minHeight && metadata.height < requirements.minHeight) {
      errors.push(`Altura muito pequena: ${metadata.height}px (mín: ${requirements.minHeight}px)`);
    }

    if (requirements.minFps && metadata.fps < requirements.minFps) {
      errors.push(`FPS muito baixo: ${metadata.fps} (mín: ${requirements.minFps})`);
    }

    if (requirements.maxSize && metadata.size > requirements.maxSize) {
      errors.push(`Arquivo muito grande: ${(metadata.size / 1024 / 1024).toFixed(2)}MB (máx: ${(requirements.maxSize / 1024 / 1024).toFixed(2)}MB)`);
    }

    if (requirements.allowedCodecs && !requirements.allowedCodecs.includes(metadata.codec)) {
      errors.push(`Codec não suportado: ${metadata.codec} (permitidos: ${requirements.allowedCodecs.join(', ')})`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  private parseFps(fpsString: string): number {
    const parts = fpsString.split('/');
    if (parts.length === 2) {
      return parseInt(parts[0]) / parseInt(parts[1]);
    }
    return parseFloat(fpsString);
  }
}
```

---

### 3. guards/quota.guard.ts

```typescript
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  BadRequestException
} from '@nestjs/common';
import { PrismaService } from '../../biomechanical/prisma.service';

@Injectable()
export class QuotaGuard implements CanActivate {

  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.body.userId || request.query.userId;

    if (!userId) {
      throw new BadRequestException('userId é obrigatório');
    }

    // Buscar usuário e verificar limites
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        subscription_tier: true,
        createdAt: true
      }
    });

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    // Contar análises no mês atual
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const analysesThisMonth = await this.prisma.videoAnalysis.count({
      where: {
        userId: userId,
        createdAt: {
          gte: startOfMonth
        }
      }
    });

    // Limites por plano
    const limits: Record<string, number> = {
      free: 3,
      premium: 10,
      premium_plus: Infinity
    };

    const limit = limits[user.subscription_tier] || limits.free;

    if (analysesThisMonth >= limit) {
      throw new ForbiddenException(
        `Limite mensal de análises atingido (${limit} análises). Faça upgrade do seu plano para continuar.`
      );
    }

    return true;
  }
}
```

---

### 4. interceptors/file-validation.interceptor.ts

```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as path from 'path';

@Injectable()
export class FileValidationInterceptor implements NestInterceptor {

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const file: Express.Multer.File = request.file;

    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado');
    }

    // Validar tipo MIME
    const allowedMimeTypes = [
      'video/mp4',
      'video/webm',
      'video/quicktime',
      'video/x-msvideo'
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Tipo de arquivo não suportado: ${file.mimetype}. Use: MP4, WebM, MOV ou AVI`
      );
    }

    // Validar extensão
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = ['.mp4', '.webm', '.mov', '.avi'];

    if (!allowedExtensions.includes(ext)) {
      throw new BadRequestException(
        `Extensão de arquivo não suportada: ${ext}. Use: .mp4, .webm, .mov ou .avi`
      );
    }

    // Validar tamanho (100MB)
    const maxSize = parseInt(process.env.MAX_VIDEO_SIZE || '104857600');

    if (file.size > maxSize) {
      const sizeMB = (file.size / 1024 / 1024).toFixed(2);
      const limitMB = (maxSize / 1024 / 1024).toFixed(0);

      throw new BadRequestException(
        `Arquivo muito grande: ${sizeMB}MB. Limite: ${limitMB}MB`
      );
    }

    return next.handle();
  }
}
```

---

### 5. dto/upload-video.dto.ts

```typescript
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
```

---

### 6. dto/get-presigned-url.dto.ts

```typescript
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
```

---

## 🔧 Variáveis de Ambiente (.env)

Adicionar ao `.env`:

```env
# Upload Configuration
STORAGE_TYPE=local              # local | s3
UPLOAD_DIR=./data/uploads       # Diretório para storage local
TEMP_DIR=./data/temp            # Diretório temporário
BASE_URL=http://localhost:3000

# File Limits
MAX_VIDEO_SIZE=104857600        # 100MB em bytes
MAX_VIDEO_DURATION=60           # Segundos

# AWS S3 (se STORAGE_TYPE=s3)
S3_BUCKET_NAME=nfc-uploads
S3_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
```

---

## 📦 Dependências Necessárias

Instalar (se ainda não instalou):

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner multer sharp fs-extra bytes
npm install --save-dev @types/multer @types/bytes
```

---

## 🚀 Como Usar

### 1. Importar no App Module

```typescript
// app.module.ts
import { UploadModule } from './modules/upload/upload.module';

@Module({
  imports: [
    UploadModule,
    // ... outros módulos
  ],
})
export class AppModule {}
```

---

### 2. Upload de Vídeo (Frontend)

```typescript
const formData = new FormData();
formData.append('video', videoFile);
formData.append('userId', 'user-uuid');

const response = await fetch('http://localhost:3000/api/v1/upload/video', {
  method: 'POST',
  body: formData
});

const result = await response.json();
console.log('Upload concluído:', result);
// { key: 'user123/abc.mp4', url: 'http://...', size: 15728640, ... }
```

---

### 3. Obter URL de Acesso

```bash
curl "http://localhost:3000/api/v1/upload/url/user123%2Fvideo.mp4?expiresIn=7200"
```

---

### 4. Deletar Vídeo

```bash
curl -X DELETE "http://localhost:3000/api/v1/upload/user123%2Fvideo.mp4?userId=user123"
```

---

### 5. Cleanup Automático (Cron)

```typescript
// Adicionar ao main.ts ou em um módulo separado
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CleanupService {
  constructor(private uploadService: UploadService) {}

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async handleCleanup() {
    await this.uploadService.cleanupOldUploads(30);
  }
}
```

---

## ✅ Checklist de Implementação

- [x] Storage interface
- [x] Local storage service
- [x] S3 storage service
- [x] Upload module
- [x] Upload service
- [x] Upload controller
- [ ] Thumbnail processor (copiar código acima)
- [ ] Video metadata processor (copiar código acima)
- [ ] Quota guard (copiar código acima)
- [ ] File validation interceptor (copiar código acima)
- [ ] Upload DTOs (copiar código acima)
- [ ] Configurar variáveis de ambiente
- [ ] Testar upload local
- [ ] Testar upload S3 (se aplicável)
- [ ] Implementar cron de cleanup

---

## 🎯 Próximos Passos

1. **Copiar e criar os arquivos restantes** (processors, guards, interceptors, DTOs)
2. **Configurar .env** com as variáveis necessárias
3. **Testar upload local** primeiro
4. **Configurar S3** (se necessário)
5. **Implementar cleanup automático**
6. **Integrar com BiomechanicalService** para análise automática após upload

---

**✅ Upload Module 80% Implementado!**

Faltam apenas os processors, guards, interceptors e DTOs (copiar do código acima).

Deseja que eu continue implementando ou prefere testar o que já está pronto primeiro?
