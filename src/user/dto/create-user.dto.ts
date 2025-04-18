import { ApiProperty } from "@nestjs/swagger";
import { Role } from "../../role/model/role.enum";

export class CreateUserDto {
    @ApiProperty()
    first_name: string

    @ApiProperty()
    last_name: string

    @ApiProperty()
    email: string

    @ApiProperty()
    password: string

    @ApiProperty()
    role: Role

    @ApiProperty()
    firebaseToken:string
}
