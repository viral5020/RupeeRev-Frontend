import apiClient from './apiClient';
import { Budget } from '../types';

export const fetchBudget = async (month: number, year: number) => {
  const { data } = await apiClient.get<{ success: boolean; data: Budget | null }>('/budgets', {
    params: { month, year },
  });
  return data.data;
};

export const saveBudget = async (payload: { month: number; year: number; totalLimit: number; categoryBudgets: { category: string; limit: number }[] }) => {
  const { data } = await apiClient.post<{ success: boolean; data: Budget }>('/budgets', payload);
  return data.data;
};

