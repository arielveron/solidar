import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserType } from '../../user/models/user.type';

@ObjectType()
export class OrgType {
  @Field(() => ID)
  id: string;

  @Field()
  orgName: string;

  @Field(() => [UserType], { nullable: true })
  owners: string[];

  @Field(() => [UserType], { nullable: true })
  hopeCreators: string[];

  @Field()
  enabled: boolean;
}
