import { Field, ObjectType } from '@nestjs/graphql';
import { UserType } from '../../user/models/user.type';

@ObjectType()
export class OrgType {
  @Field()
  orgName: string;

  @Field(() => [UserType])
  hopeCreators: string[];

  @Field()
  enabled: boolean;
}
