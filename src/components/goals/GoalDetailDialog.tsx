import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Divider,
} from '@mui/material';
import { Goal } from '../../types';
import PriorityTag from './PriorityTag';
import WhatIfSimulator from './WhatIfSimulator';

interface GoalDetailDialogProps {
  goal: Goal | null;
  onClose: () => void;
}

const GoalDetailDialog: React.FC<GoalDetailDialogProps> = ({ goal, onClose }) => {
  const [simulatorOpen, setSimulatorOpen] = useState(false);
  if (!goal) return null;

  return (
    <Dialog open={Boolean(goal)} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {goal.name} <PriorityTag priority={goal.priority} />
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Typography variant="body1">
            Target Amount:{' '}
            <strong>₹{goal.targetAmount.toLocaleString('en-IN')}</strong>
          </Typography>
          <Typography variant="body1">
            Monthly Contribution:{' '}
            <strong>₹{goal.monthlyContribution.toLocaleString('en-IN')}</strong>
          </Typography>
          <Typography variant="body1">
            Expected Timeline:{' '}
            <strong>
              {goal.expectedYears.toFixed(1)} years ({goal.expectedMonths} months)
            </strong>
          </Typography>
          <Typography variant="body1">
            Recommended Category:{' '}
            <strong>{goal.categorySuggested?.toUpperCase()}</strong>
          </Typography>
          <Divider />
          <Typography variant="body2" color="text.secondary">
            Status: {goal.status.replace('-', ' ')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Created: {new Date(goal.createdAt).toLocaleDateString()}
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setSimulatorOpen(true)} variant="outlined">
          Simulate Different SIP Amounts
        </Button>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
      <WhatIfSimulator
        goalId={goal._id}
        targetAmount={goal.targetAmount}
        currentSip={goal.monthlyContribution}
        currentMonths={goal.expectedMonths}
        open={simulatorOpen}
        onClose={() => setSimulatorOpen(false)}
      />
    </Dialog>
  );
};

export default GoalDetailDialog;



