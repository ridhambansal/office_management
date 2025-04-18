import { Module, forwardRef } from '@nestjs/common';
import { SeatBookingService } from './seat_booking.service';
import { SeatBookingController } from './seat_booking.controller';
import { SeatBooking } from './entities/seat_booking.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FloorDetailsModule } from '../floor_details/floor_details.module';
import { FloorDetail } from '../floor_details/entities/floor_detail.entity';
import { UserModule } from '../user/user.module';
import { OverallBookingModule } from '../overall_booking/overall_booking.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [TypeOrmModule.forFeature([SeatBooking, FloorDetail]), NotificationModule, FloorDetailsModule, UserModule, forwardRef(() => OverallBookingModule)],
  controllers: [SeatBookingController],
  providers: [SeatBookingService],
  exports: [SeatBookingService]
})
export class SeatBookingModule { }