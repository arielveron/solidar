import { Module } from '@nestjs/common';
import { HopeResolver } from './hope.resolver';
import { HopeService } from './hope.service';

@Module({
  providers: [HopeResolver, HopeService],
})
export class HopeModule {}
