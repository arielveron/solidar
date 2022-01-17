import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../user/models/user.entity';
import { UserService } from '../user/user.service';
import { JwtPayload } from './dto/jwt.payload';
import { LoginResponse } from './dto/login-response';
import { RolesSet } from './dto/roles-set.dto';
import { RolesService } from './roles.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private rolesService: RolesService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.findUsername(username); // replace with usersService

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
    const user: User = await this.userService.findUsername(username);
    const roles: RolesSet = this.rolesService.set(user);

    const payload: JwtPayload = {
      id: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
      ...roles,
    };

    const result: LoginResponse = {
      access_token: this.jwtService.sign({
        ...payload,
      }),
      username: username,
    };

    return result;
  }
}
