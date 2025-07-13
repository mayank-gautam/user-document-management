import { IsArray, ArrayNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserRolesDto {
  @ApiProperty({
    example: ['admin', 'editor'],
    description: 'Array of roles to assign to the user',
    type: [String],
  })
  @IsArray({ message: 'Roles must be an array' })
  @ArrayNotEmpty({ message: 'Roles array must not be empty' })
  @IsString({ each: true, message: 'Each role must be a string' })
  roles: string[];
}
