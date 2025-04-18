import { ApiProperty } from '@nestjs/swagger';

export class CreateMeetingroomBookingDto {
  @ApiProperty() token: string;
  @ApiProperty() room_id: number;
  @ApiProperty() room_name: string;
  @ApiProperty() date: Date;
  @ApiProperty() start_time: Date;
  @ApiProperty() end_time: Date;
  @ApiProperty() floorId: number;
  @ApiProperty() users: string[];
  @ApiProperty() status: boolean;
}