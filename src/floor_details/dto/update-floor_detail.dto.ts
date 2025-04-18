import { PartialType } from '@nestjs/swagger';
import { CreateFloorDetailDto } from './create-floor_detail.dto';

export class UpdateFloorDetailDto extends PartialType(CreateFloorDetailDto) {}
