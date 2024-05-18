import { TalentCards } from './talentcards.entity';
import { User } from 'src/users/users.entity';
import { TalentService } from './services/talent.service';
import { TalentController } from './controllers/talent.controller';

import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtMiddleware } from '../users/middlewares/middlewares.middleware';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([TalentCards, User])],
  providers: [TalentService, JwtService],
  controllers: [TalentController],
})
export class TalentModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('talent');
  }
}
