/**
 * Workers Module
 *
 * Registra workers BullMQ e serviços relacionados
 */

import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { HybridAnalysisWorker } from './hybrid-analysis.worker';
import { MetricsCollectorService } from './metrics-collector.service';
import { hybridVideoAnalysisQueueConfig } from './queue.config';
import { AnalysisModule } from '../modules/analysis/analysis.module';
import { CacheModule } from '../modules/cache/cache.module';
import { ProtocolsModule } from '../modules/protocols/protocols.module';
import { PrismaModule } from '../modules/prisma/prisma.module';

@Module({
  imports: [
    // Register BullMQ queue
    BullModule.registerQueue(hybridVideoAnalysisQueueConfig),

    // Import feature modules
    AnalysisModule,
    CacheModule,
    ProtocolsModule,
    PrismaModule,
  ],
  providers: [
    HybridAnalysisWorker,
    MetricsCollectorService,
  ],
  exports: [
    MetricsCollectorService,
  ],
})
export class WorkersModule {}
