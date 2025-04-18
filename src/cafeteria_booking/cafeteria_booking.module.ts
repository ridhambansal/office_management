import { Module, forwardRef } from '@nestjs/common';
import { CafeteriaBookingService } from './cafeteria_booking.service';
import { CafeteriaBookingController } from './cafeteria_booking.controller';
import { CafeteriaBooking } from './entities/cafeteria_booking.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FloorDetailsModule } from '../floor_details/floor_details.module';
import { OverallBookingModule } from '../overall_booking/overall_booking.module';
import { NotificationModule } from 'src/notification/notification.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([CafeteriaBooking]), NotificationModule, FloorDetailsModule, UserModule, forwardRef(() => OverallBookingModule)],
  controllers: [CafeteriaBookingController],
  providers: [CafeteriaBookingService],
  exports: [CafeteriaBookingService]
})
export class CafeteriaBookingModule { }
