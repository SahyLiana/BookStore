import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class StudentDto {
  @IsNotEmpty()
  @IsEmail()
  @MinLength(3)
  email: string;

  @IsNotEmpty()
  @MinLength(3)
  @IsString()
  name: string;

  password?: string;
}
