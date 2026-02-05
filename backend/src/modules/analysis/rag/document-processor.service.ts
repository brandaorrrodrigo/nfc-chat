/**
 * Serviço de processamento de documentos científicos
 * Chunk, embed e indexa documentos no vector store
 */

import { Injectable, Logger } from '@nestjs/common';
import { EmbeddingService } from './embedding.service';
import { VectorStoreService } from './vector-store.service';
import { IScientificDocument, IQdrantPoint } from '../interfaces/rag.interface';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DocumentProcessorService {
  private readonly logger = new Logger(DocumentProcessorService.name);
  private readonly chunkSize: number = 400; // palavras por chunk
  private readonly overlap: number = 50; // overlap entre chunks

  constructor(
    private embeddingService: EmbeddingService,
    private vectorStore: VectorStoreService,
  ) {}

  /**
   * Processa e indexa todos os documentos de um diretório
   */
  async processAndIndexDocuments(documentsPath: string): Promise<void> {
    const startTime = Date.now();

    try {
      // Verificar se diretório existe
      if (!fs.existsSync(documentsPath)) {
        throw new Error(`Documents directory not found: ${documentsPath}`);
      }

      const files = fs.readdirSync(documentsPath);
      const jsonFiles = files.filter((f) => f.endsWith('.json'));

      this.logger.log(`Found ${jsonFiles.length} documents to process`);

      let totalChunks = 0;

      for (const file of jsonFiles) {
        const filePath = path.join(documentsPath, file);

        try {
          const content = fs.readFileSync(filePath, 'utf-8');
          const document: IScientificDocument = JSON.parse(content);

          const chunks = await this.processDocument(document);
          totalChunks += chunks;

          this.logger.log(`✓ Processed: ${document.title} (${chunks} chunks)`);
        } catch (error) {
          this.logger.error(`✗ Failed to process ${file}: ${error.message}`);
        }
      }

      const totalTime = Date.now() - startTime;
      this.logger.log(
        `Processing completed: ${jsonFiles.length} documents, ${totalChunks} chunks in ${totalTime}ms`,
      );
    } catch (error) {
      this.logger.error(`Document processing failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Processa um documento individual
   */
  async processDocument(document: IScientificDocument): Promise<number> {
    try {
      // 1. Dividir em chunks com overlap
      const chunks = this.chunkDocument(document.content, this.chunkSize, this.overlap);

      this.logger.debug(`Document chunked into ${chunks.length} pieces`);

      // 2. Gerar embeddings para todos os chunks
      const embeddings = await this.embeddingService.generateEmbeddings(chunks);

      this.logger.debug(`Generated ${embeddings.length} embeddings`);

      // 3. Criar points para Qdrant
      const points: IQdrantPoint[] = chunks.map((chunk, idx) => ({
        id: this.generatePointId(document.doi, idx),
        vector: embeddings[idx],
        payload: {
          text: chunk,
          metadata: {
            title: document.title,
            authors: document.authors,
            year: document.year,
            journal: document.journal,
            doi: document.doi,
            evidence_level: document.metadata.evidence_level,
            deviation_type: document.metadata.deviation_types[0], // Primary
            exercise_category: document.metadata.exercise_categories[0], // Primary
            chunk_index: idx,
          },
        },
      }));

      // 4. Inserir no vector store
      await this.vectorStore.upsert('biomechanics_knowledge', points);

      return points.length;
    } catch (error) {
      this.logger.error(`Failed to process document ${document.title}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Divide texto em chunks com overlap
   */
  private chunkDocument(text: string, chunkSize: number, overlap: number): string[] {
    // Limpar e normalizar texto
    const cleanText = text
      .replace(/\s+/g, ' ') // Múltiplos espaços -> 1 espaço
      .replace(/\n+/g, '\n') // Múltiplas quebras -> 1 quebra
      .trim();

    const words = cleanText.split(/\s+/);
    const chunks: string[] = [];

    for (let i = 0; i < words.length; i += chunkSize - overlap) {
      const chunk = words.slice(i, i + chunkSize).join(' ');

      // Só adicionar chunks com conteúdo significativo
      if (chunk.length > 100) {
        chunks.push(chunk);
      }
    }

    return chunks;
  }

  /**
   * Gera ID único para ponto no vector store
   */
  private generatePointId(doi: string, chunkIndex: number): string {
    // Normalizar DOI para usar em ID
    const normalizedDoi = doi.replace(/[^a-zA-Z0-9]/g, '_');
    return `${normalizedDoi}_chunk_${chunkIndex}`;
  }

  /**
   * Remove documento do vector store
   */
  async removeDocument(doi: string): Promise<void> {
    try {
      // Buscar todos os pontos do documento
      const normalizedDoi = doi.replace(/[^a-zA-Z0-9]/g, '_');
      const prefix = `${normalizedDoi}_chunk_`;

      // Qdrant não tem busca por prefix, então vamos buscar com filtro
      const searchResults = await this.vectorStore.search({
        collectionName: 'biomechanics_knowledge',
        queryVector: new Array(768).fill(0), // Dummy vector
        limit: 1000,
        filter: {
          doi: doi,
        },
      });

      const pointIds = searchResults.map((r) => r.id);

      if (pointIds.length > 0) {
        await this.vectorStore.deletePoints('biomechanics_knowledge', pointIds);
        this.logger.log(`Removed ${pointIds.length} chunks for document ${doi}`);
      } else {
        this.logger.warn(`No chunks found for document ${doi}`);
      }
    } catch (error) {
      this.logger.error(`Failed to remove document ${doi}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Reprocessa documento (remove + adiciona novamente)
   */
  async reprocessDocument(document: IScientificDocument): Promise<void> {
    this.logger.log(`Reprocessing document: ${document.title}`);

    await this.removeDocument(document.doi);
    await this.processDocument(document);

    this.logger.log(`Document ${document.title} reprocessed successfully`);
  }

  /**
   * Valida documento antes de processar
   */
  private validateDocument(document: IScientificDocument): boolean {
    const required = ['title', 'authors', 'year', 'doi', 'content', 'metadata'];

    for (const field of required) {
      if (!document[field]) {
        this.logger.error(`Document missing required field: ${field}`);
        return false;
      }
    }

    if (!document.metadata.evidence_level) {
      this.logger.error('Document missing evidence_level');
      return false;
    }

    if (!document.metadata.deviation_types || document.metadata.deviation_types.length === 0) {
      this.logger.error('Document missing deviation_types');
      return false;
    }

    if (
      !document.metadata.exercise_categories ||
      document.metadata.exercise_categories.length === 0
    ) {
      this.logger.error('Document missing exercise_categories');
      return false;
    }

    if (document.content.length < 500) {
      this.logger.warn('Document content is very short (< 500 chars)');
    }

    return true;
  }

  /**
   * Estatísticas do repositório
   */
  async getRepositoryStats(): Promise<{
    totalDocuments: number;
    totalChunks: number;
    avgChunksPerDoc: number;
  }> {
    try {
      const info = await this.vectorStore.getCollectionInfo('biomechanics_knowledge');

      // Contar documentos únicos (buscar todos DOIs)
      // Isso é uma aproximação, pois Qdrant não tem agregação nativa
      const totalChunks = info.points_count || 0;

      // Estimativa: assumir média de 15 chunks por documento
      const estimatedDocs = Math.round(totalChunks / 15);

      return {
        totalDocuments: estimatedDocs,
        totalChunks,
        avgChunksPerDoc: estimatedDocs > 0 ? totalChunks / estimatedDocs : 0,
      };
    } catch (error) {
      this.logger.error(`Failed to get repository stats: ${error.message}`);
      return {
        totalDocuments: 0,
        totalChunks: 0,
        avgChunksPerDoc: 0,
      };
    }
  }
}
