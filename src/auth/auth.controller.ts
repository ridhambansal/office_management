// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDTO } from '../user/dto/login-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from '../user/user.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginUserDTO) {
    const user = await this.authService.validateUser(loginDto);
    const { access_token } = await this.authService.login(user);
    const result = await this.userService.addToken(
      user.email,
      access_token,
      loginDto.firebaseToken,
    );
    let updatedUser;
    if (Array.isArray(result)) {
      updatedUser = result[0];
    } else {
      updatedUser = result;
    }

    if (!updatedUser) {
      throw new InternalServerErrorException(
        'Failed to update user with Firebase token',
      );
    }
    const { password, ...safeUser } = updatedUser;
    return safeUser;
  }
}
