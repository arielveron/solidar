import { Field, ID, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class CreateOrgInput {
  @Field()
  orgName: string;

  @IsUUID('4', { each: true })
  @Field(() => [ID])
  owners: string[];

  @IsUUID('4', { each: true })
  @Field(() => [ID], { defaultValue: [] })
  hopeCreators: string[];
}
