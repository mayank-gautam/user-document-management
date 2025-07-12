import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let repo: jest.Mocked<Repository<User>>;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword',
    name: 'Test User',
    roles: ['viewer'],
    createdAt: new Date(),
    refreshToken: null
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a user successfully', async () => {
      repo.findOne.mockResolvedValue(null);
      repo.create.mockReturnValue(mockUser);
      repo.save.mockResolvedValue(mockUser);

      const result = await service.create({
        email: mockUser.email,
        password: mockUser.password,
        name: mockUser.name,
        roles: mockUser.roles,
      });

      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        roles: mockUser.roles,
        createdAt: mockUser.createdAt,
      });
    });

    it('should throw conflict error if email exists', async () => {
      repo.findOne.mockResolvedValue(mockUser);

      await expect(
        service.create({
          email: mockUser.email,
          password: mockUser.password,
          name: mockUser.name,
          roles: mockUser.roles,
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findByEmail', () => {
    it('should return a user', async () => {
      repo.findOne.mockResolvedValue(mockUser);
      const user = await service.findByEmail(mockUser.email);
      expect(user).toEqual(mockUser);
    });

    it('should return null if no user', async () => {
      repo.findOne.mockResolvedValue(null);
      const user = await service.findByEmail('none@example.com');
      expect(user).toBeNull();
    });
  });

  describe('findById', () => {
    it('should return user if found', async () => {
      repo.findOne.mockResolvedValue(mockUser);
      const user = await service.findById(mockUser.id);
      expect(user).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        roles: mockUser.roles,
        createdAt: mockUser.createdAt,
      });
    });

    it('should throw if not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
    });
  });
});
