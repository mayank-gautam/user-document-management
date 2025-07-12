import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsArray, ArrayNotEmpty } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  roles?: string[];
}
