import { Logger } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from './dto/create-user.input';
import { CreateUserReturn } from './dto/create-user.return';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  private logger = new Logger('UserResolver');
  constructor(private userService: UserService) {}

  @Mutation(() => CreateUserReturn)
  createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<CreateUserReturn> {
    return this.userService.createUser(createUserInput);
  }
}
