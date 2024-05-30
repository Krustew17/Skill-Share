import { TalentCards } from './talentcards.entity';
import { User } from 'src/users/users.entity';
import { UserProfile } from 'src/users/user.profile.entity';
import { TalentStatistics } from 'src/users/user.statistics.entity';
import { TalentService } from './services/talent.service';
import { TalentController } from './controllers/talent.controller';

import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtMiddleware } from '../users/middlewares/middlewares.middleware';
import { JwtService } from '@nestjs/jwt';
import { TalentReviews } from './talentReviews.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TalentCards,
      User,
      UserProfile,
      TalentStatistics,
      TalentReviews,
    ]),
  ],
  providers: [TalentService, JwtService],
  controllers: [TalentController],
})
export class TalentModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .forRoutes('talent/create', 'talent/review/create', 'talent/cards/me');
  }
}
