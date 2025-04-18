import { ApiProperty } from "@nestjs/swagger";

export class GetAvailabilityDto{
    @ApiProperty()
    date: Date

    @ApiProperty()
    start_time: Date

    @ApiProperty()
    end_time: Date

    @ApiProperty()
    capacity: number
}