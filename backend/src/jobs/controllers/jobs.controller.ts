import { jobsService } from '../services/jobs.service';
import { jobPostDto } from '../dto/job.post.dto';

import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('jobs')
export class jobsController {
  constructor(private readonly jobService: jobsService) {}

  @Post('create')
  createJob(@Body() jobPostData: jobPostDto, @Req() req: Request) {
    const userId = req['user'].id;
    return this.jobService.createJob(jobPostData, userId);
  }
}
