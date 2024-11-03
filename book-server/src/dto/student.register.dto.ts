import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class StudentDto {
  @IsNotEmpty()
  @IsEmail()
  @MinLength(3)
  email: string;

  password?: string;
}
