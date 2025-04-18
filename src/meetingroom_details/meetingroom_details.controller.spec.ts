import { Test, TestingModule } from '@nestjs/testing';
import { MeetingroomDetailsController } from './meetingroom_details.controller';
import { MeetingroomDetailsService } from './meetingroom_details.service';

describe('MeetingroomDetailsController', () => {
  let controller: MeetingroomDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeetingroomDetailsController],
      providers: [MeetingroomDetailsService],
    }).compile();

    controller = module.get<MeetingroomDetailsController>(MeetingroomDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
