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
      return {
        username: user.username,
      };
    }
    return null;
  }

  // to enable using mock DB -- remove when proper DB is implemented
  createPass(password: string): string {
    const hashedPass = bcrypt.hashSync(password, 10);
    return hashedPass;
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
