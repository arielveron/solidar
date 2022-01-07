import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Hope } from './models/hope.entity';
import { HopeResolver } from './hope.resolver';
import { HopeService } from './hope.service';
import { CaslModule } from '../casl/casl.module';

@Module({
  imports: [TypeOrmModule.forFeature([Hope]), AuthModule, CaslModule],
  providers: [HopeResolver, HopeService],
})
export class HopeModule {}
