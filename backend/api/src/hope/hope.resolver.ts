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

  @Query(() => HopeType)
  hope() {
    return {
      id: 'j4lk23jpo8adc',
      subject: 'This is a test',
      description: 'This is just a dummy hope, but is the first one',
      createdAt: '2021-12-14',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [HopeType])
  async hopes(@Context() ctx): Promise<Hope[]> {
    const user = ctx.req.user.username;
    this.logger.log(`User "${user}" requested all the Hopes`);

    return await this.hopeService.getHopes();
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
