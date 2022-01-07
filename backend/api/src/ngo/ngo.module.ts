import { Module } from '@nestjs/common';
import { NgoService } from './ngo.service';
import { NgoResolver } from './ngo.resolver';

@Module({
  providers: [NgoService, NgoResolver]
})
export class NgoModule {}
