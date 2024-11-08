import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateBook {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  @IsNotEmpty()
  quantity: string;

  featured?: boolean;
}
