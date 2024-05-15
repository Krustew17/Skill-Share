import { Job } from './jobs.entity';
import { JwtMiddleware } from 'src/users/middlewares/middlewares.middleware';

import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule, JwtService } from '@nestjs/jwt';

import { jobsService } from './services/jobs.service';
import { jobsController } from './controllers/jobs.controller';
import * as dotenv from 'dotenv';

dotenv.config();
@Module({
  imports: [
    TypeOrmModule.forFeature([Job]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [jobsController],
  providers: [jobsService, JwtService],
  exports: [JwtService],
})
export class JobsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .exclude({ path: 'jobs', method: RequestMethod.GET })
      .forRoutes(jobsController);
  }
}
