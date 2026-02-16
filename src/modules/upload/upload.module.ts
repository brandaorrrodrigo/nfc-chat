import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { LocalStorageService } from './storage/local-storage.service';
import { S3StorageService } from './storage/s3-storage.service';
import { ThumbnailProcessor } from './processors/thumbnail.processor';
import { VideoMetadataProcessor } from './processors/video-metadata.processor';
import { QuotaGuard } from './guards/quota.guard';
import { PrismaModule } from '../biomechanical/prisma.module';
import * as multer from 'multer';
import * as path from 'path';

@Module({
  imports: [
    PrismaModule,
    MulterModule.register({
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = process.env.TEMP_DIR || path.join(process.cwd(), 'data/temp');
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const ext = path.extname(file.originalname);
          cb(null, file.fieldname + '-' + uniqueSuffix + ext);
        }
      }),
      limits: {
        fileSize: parseInt(process.env.MAX_VIDEO_SIZE || '104857600'), // 100MB default
      },
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];

        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Tipo de arquivo não suportado. Use: MP4, WebM, MOV ou AVI'), false);
        }
      }
    })
  ],
  controllers: [UploadController],
  providers: [
    UploadService,
    LocalStorageService,
    S3StorageService,
    ThumbnailProcessor,
    VideoMetadataProcessor,
    QuotaGuard
  ],
  exports: [UploadService]
})
export class UploadModule {}
