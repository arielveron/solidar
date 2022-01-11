import { Logger, UseGuards, UnauthorizedException } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from './dto/create-user.input';
import { UserType } from './models/user.type';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CheckPolicies } from '../casl/check-policies.decorator';
import { AppAbility } from '../casl/casl-ability.factory';
import { Action } from '../auth/actions/action.enum';
import { User } from './models/user.entity';
import { PoliciesGuard } from '../casl/policies.guard';

@Resolver()
export class UserResolver {
  private logger = new Logger('UserResolver');
  constructor(private userService: UserService) {}

  /// Create User

  @Mutation(() => UserType)
  createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<UserType> {
    return this.userService.createUser(createUserInput);
  }

  /// List Users

  @Query(() => [UserType])
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, User))
  listUsers(@Context() ctx): Promise<UserType[]> {
    // temporarily allow access to read users only to Admins
    // later this endpoint can automatically list the users linked to a NGO if the user is a NGOAdmin
    const user: User = ctx.req.user;
    if (!user.isAdmin) {
      throw new UnauthorizedException();
    }

    this.logger.log(`User "${user.username}" requested all the Users`);

    return this.userService.listUsers();
  }
}
