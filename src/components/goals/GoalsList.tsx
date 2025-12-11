import React from 'react';
import { Grid, Typography } from '@mui/material';
import { Goal } from '../../types';
import GoalCard from './GoalCard';

interface GoalsListProps {
  goals: Goal[];
  onSelect: (goal: Goal) => void;
  onDelete: (goal: Goal) => void;
}

const GoalsList: React.FC<GoalsListProps> = ({ goals, onSelect, onDelete }) => {
  if (!goals.length) {
    return (
      <Typography variant="body1" color="text.secondary">
        No goals yet. Create your first target to see projections.
      </Typography>
    );
  }

  return (
    <Grid container spacing={3}>
      {goals.map((goal) => (
        <Grid item xs={12} md={6} lg={4} key={goal._id}>
          <GoalCard goal={goal} onSelect={onSelect} onDelete={onDelete} />
        </Grid>
      ))}
    </Grid>
  );
};

export default GoalsList;



