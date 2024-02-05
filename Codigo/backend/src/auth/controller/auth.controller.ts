import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '../guard/auth.guard';
import { AuthService } from '../service/auth.service';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @HttpCode(HttpStatus.OK)
  @Post()
  async signIn(
    @Body(ValidationPipe) body: { password: string; email: string },
  ): Promise<{ access_token: string }> {
    return this.authService.signIn(body.email, body.password);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/info')
  @UseGuards(AuthGuard)
  async getProfile(@Request() req): Promise<{ email: string; id: string }> {
    const user = await this.authService.getUserByEmail(req.user.username);

    if (!user) throw new UnauthorizedException();

    return user;
  }
}
