import { Module } from '@nestjs/common';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from 'src/schema/student.schema';
import {
  Conversation,
  ConversationSchema,
} from 'src/schema/conversation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Student.name,
        schema: StudentSchema,
      },
      {
        name: Conversation.name,
        schema: ConversationSchema,
      },
    ]),
  ],
  controllers: [ConversationController],
  providers: [ConversationService, JwtService],
})
export class ConversationModule {}
