import { TalentCards } from './talentcards.entity';
import { User } from '../users/users.entity';
import { UserProfile } from '../users/user.profile.entity';
import { TalentStatistics } from '../users/user.statistics.entity';
import { TalentService } from './services/talent.service';
import { TalentController } from './controllers/talent.controller';

import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtMiddleware } from '../users/middlewares/middlewares.middleware';
import { JwtService } from '@nestjs/jwt';
import { TalentReviews } from './talentReviews.entity';
import AuthModule from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TalentCards,
      User,
      UserProfile,
      TalentStatistics,
      TalentReviews,
    ]),
    AuthModule,
  ],
  providers: [TalentService, JwtService],
  controllers: [TalentController],
})
export class TalentModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .forRoutes(
        'talent/create',
        'talent/review/create',
        'talent/cards/me',
        'talent/delete',
        'talent/update',
      );
  }
}
