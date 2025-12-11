import { useQuery } from '@tanstack/react-query';
import { fetchCategoryStats, fetchMonthlyStats } from '../services/statsService';

export const useMonthlyStats = (month?: number, year?: number) =>
  useQuery({
    queryKey: ['stats-monthly', month, year],
    queryFn: () => fetchMonthlyStats(month, year),
  });

export const useCategoryStats = (range: { startDate?: string; endDate?: string }) =>
  useQuery({
    queryKey: ['stats-category', range],
    queryFn: () => fetchCategoryStats(range),
  });

