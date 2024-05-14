import { UsersController } from './controllers/users.controller';
import { User } from './users.entity';
import { UserService } from './services/user.service';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UserService],
})
export class UsersModule {}
