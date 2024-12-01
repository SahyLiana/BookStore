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

  @Get()
  getAllconversations() {
    return this.conversationService.getAllConversationService();
  }

  @Get(':studentId/:name?/:userId?')
  getConversation(
    @Param('studentId') stdId: string,
    @Param('name') stdname?: string,
    @Param('userId') userId?: string,
  ) {
    return this.conversationService.getConversationService(
      stdId,
      stdname,
      userId,
    );
  }

  @Patch(':conversationId')
  @UsePipes(new ValidationPipe())
  postMessage(
    // @Param('studentId') stdId: string,
    @Param('conversationId') conversationId: string,
    @Body() message: MessageDto,
  ) {
    return this.conversationService.postMessageService(
      // stdId,
      conversationId,
      message,
    );
  }
}
