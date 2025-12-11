import { useQuery } from '@tanstack/react-query';
import { fetchAccounts } from '../services/accountService';

export const useAccounts = () =>
  useQuery({
    queryKey: ['accounts'],
    queryFn: fetchAccounts,
  });

