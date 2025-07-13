import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
    let controller: UsersController;
    let usersService: UsersService;

    const mockUsersService = {
        findAll: jest.fn(),
        updateRoles: jest.fn(),
        delete: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {
                    provide: UsersService,
                    useValue: mockUsersService,
                },
            ],
        }).compile();

        controller = module.get<UsersController>(UsersController);
        usersService = module.get<UsersService>(UsersService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('findAll', () => {
        it('should return all users', async () => {
            const users = [{ id: 1 }, { id: 2 }];
            mockUsersService.findAll.mockResolvedValue(users);

            const result = await controller.findAll();
            expect(result).toBe(users);
            expect(usersService.findAll).toHaveBeenCalled();
        });
    });

    describe('updateRoles', () => {
        it('should update user roles', async () => {
            const updatedUser = { id: 1, roles: ['admin'] };
            const dto = { roles: ['admin'] };

            mockUsersService.updateRoles.mockResolvedValue(updatedUser);

            const result = await controller.updateRoles('1', dto);

            expect(result).toBe(updatedUser);
            expect(mockUsersService.updateRoles).toHaveBeenCalledWith(1, dto.roles);
        });
    });


    describe('delete', () => {
        it('should delete a user', async () => {
            const deleted = { deleted: true };
            mockUsersService.delete.mockResolvedValue(deleted);

            const result = await controller.delete('2');
            expect(result).toBe(deleted);
            expect(usersService.delete).toHaveBeenCalledWith(2);
        });
    });
});
