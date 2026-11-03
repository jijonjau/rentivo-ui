import axiosInstance from '../lib/axios';
import type {
  ApiResponse,
  AuthResponse,
  ChangePasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  VerifyOtpRequest,
} from '../types/auth';

const login = async (
  data: LoginRequest
): Promise<ApiResponse<AuthResponse>> => {
  const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
    '/auth/login',
    data
  );

  return response.data;
};

const register = async (
  data: RegisterRequest
): Promise<ApiResponse<AuthResponse>> => {
  const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
    '/auth/register',
    data
  );
  return response.data;
};

const verifyOtp = async (
  data: VerifyOtpRequest
): Promise<ApiResponse<AuthResponse>> => {
  const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
    '/auth/verify-otp',
    data,
    { authToken: 'otp' }
  );
  return response.data;
};

const resendOtp = async (): Promise<ApiResponse<AuthResponse>> => {
  const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
    '/auth/resend-otp',
    {},
    { authToken: 'otp' }
  );
  return response.data;
};

const forgotPassword = async (
  email: string
): Promise<ApiResponse<AuthResponse>> => {
  const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
    '/auth/forgot-password',
    { email }
  );
  return response.data;
};

const resetPassword = async (data: ResetPasswordRequest): Promise<void> => {
  await axiosInstance.post('/auth/reset-password', data, {
    authToken: 'passwordReset',
  });
};

const changePassword = async (data: ChangePasswordRequest): Promise<void> => {
  await axiosInstance.post('/auth/change-password', data);
};

const refreshToken = async (): Promise<ApiResponse<AuthResponse>> => {
  const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
    '/auth/refresh',
    {},
    { authToken: 'refresh' }
  );
  return response.data;
};

export const AuthService = {
  login,
  register,
  verifyOtp,
  resendOtp,
  forgotPassword,
  resetPassword,
  changePassword,
  refreshToken,
};
