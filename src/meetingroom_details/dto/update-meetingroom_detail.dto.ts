import { PartialType } from '@nestjs/swagger';
import { CreateMeetingroomDetailDto } from './create-meetingroom_detail.dto';

export class UpdateMeetingroomDetailDto extends PartialType(CreateMeetingroomDetailDto) {}
