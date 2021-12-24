import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Hope } from './models/hope.entity';
import { HopeResolver } from './hope.resolver';
import { HopeService } from './hope.service';

@Module({
  imports: [TypeOrmModule.forFeature([Hope]), AuthModule],
  providers: [HopeResolver, HopeService],
})
export class HopeModule {}
