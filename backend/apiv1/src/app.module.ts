import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { HopeModule } from './hope/hope.module';
@Module({
  imports: [GraphQLModule.forRoot({ autoSchemaFile: true }), HopeModule],
})
export class AppModule {}
