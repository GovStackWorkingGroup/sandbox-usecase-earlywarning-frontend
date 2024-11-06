import Axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { enqueueSnackbar } from 'notistack';

import { env } from '@/config/env';
import { paths } from '@/config/paths';
import { ErrorResponse } from '@/types/api';

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  if (config.headers) {
    config.headers.Accept = 'application/json';
  }

  config.withCredentials = true;
  return config;
}

function handleUserApiResponse(response: AxiosResponse) {
  return response.data;
}

function handleUserApiError(error: AxiosError<ErrorResponse>) {
  const message = error.response?.data?.message || error.message;

  enqueueSnackbar(message, {
    variant: 'error',
    preventDuplicate: true,
  });

  if (error.response?.status === 401 && window.location.pathname !== paths.auth.login.path) {
    const searchParams = new URLSearchParams();
    const redirectTo = searchParams.get('redirectTo') ?? window.location.pathname;
    window.location.href = paths.auth.login.getHref(redirectTo);
  }

  return Promise.reject(error);
}

export const loginApi = Axios.create({
  baseURL: env.USER_API_URL,
});

export const userApi = Axios.create({
  baseURL: env.USER_API_URL,
});

userApi.interceptors.request.use(authRequestInterceptor);
userApi.interceptors.response.use(handleUserApiResponse, handleUserApiError);

export const threatApi = Axios.create({
  baseURL: env.THREAT_API_URL,
});

threatApi.interceptors.request.use(authRequestInterceptor);
threatApi.interceptors.response.use(handleUserApiResponse, handleUserApiError);

export const attachToken = (headers?: Record<string, string>) => {
  const accessToken = localStorage.getItem('accessToken');

  return {
    headers: {
      ...headers,
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  };
};
