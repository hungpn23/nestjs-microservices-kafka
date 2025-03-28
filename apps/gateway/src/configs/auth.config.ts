import { StringValidators } from '@libs/decorators/properties.decorator';
import { validateConfig } from '@libs/utils/validate-config';
import process from 'node:process';

export class AuthEnvVariables {
  @StringValidators()
  JWT_SECRET: string;

  @StringValidators()
  REFRESH_SECRET: string;
}

// config factory
export default () => {
  validateConfig(process.env, AuthEnvVariables);

  return {
    JWT_SECRET: process.env.JWT_SECRET,
    REFRESH_SECRET: process.env.REFRESH_SECRET,
  };
};
