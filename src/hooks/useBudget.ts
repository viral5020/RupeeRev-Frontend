import { useQuery } from '@tanstack/react-query';
import { fetchBudget } from '../services/budgetService';

export const useBudget = (month: number, year: number) =>
  useQuery({
    queryKey: ['budget', month, year],
    queryFn: () => fetchBudget(month, year),
  });

