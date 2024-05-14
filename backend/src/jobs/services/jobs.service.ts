import { Job } from '../jobs.entity';
import { jobPostDto } from '../dto/job.post.dto';

import { Injectable, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class jobsService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
  ) {}

  async createJob(jobData: jobPostDto, userId: number) {
    const job = this.jobRepository.create({ ...jobData, userId });
    return this.jobRepository.save(job);
  }
}
