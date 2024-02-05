import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/service/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserDTO, userToUserDTO } from 'src/user/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.userService.getUserByEmail(email);
    if (!user || user.password !== password) throw new UnauthorizedException();
    const payload = { sub: user.id, username: user.email, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async getUserByEmail(email: string): Promise<UserDTO> {
    const user = await this.userService.getUserByEmail(email);
    if (!user) return null;

    const userDTO = userToUserDTO(user);

    return userDTO;
  }
}
