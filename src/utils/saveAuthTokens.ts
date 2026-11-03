import { AuthResponse } from '../types/auth';

export const saveAuthTokens = (data: AuthResponse) => {
  if (data.otpToken) sessionStorage.setItem('otpToken', data.otpToken);
  if (data.passwordResetToken)
    sessionStorage.setItem('passwordResetToken', data.passwordResetToken);
  if (data.accessToken) sessionStorage.setItem('accessToken', data.accessToken);
  if (data.refreshToken)
    sessionStorage.setItem('refreshToken', data.refreshToken);
};
