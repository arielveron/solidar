import { Logger, UseGuards, UnauthorizedException } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CreateUserInput } from './dto/create-user.input';
import { UserType } from './models/user.type';
import { UserService } from './user.service';
import { CheckPolicies } from '../casl/check-policies.decorator';
import { AppAbility } from '../casl/casl-ability.factory';
import { Action } from '../auth/actions/action.enum';
import { User } from './models/user.entity';
import { PoliciesGuard } from '../casl/policies.guard';
import { OrgType } from '../org/models/org.type';
import { OrgService } from '../org/org.service';
import { Org } from '../org/models/org.entity';
import { CurrentUser } from '../util/current-user.decorator';
import { JwtPayload } from '../auth/dto/jwt.payload';
import { SetAsPublic } from '../auth/decorators/set-as-public.decorator';

@Resolver(() => UserType)
export class UserResolver {
  private logger = new Logger('UserResolver');
  constructor(
    private userService: UserService,
    private orgService: OrgService,
  ) {}

  /// Create User

  @SetAsPublic()
  @Mutation(() => UserType)
  createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<UserType> {
    return this.userService.createUser(createUserInput);
  }

  /// List Users

  @Query(() => [UserType])
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, User))
  users(@CurrentUser() user: JwtPayload): Promise<UserType[]> {
    // temporarily allow access to read users only to Admins
    // later this endpoint can automatically list the users linked to a NGO if the user is a NGOAdmin
    if (!user.isAdmin) {
      throw new UnauthorizedException();
    }

    this.logger.log(`User "${user.username}" requested all the Users`);

    return this.userService.listUsers();
  }

  // List User
  @Query(() => UserType)
  async user(@Args('id') id: string) {
    const user: User = await this.userService.findOne(id);

    if (!user) throw new Error(`The user "${id}" was not found`);
    return user;
  }

  /// Resolvers
  @ResolveField(() => [OrgType])
  async orgOwnerOf(@Parent() user: UserType): Promise<Org[] | []> {
    if (user.orgOwnerOf != null) {
      return this.orgService.getManyOrgs(user.orgOwnerOf);
    }
    return [];
  }

  @ResolveField(() => [OrgType])
  async hopeCreatorOf(@Parent() user: UserType): Promise<Org[] | []> {
    if (user.hopeCreatorOf != null) {
      return this.orgService.getManyOrgs(user.hopeCreatorOf);
    }
    return [];
  }
}
