import { Injectable, Logger } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as crypto from 'crypto';
import * as path from 'path';
import * as fs from 'fs-extra';
import {
  IStorageService,
  UploadOptions,
  UploadResult,
  DeleteOptions,
  GetUrlOptions,
  StreamOptions
} from './storage.interface';

@Injectable()
export class S3StorageService implements IStorageService {
  private readonly logger = new Logger(S3StorageService.name);
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly region: string;

  constructor() {
    this.bucketName = process.env.S3_BUCKET_NAME!;
    this.region = process.env.S3_REGION || 'us-east-1';

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
      }
    });

    this.logger.log(`S3 Storage inicializado: bucket=${this.bucketName}, region=${this.region}`);
  }

  async upload(options: UploadOptions): Promise<UploadResult> {
    try {
      // Gerar chave única
      const hash = crypto.randomBytes(16).toString('hex');
      const ext = path.extname(options.file.originalname);
      const filename = options.filename || `${hash}${ext}`;
      const key = `uploads/${options.userId}/${filename}`;

      // Preparar buffer
      const buffer = options.file.buffer || await this.readFileBuffer(options.file.path!);

      // Metadados
      const metadata = {
        'original-name': options.file.originalname,
        'user-id': options.userId,
        ...options.metadata
      };

      // Upload para S3
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
        ContentType: options.contentType || options.file.mimetype,
        Metadata: metadata,
        ServerSideEncryption: 'AES256'
      });

      const response = await this.s3Client.send(command);

      // Gerar URL pública (se bucket for público) ou presigned URL
      const url = await this.getUrl({ key, expiresIn: 3600 });

      this.logger.log(`Arquivo enviado para S3: ${key}`);

      return {
        key,
        url,
        size: options.file.size,
        contentType: options.file.mimetype,
        etag: response.ETag,
        metadata
      };

    } catch (error) {
      this.logger.error('Erro ao fazer upload para S3:', error);
      throw error;
    }
  }

  async delete(options: DeleteOptions): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: options.key
      });

      await this.s3Client.send(command);
      this.logger.log(`Arquivo deletado do S3: ${options.key}`);

    } catch (error) {
      this.logger.error('Erro ao deletar arquivo do S3:', error);
      throw error;
    }
  }

  async getUrl(options: GetUrlOptions): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: options.key
      });

      // Gerar URL pré-assinada
      const expiresIn = options.expiresIn || 3600; // 1 hora default
      const url = await getSignedUrl(this.s3Client, command, { expiresIn });

      return url;

    } catch (error) {
      this.logger.error('Erro ao gerar URL pré-assinada:', error);
      throw error;
    }
  }

  async getStream(options: StreamOptions): Promise<NodeJS.ReadableStream> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: options.key,
        Range: options.range
      });

      const response = await this.s3Client.send(command);

      if (!response.Body) {
        throw new Error('Corpo da resposta vazio');
      }

      return response.Body as NodeJS.ReadableStream;

    } catch (error) {
      this.logger.error('Erro ao obter stream do S3:', error);
      throw error;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: key
      });

      await this.s3Client.send(command);
      return true;

    } catch (error: any) {
      if (error.name === 'NotFound') {
        return false;
      }
      throw error;
    }
  }

  async listUserFiles(userId: string): Promise<string[]> {
    try {
      const command = new ListObjectsV2Command({
        Bucket: this.bucketName,
        Prefix: `uploads/${userId}/`
      });

      const response = await this.s3Client.send(command);

      return response.Contents?.map(obj => obj.Key!) || [];

    } catch (error) {
      this.logger.error('Erro ao listar arquivos do usuário:', error);
      return [];
    }
  }

  async getUserQuotaUsage(userId: string): Promise<number> {
    try {
      const command = new ListObjectsV2Command({
        Bucket: this.bucketName,
        Prefix: `uploads/${userId}/`
      });

      const response = await this.s3Client.send(command);

      return response.Contents?.reduce((sum, obj) => sum + (obj.Size || 0), 0) || 0;

    } catch (error) {
      this.logger.error('Erro ao calcular quota do usuário:', error);
      return 0;
    }
  }

  private async readFileBuffer(filepath: string): Promise<Buffer> {
    return await fs.readFile(filepath);
  }
}
