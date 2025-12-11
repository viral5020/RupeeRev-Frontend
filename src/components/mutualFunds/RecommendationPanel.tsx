import React from 'react';
import { Paper, Typography, Box, Chip, LinearProgress, Stack } from '@mui/material';
import { AIRecommendation } from '../../types';

const allocationLabels: Record<string, string> = {
  index: 'Index SIP',
  equity: 'Equity SIP',
  balanced: 'Balanced SIP',
  gold: 'Gold SIP',
  debt: 'Debt SIP',
};

interface RecommendationPanelProps {
  recommendation?: AIRecommendation | null;
  loading?: boolean;
  error?: string | null;
}

const RecommendationPanel: React.FC<RecommendationPanelProps> = ({ recommendation, loading, error }) => {
  if (loading) {
    return (
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          🤖 AI Recommendation
        </Typography>
        <LinearProgress />
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          🤖 AI Recommendation
        </Typography>
        <Typography color="error">{error}</Typography>
      </Paper>
    );
  }

  if (!recommendation) {
    return (
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          🤖 AI Recommendation
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Provide your surplus and risk level to see personalized category suggestions.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        🤖 AI Recommendation
      </Typography>
      <Typography variant="subtitle2" color="text.secondary">
        Best Category
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        {recommendation.bestPerformingCategory}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {recommendation.summary}
      </Typography>

      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Suggested Allocation
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
          {Object.entries(recommendation.allocation).map(([category, value]) => (
            <Chip key={category} label={`${allocationLabels[category] || category}: ${(value * 100).toFixed(0)}%`} />
          ))}
        </Stack>
      </Box>

      <Typography variant="body2" sx={{ mt: 3 }}>
        {recommendation.reasoning}
      </Typography>
    </Paper>
  );
};

export default RecommendationPanel;


