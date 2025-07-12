import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(() => {
    const configService = {
      get: jest.fn().mockReturnValue('testsecret'),
    } as any as ConfigService;

    strategy = new JwtStrategy(configService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('validate should return user payload correctly', async () => {
    const payload = {
      sub: 1,
      email: 'user@example.com',
      roles: ['viewer'],
    };
    const result = await strategy.validate(payload);
    expect(result).toEqual({
      id: payload.sub,
      email: payload.email,
      roles: payload.roles,
    });
  });
});
