import { Test, TestingModule } from '@nestjs/testing';
import { SeatBookingController } from './seat_booking.controller';
import { SeatBookingService } from './seat_booking.service';

describe('SeatBookingController', () => {
  let controller: SeatBookingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SeatBookingController],
      providers: [SeatBookingService],
    }).compile();

    controller = module.get<SeatBookingController>(SeatBookingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
