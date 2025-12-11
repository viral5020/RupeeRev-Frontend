import React from 'react';
import { Paper, Typography, Box, LinearProgress } from '@mui/material';
import { formatCurrency } from '../../utils/format';

interface EmergencyFundStatusProps {
  currentFund: number;
  avgMonthlyExpense: number;
  recommendedMonths: number;
}

const EmergencyFundStatus: React.FC<EmergencyFundStatusProps> = ({
  currentFund,
  avgMonthlyExpense,
  recommendedMonths,
}) => {
  const recommendedAmount = avgMonthlyExpense * recommendedMonths;
  const monthsCovered = avgMonthlyExpense > 0 ? currentFund / avgMonthlyExpense : 0;
  const progress = recommendedAmount > 0 ? Math.min(100, (currentFund / recommendedAmount) * 100) : 0;
  const monthsNeeded = Math.max(0, recommendedMonths - monthsCovered);

  const getStatusColor = () => {
    if (monthsCovered >= recommendedMonths) return '#10b981';
    if (monthsCovered >= recommendedMonths * 0.5) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <Paper
      sx={{
        p: 2,
        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
        border: '2px solid #fbbf24',
        borderRadius: 2,
        height: '100%',
      }}
    >
      <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1 }}>
        Emergency Fund Status
      </Typography>
      <Typography variant="h6" sx={{ color: '#92400e', fontWeight: 700, mb: 1 }}>
        You have {monthsCovered.toFixed(1)} months / need {monthsNeeded.toFixed(1)} more
      </Typography>
      <Box sx={{ mb: 1 }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: '#fef3c7',
            '& .MuiLinearProgress-bar': {
              bgcolor: getStatusColor(),
              borderRadius: 4,
            },
          }}
        />
      </Box>
      <Typography variant="caption" sx={{ color: '#78350f' }}>
        Recommended: {recommendedMonths} months ({formatCurrency(recommendedAmount, 'INR')})
      </Typography>
    </Paper>
  );
};

export default EmergencyFundStatus;

