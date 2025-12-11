import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '../services/categoryService';

export const useCategories = () =>
  useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

