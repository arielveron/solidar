import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CreateOrgInput } from './dto/create-org.input';
import { OrgType } from './models/org.type';
import { OrgService } from './org.service';
import { UserService } from '../user/user.service';
import { UserType } from '../user/models/user.type';
import { RelationOrgToUsers } from './dto/relation-org-users.input';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/dto/jwt.payload';
import { UseGuards } from '@nestjs/common';
import { PoliciesGuard } from '../casl/policies.guard';
import { CheckPolicies } from '../casl/check-policies.decorator';
import { AppAbility } from '../casl/casl-ability.factory';
import { Action } from '../casl/actions/action.enum';
import { Org } from './models/org.entity';

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
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, Org))
  async createOrg(
    @Args('createOrgInput') createOrgInput: CreateOrgInput,
    @CurrentUser() userJwt: JwtPayload,
  ): Promise<OrgType> {
    const user = await this.userService.findOne(userJwt.id);
    return this.orgService.createOrg(createOrgInput, user);
  }

  /// Link users to Orgs
  @Mutation(() => OrgType)
  linkOrgToUsers(
    @Args('relationOrgToUsers') relationOrgToUsers: RelationOrgToUsers,
  ): Promise<OrgType | []> {
    return this.orgService.linkOrgToUsers(relationOrgToUsers);
  }

  @Mutation(() => OrgType)
  unlinkOrgFromUsers(
    @Args('relationOrgToUsers') relationOrgToUsers: RelationOrgToUsers,
  ): Promise<OrgType | []> {
    return this.orgService.unlinkOrgFromUsers(relationOrgToUsers);
  }

  /// Resolvers - Functions to instruct GraphQL on how to connect fields with entities
  @ResolveField(() => [UserType])
  async owners(@Parent() org: OrgType): Promise<UserType[] | []> {
    if (Array.isArray(org.owners) && org.owners.length > 0) {
      return this.userService.getManyUsers(org.owners);
    }
    return [];
  }

  @ResolveField(() => [UserType])
  async hopeCreators(@Parent() org: OrgType): Promise<UserType[] | []> {
    if (Array.isArray(org.hopeCreators) && org.hopeCreators.length > 0) {
      return this.userService.getManyUsers(org.hopeCreators);
    }
    return [];
  }
}
