import React from 'react';
import { Paper, Typography, Box, Chip } from '@mui/material';
import { CategoryPerformance } from '../../types';

interface BestCategoryCardProps {
  category?: CategoryPerformance;
}

const BestCategoryCard: React.FC<BestCategoryCardProps> = ({ category }) => {
  if (!category) {
    return (
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="subtitle1">Best Performing Category</Typography>
        <Typography variant="body2" color="text.secondary">
          No performance data available yet.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        background: 'linear-gradient(135deg, #d8b4fe 0%, #818cf8 100%)',
        color: '#fff',
        height: '100%',
      }}
    >
      <Typography variant="overline" sx={{ letterSpacing: 1.5 }}>
        Best Performing Category
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
        {category.category}
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.8 }}>
        {category.normalizedCategory.toUpperCase()}
      </Typography>

      <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Chip label={`1M: ${(category.avg1Month ?? 0).toFixed(2)}%`} color="success" />
        <Chip label={`3M: ${(category.avg3Month ?? 0).toFixed(2)}%`} sx={{ backgroundColor: '#fef9c3' }} />
        <Chip
          label={`1Y: ${(category.avg1Year ?? 0).toFixed(2)}%`}
          sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 600 }}
        />
      </Box>

      <Typography variant="body2" sx={{ mt: 3, opacity: 0.9 }}>
        Trend shows consistent outperformance over the past year. Consider prioritizing this
        category for surplus deployment.
      </Typography>
    </Paper>
  );
};

export default BestCategoryCard;


