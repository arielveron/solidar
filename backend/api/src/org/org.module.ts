import { forwardRef, Module } from '@nestjs/common';
import { OrgService } from './org.service';
import { OrgResolver } from './org.resolver';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Org } from './models/org.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Org]),
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
  ],
  providers: [OrgService, OrgResolver],
  exports: [OrgService],
})
export class OrgModule {}
