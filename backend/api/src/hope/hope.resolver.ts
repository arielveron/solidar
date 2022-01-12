import { Logger, UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PoliciesGuard } from '../casl/policies.guard';
import { CreateHopeInput } from './dto/create-hope.input';
import { Hope } from './models/hope.entity';
import { HopeService } from './hope.service';
import { HopeType } from './models/hope.type';
import { AppAbility, CaslAbilityFactory } from '../casl/casl-ability.factory';
import { User } from '../user/models/user.entity';
import { Action } from '../auth/actions/action.enum';
import { CheckPolicies } from '../casl/check-policies.decorator';
import { UserService } from '../user/user.service';
import { UserType } from '../user/models/user.type';

@Resolver(() => HopeType)
export class HopeResolver {
  private logger = new Logger('HopeResolver');

  constructor(
    private hopeService: HopeService,
    private caslAbilityFactory: CaslAbilityFactory,
    private userService: UserService,
  ) {}

  /// Get a specific Hope

  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Hope))
  @Query(() => HopeType)
  async hope(@Args('id') id: string, @Context() ctx): Promise<Hope> {
    const hope: Hope = await this.hopeService.getHope(id);
    const user: User = ctx.req.user;

    this.caslAbilityFactory.checkPolicy(user, Action.Read, hope);
    return hope;
  }

  /// Get Hopes

  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Hope))
  @Query(() => [HopeType])
  hopes(@Context() ctx): Promise<Hope[]> {
    const user: User = ctx.req.user;

    this.logger.log(`User "${user.username}" requested all the Hopes`);

    return this.hopeService.getHopes();
  }

  /// Create a hope

  @Mutation(() => HopeType)
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, Hope))
  async createHope(
    @Args('createHopeInput') createHopeInput: CreateHopeInput,
    @Context() ctx,
  ): Promise<Hope> {
    const hope: Hope = await this.hopeService.createHope(
      createHopeInput,
      ctx.req.user,
    );
    return hope;
  }

  /// Resolvers - Functions to instruct GraphQL on how to connect fields with entities
  @ResolveField(() => UserType)
  async createdBy(@Parent() hope: HopeType): Promise<UserType | []> {
    if (hope.createdBy != null) {
      return this.userService.findOne(hope.createdBy);
    }
    return [];
  }
}
