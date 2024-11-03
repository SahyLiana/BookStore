import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from 'src/schema/admin.schema';
import { JwtStrategy } from 'src/strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({ secret: 'secret', signOptions: { expiresIn: '1h' } }),
    MongooseModule.forFeature([
      {
        name: Admin.name,
        schema: AdminSchema,
      },
    ]),
  ],

  controllers: [AdminController],
  providers: [AdminService, JwtStrategy],
})
export class AdminModule {}
