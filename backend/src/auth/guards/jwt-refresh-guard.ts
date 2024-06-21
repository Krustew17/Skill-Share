import { AuthService } from '../services/auth.service';
import { JwtService } from '@nestjs/jwt';

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class JwtRefreshGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException();
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = this.jwtService.verify(token);
      return true;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        const newToken = await this.authService.refreshToken(token);
        request.headers['authorization'] = `Bearer ${newToken}`;
        return true;
      } else {
        throw new UnauthorizedException();
      }
    }
  }
}
