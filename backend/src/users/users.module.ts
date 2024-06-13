import { UsersController } from './controllers/users.controller';
import { User } from './users.entity';
import { UserService } from './services/user.service';
import { UserProfile } from './user.profile.entity';
import { TalentStatistics } from './user.statistics.entity';
import AuthModule from 'src/auth/auth.module';
import { JwtMiddleware } from './middlewares/middlewares.middleware';
import { TalentReviews } from 'src/talent/talentReviews.entity';

import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserProfile,
      TalentStatistics,
      TalentReviews,
    ]),
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
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('users/profile/update');
  }
}
