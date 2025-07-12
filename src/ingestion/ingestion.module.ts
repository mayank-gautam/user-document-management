import { Module } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { DocumentsModule } from '../documents/documents.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngestionJob } from './entities/ingestion-job.entity';

@Module({
  imports: [
    DocumentsModule,
    TypeOrmModule.forFeature([IngestionJob]),
  ],
  providers: [IngestionService],
})
export class IngestionModule {}
