import { useQuery } from '@tanstack/react-query';
import { fetchTransactions } from '../services/transactionService';
import { useFilters } from '../context/FilterContext';
import { PaginatedResult, Transaction } from '../types';

export const useTransactions = () => {
  const { filters } = useFilters();
  return useQuery<PaginatedResult<Transaction>>({
    queryKey: ['transactions', filters],
    queryFn: () => fetchTransactions(filters),
    placeholderData: (previous) => previous,
  });
};

