import { Test, TestingModule } from '@nestjs/testing';
import { FightController } from './fight.controller';
import { FightService } from './fight.service';

describe('FightController', () => {
  let controller: FightController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FightController],
      providers: [FightService],
    }).compile();

    controller = module.get<FightController>(FightController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
