import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MeetingroomDetailsService } from './meetingroom_details.service';
import { CreateMeetingroomDetailDto } from './dto/create-meetingroom_detail.dto';
import { UpdateMeetingroomDetailDto } from './dto/update-meetingroom_detail.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Meeting room details')
@Controller('meetingroom-details')
export class MeetingroomDetailsController {
  constructor(private readonly meetingroomDetailsService: MeetingroomDetailsService) {}

  @Post()
  create(@Body() createMeetingroomDetailDto: CreateMeetingroomDetailDto) {
    return this.meetingroomDetailsService.create(createMeetingroomDetailDto);
  }

  @Get()
  findAll() {
    return this.meetingroomDetailsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.meetingroomDetailsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMeetingroomDetailDto: UpdateMeetingroomDetailDto) {
    return this.meetingroomDetailsService.update(+id, updateMeetingroomDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.meetingroomDetailsService.remove(+id);
  }
}