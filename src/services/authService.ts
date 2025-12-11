import apiClient, { setAuthToken } from './apiClient';
import { User } from '../types';

export interface AuthResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export const login = async (email: string, password: string) => {
  const { data } = await apiClient.post<{ success: boolean; data: AuthResponse }>('/auth/login', { email, password });
  setAuthToken(data.data.tokens.accessToken);
  return data.data;
};

export const register = async (name: string, email: string, password: string) => {
  const { data } = await apiClient.post<{ success: boolean; data: AuthResponse }>('/auth/register', {
    name,
    email,
    password,
  });
  setAuthToken(data.data.tokens.accessToken);
  return data.data;
};

export const refresh = async (refreshToken: string) => {
  const { data } = await apiClient.post<{ success: boolean; data: AuthResponse }>('/auth/refresh', {
    refreshToken,
  });
  setAuthToken(data.data.tokens.accessToken);
  return data.data;
};

export const logout = async (refreshToken: string) => {
  await apiClient.post('/auth/logout', { refreshToken });
  setAuthToken(undefined);
};

export const getMe = async () => {
  const { data } = await apiClient.get<{ success: boolean; data: { user: User } }>('/auth/me');
  return data.data;
};

