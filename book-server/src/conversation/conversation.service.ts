import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { timestamp } from 'rxjs';
import { MessageDto } from 'src/dto/message.dto';
import { Conversation } from 'src/schema/conversation.schema';

//6728ea82e3ac64c5a6f9f526
@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<Conversation>,
  ) {}

  async getConversationService(stdId, stdname) {
    console.log('GetConversationService', stdId);

    const isValid = mongoose.Types.ObjectId.isValid(stdId);
    if (!isValid) {
      throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);
    }

    const findConversation = await this.conversationModel.findOne({
      'members.userId': { $in: [stdId] },
    });

    console.log(findConversation);

    if (!findConversation) {
      const newConversation = new this.conversationModel({
        members: [
          {
            name: 'admin',
            userId: '6728ea82e3ac64c5a6f9f526',
          },
          {
            name: stdname,
            userId: stdId,
          },
        ],
      });
      return await newConversation.save();
    }

    return findConversation;
  }

  async postMessageService(
    // stdId: string,
    conversationId: string,
    message: MessageDto,
  ) {
    console.log('PostMessageService', message);

    const isValid = mongoose.Types.ObjectId.isValid(conversationId);

    if (!isValid) {
      throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);
    }

    // const findConversation = await this.conversationModel.findOne({
    //   'members.userId': { $in: [stdId] },
    // });
    const findConversation = await this.conversationModel.findOne({
      _id: conversationId,
    });

    if (!findConversation) {
      throw new HttpException('Conversation not found', HttpStatus.BAD_REQUEST);
    }

    console.log('findConversation is', findConversation);

    const newConversation = await this.conversationModel.findByIdAndUpdate(
      { _id: findConversation._id },
      {
        $push: {
          messages: {
            sender: { user_id: message.senderId, user: message.senderName },
            message: message.message,
            timestamp: message.timestamp,
          },
        },
      },
      { new: true },
    );

    return newConversation;
  }

  async getAllConversationService() {
    console.log('GetallConversationService');
    const allConversation = await this.conversationModel.find({});

    return allConversation;
  }
}
