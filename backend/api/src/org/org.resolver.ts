import { UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateOrgInput } from './dto/create-org.input';
import { OrgType } from './models/org.type';
import { OrgService } from './org.service';
import { UserService } from '../user/user.service';

@Resolver(() => OrgType)
export class OrgResolver {
  constructor(
    private orgService: OrgService,
    private userService: UserService,
  ) {}

  @Mutation(() => OrgType)
  @UseGuards(JwtAuthGuard)
  createOrg(
    @Args('createOrgInput') createOrgInput: CreateOrgInput,
    @Context() ctx,
  ): Promise<OrgType> {
    return this.orgService.createOrg(createOrgInput, ctx.req.user);
  }

  /// Resolvers - Functions to instruct GraphQL on how to connect fields with entities
  @ResolveField()
  async hopeCreators(@Parent() org: OrgType) {
    if (org.hopeCreators != null) {
      return this.userService.getManyUsers(org.hopeCreators);
    }
    return [];
  }
}
