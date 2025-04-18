// meetingroom-details.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingroomDetailsService } from './meetingroom_details.service';
import { MeetingroomDetailsController } from './meetingroom_details.controller';
import { MeetingroomDetail } from './entities/meetingroom_detail.entity';
// ← Add this:
import { FloorDetail } from '../floor_details/entities/floor_detail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MeetingroomDetail,
      FloorDetail,      // ← so we can inject the FloorDetail repo
    ]),
  ],
  controllers: [MeetingroomDetailsController],
  providers: [MeetingroomDetailsService],
  exports: [MeetingroomDetailsService],
})
export class MeetingroomDetailsModule {}