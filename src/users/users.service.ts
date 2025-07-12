import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserResponseDto } from './dto/user-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
  update(id: number, arg1: { name: string; }) {
      throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(user: Partial<User>): Promise<UserResponseDto> {
    const newUser = this.userRepo.create(user);
    const savedUser = await this.userRepo.save(newUser);
    return plainToInstance(UserResponseDto, savedUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async findById(id: number): Promise<UserResponseDto | null> {
    const user = await this.userRepo.findOne({ where: { id } });
    return user ? plainToInstance(UserResponseDto, user) : null;
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepo.find();
    return users.map(user => plainToInstance(UserResponseDto, user));
  }

  async updateRoles(id: number, roles: string[]): Promise<UserResponseDto> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    user.roles = roles;
    const updatedUser = await this.userRepo.save(user);
    return plainToInstance(UserResponseDto, updatedUser);
  }

  async updateRefreshToken(userId: number, hashedToken: string | null): Promise<void> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    user.refreshToken = hashedToken;
    await this.userRepo.save(user);
  }

  async delete(id: number): Promise<{ message: string }> {
    const result = await this.userRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
    return { message: 'User deleted successfully' };
  }
}
