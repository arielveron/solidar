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
  hopes(@Context() ctx): Promise<Hope[]> {
    const user = ctx.req.user.username;
    this.logger.log(`User "${user}" requested all the Hopes`);

    return this.hopeService.getHopes();
  }

  @Mutation(() => HopeType)
  createHope(
    @Args('createHopeInput') createHopeInput: CreateHopeInput,
  ): Promise<Hope> {
    return this.hopeService.createHope(createHopeInput);
  }
}