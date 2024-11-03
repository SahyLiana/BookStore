import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BookService } from './book.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { CreateBook } from 'src/dto/createbook.dto';

@Controller('api/book')
export class BookController {
  constructor(private bookService: BookService) {}

  @Get()
  getAllBooks() {
    return this.bookService.getAllBookService();
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseInterceptors(
    FileInterceptor('bookImg', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          console.log('My file is', file);

          const fileName = `${uuidv4()}${extname(file.originalname)}`;
          cb(null, fileName);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpg', 'image/png', 'image/jpeg'];
        if (allowedTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          console.log('Invalid types');
          cb(new BadRequestException('Invalid file type'), false);
        }
      },
      limits: {
        fileSize: 2_000_000,
      },
    }),
  )
  createBook(@Body() book: CreateBook, @UploadedFile() file) {
    return this.bookService.createBookService(book, file);
  }

  @Delete(':id')
  deleteBook(@Param('id') bookId: string) {
    return this.bookService.deleteBookService(bookId);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('bookImg', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          console.log('My file is', file);

          const fileName = `${uuidv4()}${extname(file.originalname)}`;
          cb(null, fileName);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpg', 'image/png', 'image/jpeg'];
        if (allowedTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          console.log('Invalid types');
          cb(new BadRequestException('Invalid file type'), false);
        }
      },
      limits: {
        fileSize: 2_000_000,
      },
    }),
  )
  updateBook(
    @UploadedFile() file,
    @Param('id') bookId: string,
    @Body() bookEdit: { title: string; featured: boolean; img: string },
  ) {
    return this.bookService.updateBookService(bookId, file, bookEdit);
  }
}
