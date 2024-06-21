import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let validToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: ['.env.test'],
        }),
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:', // Use in-memory database for tests
          synchronize: true, // Sync database schema automatically
          dropSchema: true, // Drop schema and recreate for each test
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    jwtService = moduleFixture.get<JwtService>(JwtService);

    validToken = jwtService.sign(
      {
        userId: 1,
        username: 'testuser',
        email: 'testemail@gmail.com',
        password:
          '$2b$10$RDdYUgNqGdtznK9hVN9WLe2f4AkxlaF8EjpxcY3tcftqkFBtPIMNa',
        customerId: 'cus_123',
        hasPremium: false,
        googleId: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { secret: 'dH1lBaOTUmP51cUawlPadghQ1o2hj3j1' },
    );
  });
  afterAll(async () => {
    await app.close();
  });

  it('should return 401 if no token is provided', () => {
    return request(app.getHttpServer()).get('/users/me').expect(401);
  });

  it('should return 401 if an invalid token is provided', () => {
    return request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', 'Bearer invalidtoken')
      .expect(401);
  });

  it('should return user data if a valid token is provided', () => {
    return request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', `Bearer ${validToken}`)
      .set('content-type', 'application/json')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('user');
        expect(res.body).toHaveProperty('userProfile');
      });
  });
  it('should return empty array', () => {
    return request(app.getHttpServer())
      .get('/users/all')
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual([]);
      });
  });
});
