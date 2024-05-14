import { jobsService } from './jobs.service';

import { Test, TestingModule } from '@nestjs/testing';

describe('jobsService', () => {
  let service: jobsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [jobsService],
    }).compile();

    service = module.get<jobsService>(jobsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
