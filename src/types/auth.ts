export type AccountType = 'TENANT' | 'LANDLORD' | 'AGENCY';

export type AuthTokenType = 'access' | 'otp' | 'passwordReset' | 'refresh';

export type OtpTokenPayload = {
  sub: string;
  type: 'LOGIN_OTP' | 'REGISTER_OTP' | 'PASSWORD_RESET_OTP';
  exp: number;
};

export type ApiResponse<T> = {
  status: number;
  statusDesc: string;
  responseDateTime: string;
  payload: T;
};

export type AuthResponse = {
  otpToken?: string;
  passwordResetToken?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresIn: number;
};

export type RegisterRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  accountType: AccountType;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type VerifyOtpRequest = {
  otp: string;
};

export type ResetPasswordRequest = {
  newPassword: string;
};

export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
};
