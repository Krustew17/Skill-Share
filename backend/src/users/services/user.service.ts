import { User } from '../users.entity';
import { registerUserDto } from '../dto/register.dto';
import { loginPayloadDto } from '../dto/login.dto';
import { EmailService } from './email.service';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { Repository } from 'typeorm';
import { comparePasswords, hashPassword } from '../utils/bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async createUser(userData: registerUserDto) {
    const user = await this.userRepository.findOneBy({
      username: userData.username,
    });
    if (user) {
      throw new HttpException('username already exists', HttpStatus.CONFLICT);
    }

    const email = await this.userRepository.findOneBy({
      email: userData.email,
    });
    if (email) {
      throw new HttpException('email already exists', HttpStatus.CONFLICT);
    }

    const password = await hashPassword(userData.password);
    const newUser = this.userRepository.create({ ...userData, password });
    const savedUser = await this.userRepository.save(newUser);
    const verificationToken = this.jwtService.sign({
      userId: savedUser.id,
    });
    await this.emailService.sendVerificationEmail(
      savedUser.email,
      verificationToken,
    );
    return savedUser;
  }

  async loginUser(AuthPayload: loginPayloadDto) {
    const user = await this.userRepository.findOneBy({
      username: AuthPayload.username,
    });
    if (!user) {
      return { error: 'user does not exist.' };
    }
    if (!user.isActive) {
      return { error: 'email not verified' };
    }

    const isPasswordValid = comparePasswords(
      AuthPayload.password,
      user.password,
    );
    if (!isPasswordValid) {
      return { error: 'invalid credentials' };
    }
    return { success: 'logging in..' };
  }

  async verifyUser(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      const userId = decoded.userId;

      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      user.isActive = true;
      await this.userRepository.save(user);

      return { message: 'Email verified successfully' };
    } catch (error) {
      throw new HttpException(
        'Invalid or expired token',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async Getuser(username: string, password: string): Promise<User> {
    return await this.userRepository.findOneBy({ username, password });
  }
}
