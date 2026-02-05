/**
 * Módulo RAG
 * Agrupa todos os serviços relacionados ao RAG
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RagService } from './rag.service';
import { EmbeddingService } from './embedding.service';
import { VectorStoreService } from './vector-store.service';
import { DocumentProcessorService } from './document-processor.service';
import { OllamaModule } from '../ollama/ollama.module';

@Module({
  imports: [ConfigModule, OllamaModule],
  providers: [RagService, EmbeddingService, VectorStoreService, DocumentProcessorService],
  exports: [RagService, EmbeddingService, VectorStoreService, DocumentProcessorService],
})
export class RagModule {}
