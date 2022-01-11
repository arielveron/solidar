import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateOrgInput } from './dto/create-org.input';
import { OrgType } from './models/org.type';
import { OrgService } from './org.service';

@Resolver()
export class OrgResolver {
  constructor(private orgService: OrgService) {}

  @Mutation(() => OrgType)
  @UseGuards(JwtAuthGuard)
  createOrg(
    @Args('createOrgInput') createOrgInput: CreateOrgInput,
    @Context() ctx,
  ): Promise<OrgType> {
    return this.orgService.createOrg(createOrgInput, ctx.req.user);
  }
}
