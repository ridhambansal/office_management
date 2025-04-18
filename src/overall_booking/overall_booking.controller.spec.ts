import { Test, TestingModule } from '@nestjs/testing';
import { OverallBookingController } from './overall_booking.controller';
import { OverallBookingService } from './overall_booking.service';

describe('OverallBookingController', () => {
  let controller: OverallBookingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OverallBookingController],
      providers: [OverallBookingService],
    }).compile();

    controller = module.get<OverallBookingController>(OverallBookingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
