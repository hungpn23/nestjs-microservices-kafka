import { GlobalExceptionsFilter } from '@libs/filters/global-exception.filter';
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseNamingStrategy } from '@user/database/name-strategy';
import { TypeOrmConfigService } from '@user/database/typeorm-config.service';
import { DataSource } from 'typeorm';
import { UserModule } from './main/user.module';

@Module({
  imports: [
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
