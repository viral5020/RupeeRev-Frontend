import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';
import { formatCurrency } from '../../utils/format';

interface Props {
  spent: number;
  limit: number;
  label: string;
  currency?: string;
}

const BudgetProgress: React.FC<Props> = ({ spent, limit, label, currency = 'USD' }) => {
  const percentage = Math.min((spent / limit) * 100, 100);
  const color = percentage >= 100 ? 'error' : percentage >= 70 ? 'warning' : 'success';

  return (
    <Box sx={{ p: 2, borderRadius: 2, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
      <Typography variant="subtitle2">{label}</Typography>
      <Typography variant="h6">{formatCurrency(spent, currency)}</Typography>
      <Typography variant="caption" color="text.secondary">
        of {formatCurrency(limit, currency)}
      </Typography>
      <LinearProgress variant="determinate" value={percentage} color={color} sx={{ mt: 1 }} />
    </Box>
  );
};

export default BudgetProgress;

