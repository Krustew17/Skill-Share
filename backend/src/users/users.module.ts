import { UsersController } from './controllers/users.controller';
import { User } from './users.entity';
import { UserService } from './services/user.service';
import { UserProfile } from './user.profile.entity';
import { AuthService } from 'src/auth/services/auth.service';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule, JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import AuthModule from 'src/auth/auth.module';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserProfile]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    AuthModule,
  ],
  controllers: [UsersController],
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule {}
