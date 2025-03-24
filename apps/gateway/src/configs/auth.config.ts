import { StringValidators } from '@libs/decorators/properties.decorator';
import { validateConfig } from '@libs/utils/validate-config';
import { StringValue } from 'ms';
import process from 'node:process';

export class AuthEnvVariables {
  @StringValidators()
  JWT_SECRET: string;

  @StringValidators()
  JWT_TOKEN_EXPIRES_IN: StringValue;

  @StringValidators()
  REFRESH_SECRET: string;

  @StringValidators()
  REFRESH_TOKEN_EXPIRES_IN: StringValue;
}

// config factory
export default () => {
  validateConfig(process.env, AuthEnvVariables);

  return {
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_TOKEN_EXPIRES_IN: process.env.JWT_TOKEN_EXPIRES_IN as StringValue,
    REFRESH_SECRET: process.env.REFRESH_SECRET,
    REFRESH_TOKEN_EXPIRES_IN: process.env
      .REFRESH_TOKEN_EXPIRES_IN as StringValue,
  };
};
