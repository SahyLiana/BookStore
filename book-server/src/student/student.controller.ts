import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentDto } from 'src/dto/student.register.dto';
import { StudentLoginDto } from 'src/dto/student.login.dto';
import { JwtAuthGuard } from 'src/guards/jwt.guards';
import { Request } from 'express';

@Controller('api/student')
export class StudentController {
  constructor(private studentService: StudentService) {}

  @Get()
  getAllStudents() {
    return this.studentService.getAllStudentService();
  }

  @Post()
  @UsePipes(new ValidationPipe())
  registerStudent(@Body() studentData: StudentDto) {
    return this.studentService.registerStudentService(studentData);
  }

  @Get(':id')
  getSingleStudent(@Param('id') studentId: string) {
    return this.studentService.getSingleStudentService(studentId);
  }

  @Delete(':id')
  deleteStudent(@Param('id') studentId: string) {
    return this.studentService.deleteUserService(studentId);
  }

  @Post('login')
  studentLogin(@Body() studentData: StudentLoginDto) {
    return this.studentService.loginUserService(studentData);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getStudentDashboard(@Req() req: Request) {
    return this.studentService.getDashboardStudentService(req);
  }

  @Get('test/:id')
  testGetBooksBorrowed(@Param('id') studentId: string) {
    return this.studentService.testGetBooks(studentId);
  }
}
