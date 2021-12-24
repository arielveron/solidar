import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configValidationSchema } from './config.schema';
import { Hope } from './hope/models/hope.entity';
import { HopeModule } from './hope/hope.module';
import { AuthModule } from './auth/auth.module';
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
          entities: [Hope],
        };
      },
    }),
    GraphQLModule.forRoot({ autoSchemaFile: true }),
    HopeModule,
    AuthModule,
  ],
})
export class AppModule {}