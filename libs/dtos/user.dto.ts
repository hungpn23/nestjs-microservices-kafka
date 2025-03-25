import {
  EmailValidators,
  PasswordValidators,
  StringValidators,
} from '@libs/decorators/properties.decorator';

export class RegisterDto {
  @StringValidators({ minLength: 6, maxLength: 20, required: true })
  username: string;

  @EmailValidators()
  email: string;

  @PasswordValidators()
  password: string;
}
