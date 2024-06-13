import { UserService } from '../services/user.service';
import { JwtRefreshGuard } from 'src/auth/guards/jwt-refresh-guard';

import { Request } from 'express';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  async getAllUsers(@Req() req: Request) {
    const user = req['user'];
    return this.userService.getAllUsers();
  }
  @Get('getUser')
  getUser(
    @Body() { username, password }: { username: string; password: string },
  ) {
    return this.userService.Getuser(username, password);
  }

  @Get('get-user-by-token')
  getUserByToken(token: string) {
    return this.userService.getUserByToken(token);
  }

  @Get('me')
  // @UseGuards(JwtRefreshGuard)
  getMe(@Req() req: Request) {
    const token = req.headers.authorization.split(' ')[1];
    console.log(`token: ${token}`);
    return this.userService.getMe(token);
  }

  @Post('profile/update')
  @UseGuards(JwtRefreshGuard)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'profileImage', maxCount: 1 }], {
      storage: diskStorage({
        destination: './uploads/profileImages',
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              'Only .png, .jpg and .jpeg format allowed!',
            ),
            false,
          );
        }
      },
    }),
  )
  async updateProfile(
    @UploadedFiles() files: { profileImage?: Express.Multer.File[] },
    @Req() req: Request,
    @Body()
    data: {
      username: string;
      firstName: string;
      lastName: string;
      country: string;
      useDefaultProfileImage?: boolean;
    },
  ) {
    const profileImage = files.profileImage
      ? files.profileImage[0].filename
      : null;
    console.log(profileImage);
    return this.userService.updateUser(data, profileImage, req);
  }
}
