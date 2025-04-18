// src/seat_booking/dto/create-seat_booking.dto.ts
import {
  IsDateString,
  IsInt,
  Min,
  IsBoolean,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  IsString,
} from 'class-validator';

export class CreateSeatBookingDto {
  @IsDateString()         date: string;
  @IsInt()                floor_number: number;
  @IsBoolean()            status: boolean;

  @IsOptional()
  @IsString()             token?: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  seat_no?: string[];

  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  users?: string[];
}