import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateHopeInput } from './create-hope.input';
import { Hope } from './hope.entity';
import { HopeService } from './hope.service';
import { HopeType } from './hope.type';

@Resolver(() => HopeType)
export class HopeResolver {
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
  hopes(): Promise<Hope[]> {
    return this.hopeService.getHopes();
  }

  @Mutation(() => HopeType)
  createHope(
    @Args('createHopeInput') createHopeInput: CreateHopeInput,
  ): Promise<Hope> {
    return this.hopeService.createHope(createHopeInput);
  }
}
