import { Job } from '../jobs.entity';
import { jobPostDto } from '../dto/job.post.dto';
import { filtersDto } from '../dto/filters.dto';

import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Request } from 'express';

@Injectable()
export class jobsService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
  ) {}

  async getAllJobs() {
    return await this.jobRepository.find();
  }

  async getAllJobsByUser(userId: number): Promise<Job[]> {
    return await this.jobRepository.find({ where: { user: { id: userId } } });
  }

  async createJob(jobData: jobPostDto, req: Request) {
    const user = req['user'];
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const job = this.jobRepository.create({ ...jobData, user: user });
    return this.jobRepository.save(job);
  }

  async updateJob(jobId: number, newJobData: jobPostDto, req: Request) {
    const jobID = parseInt(jobId['id']);
    const job = await this.jobRepository.findOne({
      where: { id: jobID },
      relations: ['user'],
    });

    if (!job) {
      throw new HttpException('Job not found', HttpStatus.NOT_FOUND);
    }

    const user = req['user'];

    if (user.id !== job.user.id) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    if (!job) {
      throw new HttpException('Job not found', HttpStatus.NOT_FOUND);
    }

    await this.jobRepository.update({ id: jobID }, { ...newJobData });
    return {
      message: 'Job updated successfully',
      HttpStatus: HttpStatus.OK,
    };
  }

  async deleteJob(jobId: number, req: Request) {
    const job = await this.jobRepository.findOne({
      where: { id: jobId },
      relations: ['user'],
    });
    if (!job) {
      throw new HttpException('Job not found', HttpStatus.NOT_FOUND);
    }

    const user = req['user'];

    if (user.id !== job.user.id || !user) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    await this.jobRepository.delete({ id: jobId });
    return {
      message: 'Job deleted successfully',
      HttpStatus: HttpStatus.OK,
    };
  }

  async filterJobsBySkills(skills: Array<string>) {
    return this.jobRepository
      .createQueryBuilder('job')
      .where('job.skills && :skillsArr', { skillsArr: skills })
      .getMany();
  }
  async filterJobs(filters: filtersDto) {
    let data: object;
    const query = this.jobRepository.createQueryBuilder('job');

    if (filters.search) {
      query.where(
        '(job.title ILIKE :search OR job.description ILIKE :search)',
        {
          search: `%${filters.search}%`,
        },
      );
    }
    if (filters.pay !== undefined) {
      query.andWhere('job.pay >= :pay', { pay: filters.pay });
    }
    // const skillsArr = filters.skills.toString().split(',');
    // if (skillsArr && skillsArr.length > 0) {
    //   for (let i = 0; i < skillsArr.length; i++) {
    //     const paramName = `skillsArr${i}`;
    //     query.andWhere(`:paramName = ANY(job.skills)`, {
    //       [paramName]: skillsArr[i],
    //     });
    //   }
    // }

    if (filters.order) {
      const [key, orderBy] = filters.order.split(':');
      const direction = orderBy.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
      query.orderBy(`job.${key} `, direction);
    }

    const jobs_found = await query.getMany();
    return { data: jobs_found, amount_jobs: jobs_found.length };
  }
}
