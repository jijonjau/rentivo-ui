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
import { RoleRequest, RoleResponse } from '../types/roles';

const Login = async (
  data: LoginRequest
): Promise<ApiResponse<AuthResponse>> => {
  const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
    '/auth/login',
    data
  );

  return response.data;
};

const Register = async (
  data: RegisterRequest
): Promise<ApiResponse<AuthResponse>> => {
  const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
    '/auth/register',
    data
  );
  return response.data;
};

const VerifyOtp = async (
  data: VerifyOtpRequest
): Promise<ApiResponse<AuthResponse>> => {
  const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
    '/auth/verify-otp',
    data,
    { authToken: 'otp' }
  );
  return response.data;
};

const ResendOtp = async (): Promise<ApiResponse<AuthResponse>> => {
  const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
    '/auth/resend-otp',
    {},
    { authToken: 'otp' }
  );
  return response.data;
};

const ForgotPassword = async (
  email: string
): Promise<ApiResponse<AuthResponse>> => {
  const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
    '/auth/forgot-password',
    { email }
  );
  return response.data;
};

const ResetPassword = async (data: ResetPasswordRequest): Promise<void> => {
  await axiosInstance.post('/auth/reset-password', data, {
    authToken: 'passwordReset',
  });
};

const ChangePassword = async (data: ChangePasswordRequest): Promise<void> => {
  await axiosInstance.post('/auth/change-password', data);
};

const RefreshToken = async (): Promise<ApiResponse<void>> => {
  const response = await axiosInstance.post<ApiResponse<void>>(
    '/auth/refresh',
    {}
  );

  return response.data;
};

const Logout = async (): Promise<ApiResponse<void>> => {
  const response = await axiosInstance.post<ApiResponse<void>>(
    '/auth/logout',
    {}
  );

  return response.data;
};

const CreateRole = async (request: RoleRequest): Promise<ApiResponse<void>> => {
  const response = await axiosInstance.post<ApiResponse<void>>('/auth/roles', {
    ...request,
  });

  return response.data;
};

const FetchRoles = async (
  params?: QueryParams
): Promise<ApiResponse<RoleResponse>> => {
  const response = await axiosInstance.get<ApiResponse<RoleResponse>>(
    '/auth/roles',
    { params }
  );

  return response.data;
};

const FetchRoleById = async (
  roleId: number
): Promise<ApiResponse<RoleResponse>> => {
  const response = await axiosInstance.get<ApiResponse<RoleResponse>>(
    `/auth/roles/${roleId}`
  );

  return response.data;
};

const UpdateRole = async (
  roleId: number,
  request: RoleRequest
): Promise<ApiResponse<void>> => {
  const response = await axiosInstance.put<ApiResponse<void>>(
    `/auth/roles/${roleId}`,
    {
      ...request,
    }
  );

  return response.data;
};

const UpdateRoleStatus = async (
  roleId: number,
  enabled: boolean
): Promise<ApiResponse<void>> => {
  const response = await axiosInstance.patch<ApiResponse<void>>(
    `/auth/roles/${roleId}/status`,
    {
      enabled,
    }
  );

  return response.data;
};

export const AuthService = {
  Login,
  Register,
  VerifyOtp,
  ResendOtp,
  ForgotPassword,
  ResetPassword,
  ChangePassword,
  RefreshToken,
  Logout,
  CreateRole,
  FetchRoles,
  FetchRoleById,
  UpdateRole,
  UpdateRoleStatus,
};
