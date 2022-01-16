import { UseGuards } from '@nestjs/common';
import {
  Args,
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
import { RelationOrgToUsers } from './dto/relation-org-users.input';
import { CurrentUser } from '../util/current-user.decorator';

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
    @CurrentUser() user: UserType,
  ): Promise<OrgType> {
    return this.orgService.createOrg(createOrgInput, user);
  }

  /// Link users to Orgs
  @Mutation(() => OrgType)
  @UseGuards(JwtAuthGuard)
  linkOrgToUsers(
    @Args('relationOrgToUsers') relationOrgToUsers: RelationOrgToUsers,
  ): Promise<OrgType | []> {
    return this.orgService.linkOrgToUsers(relationOrgToUsers);
  }

  @Mutation(() => OrgType)
  @UseGuards(JwtAuthGuard)
  unlinkOrgFromUsers(
    @Args('relationOrgToUsers') relationOrgToUsers: RelationOrgToUsers,
  ): Promise<OrgType | []> {
    return this.orgService.unlinkOrgFromUsers(relationOrgToUsers);
  }

  /// Resolvers - Functions to instruct GraphQL on how to connect fields with entities
  @ResolveField(() => [UserType])
  async owners(@Parent() org: OrgType): Promise<UserType[] | []> {
    if (org.owners != null) {
      return this.userService.getManyUsers(org.owners);
    }
    return [];
  }

  @ResolveField(() => [UserType])
  async hopeCreators(@Parent() org: OrgType): Promise<UserType[] | []> {
    if (org.hopeCreators != null) {
      return this.userService.getManyUsers(org.hopeCreators);
    }
    return [];
  }
}
