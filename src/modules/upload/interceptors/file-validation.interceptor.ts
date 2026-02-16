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
