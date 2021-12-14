/* eslint-disable @typescript-eslint/no-unused-vars */
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType('Hope')
export class HopeType {
  @Field((type) => ID)
  id: string;

  @Field()
  subject: string;

  @Field()
  description: string;

  @Field()
  createdAt: string;
}
