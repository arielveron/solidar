/* eslint-disable @typescript-eslint/no-unused-vars */
import { Query, Resolver } from '@nestjs/graphql';
import { HopeService } from './hope.service';
import { HopeType } from './hope.type';

@Resolver((of) => HopeType)
export class HopeResolver {
  constructor(private hopeService: HopeService) {}
  @Query((returns) => HopeType)
  hope() {
    return {
      id: 'j4lk23jpo8adc',
      subject: 'This is a test',
      description: 'This is just a dummy hope, but is the first one',
      createdAt: '2021-12-14',
    };
  }
}
