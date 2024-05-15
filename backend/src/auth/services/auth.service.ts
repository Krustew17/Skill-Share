import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { registerUserDto } from '../dto/register.dto';
import { comparePasswords, hashPassword } from '../utils/bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from 'src/users/users.entity';
import { EmailService } from './email.service';
import { loginPayloadDto } from '../dto/login.dto';
import { Response, Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
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

  async loginUser(AuthPayload: loginPayloadDto, req: Request, res: Response) {
    const user = await this.userRepository.findOneBy({
      username: AuthPayload.username,
    });
    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    if (!user.isActive) {
      throw new HttpException('user not verified', HttpStatus.UNAUTHORIZED);
    }

    const isPasswordValid = comparePasswords(
      AuthPayload.password,
      user.password,
    );
    if (!isPasswordValid) {
      return {
        error: 'invalid credentials',
        HttpStatus: HttpStatus.UNAUTHORIZED,
      };
    }
    // res.cookie('session', await this.jwtService.signAsync({ user }), {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: true,
    //   maxAge: 15 * 60 * 1000,
    // });
    const data = {
      access_token: this.jwtService.sign({ user }),
      refresh_token: this.jwtService.sign({ user }, { expiresIn: '7d' }),
    };
    return data;
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

      return {
        message: 'Email verified successfully',
        HttpStatus: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(
        'Invalid or expired token',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
