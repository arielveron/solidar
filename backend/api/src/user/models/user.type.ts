import { Field, ID, ObjectType } from '@nestjs/graphql';
import { OrgType } from '../../org/models/org.type';

@ObjectType('User')
export class UserType {
  @Field(() => ID)
  id: string;

  @Field()
  username: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  isAdmin: boolean;

  // administration properties
  @Field(() => [OrgType], { nullable: true })
  orgOwnerOf: string[];

  @Field(() => [OrgType], { nullable: true })
  hopeCreatorOf: string[];
}
