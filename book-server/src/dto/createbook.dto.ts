import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateBook {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  title: string;

  featured?: boolean;
}
