import apiClient from './apiClient';
import { PaginatedResult, Transaction, TransactionType } from '../types';

export interface TransactionFilters {
  page?: number;
  limit?: number;
  type?: TransactionType;
  category?: string;
  account?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export const fetchTransactions = async (filters: TransactionFilters) => {
  const { data } = await apiClient.get<{ success: boolean; data: PaginatedResult<Transaction> }>('/transactions', {
    params: filters,
  });
  return data.data;
};

export const createTransaction = async (payload: FormData) => {
  const { data } = await apiClient.post<{ success: boolean; data: Transaction }>('/transactions', payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
};

export const updateTransaction = async (id: string, payload: FormData) => {
  const { data } = await apiClient.put<{ success: boolean; data: Transaction }>(`/transactions/${id}`, payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
};

export const deleteTransaction = async (id: string) => {
  await apiClient.delete(`/transactions/${id}`);
};

export const deleteAllTransactions = async () => {
  const { data } = await apiClient.delete<{ success: boolean; data: { deletedCount: number } }>('/transactions');
  return data.data;
};

