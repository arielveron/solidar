import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configValidationSchema } from './config.schema';

import { HopeModule } from './hope/hope.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CaslModule } from './casl/casl.module';
import { OrgModule } from './org/org.module';

import { Hope } from './hope/models/hope.entity';
import { User } from './user/models/user.entity';
import { Org } from './org/models/org.entity';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'mongodb',
          url: configService.get('DB_URL'),
          synchronize: true, // this is not intended to be used on production
          useUnifiedTopology: true,
          entities: [Hope, User, Org],
        };
      },
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      debug: false,
      formatError: (error: GraphQLError) => {
        const graphQLFormattedError: GraphQLFormattedError = {
          message: error.message,
          extensions: error?.extensions,
        };
        return graphQLFormattedError;
      },
    }),
    HopeModule,
    AuthModule,
    UserModule,
    CaslModule,
    OrgModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
