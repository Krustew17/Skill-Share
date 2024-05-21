import { User } from '../users.entity';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository, DataSource } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private dataSource: DataSource,
  ) {}

  async getAllUsers() {
    const query = 'SELECT * FROM public."user"';
    const result = await this.dataSource.query(query);
    return result;
  }

  async Getuser(username: string, password: string): Promise<User> {
    return await this.userRepository.findOneBy({ username, password });
  }

  async getUserByToken(token: string) {
    if (!token) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    const decoded = this.jwtService.verify(token);

    if (!decoded) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }

    return decoded;
  }

  async getMe(token: string) {
    if (!token) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    const decoded = this.jwtService.verify(token);
    if (!decoded) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }
    return decoded;
  }
}
