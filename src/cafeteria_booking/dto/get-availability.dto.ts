import { ApiProperty } from "@nestjs/swagger";

export class GetAvailaBilityDto {
    @ApiProperty()
    date: Date

    @ApiProperty()
    start_time: Date

    @ApiProperty()
    end_time: Date
}
