import { ApiProperty } from "@nestjs/swagger";

export class CreateMeetingroomDetailDto {
    @ApiProperty()
    room_name: string

    @ApiProperty()
    capacity: number

    @ApiProperty()
    floor_number: number
}