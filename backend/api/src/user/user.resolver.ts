import { Logger } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';

@Resolver()
export class UserResolver {
  private logger = new Logger('UserResolver');
}
