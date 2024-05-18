import { TalentService } from '../services/talent.service';
import { createTalentDto } from '../dto/create.talent.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { updateTalentDto } from '../dto/update.talent.dto';

@Controller('talent')
export class TalentController {
  constructor(private readonly talentService: TalentService) {}

  @Get('all')
  getAllTalentCards() {
    return this.talentService.getAllTalents();
  }

  @Post('create')
  createTalentCard(
    @Body() createTalentBody: createTalentDto,
    @Req() req: Request,
  ) {
    return this.talentService.createTalentCard(createTalentBody, req);
  }

  @Put('update/:id')
  updateTalentCard(
    @Param('id') talentCardId: number,
    @Body() newTalentCardBody: updateTalentDto,
    @Req() req: Request,
  ) {
    console.log(talentCardId);
    return this.talentService.updateTalentCard(
      talentCardId,
      newTalentCardBody,
      req,
    );
  }

  @Delete('delete/:id')
  deleteTalentCard(@Param('id') talentCardId: number, @Req() req: Request) {
    return this.talentService.deleteTalentCard(talentCardId, req);
  }
}
