import { StringValidators } from '@libs/decorators/properties.decorator';
import { validateConfig } from '@libs/utils/validate-config';
import process from 'node:process';

export class RedisEnvVariables {
  @StringValidators()
  REDIS_HOST: string;

  @StringValidators()
  REDIS_USERNAME: string;

  @StringValidators()
  REDIS_PASSWORD: string;

  @StringValidators()
  REDIS_PERMISSIONS: string;
}

// config factory
export default () => {
  validateConfig(process.env, RedisEnvVariables);

  return {
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_USERNAME: process.env.REDIS_USERNAME,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    REDIS_PERMISSIONS: process.env.REDIS_PERMISSIONS,
  };
};
