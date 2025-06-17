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

    if (!user) {
      throw new UnauthorizedException("Usuário não encontrado")
    }

    if (user.password == undefined) {
      throw new UnauthorizedException("Senha incorreta");
    }

    if (compareSync(data.password, user.password) == false) {
      throw new UnauthorizedException("Senha incorreta");
    }

    const payload = { sub: user.id, roles: user.roles };

    return {
        access_token: await this.jwtService.signAsync(payload),
      };
  }
}