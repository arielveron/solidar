import { Logger, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateHopeInput } from './dto/create-hope.input';
import { Hope } from './models/hope.entity';
import { HopeService } from './hope.service';
import { HopeType } from './models/hope.type';
// import { JwtPayload } from '../auth/dto/jwt.payload';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { User } from '../user/models/user.entity';
import { Action } from '../auth/actions/action.enum';

@Resolver(() => HopeType)
export class HopeResolver {
  private logger = new Logger('HopeResolver');

  constructor(
    private hopeService: HopeService,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => HopeType)
  async hope(@Args('id') id: string, @Context() ctx): Promise<Hope> {
    const hope: Hope = await this.hopeService.getHope(id);

    const user: User = ctx.req.user;
    const ability = this.caslAbilityFactory.createForUser(user);
    console.log('can read?', ability.can(Action.Read, hope));

    console.log();

    return hope;
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [HopeType])
  hopes(@Context() ctx): Promise<Hope[]> {
    // const user = ctx.req.user.username;
    const user: User = ctx.req.user;

    const ability = this.caslAbilityFactory.createForUser(user);
    console.log('can request?', ability.can(Action.Read, Hope));

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
