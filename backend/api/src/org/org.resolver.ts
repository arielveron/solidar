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
