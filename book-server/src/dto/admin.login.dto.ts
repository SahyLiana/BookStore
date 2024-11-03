import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AdminLoginDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  username: string;
  @IsNotEmpty()
  @MinLength(3)
  @IsString()
  password: string;
}
