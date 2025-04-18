import { Test, TestingModule } from '@nestjs/testing';
import { FloorDetailsController } from './floor_details.controller';
import { FloorDetailsService } from './floor_details.service';

describe('FloorDetailsController', () => {
  let controller: FloorDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FloorDetailsController],
      providers: [FloorDetailsService],
    }).compile();

    controller = module.get<FloorDetailsController>(FloorDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
