import { AuthService } from 'src/auth/services/auth.service';

import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    console.log('inside middleware');
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer')) {
      return res
        .status(401)
        .json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
      let decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      req['user'] = decoded['user'];
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        const refreshTokenHeader = req.headers['refreshtoken'];

        if (!refreshTokenHeader) {
          return res
            .status(401)
            .json({ message: 'Unauthorized: No refresh token provided' });
        }
        console.log('refresh token', refreshTokenHeader);
        const refreshToken = refreshTokenHeader as string;

        try {
          const newAccessToken =
            await this.authService.refreshToken(refreshToken);
          console.log(`newAccessToken: ${newAccessToken}`);
          res.setHeader(
            'Authorization',
            `Bearer ${newAccessToken.access_token}`,
          );

          let decoded = this.jwtService.verify(newAccessToken.access_token, {
            secret: process.env.JWT_SECRET,
          });
          req['user'] = decoded['user'];
          next();
        } catch (refreshError) {
          console.log('refreshError: ', refreshError);
          return res.status(401).json({
            message: 'Unauthorized: Invalid refresh token',
            refreshError,
          });
        }
      } else {
        return res
          .status(401)
          .json({ message: 'Unauthorized: Invalid or expired token', error });
      }
    }
  }
}
