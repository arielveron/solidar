import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { CreateUserReturn } from './dto/create-user.return';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createUser(
    createUserInput: CreateUserInput,
  ): Promise<CreateUserReturn> {
    const hashedPass = await bcrypt.hash(createUserInput.password, 10);

    const user: User = {
      _id: null,
      id: uuid(),
      username: createUserInput.username,
      password: hashedPass,
      firstName: createUserInput.firstName,
      lastName: createUserInput.lastName,
    };

    const userCreated: User = this.userRepository.create(user);
    return this.userRepository.save(userCreated);
  }
}
