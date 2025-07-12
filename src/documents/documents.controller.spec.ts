import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsController } from './documents.controller';
import { DeleteResult } from 'typeorm';
import { DocumentResponseDto } from './dto/document-response.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { DocumentsService } from './documents.service';
import { Document } from './document.entity';
import { User } from 'src/users/user.entity';

describe('DocumentsController', () => {
    let controller: DocumentsController;
    let service: DocumentsService;

    const mockUser: User = {
        id: 1,
        email: 'user@example.com',
        name: 'Test User',
        roles: ['viewer'],
        createdAt: new Date(),
        password: "acb",
        refreshToken: "111"
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [DocumentsController],
            providers: [
                {
                    provide: DocumentsService,
                    useValue: {
                        create: jest.fn(),
                        findAll: jest.fn(),
                        findById: jest.fn(),
                        update: jest.fn(),
                        delete: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<DocumentsController>(DocumentsController);
        service = module.get<DocumentsService>(DocumentsService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should call service.create and return a document', async () => {
            const mockDoc: Document = {
                id: 1,
                title: 'Doc Title',
                filename: 'pending',
                ownerId: mockUser.id,
                uploadedAt: new Date(),
                owner: mockUser,
            };

             jest.spyOn(service, 'create').mockResolvedValue(mockDoc);

            const req = { user: { id: 1 } };

            const result = await controller.create('Doc Title', req as any);

            expect(service.create).toHaveBeenCalledWith('Doc Title', 'pending', 1);
            expect(result).toEqual(mockDoc);

            expect(service.create).toHaveBeenCalledWith('Doc Title', 'pending', 1);
            expect(result).toEqual(expect.objectContaining({
                id: 1,
                title: 'Doc Title',
                filename: 'pending',
            }));
        });
    });

    describe('findAll', () => {
        it('should return all documents', async () => {
            const mockDocs: DocumentResponseDto[] = [
                {
                    id: 1,
                    title: 'Doc1',
                    filename: 'doc1.pdf',
                    uploadedAt: new Date(),
                    owner: mockUser,
                },
            ];

            jest.spyOn(service, 'findAll').mockResolvedValue(mockDocs);

            const result = await controller.findAll();

            expect(service.findAll).toHaveBeenCalled();
            expect(result).toEqual(expect.arrayContaining([
                expect.objectContaining({ id: 1, title: 'Doc1' }),
            ]));
        });
    });

    describe('delete', () => {
        it('should delete a document and return DeleteResult', async () => {
            const mockDeleteResult: DeleteResult = {
                affected: 1,
                raw: {},
            };

            jest.spyOn(service, 'delete').mockResolvedValue(mockDeleteResult);

            const result = await controller.delete('1');

            expect(service.delete).toHaveBeenCalledWith(1);
            expect(result).toEqual({ affected: 1, raw: {} });
        });
    });
});
