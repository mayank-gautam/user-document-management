import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already in use');

    const hashed = await bcrypt.hash(dto.password, 10);
    const validRoles = ['admin', 'editor', 'viewer'];
    const filteredRoles = dto.roles?.filter(role => validRoles.includes(role)) ?? [];

    const roles = filteredRoles.length > 0 ? filteredRoles : ['viewer'];


    const user = await this.usersService.create({
      ...dto,
      password: hashed,
      roles,
    });

    const payload = { sub: user.id, roles: user.roles };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    const hashedRefresh = await bcrypt.hash(refreshToken, 10);

    await this.usersService.updateRefreshToken(user.id, hashedRefresh);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, roles: user.roles };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    const hashedRefresh = await bcrypt.hash(refreshToken, 10);

    await this.usersService.updateRefreshToken(user.id, hashedRefresh);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refresh(refreshToken: string) {
    let payload: any;
    try {
      payload = this.jwtService.verify(refreshToken);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.usersService.findById(payload.sub);
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isMatch) {
      throw new UnauthorizedException('Refresh token mismatch');
    }

    const newPayload = { sub: user.id, roles: user.roles };
    const newAccessToken = this.jwtService.sign(newPayload, { expiresIn: '15m' });

    return { access_token: newAccessToken };
  }

  async logout(userId: number) {
    await this.usersService.updateRefreshToken(userId, null);
    return { message: 'Logged out successfully' };
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
