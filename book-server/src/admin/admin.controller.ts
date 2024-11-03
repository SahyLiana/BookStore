import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminLoginDto } from 'src/dto/admin.login.dto';
import { JwtAuthGuard } from 'src/guards/jwt.guards';
import { Request } from 'express';

@Controller('api/admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  getAdminFunction(@Body() adminData: AdminLoginDto) {
    return this.adminService.validateAdminService(adminData);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getAdminDashboard(@Req() req: Request) {
    return this.adminService.getAdminDashboardService(req.user);
  }
}
