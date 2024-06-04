import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response, NextFunction } from 'express';
import { User } from '../users.entity';
import { Repository } from 'typeorm';
import { UserService } from '../services/user.service';

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
      let decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      console.log(decoded);
      req['user'] = decoded['user'];
      next();
    } catch (error) {
      return res
        .status(401)
        .json({ message: 'Unauthorized: Invalid or expired token', error });
    }
  }
}
