import React from 'react';
import { Paper, Typography, Box, Chip } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { formatCurrency } from '../../utils/format';

interface NetWorthTrackerProps {
  currentNetWorth: number;
  lastMonthNetWorth: number;
}

const NetWorthTracker: React.FC<NetWorthTrackerProps> = ({ currentNetWorth, lastMonthNetWorth }) => {
  const change = currentNetWorth - lastMonthNetWorth;
  const changePercent = lastMonthNetWorth > 0 ? ((change / lastMonthNetWorth) * 100).toFixed(1) : '0.0';
  const isPositive = change >= 0;

  return (
    <Paper
      sx={{
        p: 2,
        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
        border: '2px solid #bbf7d0',
        borderRadius: 2,
        height: '100%',
      }}
    >
      <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1 }}>
        Net Worth Tracker
      </Typography>
      <Typography
        variant="h5"
        sx={{
          color: '#059669',
          fontWeight: 700,
          mb: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        {formatCurrency(currentNetWorth, 'INR')}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {isPositive ? (
          <TrendingUpIcon sx={{ color: '#10b981', fontSize: 20 }} />
        ) : (
          <TrendingDownIcon sx={{ color: '#ef4444', fontSize: 20 }} />
        )}
        <Chip
          label={`${isPositive ? '+' : ''}${changePercent}% vs last month`}
          size="small"
          sx={{
            bgcolor: isPositive ? '#d1fae5' : '#fee2e2',
            color: isPositive ? '#059669' : '#dc2626',
            fontWeight: 600,
          }}
        />
      </Box>
    </Paper>
  );
};

export default NetWorthTracker;

