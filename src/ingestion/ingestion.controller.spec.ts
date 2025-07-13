import { Test, TestingModule } from '@nestjs/testing';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';

describe('IngestionController', () => {
  let controller: IngestionController;
  let ingestionService: IngestionService;

  const mockIngestionService = {
    trigger: jest.fn(),
    findAllJobs: jest.fn(),
    findOneJob: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngestionController],
      providers: [
        {
          provide: IngestionService,
          useValue: mockIngestionService,
        },
      ],
    }).compile();

    controller = module.get<IngestionController>(IngestionController);
    ingestionService = module.get<IngestionService>(IngestionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('trigger', () => {
    it('should call ingestionService.trigger with number param', async () => {
      const mockJob = { id: 1, documentId: 5, status: 'pending' };
      mockIngestionService.trigger.mockResolvedValue(mockJob);

      const result = await controller.trigger('5');
      expect(result).toBe(mockJob);
      expect(mockIngestionService.trigger).toHaveBeenCalledWith(5);
    });
  });

  describe('findAllJobs', () => {
    it('should return all jobs', async () => {
      const mockJobs = [{ id: 1 }, { id: 2 }];
      mockIngestionService.findAllJobs.mockResolvedValue(mockJobs);

      const result = await controller.findAllJobs();
      expect(result).toBe(mockJobs);
      expect(mockIngestionService.findAllJobs).toHaveBeenCalled();
    });
  });

  describe('findOneJob', () => {
    it('should return a job by id', async () => {
      const mockJob = { id: 2, status: 'success' };
      mockIngestionService.findOneJob.mockResolvedValue(mockJob);

      const result = await controller.findOneJob('2');
      expect(result).toBe(mockJob);
      expect(mockIngestionService.findOneJob).toHaveBeenCalledWith(2);
    });
  });
});
