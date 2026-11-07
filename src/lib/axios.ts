import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1`,
  timeout: 30000,
  withCredentials: true,
  withXSRFToken: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use((config) => {
  if (config.authToken === false) return config;

  const tokenType = config.authToken;

  if (tokenType === 'otp' || tokenType === 'passwordReset') {
    const token = sessionStorage.getItem(`${tokenType}Token`);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ statusDesc?: string; message?: string }>) => {
    if (!error.response) {
      const message = 'Unable to connect to the server. Please try again.';
      toast.error(message);
      return Promise.reject(new ApiError(0, message));
    }

    const status = error.response.status;

    const serverMessage =
      error.response.data?.statusDesc || error.response.data?.message;

    const messages: Record<number, string> = {
      400: 'Invalid request. Please check your details.',
      401: 'Your session has expired or your credentials are invalid.',
      403: "You don't have permission to perform this action.",
      409: 'This resource already exists.',
      500: 'Something went wrong on the server. Please try again later.',
    };

    const message =
      serverMessage || messages[status] || 'An unexpected error occurred.';

    toast.error(message);

    if (status === 401 && typeof window !== 'undefined') {
      // Handle session cleanup/refresh later.
    }

    return Promise.reject(new ApiError(status, message));
  }
);

export default axiosInstance;
