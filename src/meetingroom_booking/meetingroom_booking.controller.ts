import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MeetingroomBookingService } from './meetingroom_booking.service';
import { CreateMeetingroomBookingDto } from './dto/create-meetingroom_booking.dto';
import { UpdateMeetingroomBookingDto } from './dto/update-meetingroom_booking.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetAvailabilityDto } from './dto/get-availability.dto';
import { AccessTokenGuard } from '../auth/access-token-guard';

@ApiTags('Meeting room booking')
// @ApiBearerAuth('access-token')
// @UseGuards(AccessTokenGuard)
@Controller('meetingroom-booking')
export class MeetingroomBookingController {
  constructor(private readonly meetingroomBookingService: MeetingroomBookingService) {}

  @Post()
  create(@Body() createMeetingroomBookingDto: CreateMeetingroomBookingDto) {
    return this.meetingroomBookingService.create(createMeetingroomBookingDto);
  }

  @Get()
  findAll() {
    return this.meetingroomBookingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.meetingroomBookingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMeetingroomBookingDto: UpdateMeetingroomBookingDto) {
    return this.meetingroomBookingService.update(+id, updateMeetingroomBookingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.meetingroomBookingService.remove(+id);
  }

  //get by user email
  @Get('token/:token')
  getByToken(@Param('token') token: string){
    return this.meetingroomBookingService.findByToken(token)
  }

  //get total available rooms based on current date and time
  @Get('available/availableRoomCount')
  getAvailableRoomCount(){
    return this.meetingroomBookingService.getTotalAvailability()
  }

  //get available room names based on date, time and capacity
  @Post('booking/available')
  getAvailableByTime(@Body() getAvailability: GetAvailabilityDto){
    return this.meetingroomBookingService.getAvailabilityByTime(getAvailability)
  }
}