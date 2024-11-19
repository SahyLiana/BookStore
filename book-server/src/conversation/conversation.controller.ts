import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { MessageDto } from 'src/dto/message.dto';

@Controller('api/conversation')
export class ConversationController {
  constructor(private conversationService: ConversationService) {}

  @Get(':studentId/:name')
  getConversation(
    @Param('studentId') stdId: string,
    @Param('name') stdname: string,
  ) {
    return this.conversationService.getConversationService(stdId, stdname);
  }

  @Patch(':studentId')
  @UsePipes(new ValidationPipe())
  postMessage(@Param('studentId') stdId: string, @Body() message: MessageDto) {
    return this.conversationService.postMessageService(stdId, message);
  }
}
