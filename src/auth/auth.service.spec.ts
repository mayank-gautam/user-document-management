import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;


  const mockUser = {
    id: 1,
    email: 'user@example.com',
    password: 'hashedpassword',
    name: 'Test User',
    roles: ['viewer'],
  };

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };

    jwtService = {
      signAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should return user without password if credentials are valid', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);

      const result = await authService.validateUser('user@example.com', 'password123');

      expect(usersService.findByEmail).toHaveBeenCalledWith('user@example.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', mockUser.password);
      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        roles: mockUser.roles,
      });
    });

    it('should return null if password is invalid', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false);

      const result = await authService.validateUser('user@example.com', 'wrongpassword');

      expect(usersService.findByEmail).toHaveBeenCalledWith('user@example.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', mockUser.password);
      expect(result).toBeNull();
    });

    it('should return null if user is not found', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);

      const result = await authService.validateUser('nouser@example.com', 'password123');

      expect(usersService.findByEmail).toHaveBeenCalledWith('nouser@example.com');
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should handle bcrypt comparison errors', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => {
        throw new Error('Bcrypt error');
      });

      await expect(authService.validateUser('user@example.com', 'password123'))
        .rejects.toThrow('Bcrypt error');
    });
  });

  describe('login', () => {
    it('should return access_token if user is valid', async () => {
      const payload = {
        sub: mockUser.id,
        email: mockUser.email,
        roles: mockUser.roles,
      };
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);
      (jwtService.signAsync as jest.Mock).mockResolvedValue('token123');

      const result = await authService.login(mockUser);

      expect(jwtService.signAsync).toHaveBeenCalledWith(payload);
      expect(result).toEqual({ access_token: 'token123' });
    });

    it('should handle JWT signing errors', async () => {
      (jwtService.signAsync as jest.Mock).mockRejectedValue(new Error('Invalid credentials'));

      await expect(authService.login(mockUser))
        .rejects.toThrow('Invalid credentials');
    });
  });
});