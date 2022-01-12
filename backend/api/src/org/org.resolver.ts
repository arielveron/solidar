import { UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateOrgInput } from './dto/create-org.input';
import { OrgType } from './models/org.type';
import { OrgService } from './org.service';
import { UserService } from '../user/user.service';
import { UserType } from '../user/models/user.type';
import { User } from '../user/models/user.entity';

@Resolver(() => OrgType)
export class OrgResolver {
  constructor(
    private orgService: OrgService,
    private userService: UserService,
  ) {}

  /// Get list of Orgs
  @Query(() => [OrgType])
  orgs(): Promise<OrgType[]> {
    return this.orgService.getOrgs();
  }

  /// Create Org

  @Mutation(() => OrgType)
  @UseGuards(JwtAuthGuard)
  createOrg(
    @Args('createOrgInput') createOrgInput: CreateOrgInput,
    @Context() ctx,
  ): Promise<OrgType> {
    return this.orgService.createOrg(createOrgInput, ctx.req.user);
  }

  /// Resolvers - Functions to instruct GraphQL on how to connect fields with entities
  @ResolveField(() => [UserType])
  async hopeCreators(@Parent() org: OrgType): Promise<User[] | []> {
    if (org.hopeCreators != null) {
      return this.userService.getManyUsers(org.hopeCreators);
    }
    return [];
  }
}
