import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as crypto from 'crypto';
import {
  IStorageService,
  UploadOptions,
  UploadResult,
  DeleteOptions,
  GetUrlOptions,
  StreamOptions
} from './storage.interface';

@Injectable()
export class LocalStorageService implements IStorageService {
  private readonly logger = new Logger(LocalStorageService.name);
  private readonly uploadDir: string;
  private readonly baseUrl: string;

  constructor() {
    this.uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'data/uploads');
    this.baseUrl = process.env.BASE_URL || 'http://localhost:3000';

    // Criar diretório de uploads se não existir
    fs.ensureDirSync(this.uploadDir);
  }

  async upload(options: UploadOptions): Promise<UploadResult> {
    try {
      // Gerar nome único
      const hash = crypto.randomBytes(16).toString('hex');
      const ext = path.extname(options.file.originalname);
      const filename = options.filename || `${hash}${ext}`;

      // Criar estrutura de diretórios por usuário
      const userDir = path.join(this.uploadDir, options.userId);
      await fs.ensureDir(userDir);

      const filepath = path.join(userDir, filename);

      // Mover arquivo do temp para destino final
      if (options.file.path) {
        await fs.move(options.file.path, filepath, { overwrite: true });
      } else if (options.file.buffer) {
        await fs.writeFile(filepath, options.file.buffer);
      } else {
        throw new Error('Arquivo inválido: sem path ou buffer');
      }

      // Calcular hash do arquivo
      const fileBuffer = await fs.readFile(filepath);
      const etag = crypto.createHash('md5').update(fileBuffer).digest('hex');

      const key = `${options.userId}/${filename}`;
      const url = `${this.baseUrl}/uploads/${key}`;

      this.logger.log(`Arquivo enviado: ${key}`);

      return {
        key,
        url,
        size: options.file.size,
        contentType: options.file.mimetype,
        etag,
        metadata: options.metadata
      };

    } catch (error) {
      this.logger.error('Erro ao fazer upload:', error);
      throw error;
    }
  }

  async delete(options: DeleteOptions): Promise<void> {
    try {
      const filepath = path.join(this.uploadDir, options.key);

      if (await fs.pathExists(filepath)) {
        await fs.remove(filepath);
        this.logger.log(`Arquivo deletado: ${options.key}`);
      } else {
        this.logger.warn(`Arquivo não encontrado: ${options.key}`);
      }

    } catch (error) {
      this.logger.error('Erro ao deletar arquivo:', error);
      throw error;
    }
  }

  async getUrl(options: GetUrlOptions): Promise<string> {
    // Para storage local, URL é sempre a mesma (não expira)
    return `${this.baseUrl}/uploads/${options.key}`;
  }

  async getStream(options: StreamOptions): Promise<NodeJS.ReadableStream> {
    const filepath = path.join(this.uploadDir, options.key);

    if (!await fs.pathExists(filepath)) {
      throw new Error(`Arquivo não encontrado: ${options.key}`);
    }

    // Suporte a range requests para streaming
    if (options.range) {
      const stats = await fs.stat(filepath);
      const parts = options.range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;

      return fs.createReadStream(filepath, { start, end });
    }

    return fs.createReadStream(filepath);
  }

  async exists(key: string): Promise<boolean> {
    const filepath = path.join(this.uploadDir, key);
    return await fs.pathExists(filepath);
  }

  async listUserFiles(userId: string): Promise<string[]> {
    const userDir = path.join(this.uploadDir, userId);

    if (!await fs.pathExists(userDir)) {
      return [];
    }

    const files = await fs.readdir(userDir);
    return files.map(file => `${userId}/${file}`);
  }

  async getUserQuotaUsage(userId: string): Promise<number> {
    const userDir = path.join(this.uploadDir, userId);

    if (!await fs.pathExists(userDir)) {
      return 0;
    }

    let totalSize = 0;
    const files = await fs.readdir(userDir);

    for (const file of files) {
      const filepath = path.join(userDir, file);
      const stats = await fs.stat(filepath);
      totalSize += stats.size;
    }

    return totalSize;
  }
}
