import { Exclude, Expose } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  name: string;

  @Expose()
  roles: string[];

  @Expose()
  createdAt: Date;

  @Exclude()
  password?: string;

  @Exclude()
  refreshToken?: string | null;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
