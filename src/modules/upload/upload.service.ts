import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../biomechanical/prisma.service';
import { IStorageService } from './storage/storage.interface';
import { LocalStorageService } from './storage/local-storage.service';
import { S3StorageService } from './storage/s3-storage.service';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private readonly storageService: IStorageService;

  constructor(
    private prisma: PrismaService,
    private localStorage: LocalStorageService,
    private s3Storage: S3StorageService
  ) {
    // Escolher storage baseado em variável de ambiente
    const storageType = process.env.STORAGE_TYPE || 'local';

    this.storageService = storageType === 's3'
      ? this.s3Storage
      : this.localStorage;

    this.logger.log(`Upload Service inicializado com storage: ${storageType}`);
  }

  /**
   * Upload de vídeo com validação de quota
   */
  async uploadVideo(
    file: Express.Multer.File,
    userId: string
  ) {
    try {
      this.logger.log(`Iniciando upload de vídeo para usuário ${userId}`);

      // Validar quota do usuário
      await this.validateUserQuota(userId, file.size);

      // Upload do vídeo
      const uploadResult = await this.storageService.upload({
        file,
        userId,
        metadata: {
          originalName: file.originalname,
          uploadedAt: new Date().toISOString()
        }
      });

      this.logger.log(`Upload concluído: ${uploadResult.key}`);

      return uploadResult;

    } catch (error) {
      this.logger.error('Erro no upload:', error);
      throw error;
    }
  }

  /**
   * Validar quota do usuário
   */
  private async validateUserQuota(userId: string, fileSize: number): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        subscription_tier: true
      }
    });

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    // Definir limites por plano
    const quotaLimits: Record<string, number> = {
      free: 500 * 1024 * 1024,        // 500MB
      premium: 5 * 1024 * 1024 * 1024,  // 5GB
      premium_plus: 100 * 1024 * 1024 * 1024  // 100GB
    };

    const quotaLimit = quotaLimits[user.subscription_tier] || quotaLimits.free;
    const currentUsage = await this.storageService.getUserQuotaUsage(userId);

    if (currentUsage + fileSize > quotaLimit) {
      const limitMB = (quotaLimit / 1024 / 1024).toFixed(0);
      const usageMB = (currentUsage / 1024 / 1024).toFixed(0);

      throw new BadRequestException(
        `Quota de armazenamento excedida. Limite: ${limitMB}MB, Uso atual: ${usageMB}MB`
      );
    }
  }

  /**
   * Deletar vídeo
   */
  async deleteVideo(key: string, userId: string): Promise<void> {
    // Verificar se arquivo pertence ao usuário
    if (!key.startsWith(`${userId}/`)) {
      throw new BadRequestException('Acesso negado');
    }

    await this.storageService.delete({ key });
  }

  /**
   * Obter URL de acesso
   */
  async getVideoUrl(key: string, expiresIn?: number): Promise<string> {
    return await this.storageService.getUrl({ key, expiresIn });
  }

  /**
   * Cleanup de arquivos antigos
   */
  async cleanupOldUploads(olderThanDays: number = 30): Promise<number> {
    this.logger.log(`Iniciando cleanup de uploads com mais de ${olderThanDays} dias`);

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    const oldAnalyses = await this.prisma.videoAnalysis.findMany({
      where: {
        createdAt: { lt: cutoffDate },
        videoPath: { not: null }
      },
      select: { videoPath: true }
    });

    let deletedCount = 0;

    for (const analysis of oldAnalyses) {
      try {
        if (analysis.videoPath) {
          const key = analysis.videoPath.split('/uploads/')[1];
          if (key) {
            await this.storageService.delete({ key });
            deletedCount++;
          }
        }
      } catch (error) {
        this.logger.error(`Erro ao deletar ${analysis.videoPath}:`, error);
      }
    }

    this.logger.log(`Cleanup concluído: ${deletedCount} arquivos deletados`);
    return deletedCount;
  }
}
