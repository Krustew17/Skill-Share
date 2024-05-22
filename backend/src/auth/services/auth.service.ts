import { registerUserDto } from '../dto/register.dto';
import { comparePasswords, hashPassword } from '../utils/bcrypt';
import { User } from 'src/users/users.entity';
import { Job } from 'src/jobs/jobs.entity';
import { EmailService } from './email.service';
import { loginPayloadDto } from '../dto/login.dto';
import { UserProfile } from 'src/users/user.profile.entity';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Response, Request } from 'express';
import Stripe from 'stripe';

@Injectable()
export class AuthService {
  private stripe: Stripe;
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
    @InjectRepository(UserProfile)
    private readonly userProfileRepository: Repository<UserProfile>,

    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-04-10',
    });
  }
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
    // Create a Stripe customer
    const stripeCustomer = await this.stripe.customers.create({
      email: userData.email,
    });

    // Save the Stripe customer ID to the user (if you have a stripeCustomerId field in your User entity)
    savedUser.customerId = stripeCustomer.id;
    await this.userRepository.save(savedUser);
    return {
      message: 'User created successfully',
      HttpStatus: HttpStatus.CREATED,
    };
  }

  async loginUser(AuthPayload: loginPayloadDto, req: Request, res: Response) {
    const user = await this.userRepository.findOneBy({
      username: AuthPayload.username,
    });
    console.log(user);
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

      const data = {
        access_token: this.jwtService.sign({ user }),
        refresh_token: this.jwtService.sign({ user }, { expiresIn: '7d' }),
      };
      return data;
    } catch (error) {
      throw new HttpException(
        'Invalid or expired token',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteUser(req: Request, res: Response) {
    // TO DO: BLACKLIST/REMOVE THE JWT TOKEN AFTER DELETING/LOGGONG OUT THE USER
    const user = req['user'];
    if (!user) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    const jobs = await this.jobRepository.find({
      where: { user: { id: user.id } },
    });
    await this.jobRepository.remove(jobs);
    await this.userRepository.delete({ id: user.id });
    return {
      message: 'User deleted successfully',
      HttpStatus: HttpStatus.OK,
    };
  }
  // TO DO: LOGOUT THE USER AND REMOVE THE JWT TOKEN

  async createPasswordResetToken(userId: number): Promise<string> {
    const payload = { userId };
    return this.jwtService.sign(payload, { expiresIn: '1h' });
  }

  async sendPasswordResetEmail(email: string) {
    console.log(email);
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const resetToken = await this.createPasswordResetToken(user.id);
    await this.emailService.sendPasswordResetEmail(email, resetToken);
    return {
      message: 'Password reset email sent',
      HttpStatus: HttpStatus.OK,
      resetToken,
    };
  }
  async resetPassword(
    token: string,
    newPassword: string,
    confirmPassword: string,
  ) {
    try {
      const decoded = this.jwtService.verify(token);
      const userId = decoded.userId;
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      if (newPassword !== confirmPassword) {
        throw new HttpException(
          'Passwords do not match',
          HttpStatus.BAD_REQUEST,
        );
      }

      user.password = await hashPassword(newPassword);
      await this.userRepository.save(user);
      return {
        message: 'Password reset successfully',
        HttpStatus: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(
        'Invalid or expired token',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async googleLogin(req: any) {
    if (!req.user) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const { email, firstName, lastName, picture, googleId } = req.user;

    // Check if user exists
    let user = await this.userRepository.findOne({
      where: { email },
      relations: ['profile'],
    });

    if (user) {
      // Link Google account if not already linked
      if (!user.profile) {
        const userProfile = this.userProfileRepository.create({
          firstName,
          lastName,
          picture,
        });
        user.googleId = googleId;
        user.profile = userProfile;
        await this.userRepository.save(user);
      }
    } else {
      // Create a new user and profile if not found
      const userProfile = this.userProfileRepository.create({
        firstName,
        lastName,
        picture,
      });
      user = this.userRepository.create({
        email,
        profile: userProfile,
        googleId: googleId,
      });
      await this.userRepository.save(user);
    }

    return {
      user,
      access_token: this.jwtService.sign({ user }, { expiresIn: '1d' }),
      refresh_token: this.jwtService.sign(
        { user: { id: user.id, email: user.email } },
        { expiresIn: '7d' },
      ),
    };
  }
}
