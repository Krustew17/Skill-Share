import { UsersModule } from './users/users.module';
import { User } from './users/users.entity';
import { Earnings } from './users/earnings.entity';
import { TalentCards } from './talent/talentcards.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TalentModule } from './talent/talent.module';
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
import { ConfigService, ConfigModule } from '@nestjs/config';
import { TalentReviews } from './talent/talentReviews.entity';
import { UserProfile } from './users/user.profile.entity';
import { TalentStatistics } from './users/user.statistics.entity';
dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.test'],
    }),
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
    TypeOrmModule.forFeature([
      User,
      UserProfile,
      TalentStatistics,
      Earnings,
      TalentCards,
      TalentReviews,
      Earnings,
    ]),
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    TalentModule,
    StripeModule,
    ServeStaticModule.forRoot(
      {
        rootPath: join(__dirname, '..', '../frontend/build'),
        exclude: ['/api/(.*)'],
      },
      {
        rootPath: join(__dirname, '..', '../frontend/public/images/uploads'),
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
