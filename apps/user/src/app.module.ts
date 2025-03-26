import { GlobalExceptionsFilter } from '@libs/filters/global-exception.filter';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import authConfig from '@user/configs/auth.config';
import databaseConfig from '@user/configs/database.config';
import { DatabaseNamingStrategy } from '@user/database/name-strategy';
import { TypeOrmConfigService } from '@user/database/typeorm-config.service';
import { DataSource } from 'typeorm';
import { UserModule } from './main/user.module';

const envFilePath =
  process.env.NODE_ENV === 'production'
    ? 'apps/user/.env.prod'
    : 'apps/user/.env.local';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [envFilePath],
      cache: true, // speed up the loading process
      expandVariables: true, // support variables in .env file
      load: [
        // load config factories to validate and transform the config values
        databaseConfig,
        authConfig,
      ],
    }),
    TypeOrmModule.forRootAsync({
      // configure the DataSourceOptions.
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options) => {
        if (!options) throw new Error('Invalid DataSourceOptions value');

        return await new DataSource({
          ...options,
          namingStrategy: new DatabaseNamingStrategy(),
        }).initialize();
      },
    }),
    JwtModule.register({ global: true }),

    UserModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionsFilter,
    },
  ],
})
export class AppModule {}
