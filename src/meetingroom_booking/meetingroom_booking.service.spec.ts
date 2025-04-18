import { Test, TestingModule } from '@nestjs/testing';
import { MeetingroomBookingService } from './meetingroom_booking.service';

describe('MeetingroomBookingService', () => {
  let service: MeetingroomBookingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MeetingroomBookingService],
    }).compile();

    service = module.get<MeetingroomBookingService>(MeetingroomBookingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
