import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Student {
  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true, default: '123' })
  password: string;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
