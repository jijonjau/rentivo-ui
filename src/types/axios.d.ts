import 'axios';
import type { AuthTokenType } from './auth';

declare module 'axios' {
  export interface AxiosRequestConfig {
    authToken?: AuthTokenType | false;
  }
}
