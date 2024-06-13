import { User } from '../users.entity';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository, DataSource } from 'typeorm';
import { UserProfile } from '../user.profile.entity';
import { profile } from 'console';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private readonly useProfileRepository: Repository<UserProfile>,
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
    try {
      const decoded = this.jwtService.verify(token);
      if (!decoded) {
        throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
      }

      const userId = decoded.userId ? decoded.userId : decoded.user.id;
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['profile'],
      });
      const data = {
        user,
        userProfile: user.profile,
      };
      return data;
    } catch (error) {
      throw new HttpException(
        'Invalid or expired token',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateUser(
    data: {
      username: string;
      firstName: string;
      lastName: string;
      country: string;
      useDefaultProfileImage?: boolean;
    },
    profileImage: string | null,
    req: Request,
  ) {
    console.log(profileImage);
    const { username, firstName, lastName, useDefaultProfileImage, country } =
      data;

    const user = await this.userRepository.findOneBy({ username });
    if (user && user.id !== req['user'].id) {
      throw new HttpException('Username is taken', HttpStatus.CONFLICT);
    }

    const requestUser = await this.userRepository.findOne({
      where: { id: req['user'].id },
      relations: ['profile'],
    });

    if (!requestUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (useDefaultProfileImage) {
      requestUser.profile.profileImage = 'default_avatar.jpg';
    }

    requestUser.username = username;
    requestUser.profile.firstName = firstName;
    requestUser.profile.lastName = lastName;
    requestUser.profile.country = country;

    if (profileImage) {
      requestUser.profile.profileImage = profileImage;
    }

    await this.userRepository.save(requestUser);

    return {
      message: 'Profile updated successfully',
      statusCode: HttpStatus.OK,
    };
  }
}
