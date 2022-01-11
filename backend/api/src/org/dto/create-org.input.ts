import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateOrgInput {
  @Field()
  orgName: string;
}
