import { Test, TestingModule } from '@nestjs/testing';
import { MeetingroomBookingController } from './meetingroom_booking.controller';
import { MeetingroomBookingService } from './meetingroom_booking.service';

describe('MeetingroomBookingController', () => {
  let controller: MeetingroomBookingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeetingroomBookingController],
      providers: [MeetingroomBookingService],
    }).compile();

    controller = module.get<MeetingroomBookingController>(MeetingroomBookingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
