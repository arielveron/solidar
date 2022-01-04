import { Logger } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from './dto/create-user.input';
import { UserType } from './models/user.type';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  private logger = new Logger('UserResolver');
  constructor(private userService: UserService) {}

  @Mutation(() => UserType)
  createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<UserType> {
    return this.userService.createUser(createUserInput);
  }
}
