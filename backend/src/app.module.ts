import { UsersModule } from './users/users.module';
import { User } from './users/users.entity';
import { UsersController } from './users/controllers/users.controller';
import { UserService } from './users/services/user.service';

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import * as dotenv from 'dotenv';
import { TypeOrmModule } from '@nestjs/typeorm';

dotenv.config(); // Load environment variables from .env file

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(<string>process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([User]),
    UsersModule,
  ],
  controllers: [AppController, UsersController],
  providers: [AppService, UserService],
})
export class AppModule {}
