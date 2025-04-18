// src/overall_booking/overall_booking.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OverallBookingService }    from './overall_booking.service';
import { OverallBookingController } from './overall_booking.controller';
import { OverallBooking }           from './entities/overall_booking.entity';

import { MeetingroomBookingModule } from '../meetingroom_booking/meetingroom_booking.module';
import { SeatBookingModule }        from '../seat_booking/seat_booking.module';
import { CafeteriaBookingModule }   from '../cafeteria_booking/cafeteria_booking.module';
import { EventsModule }             from '../events/events.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OverallBooking]),
    EventsModule,
    forwardRef(() => MeetingroomBookingModule),
    forwardRef(() => SeatBookingModule),
    forwardRef(() => CafeteriaBookingModule),
  ],
  controllers: [OverallBookingController],
  providers: [OverallBookingService],
  exports: [OverallBookingService],
})
export class OverallBookingModule {}