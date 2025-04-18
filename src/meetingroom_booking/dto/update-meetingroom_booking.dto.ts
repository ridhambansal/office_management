import { ApiProperty } from '@nestjs/swagger';

export class UpdateMeetingroomBookingDto {
  @ApiProperty({ required: false }) room_id?: number;
  @ApiProperty({ required: false }) room_name?: string;
  @ApiProperty({ required: false }) date?: Date;
  @ApiProperty({ required: false }) start_time?: Date;
  @ApiProperty({ required: false }) end_time?: Date;
  @ApiProperty({ required: false }) floorId?: number;
  @ApiProperty({ required: false }) users?: string[];
  @ApiProperty({ required: false }) status?: boolean;
}