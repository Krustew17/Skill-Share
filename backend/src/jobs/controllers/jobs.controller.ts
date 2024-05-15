import { jobsService } from '../services/jobs.service';
import { jobPostDto } from '../dto/job.post.dto';

import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  HttpException,
  HttpStatus,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { Request } from 'express';

@Controller('jobs')
export class jobsController {
  constructor(private readonly jobService: jobsService) {}

  @Get()
  getAllJobs() {
    return this.jobService.getAllJobs();
  }

  @Post('create')
  createJob(@Body() jobPostData: jobPostDto, @Req() req: Request) {
    const user = req['user'];
    if (!user) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    const userId = req['user'].id;
    return this.jobService.createJob(jobPostData, userId);
  }

  @Put('update/:id')
  updateJob(
    @Param() jobId: number,
    @Body() newJobData: jobPostDto,
    @Req() req: Request,
  ) {
    return this.jobService.updateJob(jobId, newJobData, req);
  }

  @Delete('delete/:id')
  deleteJob(@Param() jobId: number, @Req() req: Request) {
    jobId = parseInt(jobId['id']);
    return this.jobService.deleteJob(jobId, req);
  }
}
