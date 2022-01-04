import { Logger, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateHopeInput } from './dto/create-hope.input';
import { Hope } from './models/hope.entity';
import { HopeService } from './hope.service';
import { HopeType } from './models/hope.type';

@Resolver(() => HopeType)
export class HopeResolver {
  private logger = new Logger('HopeResolver');

  constructor(private hopeService: HopeService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => HopeType)
  hope(@Args('id') id: string): Promise<Hope> {
    return this.hopeService.getHope(id);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [HopeType])
  hopes(@Context() ctx): Promise<Hope[]> {
    const user = ctx.req.user.username;
    this.logger.log(`User "${user}" requested all the Hopes`);

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
