import { AuthResponse } from '../types/auth';

export const saveTemporaryAuthTokens = (data: AuthResponse) => {
  if (data.otpToken) {
    sessionStorage.setItem('otpToken', data.otpToken);
  }

  if (data.passwordResetToken) {
    sessionStorage.setItem('passwordResetToken', data.passwordResetToken);
  }
};
