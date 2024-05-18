import { jobsService } from '../services/jobs.service';
import { jobPostDto } from '../dto/job.post.dto';
import { filtersDto } from '../dto/filters.dto';

import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Put,
  Param,
  Delete,
  Query,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  Res,
} from '@nestjs/common';

import { Request, Response } from 'express';
import { AuthInterceptor } from 'src/auth/interceptors/auth.interceptor';

@Controller('jobs')
@UseInterceptors(AuthInterceptor)
export class jobsController {
  constructor(private readonly jobService: jobsService) {}

  @Get()
  getAllJobs() {
    return this.jobService.getAllJobs();
  }

  @Get('filters')
  @UsePipes(new ValidationPipe({ transform: true }))
  async filterJobs(@Query() filters: filtersDto) {
    return await this.jobService.filterJobs(filters);
  }

  @Get('user/:id')
  getAllJobsByUserId(@Param('id') UserId: number) {
    return this.jobService.getAllJobsByUser(UserId);
  }

  @Post('create')
  createJob(@Body() jobPostData: jobPostDto, @Req() req: Request) {
    return this.jobService.createJob(jobPostData, req);
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
