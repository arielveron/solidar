import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hope } from './hope/hope.entity';
import { HopeModule } from './hope/hope.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: 'mongodb:://localhost/solidar',
      synchronize: true, // this is not intended to be used on production
      useUnifiedTopology: true,
      entities: [Hope],
    }),
    GraphQLModule.forRoot({ autoSchemaFile: true }),
    HopeModule,
  ],
})
export class AppModule {}
