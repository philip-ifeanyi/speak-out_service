import { Test, TestingModule } from '@nestjs/testing';
import { GrievancesController } from './grievances.controller';
import { GrievancesService } from './grievances.service';

describe('GrievancesController', () => {
  let controller: GrievancesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GrievancesController],
      providers: [GrievancesService],
    }).compile();

    controller = module.get<GrievancesController>(GrievancesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
