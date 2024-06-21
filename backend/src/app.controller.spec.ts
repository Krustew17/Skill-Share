import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersModule } from '../src/users/users.module'; // Adjust the path as per your project structure

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
      providers: [
        {
          provide: JwtService,
          useValue: {
            verify: jest.fn((token: string) => {
              if (token === 'valid-token') {
                return {
                  userId: 1,
                  username: 'testuser',
                };
              } else {
                throw new Error('Invalid token');
              }
            }),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'JWT_SECRET') {
                return 'test-secret';
              }
            }),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    jwtService = moduleFixture.get<JwtService>(JwtService);
    configService = moduleFixture.get<ConfigService>(ConfigService);
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('should return 401 if no token is provided', () => {
    return request(app.getHttpServer())
      .get('/api/users/me')
      .expect(HttpStatus.UNAUTHORIZED)
      .expect((res) => {
        expect(res.body.message).toBe('Unauthorized');
      });
  });

  it('should return 400 if an invalid token is provided', () => {
    return request(app.getHttpServer())
      .get('/api/users/me')
      .set('Authorization', 'Bearer invalidtoken')
      .expect(HttpStatus.BAD_REQUEST)
      .expect((res) => {
        expect(res.body.message).toBe('Invalid or expired token');
      });
  });

  it('should return user data if a valid token is provided', async () => {
    const validToken = jwtService.sign(
      { userId: 1 },
      { secret: 'test-secret' },
    );

    return request(app.getHttpServer())
      .get('/api/users/me')
      .set('Authorization', `Bearer ${validToken}`)
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body).toHaveProperty('user');
        expect(res.body).toHaveProperty('userProfile');
      });
  });

  // Add more test cases as needed
});
