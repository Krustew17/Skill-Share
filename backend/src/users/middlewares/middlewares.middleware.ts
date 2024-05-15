import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    console.log('inside middleware');
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer')) {
      return res
        .status(401)
        .json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      res.cookie.apply({
        name: 'session',
        value: token,
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      });
      req['user'] = decoded['user'];
      next();
    } catch (error) {
      return res
        .status(401)
        .json({ message: 'Unauthorized: Invalid or expired token', error });
    }
  }
}
