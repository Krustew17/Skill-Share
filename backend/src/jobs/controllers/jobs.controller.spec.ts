import { Test, TestingModule } from '@nestjs/testing';
import { jobsController } from './jobs.controller';

describe('jobsController', () => {
  let controller: jobsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [jobsController],
    }).compile();

    controller = module.get<jobsController>(jobsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
