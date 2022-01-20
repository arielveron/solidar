import { Field, InputType } from '@nestjs/graphql';
import { IsUUID, MinLength } from 'class-validator';

@InputType()
export class CreateHopeInput {
  @MinLength(5)
  @Field()
  subject: string;

  @MinLength(5)
  @Field()
  description: string;

  @IsUUID('4')
  @Field()
  forOrg: string;
}
