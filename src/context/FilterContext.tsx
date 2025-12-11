import React, { createContext, useContext, useMemo, useState } from 'react';
import { TransactionFilters } from '../services/transactionService';

interface FilterContextValue {
  filters: TransactionFilters;
  setFilters: (filters: TransactionFilters) => void;
  reset: () => void;
}

const FilterContext = createContext<FilterContextValue | undefined>(undefined);

const defaultFilters: TransactionFilters = {
  page: 1,
  limit: 10,
};

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filters, setFiltersState] = useState<TransactionFilters>(defaultFilters);

  const setFilters = (next: TransactionFilters) => {
    setFiltersState((prev) => ({ ...prev, ...next }));
  };

  const reset = () => setFiltersState(defaultFilters);

  const value = useMemo(() => ({ filters, setFilters, reset }), [filters]);

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
};

export const useFilters = () => {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error('useFilters must be used within FilterProvider');
  return ctx;
};

