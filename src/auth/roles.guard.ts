// roles.guard.ts
import { Injectable, CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '../user/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    // console.log(roles)
    const request = context.switchToHttp().getRequest();
    const user: User = request.user
    const req = context.switchToHttp().getRequest<Request>();
    console.log('🔐 Guard saw header:', req.headers['authorization']);
    // console.log(user)
    if (!user || !user.role) {
      return false;
    }
    // console.log("In role guard",user)

    return roles.some(role => user?.role.includes(role));
    // return false
  }
}
