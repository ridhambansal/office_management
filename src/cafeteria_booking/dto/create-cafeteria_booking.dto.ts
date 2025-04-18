// src/cafeteria-booking/dto/create-cafeteria-booking.dto.ts
import { ApiProperty }  from '@nestjs/swagger';
import { Type }         from 'class-transformer';
import { IsDate }       from 'class-validator';

export class CreateCafeteriaBookingDto {
  @ApiProperty({ example: '2025-04-18' })
  @Type(() => Date)
  @IsDate()
  date: Date;

  @ApiProperty({ example: '2025-04-17T05:42:03.614Z' })
  @Type(() => Date)
  @IsDate()
  start_time: Date;

  @ApiProperty({ example: '2025-04-18T06:42:03.614Z' })
  @Type(() => Date)
  @IsDate()
  end_time: Date;
}
