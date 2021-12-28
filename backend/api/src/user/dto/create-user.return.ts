import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CreateUserReturn {
  @Field()
  id: string;

  @Field()
  username: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;
}
