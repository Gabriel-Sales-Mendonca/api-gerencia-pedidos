import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compareSync } from 'bcrypt';

import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

interface ILogin {
    email: string,
    password: string
}

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async signIn(data: ILogin): Promise<{ access_token: string }> {
    const user = await this.usersService.findByEmail(data.email);

    if (user?.password == undefined) {
        throw new UnauthorizedException();
    }

    if (compareSync(data.password, user.password) == false) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.email, roles: user.roles };

    return {
        access_token: await this.jwtService.signAsync(payload),
      };
  }
}
