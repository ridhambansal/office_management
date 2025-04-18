import { Module, forwardRef } from '@nestjs/common';
import { MeetingroomBookingService } from './meetingroom_booking.service';
import { MeetingroomBookingController } from './meetingroom_booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingroomBooking } from './entities/meetingroom_booking.entity';
import { FloorDetailsModule } from '../floor_details/floor_details.module';
import { MeetingroomDetailsModule } from '../meetingroom_details/meetingroom_details.module';
import { OverallBookingModule } from '../overall_booking/overall_booking.module';
import { UserModule } from '../user/user.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [TypeOrmModule.forFeature([MeetingroomBooking]), NotificationModule, FloorDetailsModule, MeetingroomDetailsModule, UserModule, forwardRef(() => OverallBookingModule)],
  controllers: [MeetingroomBookingController],
  providers: [MeetingroomBookingService],
  exports: [MeetingroomBookingService]
})
export class MeetingroomBookingModule { }