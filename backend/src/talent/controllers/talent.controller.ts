import { TalentService } from '../services/talent.service';
import { updateTalentDto } from '../dto/update.talent.dto';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';

import { Request } from 'express';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { TalentCards } from '../talentcards.entity';

@Controller('talent')
export class TalentController {
  constructor(private readonly talentService: TalentService) {}

  @Get('all')
  getAllTalentCards() {
    return this.talentService.getAllTalents();
  }

  @Post('create')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'thumbnail', maxCount: 1 },
        { name: 'portfolio', maxCount: 10 },
      ],
      {
        storage: diskStorage({
          destination: './uploads',
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
      },
    ),
  )
  async createTalentCard(
    @UploadedFiles()
    files: {
      thumbnail?: Express.Multer.File[];
      portfolio?: Express.Multer.File[];
    },
    @Body() body: TalentCards,
    @Req() req: Request,
  ) {
    const thumbnailPath = files.thumbnail ? files.thumbnail[0].path : '';
    const portfolioPaths = files.portfolio
      ? files.portfolio.map((file) => file.path)
      : [];
    const talentCardData: Partial<TalentCards> = {
      ...body,
      thumbnail: thumbnailPath,
      portfolio: portfolioPaths,
      user: req['user'],
    };

    const talentCard = await this.talentService.saveTalentCard(talentCardData);
    return talentCard;
  }

  // @Put('update/:id')
  // updateTalentCard(
  //   @Param('id') talentCardId: number,
  //   @Body() newTalentCardBody: updateTalentDto,
  //   @Req() req: Request,
  // ) {
  //   console.log(talentCardId);
  //   return this.talentService.updateTalentCard(
  //     talentCardId,
  //     newTalentCardBody,
  //     req,
  //   );
  // }

  @Delete('delete/:id')
  deleteTalentCard(@Param('id') talentCardId: number, @Req() req: Request) {
    return this.talentService.deleteTalentCard(talentCardId, req);
  }
}
// function diskStorage(arg0: {
//   destination: string;
//   filename: (req: any, file: any, cb: any) => void;
// }): any {
//   throw new Error('Function not implemented.');
// }
