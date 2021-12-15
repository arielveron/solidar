import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hope } from './hope.entity';
import { HopeResolver } from './hope.resolver';
import { HopeService } from './hope.service';

@Module({
  imports: [TypeOrmModule.forFeature([Hope])],
  providers: [HopeResolver, HopeService],
})
export class HopeModule {}
