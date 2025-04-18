import { Test, TestingModule } from '@nestjs/testing';
import { FloorDetailsService } from './floor_details.service';

describe('FloorDetailsService', () => {
  let service: FloorDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FloorDetailsService],
    }).compile();

    service = module.get<FloorDetailsService>(FloorDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
