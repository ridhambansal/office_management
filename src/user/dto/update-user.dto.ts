import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { Role } from '../../role/entities/role.entity';

export class UpdateUserDto {
    @ApiProperty()
    first_name?: string

    @ApiProperty()
    last_name?: string

    @ApiProperty()
    role?: Role

    @ApiProperty()
    password?: string

    @ApiProperty()
    firebaseToken?: string
}
