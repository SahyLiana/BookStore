import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Admin {
  @Prop({ unique: true, required: true, minlength: 3 })
  username: string;

  @Prop({ required: true, minlength: 3 })
  password: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
