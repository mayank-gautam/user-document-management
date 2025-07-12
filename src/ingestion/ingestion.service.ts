import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IngestionJob } from './entities/ingestion-job.entity';
import { Repository } from 'typeorm';
import { DocumentsService } from '../documents/documents.service';

@Injectable()
export class IngestionService {
  constructor(
    @InjectRepository(IngestionJob)
    private readonly ingestionRepo: Repository<IngestionJob>,
    private readonly documentsService: DocumentsService,
  ) {}

  async trigger(documentId: number) {
    const doc = await this.documentsService.findById(documentId);
    if (!doc) throw new NotFoundException('Document not found');

    const job = this.ingestionRepo.create({ documentId, status: 'pending' });
    await this.ingestionRepo.save(job);

    setTimeout(async () => {
      job.status = Math.random() < 0.9 ? 'success' : 'failed';
      await this.ingestionRepo.save(job);
    }, 2000);

    return job;
  }

  async findAllJobs() {
    return this.ingestionRepo.find({ relations: ['document'] });
  }

  async findOneJob(id: number) {
    return this.ingestionRepo.findOne({ where: { id }, relations: ['document'] });
  }
}
