import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { join } from 'path';
import { CreateBook } from 'src/dto/createbook.dto';
import { Book } from 'src/schema/book.schema';
import { promises as fs } from 'fs';

@Injectable()
export class BookService {
  private uploadDir = join(
    '/home/sahy/Tutorials/react/BookStore/server/book-server/uploads/',
  );

  constructor(@InjectModel(Book.name) private bookModel: Model<Book>) {}

  async getAllBookService() {
    console.log('Get all books service');

    const books = await this.bookModel.find();

    return books;
  }

  async createBookService(book: CreateBook, file) {
    console.log('Create book service');
    const newBook = new this.bookModel({ ...book, img: file.filename });
    try {
      return await newBook.save();
    } catch (err) {
      //////////////////////////////////////////////////////
      /////////////////////////////////////////////////////
      //IF IT HAS FAILED WE HAVE TO DELETE THE IMAGE THAT WAS UPLOADED
      console.log(err);
      const filePath = join(this.uploadDir, file.filename);
      console.log('The file path is'), filePath;
      try {
        const stats = await fs.stat(filePath);
        console.log('File stats', stats);
        await fs.access(filePath);
        await fs.unlink(filePath);
        console.log('File deleted successfully');
      } catch (e) {
        // console.log(e);
        if (e.code === 'ENOENT') {
          console.error('File does not exist');
        } else {
          console.error('Error deleting file:', e);
        }
        throw new HttpException('Bad request', HttpStatus.FORBIDDEN);
      }
    }
  }

  async deleteBookService(bookId: string) {
    console.log('Delete book service', bookId);

    const isValidBookId = mongoose.Types.ObjectId.isValid(bookId);
    if (!isValidBookId) {
      throw new HttpException('Invalid Id', HttpStatus.BAD_REQUEST);
    }

    try {
      const deleteBook = await this.bookModel.findOneAndDelete({ _id: bookId });
      if (!deleteBook) {
        throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
      }
      const filePath = join(this.uploadDir, deleteBook.img);

      try {
        console.log(filePath);

        await fs.access(filePath);
        await fs.unlink(filePath);
      } catch (e) {
        if (e.code === 'ENOENT') {
          console.error('File does not exist');
        } else {
          console.error('Error deleting file:', e);
        }
      }
      console.log('Book deleted successfuly');
      return deleteBook;
    } catch (e) {
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    }
  }

  async updateBookService(
    bookId: string,
    file,
    bookEdit: { title: string; featured: boolean; img: string },
  ) {
    console.log('Inside book service', bookId);
    const isValidBookId = mongoose.Types.ObjectId.isValid(bookId);
    if (!isValidBookId) {
      throw new HttpException('Invalid Id', HttpStatus.BAD_REQUEST);
    }

    if (!bookEdit && !file) {
      throw new HttpException('Invalid input', HttpStatus.BAD_REQUEST);
    }

    try {
      if (!file) {
        // if (bookEdit.title && bookEdit.featured) {
        const updateBookMdb = await this.bookModel.findOneAndUpdate(
          { _id: bookId },
          { $set: { ...bookEdit } },
          { new: true },
        );

        return updateBookMdb;
        // }
      } else {
        const updateBookMdb = await this.bookModel.findByIdAndUpdate(
          { _id: bookId },
          { $set: { ...bookEdit, img: file.filename } },
          { new: true },
        );

        const filePath = join(this.uploadDir, bookEdit.img);

        try {
          console.log(filePath);

          await fs.access(filePath);
          await fs.unlink(filePath);
        } catch (e) {
          if (e.code === 'ENOENT') {
            console.error('File does not exist');
          } else {
            console.error('Error deleting file:', e);
          }
        }
        return updateBookMdb;
      }
    } catch (e) {
      throw new HttpException('Invalid input', HttpStatus.BAD_REQUEST);
    }
  }
}
