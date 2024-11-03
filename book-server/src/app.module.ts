import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminModule } from './admin/admin.module';
import { BookModule } from './book/book.module';
import { StudentModule } from './student/student.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/bookstore'),
    AdminModule,
    BookModule,
    StudentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
