import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class JwtPayload {
  @Field()
  id: string;

  @Field()
  username: string;

  @Field()
  isAdmin: boolean;
}
