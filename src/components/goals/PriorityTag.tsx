import React from 'react';
import { Chip } from '@mui/material';
import { GoalPriority } from '../../types';

const palette: Record<GoalPriority, { color: string; bg: string; label: string }> = {
  high: { color: '#b91c1c', bg: '#fee2e2', label: 'High Priority' },
  medium: { color: '#b45309', bg: '#ffedd5', label: 'Medium Priority' },
  low: { color: '#047857', bg: '#d1fae5', label: 'Low Priority' },
};

interface PriorityTagProps {
  priority: GoalPriority;
}

const PriorityTag: React.FC<PriorityTagProps> = ({ priority }) => {
  const data = palette[priority];
  return (
    <Chip
      label={data.label}
      size="small"
      sx={{
        backgroundColor: data.bg,
        color: data.color,
        fontWeight: 600,
      }}
    />
  );
};

export default PriorityTag;



