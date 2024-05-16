import { Job } from '../jobs.entity';
import { jobPostDto } from '../dto/job.post.dto';
import { filtersDto } from '../dto/filters.dto';

import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Request } from 'express';

const FILTERS = {
  sortBy: {
    title: 'title',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
  skills: ['node', 'react', 'javascript', 'c++', 'python', 'typescript'],
};

@Injectable()
export class jobsService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
  ) {}

  async getAllJobs() {
    return await this.jobRepository.find();
  }

  async getAllJobsByUser(id: number) {
    return await this.jobRepository.find({ where: { userId: id } });
  }

  async createJob(jobData: jobPostDto, userId: number) {
    const job = this.jobRepository.create({ ...jobData, userId });
    return this.jobRepository.save(job);
  }

  async updateJob(jobId: number, newJobData: jobPostDto, req: Request) {
    const job = await this.jobRepository.findOneBy({ id: jobId['id'] });
    const user = req['user'];

    if (user.id !== job.userId) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    if (!job) {
      throw new HttpException('Job not found', HttpStatus.NOT_FOUND);
    }

    await this.jobRepository.update({ id: jobId['id'] }, { ...newJobData });
    return {
      message: 'Job updated successfully',
      HttpStatus: HttpStatus.OK,
    };
  }

  async deleteJob(jobId: number, req: Request) {
    const job = await this.jobRepository.findOneBy({ id: jobId });
    if (!job) {
      throw new HttpException('Job not found', HttpStatus.NOT_FOUND);
    }
    const user = req['user'];
    if (user.id !== job.userId || !user) {
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

    console.log(query.getSql());
    const jobs_found = await query.getMany();
    return { data: jobs_found, amount_jobs: jobs_found.length };
  }
}
