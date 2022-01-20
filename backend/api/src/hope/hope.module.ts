import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Hope } from './models/hope.entity';
import { HopeResolver } from './hope.resolver';
import { HopeService } from './hope.service';
import { CaslModule } from '../casl/casl.module';
import { UserModule } from '../user/user.module';
import { OrgModule } from '../org/org.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Hope]),
    AuthModule,
    CaslModule,
    UserModule,
    OrgModule,
  ],
  providers: [HopeResolver, HopeService],
})
export class HopeModule {}
