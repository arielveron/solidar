import { Field, ID, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class LinkOrgToUsers {
  @Field(() => ID)
  orgId: string;

  @IsUUID('4', { each: true })
  @Field(() => [ID], { nullable: true })
  owners: string[];

  @IsUUID('4', { each: true })
  @Field(() => [ID], { nullable: true })
  hopeCreators: string[];
}
