import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AdminLoginDto } from 'src/dto/admin.login.dto';
import { Admin } from 'src/schema/admin.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    private jwtService: JwtService,
  ) {}

  async validateAdminService(adminData: AdminLoginDto) {
    console.log('The admin', adminData);
    const findAdmin = await this.adminModel.findOne({
      username: adminData.username,
    });

    if (!findAdmin) {
      throw new HttpException('Invalid credential', HttpStatus.UNAUTHORIZED);
    }

    if (findAdmin.password === adminData.password) {
      const userData = {
        username: findAdmin.username,
        _id: findAdmin._id,
      };
      return {
        token: this.jwtService.sign(userData),
        _id: findAdmin._id,
        username: findAdmin.username,
      };
    }

    throw new HttpException('Invalid credential', HttpStatus.UNAUTHORIZED);
  }

  getAdminDashboardService(admin: any) {
    console.log('Inside getAdminDashboardService');
    return admin;
  }
}
