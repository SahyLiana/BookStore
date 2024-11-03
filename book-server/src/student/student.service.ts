import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { StudentLoginDto } from 'src/dto/student.login.dto';

import { StudentDto } from 'src/dto/student.register.dto';
import { Book } from 'src/schema/book.schema';
import { Student } from 'src/schema/student.schema';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<Student>,
    @InjectModel(Book.name) private bookModel: Model<Book>,
    private jwtService: JwtService,
  ) {}

  async getAllStudentService() {
    console.log('Get all student service');

    const students = await this.studentModel.find();

    return students;
  }

  async registerStudentService(studentData: StudentDto) {
    console.log('Register user:', studentData);

    const student = new this.studentModel({ ...studentData });

    try {
      return await student.save();
    } catch (e) {
      throw new HttpException('Error input', HttpStatus.BAD_REQUEST);
    }
  }

  async getSingleStudentService(studentId: string) {
    console.log('Get single Student service', studentId);

    const isValidId = mongoose.Types.ObjectId.isValid(studentId);

    if (!isValidId) {
      throw new HttpException('Invalid Id', HttpStatus.BAD_REQUEST);
    }

    try {
      const getStudent = await this.studentModel.findById({ _id: studentId });

      if (!getStudent) {
        throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
      }
      return getStudent;
    } catch (e) {
      throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
    }
  }

  async deleteUserService(studentId: string) {
    console.log('Delete user service', studentId);

    const isValidId = mongoose.Types.ObjectId.isValid(studentId);

    if (!isValidId) {
      throw new HttpException('Invalid Id', HttpStatus.BAD_REQUEST);
    }

    try {
      const deleteStudent = await this.studentModel.findByIdAndDelete({
        _id: studentId,
      });

      if (!deleteStudent) {
        throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
      }
      await this.bookModel.updateMany(
        { borrowedBy: { $in: [studentId] } },
        { $pull: { borrowedBy: studentId, likedBy: studentId } },
      );
      return deleteStudent;
    } catch (e) {
      throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
    }
  }

  async loginUserService(studentData: StudentLoginDto) {
    console.log('Insinde loginUserService', studentData);
    const findStudent = await this.studentModel.findOne({
      email: studentData.email,
    });

    if (!findStudent) {
      throw new HttpException('Invalid credential', HttpStatus.UNAUTHORIZED);
    }

    if (findStudent.password === studentData.password) {
      const userData = {
        email: findStudent.email,
        _id: findStudent._id,
      };
      return this.jwtService.sign(userData);
    }

    throw new HttpException('Invalid credential', HttpStatus.UNAUTHORIZED);
  }

  getDashboardStudentService(student: any) {
    console.log('Inside getStudentDasboardService');
    return student;
  }

  ///////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////
  //THIS TEST IS USED HOW TO REMOVE THE USER FROM THE BORROWEDBY AND LIKEDBY ARRAY FIELD IN ALL BOOKS
  async testGetBooks(studentId: string) {
    console.log(studentId);
    return await this.bookModel.updateMany(
      { borrowedBy: { $in: [studentId] } },
      { $pull: { borrowedBy: studentId, likedBy: studentId } },
    );
    // return await this.bookModel.find({ borrowedBy: { $in: [studentId] } });
  }
}
