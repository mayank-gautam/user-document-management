import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsService } from './documents.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './document.entity';
import { User } from '../users/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('DocumentsService', () => {
  let service: DocumentsService;
  let repo: jest.Mocked<Repository<Document>>;

  const mockUser: User = {
    id: 1,
    email: 'user@example.com',
    password: 'hashed',
    name: 'Test User',
    roles: ['viewer'],
    refreshToken: '',
    createdAt: new Date('2025-07-12T19:06:36.247Z'),
  };

  const mockDoc: Document = {
    id: 1,
    title: 'Doc 1',
    filename: 'file.pdf',
    uploadedAt: new Date('2025-07-12T19:06:36.247Z'),
    ownerId: mockUser.id,
    owner: mockUser,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        {
          provide: getRepositoryToken(Document),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
    repo = module.get(getRepositoryToken(Document));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a document', async () => {
      repo.create.mockReturnValue(mockDoc);
      repo.save.mockResolvedValue(mockDoc);

      const result = await service.create('Doc 1', 'file.pdf', mockUser.id);

      expect(repo.create).toHaveBeenCalledWith({
        title: 'Doc 1',
        filename: 'file.pdf',
        ownerId: mockUser.id,
      });

      expect(repo.save).toHaveBeenCalledWith(mockDoc);
      expect(result).toEqual(mockDoc);
    });
  });

  describe('findById', () => {
    it('should return document if found', async () => {
      repo.findOne.mockResolvedValue(mockDoc);

      const result = await service.findById(mockDoc.id);

      expect(repo.findOne).toHaveBeenCalledWith({
        where: { id: mockDoc.id },
        relations: ['owner'],
      });

      expect(result).toMatchObject({
        id: mockDoc.id,
        title: mockDoc.title,
        filename: mockDoc.filename,
        owner: {
          id: mockUser.id,
          email: mockUser.email,
          roles: mockUser.roles,
        },
      });
    });

    it('should throw NotFoundException if document not found', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update title and return updated document', async () => {
      const updatedDoc = { ...mockDoc, title: 'Updated' };
      repo.findOne.mockResolvedValue(mockDoc);
      repo.save.mockResolvedValue(updatedDoc);
      const result = await service.update(mockDoc.id, 'Updated');
      expect(result.title).toBe('Updated');
    });
  });



  describe('delete', () => {
    it('should delete the document and return result', async () => {
      const deleteResult = { affected: 1, raw: {} };
      repo.delete.mockResolvedValue(deleteResult);

      const result = await service.delete(mockDoc.id);

      expect(repo.delete).toHaveBeenCalledWith(mockDoc.id);
      expect(result).toEqual(deleteResult);
    });
  });

  describe('findAll', () => {
    it('should return all documents sorted by uploadedAt DESC', async () => {
      repo.find.mockResolvedValue([mockDoc]);

      const result = await service.findAll();

      expect(repo.find).toHaveBeenCalledWith({
        relations: ['owner'],
        order: { uploadedAt: 'DESC' },
      });

      expect(result).toMatchObject([
        {
          id: mockDoc.id,
          title: mockDoc.title,
          filename: mockDoc.filename,
          uploadedAt: mockDoc.uploadedAt,
          owner: {
            id: mockUser.id,
            email: mockUser.email,
            name: mockUser.name,
            roles: mockUser.roles,
            createdAt: mockUser.createdAt,
          },
        },
      ]);
    });
  });

});
