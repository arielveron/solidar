import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateHopeInput {
  @Field()
  subject: string;

  @Field()
  description: string;

  @Field()
  createdAt: string;
}
