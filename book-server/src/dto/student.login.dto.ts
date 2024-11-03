import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class StudentLoginDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @MinLength(3)
  @IsString()
  password: string;
}
