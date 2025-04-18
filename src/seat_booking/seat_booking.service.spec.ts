import { Test, TestingModule } from '@nestjs/testing';
import { SeatBookingService } from './seat_booking.service';

describe('SeatBookingService', () => {
  let service: SeatBookingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SeatBookingService],
    }).compile();

    service = module.get<SeatBookingService>(SeatBookingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
