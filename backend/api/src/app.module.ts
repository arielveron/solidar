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
    GraphQLModule.forRoot({ autoSchemaFile: true }),
    HopeModule,
    AuthModule,
    UserModule,
    CaslModule,
    OrgModule,
  ],
})
export class AppModule {}
