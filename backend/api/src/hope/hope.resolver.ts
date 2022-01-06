import { Logger, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateHopeInput } from './dto/create-hope.input';
import { Hope } from './models/hope.entity';
import { HopeService } from './hope.service';
import { HopeType } from './models/hope.type';
import { AppAbility, CaslAbilityFactory } from '../casl/casl-ability.factory';
import { User } from '../user/models/user.entity';
import { Action } from '../auth/actions/action.enum';
import { CheckPolicies } from 'src/casl/check-policies.decorator';

@Resolver(() => HopeType)
export class HopeResolver {
  private logger = new Logger('HopeResolver');

  constructor(
    private hopeService: HopeService,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @UseGuards(JwtAuthGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Hope))
  @Query(() => HopeType)
  async hope(@Args('id') id: string, @Context() ctx): Promise<Hope> {
    const hope: Hope = await this.hopeService.getHope(id);

    const user: User = ctx.req.user;
    this.caslAbilityFactory.checkPolicy(user, Action.Read, hope);

    return hope;
  }

  @UseGuards(JwtAuthGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Hope))
  @Query(() => [HopeType])
  hopes(@Context() ctx): Promise<Hope[]> {
    const user: User = ctx.req.user;

    this.logger.log(`User "${user.username}" requested all the Hopes`);

    return this.hopeService.getHopes();
  }

  @Mutation(() => HopeType)
  @UseGuards(JwtAuthGuard)
  createHope(
    @Args('createHopeInput') createHopeInput: CreateHopeInput,
    @Context() context,
  ): Promise<Hope> {
    this.logger.log(context.req.user);
    return this.hopeService.createHope(createHopeInput, context.req.user);
  }
}
