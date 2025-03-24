import { Environment } from '@libs/constants/env.enum';
import {
  EnumValidators,
  PortValidators,
  StringValidators,
  UrlValidators,
} from '@libs/decorators/properties.decorator';
import { validateConfig } from '@libs/utils/validate-config';
import process from 'node:process';

export class AppEnvVariables {
  @EnumValidators(Environment)
  NODE_ENV: Environment;

  @UrlValidators({ require_tld: false }) // to allow localhost
  APP_HOST: string;

  @PortValidators()
  APP_PORT: number;

  @StringValidators()
  APP_PREFIX: string;
}

// config factory
export default () => {
  validateConfig(process.env, AppEnvVariables);

  return {
    NODE_ENV: process.env.NODE_ENV as Environment,
    APP_HOST: process.env.APP_HOST,
    APP_PORT: process.env.APP_PORT,
    APP_PREFIX: process.env.API_PREFIX,
  };
};
