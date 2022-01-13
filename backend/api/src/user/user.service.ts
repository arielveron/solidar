import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './models/user.entity';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { UserType } from './models/user.type';
import { CurrentDateTime } from '../util/date.helpers';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  private logger = new Logger('UserService');

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
      orgOwnerOf: [],
      hopeCreatorOf: [],
      isAdmin: false,
      enabled: true,
      createdAt: CurrentDateTime(),
    };

    const userCreated: User = this.userRepository.create(user);

    try {
      // this destructuring trick removes password from the returned object
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...savedUser } = await this.userRepository.save(
        userCreated,
      );

      this.logger.log(
        `Created User: "${savedUser.username}", Name: "${savedUser.firstName} ${savedUser.lastName}"`,
      );
      this.logger.verbose(`Created User: ${JSON.stringify(savedUser)}`);

      return savedUser;
    } catch (error) {
      this.logger.error(
        `Failed to save User "${createUserInput.username}"`,
        error.stack,
      );
      throw new InternalServerErrorException('Error saving to DB');
    }
  }

  async findOne(id: string): Promise<User> {
    return this.userRepository.findOne({ id });
  }

  async findUsername(username: string): Promise<User> {
    return this.userRepository.findOne({ username });
  }

  async listUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async save(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async getManyUsers(userIds: string[]): Promise<User[]> {
    return this.userRepository.find({
      where: {
        id: {
          $in: userIds,
        },
      },
    });
  }

  // Private methods

  private async doHashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPass = await bcrypt.hash(password, salt);

    return hashedPass;
  }
}
