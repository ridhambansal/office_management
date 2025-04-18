import { Test, TestingModule } from '@nestjs/testing';
import { OverallBookingService } from './overall_booking.service';

describe('OverallBookingService', () => {
  let service: OverallBookingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OverallBookingService],
    }).compile();

    service = module.get<OverallBookingService>(OverallBookingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
