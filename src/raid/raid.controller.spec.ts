import { Test, TestingModule } from '@nestjs/testing';
import { RaidController } from './raid.controller';
import { RaidService } from './raid.service';

describe('RaidController', () => {
  let controller: RaidController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RaidController],
      providers: [RaidService],
    }).compile();

    controller = module.get<RaidController>(RaidController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
