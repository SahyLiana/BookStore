import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Book {
  @Prop({ unique: true, required: true })
  title: string;

  @Prop({ required: true })
  img: string;

  @Prop({ required: false, default: [] })
  likedBy: string[];

  @Prop({ default: false })
  featured: boolean;

  @Prop({ required: false })
  borrowedBy: { user: string; returnedBy?: string }[];
}

export const BookSchema = SchemaFactory.createForClass(Book);
