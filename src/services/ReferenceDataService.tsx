import axiosInstance from '../lib/axios';
import { ApiResponse } from '../types/auth';
import { DropdownResponse } from '../types/dropdown';

const FetchPermissions = async (): Promise<ApiResponse<DropdownResponse>> => {
  const response =
    await axiosInstance.get<ApiResponse<DropdownResponse>>('/auth/permissions');

  return response.data;
};

const FetchAccountTypes = async (): Promise<ApiResponse<DropdownResponse>> => {
  const response = await axiosInstance.get<ApiResponse<DropdownResponse>>(
    '/reference-data/account-types'
  );

  return response.data;
};

export const ReferenceDataService = {
  FetchPermissions,
  FetchAccountTypes,
};
