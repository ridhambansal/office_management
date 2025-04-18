// src/overall_booking/dto/update-overall_booking.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateOverallBookingDto } from './create-overall_booking.dto';

export class UpdateOverallBookingDto extends PartialType(CreateOverallBookingDto) {
  // you can add optional date/start_time/end_time here if needed,
  // but PartialType covers token already.
}