import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IngestionService } from './ingestion.service';
import { IngestionController } from './ingestion.controller'; // ✅ Make sure this is imported
import { DocumentsModule } from '../documents/documents.module';
import { IngestionJob } from './entities/ingestion-job.entity';

@Module({
  imports: [
    DocumentsModule,
    TypeOrmModule.forFeature([IngestionJob]),
  ],
  controllers: [IngestionController],
  providers: [IngestionService],
})
export class IngestionModule {}
