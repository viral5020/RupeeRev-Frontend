import apiClient from './apiClient';
import { MonthlyStats, CategoryStats } from '../types';

export const fetchMonthlyStats = async (month?: number, year?: number) => {
  const { data } = await apiClient.get<{ success: boolean; data: MonthlyStats }>('/stats/monthly', {
    params: { month, year },
  });
  return data.data;
};

export const fetchCategoryStats = async (range: { startDate?: string; endDate?: string }) => {
  const { data } = await apiClient.get<{ success: boolean; data: CategoryStats[] }>('/stats/category', {
    params: range,
  });
  return data.data;
};

