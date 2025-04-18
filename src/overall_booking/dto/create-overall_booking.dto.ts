// src/overall_booking/dto/create-overall_booking.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateOverallBookingDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}