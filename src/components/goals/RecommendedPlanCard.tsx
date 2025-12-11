import React from 'react';
import { Card, CardContent, Typography, Stack, Chip } from '@mui/material';
import { Goal } from '../../types';

interface RecommendedPlanCardProps {
  goals: Goal[];
  surplus: number;
}

const RecommendedPlanCard: React.FC<RecommendedPlanCardProps> = ({ goals, surplus }) => {
  const totalContribution = goals.reduce((sum, goal) => sum + goal.monthlyContribution, 0);
  const highlighted = goals.slice(0, 3);

  return (
    <Card
      sx={{
        borderRadius: 3,
        background: 'linear-gradient(120deg, #ecfccb 0%, #d9f99d 60%, #fef9c3 100%)',
        border: '1px solid rgba(34,197,94,0.4)',
      }}
    >
      <CardContent>
        <Typography variant="overline" sx={{ letterSpacing: 2, color: '#15803d' }}>
          Allocation Snapshot
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          ₹{totalContribution.toLocaleString('en-IN')} / month
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          from total surplus of ₹{surplus.toLocaleString('en-IN')}
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={1}>
          {highlighted.map((goal) => (
            <Chip
              key={goal._id}
              label={`${goal.name}: ₹${goal.monthlyContribution.toLocaleString('en-IN')}`}
              sx={{ backgroundColor: '#dcfce7', color: '#166534', fontWeight: 600 }}
            />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default RecommendedPlanCard;



