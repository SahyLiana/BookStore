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

  async getConversationService(
    stdId: string,
    stdname?: string,
    userId?: string,
  ) {
    console.log('GetConversationService', stdId, userId);

    const isValid = mongoose.Types.ObjectId.isValid(stdId);
    if (!isValid) {
      throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);
    }

    // const findConversation = await this.conversationModel.findOneAndUpdate(
    //   {
    //     'members.userId': { $in: [stdId] },
    //   },
    //   { messages: { $set: { read: true } } },
    //   { new: true },
    // );

    let findConversation = null;

    if (stdname && userId) {
      findConversation = await this.conversationModel.findOneAndUpdate(
        {
          'members.userId': { $in: [stdId] }, // Ensures the conversation includes the user with stdId
        },
        {
          $set: { 'messages.$[elem].read': true }, // Update the read status of matching messages
        },
        {
          arrayFilters: [
            {
              'elem.read': false, // Only update messages that have not been read yet
              'elem.sender.user_id': { $ne: userId }, // Ensure the sender's user_id is different from userId
            },
          ],
          new: true, // Return the updated conversation
        },
      );

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
    } else {
      findConversation = await this.conversationModel.findOne({
        'members.userId': { $in: [stdId] },
      });

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
            read: false,
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
