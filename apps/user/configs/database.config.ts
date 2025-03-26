import {
  BooleanValidators,
  NumberValidators,
  PortValidators,
  StringValidators,
} from '@libs/decorators/properties.decorator';
import { validateConfig } from '@libs/utils/validate-config';
import { ValidateIf } from 'class-validator';
import process from 'node:process';

export class DatabaseEnvVariables {
  @StringValidators()
  POSTGRES_HOST: string;

  @PortValidators()
  POSTGRES_PORT: number;

  @StringValidators()
  POSTGRES_USER: string;

  @StringValidators()
  POSTGRES_PASSWORD: string;

  @StringValidators()
  POSTGRES_DB: string;

  @BooleanValidators()
  POSTGRES_SYNCHRONIZE: boolean;

  @BooleanValidators()
  POSTGRES_LOGGING: boolean;

  @NumberValidators({ isInt: true, min: 1 })
  POSTGRES_MAX_CONNECTIONS: number;

  @BooleanValidators()
  POSTGRES_SSL_ENABLED: boolean;

  @ValidateIf((obj) => obj.POSTGRES_SSL_ENABLED)
  @BooleanValidators()
  POSTGRES_REJECT_UNAUTHORIZED: boolean;

  @StringValidators({ required: false })
  POSTGRES_CA?: string;

  @StringValidators({ required: false })
  POSTGRES_KEY?: string;

  @StringValidators({ required: false })
  POSTGRES_CERT?: string;
}

export default () => {
  validateConfig(process.env, DatabaseEnvVariables);

  return {
    POSTGRES_HOST: process.env.POSTGRES_HOST,
    POSTGRES_PORT: parseInt(process.env.POSTGRES_PORT || '5432'),
    POSTGRES_USER: process.env.POSTGRES_USER,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
    POSTGRES_DB: process.env.POSTGRES_DB,
    POSTGRES_SYNCHRONIZE: process.env.POSTGRES_SYNCHRONIZE === 'true',
    POSTGRES_LOGGING: process.env.POSTGRES_LOGGING === 'true',
    POSTGRES_MAX_CONNECTIONS: parseInt(
      process.env.POSTGRES_MAX_CONNECTIONS || '10',
    ),
    POSTGRES_SSL_ENABLED: process.env.POSTGRES_SSL_ENABLED === 'true',
    POSTGRES_REJECT_UNAUTHORIZED:
      process.env.POSTGRES_REJECT_UNAUTHORIZED === 'true',
    POSTGRES_CA: process.env.POSTGRES_CA,
    POSTGRES_KEY: process.env.POSTGRES_KEY,
    POSTGRES_CERT: process.env.POSTGRES_CERT,
  };
};
