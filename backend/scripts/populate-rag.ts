/**
 * Script para popular o RAG com documentos científicos iniciais
 *
 * Uso:
 *   npm run populate-rag
 *   npm run populate-rag -- --path=./scientific-papers
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { DocumentProcessorService } from '../src/modules/analysis/rag/document-processor.service';
import { VectorStoreService } from '../src/modules/analysis/rag/vector-store.service';
import * as path from 'path';

async function bootstrap() {
  console.log('🚀 Starting RAG population...\n');

  // Criar aplicação NestJS
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['log', 'error', 'warn'],
  });

  // Obter serviços
  const documentProcessor = app.get(DocumentProcessorService);
  const vectorStore = app.get(VectorStoreService);

  try {
    // Verificar health do Qdrant
    console.log('📊 Checking Qdrant connection...');
    const isHealthy = await vectorStore.healthCheck();

    if (!isHealthy) {
      throw new Error('Qdrant is not healthy. Please ensure Qdrant is running.');
    }

    console.log('✓ Qdrant connection OK\n');

    // Determinar caminho dos documentos
    const args = process.argv.slice(2);
    const pathArg = args.find((arg) => arg.startsWith('--path='));
    const documentsPath = pathArg
      ? pathArg.split('=')[1]
      : path.join(__dirname, '../../scientific-papers');

    console.log(`📁 Documents path: ${documentsPath}\n`);

    // Verificar status antes
    const statsBefore = await vectorStore.getCollectionInfo('biomechanics_knowledge');
    console.log(
      `📈 Current status: ${statsBefore?.points_count || 0} chunks in database\n`,
    );

    // Processar documentos
    console.log('⚙️  Processing documents...\n');
    await documentProcessor.processAndIndexDocuments(documentsPath);

    // Verificar status depois
    const statsAfter = await vectorStore.getCollectionInfo('biomechanics_knowledge');
    const chunksAdded = (statsAfter?.points_count || 0) - (statsBefore?.points_count || 0);

    console.log('\n✅ RAG population completed!');
    console.log(`📊 Total chunks in database: ${statsAfter?.points_count || 0}`);
    console.log(`➕ Chunks added: ${chunksAdded}`);

    // Estatísticas do repositório
    const repoStats = await documentProcessor.getRepositoryStats();
    console.log('\n📚 Repository Statistics:');
    console.log(`  - Estimated documents: ${repoStats.totalDocuments}`);
    console.log(`  - Total chunks: ${repoStats.totalChunks}`);
    console.log(`  - Avg chunks per document: ${repoStats.avgChunksPerDoc.toFixed(1)}`);
  } catch (error) {
    console.error('\n❌ Error during RAG population:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrap();
