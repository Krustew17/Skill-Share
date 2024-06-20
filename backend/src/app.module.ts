import { UsersModule } from './users/users.module';
import { User } from './users/users.entity';
import { Job } from './jobs/jobs.entity';
import { Earnings } from './users/earnings.entity';
import { TalentCards } from './talent/talentcards.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JobsModule } from './jobs/jobs.module';
import { TalentModule } from './talent/talent.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import AuthModule from './auth/auth.module';
import { StripeModule } from './stripe/stripe.module';

import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import * as dotenv from 'dotenv';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
dotenv.config();

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
    TypeOrmModule.forFeature([User, Job, Earnings, TalentCards]),
    UsersModule,
    JobsModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    AuthModule,
    TalentModule,
    LeaderboardModule,
    StripeModule,
    ServeStaticModule.forRoot(
      {
        rootPath: join(__dirname, '..', '../frontend/build'),
        exclude: ['/api/(.*)'],
      },
      {
        rootPath: join(__dirname, '..', '../frontend/build/uploads'),
        serveRoot: '/uploads',
      },
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  //   configure(consumer: MiddlewareConsumer) {
  //     consumer.apply(checkAuthenticatedMiddleware).forRoutes('*');
  //   }
  // }
}
