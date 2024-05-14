import { User } from '../users.entity';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly pollRepository: Repository<User>,
  ) {}

  async Createuser(username: string, password: string): Promise<User> {
    const user = new User();
    user.username = username;
    user.password = password;
    return await this.pollRepository.save(user);
  }

  async Getuser(username: string, password: string): Promise<User> {
    return await this.pollRepository.findOneBy({ username, password });
  }
}
