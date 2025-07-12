import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from '../../users/dto/user-response.dto';

export class DocumentResponseDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  filename: string;

  @Expose()
  uploadedAt: Date;

  @Expose()
  @Type(() => UserResponseDto)
  owner: UserResponseDto;
}
