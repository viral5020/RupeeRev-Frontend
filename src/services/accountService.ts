import apiClient from './apiClient';
import { Account } from '../types';

export const fetchAccounts = async () => {
  const { data } = await apiClient.get<{ success: boolean; data: Account[] }>('/accounts');
  return data.data;
};

export const createAccount = async (payload: Partial<Account>) => {
  const { data } = await apiClient.post<{ success: boolean; data: Account }>('/accounts', payload);
  return data.data;
};

export const deleteAccount = async (id: string) => {
  await apiClient.delete(`/accounts/${id}`);
};

