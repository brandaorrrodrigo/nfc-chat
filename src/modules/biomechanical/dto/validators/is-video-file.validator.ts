import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import * as path from 'path';

export function IsVideoFile(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isVideoFile',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!value) return false;

          // Verificar se é um objeto de arquivo (Multer)
          if (typeof value === 'object' && value.mimetype) {
            const allowedMimeTypes = [
              'video/mp4',
              'video/webm',
              'video/quicktime',
              'video/x-msvideo'
            ];

            return allowedMimeTypes.includes(value.mimetype);
          }

          // Verificar extensão se for string (path)
          if (typeof value === 'string') {
            const ext = path.extname(value).toLowerCase();
            const allowedExtensions = ['.mp4', '.webm', '.mov', '.avi'];

            return allowedExtensions.includes(ext);
          }

          return false;
        },
        defaultMessage(args: ValidationArguments) {
          return 'Arquivo deve ser um vídeo válido (.mp4, .webm, .mov ou .avi)';
        },
      },
    });
  };
}
