/* eslint-disable @typescript-eslint/no-unused-vars */
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { UserType } from 'src/user/models/user.type';

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

  @Field()
  isPublished: boolean;

  @Field((type) => UserType, { nullable: true })
  createdBy: string;
}
