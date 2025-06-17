import { Body, Controller, Post, HttpCode, HttpStatus, Res, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/decorators/public.decorator';
import { Response } from 'express';
import { AuthenticatedRequest } from 'src/interfaces/authenticated-request.interface';
import { ILogin } from 'src/interfaces/login.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() signInDto: ILogin,
    @Res({ passthrough: true }) res: Response
  ) {
    const { access_token } = await this.authService.signIn(signInDto);

    console.log("Já gerei o token")

    res.cookie('token', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
      domain: '.vercel.app'
    });

    return { message: 'Login realizado com sucesso' };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      domain: '.vercel.app'
    });
    return { message: 'Logout efetuado com sucesso' };
  }

  @Get('me')
  getMe(@Req() req: AuthenticatedRequest) {
    return req.user;
  }

}
