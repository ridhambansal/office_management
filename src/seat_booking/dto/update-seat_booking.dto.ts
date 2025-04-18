import { PartialType } from '@nestjs/swagger';
import { CreateSeatBookingDto } from './create-seat_booking.dto';

export class UpdateSeatBookingDto extends PartialType(CreateSeatBookingDto) {}