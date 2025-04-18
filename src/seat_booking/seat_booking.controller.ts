import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SeatBookingService } from './seat_booking.service';
import { CreateSeatBookingDto } from './dto/create-seat_booking.dto';
import { UpdateSeatBookingDto } from './dto/update-seat_booking.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Seat Booking')
@Controller('seat-booking')
export class SeatBookingController {
  constructor(private readonly seatBookingService: SeatBookingService) {}

  @Post()
  create(@Body() createSeatBookingDto: CreateSeatBookingDto) {
    return this.seatBookingService.create(createSeatBookingDto);
  }

  @Get()
  findAll() {
    return this.seatBookingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.seatBookingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSeatBookingDto: CreateSeatBookingDto) {
    return this.seatBookingService.update(+id, updateSeatBookingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.seatBookingService.remove(+id);
  }

  @Get('booking/:token')
  getByToken(@Param('token') token: string){
    return this.seatBookingService.getByToken(token)
  }

  @Get('availability/:date')
getAvailDate(@Param('date') date: string) {
  return this.seatBookingService.getAvailDate(new Date(date));
}

@Get('availabilityFloorWise/:date')
getAvailDateFloor(@Param('date') date: string) {
  return this.seatBookingService.getAvailDateFloor(new Date(date));
}
}