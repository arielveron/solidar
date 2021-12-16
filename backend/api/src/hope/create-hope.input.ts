import { Field, InputType } from '@nestjs/graphql';
import { MinLength } from 'class-validator';

@InputType()
export class CreateHopeInput {
  @MinLength(5)
  @Field()
  subject: string;

  @MinLength(5)
  @Field()
  description: string;

  @Field()
  createdAt: string;
}
