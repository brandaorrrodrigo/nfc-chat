import { Module } from '@nestjs/common';
import { ProtocolMatcherService } from './protocol-matcher.service';

@Module({
  providers: [ProtocolMatcherService],
  exports: [ProtocolMatcherService],
})
export class ProtocolsModule {}
