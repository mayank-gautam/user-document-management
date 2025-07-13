import { Test, TestingModule } from '@nestjs/testing';
import { IngestionService } from './ingestion.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { IngestionJob } from './entities/ingestion-job.entity';
import { DocumentsService } from '../documents/documents.service';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('IngestionService', () => {
  let service: IngestionService;
  let ingestionRepo: Repository<IngestionJob>;
  let documentsService: DocumentsService;

  const mockIngestionRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockDocumentsService = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngestionService,
        { provide: getRepositoryToken(IngestionJob), useValue: mockIngestionRepo },
        { provide: DocumentsService, useValue: mockDocumentsService },
      ],
    }).compile();

    service = module.get<IngestionService>(IngestionService);
    ingestionRepo = module.get(getRepositoryToken(IngestionJob));
    documentsService = module.get(DocumentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('trigger', () => {
    it('should throw NotFoundException if document not found', async () => {
      mockDocumentsService.findById.mockResolvedValue(null);

      await expect(service.trigger(1)).rejects.toThrow(NotFoundException);
      expect(mockDocumentsService.findById).toHaveBeenCalledWith(1);
    });

    it('should create and save a job with pending status and update it after 2s', async () => {
      jest.useFakeTimers();

      const mockDoc = { id: 1 };
      const mockJob = { id: 100, documentId: 1, status: 'pending' };

      mockDocumentsService.findById.mockResolvedValue(mockDoc);
      mockIngestionRepo.create.mockReturnValue(mockJob);
      mockIngestionRepo.save.mockResolvedValue(mockJob);

      const result = await service.trigger(1);

      expect(mockDocumentsService.findById).toHaveBeenCalledWith(1);
      expect(mockIngestionRepo.create).toHaveBeenCalledWith({ documentId: 1, status: 'pending' });
      expect(mockIngestionRepo.save).toHaveBeenCalledWith(mockJob);
      expect(result).toBe(mockJob);

      // simulate setTimeout
      jest.advanceTimersByTime(2000);
      expect(mockIngestionRepo.save).toHaveBeenCalledTimes(2); // one initial, one after timeout

      jest.useRealTimers();
    });
  });

  describe('findAllJobs', () => {
    it('should return all jobs with document relation', async () => {
      const jobs = [{ id: 1 }, { id: 2 }];
      mockIngestionRepo.find.mockResolvedValue(jobs);

      const result = await service.findAllJobs();
      expect(result).toBe(jobs);
      expect(mockIngestionRepo.find).toHaveBeenCalledWith({ relations: ['document'] });
    });
  });

  describe('findOneJob', () => {
    it('should return job by id with document relation', async () => {
      const job = { id: 1 };
      mockIngestionRepo.findOne.mockResolvedValue(job);

      const result = await service.findOneJob(1);
      expect(result).toBe(job);
      expect(mockIngestionRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['document'],
      });
    });
  });
});
