import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateEventDto } from './create-event.dto';

export class UpdateEventDto {
    @ApiProperty()
    event_name?: string;
    @ApiProperty()
    date?: Date;
    @ApiProperty()
    description?: string
}
