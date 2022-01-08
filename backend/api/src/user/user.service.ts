import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './models/user.entity';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { UserType } from './models/user.type';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createUser(createUserInput: CreateUserInput): Promise<UserType> {
    const hashedPass: string = await this.doHashPassword(
      createUserInput.password,
    );

    const user: User = {
      _id: null,
      id: uuid(),
      username: createUserInput.username,
      password: hashedPass,
      firstName: createUserInput.firstName,
      lastName: createUserInput.lastName,
      isAdmin: false,
      enabled: true,
      createdAt: Date.now().toLocaleString(),
    };

    const userCreated: User = this.userRepository.create(user);
    return this.userRepository.save(userCreated);
  }

  async findOne(username: string): Promise<User> {
    return this.userRepository.findOne({ username });
  }

  async listUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  // Private methods

  private async doHashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPass = await bcrypt.hash(password, salt);

    return hashedPass;
  }
}
