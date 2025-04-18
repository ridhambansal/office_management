// auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(payload: any): Promise<User> {
    console.log("paylod", payload)
    const user = await this.usersService.findOne(payload.email);
    console.log("after finding",user)
    if (!user) {
      throw new UnauthorizedException('Invalid user');
    }
    console.log("Validation", user)
    return user[0];
  }

  async login(user: User): Promise<{ access_token: string }> {
    console.log("in login", user)
    const payload = { sub: user.email };
    const access_token = this.jwtService.sign(payload);
    return { access_token };
  }
}
