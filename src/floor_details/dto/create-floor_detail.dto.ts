import { ApiProperty } from "@nestjs/swagger";

export class CreateFloorDetailDto {
    @ApiProperty()
    floor_number: number

    @ApiProperty()
    floor_name: string

    @ApiProperty()
    capacity: number

    @ApiProperty()
    no_meeting_rooms: number

    @ApiProperty()
    starting_seat_no: string

    @ApiProperty()
    ending_seat_no: string
}
