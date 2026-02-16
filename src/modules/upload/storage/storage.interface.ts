export interface UploadOptions {
  file: Express.Multer.File;
  userId: string;
  filename?: string;
  contentType?: string;
  metadata?: Record<string, string>;
}

export interface UploadResult {
  key: string;           // Identificador único do arquivo
  url: string;           // URL de acesso
  size: number;          // Tamanho em bytes
  contentType: string;   // MIME type
  etag?: string;         // Hash do arquivo
  metadata?: Record<string, string>;
}

export interface DeleteOptions {
  key: string;
}

export interface GetUrlOptions {
  key: string;
  expiresIn?: number;    // Segundos (para presigned URLs)
}

export interface StreamOptions {
  key: string;
  range?: string;        // Para streaming parcial (ex: "bytes=0-1024")
}

export interface IStorageService {
  /**
   * Fazer upload de arquivo
   */
  upload(options: UploadOptions): Promise<UploadResult>;

  /**
   * Deletar arquivo
   */
  delete(options: DeleteOptions): Promise<void>;

  /**
   * Obter URL de acesso ao arquivo
   */
  getUrl(options: GetUrlOptions): Promise<string>;

  /**
   * Stream de arquivo
   */
  getStream(options: StreamOptions): Promise<NodeJS.ReadableStream>;

  /**
   * Verificar se arquivo existe
   */
  exists(key: string): Promise<boolean>;

  /**
   * Listar arquivos de um usuário
   */
  listUserFiles(userId: string): Promise<string[]>;

  /**
   * Obter tamanho total usado por um usuário
   */
  getUserQuotaUsage(userId: string): Promise<number>;
}
