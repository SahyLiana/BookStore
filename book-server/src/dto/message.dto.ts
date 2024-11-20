import { IsNotEmpty, IsString } from 'class-validator';

export class MessageDto {
  @IsNotEmpty()
  @IsString()
  senderId;

  @IsNotEmpty()
  @IsString()
  senderName;

  @IsNotEmpty()
  @IsString()
  message;

  @IsNotEmpty()
  @IsString()
  timestamp;
}
