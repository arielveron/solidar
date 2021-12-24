import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginResponse } from './dto/login-response';

@Injectable()
export class AuthService {
  private users = [{ username: 'ariel', password: this.createPass('test') }];

  constructor(private jwtService: JwtService) {}

  async validateUser(username: string, password: string) {
    const user = await this.users.find((user) => user.username); // replace with usersService

    const valid = await bcrypt.compare(password, user?.password);
    if (user && valid) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // to enable using mock DB
  createPass(password: string): string {
    const hashedPass = bcrypt.hashSync(password, 10);
    return hashedPass;
  }

  async login(username: string): Promise<LoginResponse> {
    const result: LoginResponse = {
      access_token: this.jwtService.sign({
        username: username,
      }),
      user: username,
    };

    return result;
  }
}
