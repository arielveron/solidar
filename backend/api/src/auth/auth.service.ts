import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { LoginResponse } from './dto/login-response';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.findOne(username); // replace with usersService

    const valid = await bcrypt.compare(password, user?.password);
    if (user && valid) {
      return {
        username: user.username,
      };
    }
    return null;
  }

  async login(username: string): Promise<LoginResponse> {
    // TODO: use a type to put JWT data
    const result: LoginResponse = {
      access_token: this.jwtService.sign({
        username: username,
      }),
      user: username,
    };

    return result;
  }
}
