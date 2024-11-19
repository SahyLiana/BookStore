import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Conversation {
  @Prop({ required: true })
  members: { name: string; userId: string }[];

  @Prop({ required: false })
  messages: {
    sender: {
      user_id: string;
      user: string;
    };
    message: string;
    timestamp: Date;
  }[];
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
