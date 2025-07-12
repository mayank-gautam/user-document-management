import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let repo: Repository<User>;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword',
    name: 'Test User',
    roles: ['viewer'],
  } as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a user successfully', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      jest.spyOn(repo, 'create').mockReturnValue(mockUser);
      jest.spyOn(repo, 'save').mockResolvedValue(mockUser);

      const result = await service.create({
        email: mockUser.email,
        password: mockUser.password,
        name: mockUser.name,
        roles: mockUser.roles,
      });

      expect(result).toEqual(mockUser);
    });

    it('should throw conflict error if email exists', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(mockUser);

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
      jest.spyOn(repo, 'findOne').mockResolvedValue(mockUser);
      expect(await service.findByEmail(mockUser.email)).toEqual(mockUser);
    });

    it('should return null if no user', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      expect(await service.findByEmail('none@example.com')).toBeNull();
    });
  });

  describe('update', () => {
    it('should update and save user', async () => {
      jest.spyOn(service, 'findById').mockResolvedValue(mockUser);
      jest.spyOn(repo, 'save').mockResolvedValue({ ...mockUser, name: 'Updated' });

      const result = await service.update(mockUser.id, { name: 'Updated' });
      expect(result['name']).toBe('Updated');
    });

    it('should throw if user not found', async () => {
      jest.spyOn(service, 'findById').mockRejectedValue(new NotFoundException());
      await expect(service.update(999, { name: 'Updated' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('findById', () => {
    it('should return user if found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(mockUser);
      expect(await service.findById(mockUser.id)).toEqual(mockUser);
    });

    it('should throw if not found', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
    });
  });
});