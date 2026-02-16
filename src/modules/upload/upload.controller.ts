import {
  Controller,
  Post,
  Delete,
  Get,
  UseInterceptors,
  UseGuards,
  UploadedFile,
  Param,
  Query,
  BadRequestException,
  Body
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { QuotaGuard } from './guards/quota.guard';
import { FileValidationInterceptor } from './interceptors/file-validation.interceptor';
import { UploadVideoDto } from './dto/upload-video.dto';
import { GetPresignedUrlDto } from './dto/get-presigned-url.dto';

@ApiTags('upload')
@Controller('api/v1/upload')
export class UploadController {

  constructor(private uploadService: UploadService) {}

  @Post('video')
  @ApiOperation({ summary: 'Upload de vídeo para análise biomecânica' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        video: {
          type: 'string',
          format: 'binary',
          description: 'Arquivo de vídeo (MP4, WebM, MOV ou AVI, máx 100MB)'
        },
        userId: {
          type: 'string',
          description: 'ID do usuário'
        }
      },
      required: ['video', 'userId']
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Vídeo enviado com sucesso',
    schema: {
      example: {
        key: 'user123/abc123.mp4',
        url: 'http://localhost:3000/uploads/user123/abc123.mp4',
        size: 15728640,
        contentType: 'video/mp4',
        etag: 'abc123def456'
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Erro de validação ou quota excedida'
  })
  @ApiResponse({
    status: 403,
    description: 'Quota mensal excedida'
  })
  @UseGuards(QuotaGuard)
  @UseInterceptors(FileInterceptor('video'), FileValidationInterceptor)
  async uploadVideo(
    @UploadedFile() file: Express.Multer.File,
    @Body('userId') userId: string
  ) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado');
    }

    if (!userId) {
      throw new BadRequestException('userId é obrigatório');
    }

    return await this.uploadService.uploadVideo(file, userId);
  }

  @Get('url/:key')
  @ApiOperation({ summary: 'Obter URL de acesso ao vídeo' })
  @ApiResponse({
    status: 200,
    description: 'URL gerada com sucesso',
    schema: {
      example: {
        url: 'https://s3.amazonaws.com/bucket/key?signature=...',
        expiresIn: 3600
      }
    }
  })
  async getVideoUrl(
    @Param('key') key: string,
    @Query('expiresIn') expiresIn?: number
  ) {
    const url = await this.uploadService.getVideoUrl(key, expiresIn);

    return {
      url,
      expiresIn: expiresIn || 3600
    };
  }

  @Delete(':key')
  @ApiOperation({ summary: 'Deletar vídeo' })
  @ApiResponse({
    status: 200,
    description: 'Vídeo deletado com sucesso'
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado'
  })
  async deleteVideo(
    @Param('key') key: string,
    @Query('userId') userId: string
  ) {
    if (!userId) {
      throw new BadRequestException('userId é obrigatório');
    }

    await this.uploadService.deleteVideo(key, userId);

    return {
      message: 'Vídeo deletado com sucesso',
      key
    };
  }

  @Post('cleanup')
  @ApiOperation({ summary: 'Cleanup de arquivos antigos (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Cleanup executado',
    schema: {
      example: {
        deletedCount: 42,
        olderThanDays: 30
      }
    }
  })
  async cleanup(@Query('olderThanDays') olderThanDays?: number) {
    const days = olderThanDays || 30;
    const deletedCount = await this.uploadService.cleanupOldUploads(days);

    return {
      deletedCount,
      olderThanDays: days
    };
  }
}
