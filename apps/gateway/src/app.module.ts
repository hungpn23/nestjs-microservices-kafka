import KeyvRedis from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import {
  HttpStatus,
  Module,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import appConfig from './configs/app.config';
import authConfig from './configs/auth.config';
import redisConfig, { RedisEnvVariables } from './configs/redis.config';
import { GatewayExceptionFilter } from './exception.filter';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';

const envFilePath =
  process.env.NODE_ENV === 'production'
    ? 'apps/gateway/.env.prod'
    : 'apps/gateway/.env.local';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [envFilePath],
      cache: true, // speed up the loading process
      expandVariables: true, // support variables in .env file
      load: [
        // load config factories to validate and transform the config values
        appConfig,
        authConfig,
        redisConfig,
      ],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        redisConfig: ConfigService<RedisEnvVariables, true>,
      ) => {
        const host = redisConfig.get('REDIS_HOST', { infer: true });
        const username = redisConfig.get('REDIS_USERNAME', { infer: true });
        const password = redisConfig.get('REDIS_PASSWORD', { infer: true });

        return {
          stores: new KeyvRedis({
            url: `redis://${username}:${password}@${host}`,
          }),
        };
      },
    }),
    JwtModule.register({ global: true }),
    UserModule,
    ProductModule,
  ],

  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true, // auto transform payload to DTO instance
        whitelist: true, // more strict
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        exceptionFactory: (errors: ValidationError[]) => {
          return new UnprocessableEntityException(errors);
        },
      }),
    },
    {
      provide: APP_FILTER,
      useClass: GatewayExceptionFilter,
    },
  ],
})
export class AppModule {}
