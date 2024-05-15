import { User } from '../users.entity';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository, DataSource } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
}
