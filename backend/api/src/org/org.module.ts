import { forwardRef, Module } from '@nestjs/common';
import { OrgService } from './org.service';
import { OrgResolver } from './org.resolver';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Org } from './models/org.entity';
import { AuthModule } from '../auth/auth.module';
import { LinkUsersOrgHelper } from './helper/link-users-to-org-field.helper';

@Module({
  imports: [
    TypeOrmModule.forFeature([Org]),
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
  ],
  providers: [OrgService, OrgResolver, LinkUsersOrgHelper],
  exports: [OrgService],
})
export class OrgModule {}
