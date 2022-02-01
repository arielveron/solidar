import { Logger, UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { PoliciesGuard } from '../casl/policies.guard';
import { CreateHopeInput } from './dto/create-hope.input';
import { Hope } from './models/hope.entity';
import { HopeService } from './hope.service';
import { HopeType } from './models/hope.type';
import { AppAbility, CaslAbilityFactory } from '../casl/casl-ability.factory';
import { Action } from '../casl/actions/action.enum';
import { CheckPolicies } from '../casl/check-policies.decorator';
import { UserService } from '../user/user.service';
import { UserType } from '../user/models/user.type';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/dto/jwt.payload';
import { OrgType } from '../org/models/org.type';
import { OrgService } from '../org/org.service';

@Resolver(() => HopeType)
export class HopeResolver {
  private logger = new Logger('HopeResolver');

  constructor(
    private hopeService: HopeService,
    private caslAbilityFactory: CaslAbilityFactory,
    private userService: UserService,
    private orgService: OrgService,
  ) {}

  /// Get a specific Hope

  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Hope))
  @Query(() => HopeType)
  async hope(
    @Args('id') id: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<Hope> {
    const hope: Hope = await this.hopeService.getHope(id);

    this.caslAbilityFactory.checkPolicy(user, Action.Read, hope);
    if (!hope) throw new Error(`The hope "${id}" was not found`);

    return hope;
  }

  /// Get Hopes

  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Hope))
  @Query(() => [HopeType])
  async hopes(@CurrentUser() user: JwtPayload): Promise<Hope[]> {
    this.logger.log(`User "${user.username}" requested all the Hopes`);

    return this.hopeService.getHopes();
  }

  /// Create a hope

  @Mutation(() => HopeType)
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, Hope))
  async createHope(
    @Args('createHopeInput') createHopeInput: CreateHopeInput,
    @CurrentUser() userJwt: JwtPayload,
  ): Promise<Hope> {
    const user = await this.userService.findOne(userJwt.id);
    const { forOrg } = createHopeInput;

    if (
      !(
        user.orgOwnerOf?.includes(forOrg) ||
        user.hopeCreatorOf?.includes(forOrg)
      )
    )
      throw new Error(`User has no permissions to create Hopes for ${forOrg}`);

    const hope: Hope = await this.hopeService.createHope(
      createHopeInput,
      userJwt,
    );
    return hope;
  }

  /// Resolvers - Functions to instruct GraphQL on how to connect fields with entities
  @ResolveField(() => UserType)
  async createdBy(@Parent() hope: HopeType): Promise<UserType | undefined> {
    if (hope.createdBy) {
      return this.userService.findOne(hope.createdBy);
    }
    return null;
  }
  @ResolveField(() => OrgType)
  async forOrg(@Parent() hope: HopeType): Promise<OrgType | []> {
    if (hope.forOrg) {
      return this.orgService.findOne(hope.forOrg);
    }
    return null;
  }
}
