import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { join } from 'path';
import { CreateBook } from 'src/dto/createbook.dto';
import { Book } from 'src/schema/book.schema';
import { promises as fs } from 'fs';

@Injectable()
export class BookService {
  // projectRoot = path.resolve(__dirname, '..');
  // private uploadDir = join(path.resolve(__dirname, '..'), 'uploads');

  private uploadDir = join('C:/Tutorials/react/BookStore/book-server/uploads/');

  // private uploadDir = join(__dirname, '..', 'uploads');

  constructor(@InjectModel(Book.name) private bookModel: Model<Book>) {}

  async getAllBookService() {
    console.log('Get all books service');

    const books = await this.bookModel.find();

    return books;
  }

  async createBookService(book: CreateBook, file) {
    console.log('Create book service', book);
    const newBook = new this.bookModel({
      ...book,
      quantity: parseInt(book.quantity, 10),
      img: file.filename,
    });
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
    bookEdit: {
      title: string;
      featured: boolean;
      quantity: string;
      img: string;
    },
  ) {
    console.log('Inside book service', bookId, file, bookEdit);
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
          {
            $set: {
              title: bookEdit?.title,
              featured: bookEdit?.featured,
              quantity: Number(bookEdit?.quantity),
            },
          },
          { new: true },
        );

        return updateBookMdb;
        // }
      } else {
        try {
          const updateBookMdb = await this.bookModel.findByIdAndUpdate(
            { _id: bookId },
            // { $set: { ...bookEdit, img: file.filename } },
            {
              $set: {
                title: bookEdit?.title,
                featured: bookEdit?.featured,
                quantity: Number(bookEdit?.quantity),
                img: file.filename,
              },
            },
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
        } catch (e) {
          const filePath = join(this.uploadDir, file.filename);

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
        }
      }
    } catch (e) {
      throw new HttpException('Invalid input', HttpStatus.BAD_REQUEST);
    }
  }

  async likeBookService(bookId: string, body: any) {
    console.log('Inside likebookservice:', bookId, body);

    const isValidBookId = mongoose.Types.ObjectId.isValid(bookId);
    if (!isValidBookId) {
      throw new HttpException('Invalid Id', HttpStatus.BAD_REQUEST);
    }

    const findLikedBook = await this.bookModel.findById({ _id: bookId });

    if (!findLikedBook.likedBy.includes(body.user)) {
      const updateBook = this.bookModel.findByIdAndUpdate(
        { _id: bookId },
        { $push: { likedBy: body.user } },
        { new: true },
      );
      return updateBook;
    } else {
      const updateBook = this.bookModel.findByIdAndUpdate(
        { _id: bookId },
        { $pull: { likedBy: body.user } },
        { new: true },
      );
      return updateBook;
    }
  }

  async borrowBookService(
    bookId: string,
    body: { user: string; name: string; returnedBy?: string },
  ) {
    const isValidBookId = mongoose.Types.ObjectId.isValid(bookId);
    if (!isValidBookId) {
      throw new HttpException('Invalid Id', HttpStatus.BAD_REQUEST);
    }

    console.log('Inside likebookservice:', bookId, body);

    const borrowBook = this.bookModel.findByIdAndUpdate(
      { _id: bookId },
      { $push: { borrowedBy: { ...body } } },
      { new: true },

      // { $push: { likedBy: body.user } },
    );

    return borrowBook;
  }

  async returnBookService(bookId: string, body: { user: string }) {
    const isValidBookId = mongoose.Types.ObjectId.isValid(bookId);
    if (!isValidBookId) {
      throw new HttpException('Invalid Id', HttpStatus.BAD_REQUEST);
    }

    console.log('Inside likebookservice:', bookId, body);

    const returnBook = this.bookModel.findByIdAndUpdate(
      { _id: bookId },
      { $pull: { borrowedBy: { user: body.user } } },
      { new: true },

      // { $push: { likedBy: body.user } },
    );

    return returnBook;
  }
}
