import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private users = [{ username: 'ariel', password: this.createPass('test') }];

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

  createPass(password: string): string {
    const hashedPass = bcrypt.hashSync(password, 10);
    return hashedPass;
  }
}
