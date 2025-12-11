import React from 'react';
import { MenuItem, TextField } from '@mui/material';
import { useCategories } from '../../hooks/useCategories';
import { TransactionType } from '../../types';

interface Props {
  value?: string;
  onChange: (value: string) => void;
  type?: TransactionType | 'all';
  label?: string;
}

const CategorySelect: React.FC<Props> = ({ value, onChange, type = 'all', label = 'Category' }) => {
  const { data } = useCategories();
  const filtered = type === 'all' ? data : data?.filter((category) => category.type === type);
  return (
    <TextField select label={label} value={value ?? ''} onChange={(event) => onChange(event.target.value)} fullWidth>
      {filtered?.map((category) => (
        <MenuItem key={category._id} value={category._id}>
          {category.icon} {category.name}
        </MenuItem>
      )) || <MenuItem disabled>No categories</MenuItem>}
    </TextField>
  );
};

export default CategorySelect;

