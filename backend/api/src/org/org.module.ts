import { Module } from '@nestjs/common';
import { OrgService } from './org.service';
import { OrgResolver } from './org.resolver';

@Module({
  providers: [OrgService, OrgResolver],
})
export class OrgModule {}
