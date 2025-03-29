import {
  EmailValidators,
  PasswordValidators,
  StringValidators,
} from '@libs/decorators/properties.decorator';

export class RegisterDto {
  @StringValidators({ minLength: 6, maxLength: 20 })
  username: string;

  @EmailValidators()
  email: string;

  @PasswordValidators()
  password: string;

  @PasswordValidators()
  confirmPassword: string;
}

export class LoginDto {
  @EmailValidators()
  email: string;

  @PasswordValidators()
  password: string;
}

export class ChangePasswordDto {
  @PasswordValidators()
  oldPassword: string;

  @PasswordValidators()
  newPassword: string;

  @PasswordValidators()
  confirmPassword: string;
}

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
};
