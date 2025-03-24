import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { AppEnvVariables } from './configs/app.config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const appConfig = app.get(ConfigService<AppEnvVariables, true>);

  const prefix = appConfig.get('APP_PREFIX', { infer: true });
  const host = appConfig.get('APP_HOST', { infer: true });
  const port = appConfig.get('APP_PORT', { infer: true });
  app.setGlobalPrefix(prefix);

  await app.listen(port);
  Logger.log(`🚀🚀🚀 App is running on: ${host}:${port}/${prefix}`);
}

void bootstrap();
