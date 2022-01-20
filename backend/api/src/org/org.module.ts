import { forwardRef, Module } from '@nestjs/common';
import { OrgService } from './org.service';
import { OrgResolver } from './org.resolver';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Org } from './models/org.entity';
import { AuthModule } from '../auth/auth.module';
import { LinkUsersOrgHelper } from './helper/link-users-to-org.helper';
import { UnlinkUsersOrgHelper } from './helper/unlink-users-from-org.helper';
import { CaslModule } from '../casl/casl.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Org]),
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
    CaslModule,
  ],
  providers: [
    OrgService,
    OrgResolver,
    LinkUsersOrgHelper,
    UnlinkUsersOrgHelper,
  ],
  exports: [OrgService],
})
export class OrgModule {}
