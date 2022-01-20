/* eslint-disable @typescript-eslint/no-unused-vars */
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { UserType } from 'src/user/models/user.type';
import { OrgType } from '../../org/models/org.type';

@ObjectType('Hope')
export class HopeType {
  @Field((type) => ID)
  id: string;

  @Field()
  subject: string;

  @Field()
  description: string;

  @Field(() => OrgType, { nullable: true })
  forOrg: string;

  @Field()
  isPublished: boolean;

  @Field()
  createdAt: string;

  @Field((type) => UserType, { nullable: true })
  createdBy: string;
}
