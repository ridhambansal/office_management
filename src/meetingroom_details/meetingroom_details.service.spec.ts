import { Test, TestingModule } from '@nestjs/testing';
import { MeetingroomDetailsService } from './meetingroom_details.service';

describe('MeetingroomDetailsService', () => {
  let service: MeetingroomDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MeetingroomDetailsService],
    }).compile();

    service = module.get<MeetingroomDetailsService>(MeetingroomDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
