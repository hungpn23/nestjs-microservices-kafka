import TypeOrmCustomLogger from '@libs/utils/typeorm-logger';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { DatabaseEnvVariables } from '@user/configs/database.config';
import { DatabaseNamingStrategy } from './name-strategy';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(
    private databaseConfig: ConfigService<DatabaseEnvVariables, true>,
  ) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      // TypeOrmModuleOptions
      retryAttempts: 1,

      // PostgresConnectionCredentialsOptions
      type: 'postgres',
      host: this.databaseConfig.get('POSTGRES_HOST', { infer: true }),
      port: this.databaseConfig.get('POSTGRES_PORT', { infer: true }),
      username: this.databaseConfig.get('POSTGRES_USER', { infer: true }),
      database: this.databaseConfig.get('POSTGRES_DB', { infer: true }),
      password: this.databaseConfig.get('POSTGRES_PASSWORD', {
        infer: true,
      }),

      // BaseDataSourceOptions
      synchronize: this.databaseConfig.get('POSTGRES_SYNCHRONIZE', {
        infer: true,
      }),
      logging: this.databaseConfig.get('POSTGRES_LOGGING', { infer: true }),
      logger: TypeOrmCustomLogger.getInstance(
        'default',
        this.databaseConfig.get('POSTGRES_LOGGING', { infer: true })
          ? ['error', 'warn', 'query', 'schema']
          : ['error', 'warn'],
      ),
      poolSize: this.databaseConfig.get('POSTGRES_MAX_CONNECTIONS', {
        infer: true,
      }),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/../**/migrations/**/*.{.ts,.js}'],

      // ref: https://node-postgres.com/features/ssl
      ssl: this.databaseConfig.get('POSTGRES_SSL_ENABLED', { infer: true })
        ? {
            rejectUnauthorized: this.databaseConfig.get(
              'POSTGRES_REJECT_UNAUTHORIZED',
              {
                infer: true,
              },
            ),
            ca: this.databaseConfig.get('POSTGRES_CA', { infer: true }),
            key: this.databaseConfig.get('POSTGRES_KEY', { infer: true }),
            cert: this.databaseConfig.get('POSTGRES_CERT', { infer: true }),
          }
        : false,

      namingStrategy: new DatabaseNamingStrategy(),
    };
  }
}
