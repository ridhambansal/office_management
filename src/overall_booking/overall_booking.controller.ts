// src/overall_booking/overall_booking.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OverallBookingService } from './overall_booking.service';
import { CreateOverallBookingDto } from './dto/create-overall_booking.dto';
import { UpdateOverallBookingDto } from './dto/update-overall_booking.dto';

@ApiTags('Overall Booking')
@Controller('overall-booking')
export class OverallBookingController {
  constructor(private readonly svc: OverallBookingService) {}

  /** Roll up existing bookings into overall_booking */
  @Post()
  create(@Body() dto: CreateOverallBookingDto) {
    return this.svc.add(dto);
  }

  @Get()
  findAll() {
    return this.svc.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.svc.findOne(+id);
  }

  /** Update date/time window for a specific amenity booking */
  @Patch(':amenity/:id')
  update(
    @Param('amenity') amenity: string,
    @Param('id') id: string,
    @Body() dto: UpdateOverallBookingDto,      // can contain date, start_time, end_time
  ) {
    return this.svc.update(+id, dto as any, amenity);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.svc.remove(+id);
  }

  @Get('homescreen_api/:token')
  homescreenAPI(@Param('token') token: string) {
    return this.svc.homescreenAPI(token);
  }
}