import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  Stack,
} from '@mui/material';
import { GoalPriority, CreateGoalPayload } from '../../types';

interface NewGoalFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateGoalPayload) => Promise<void>;
}

const NewGoalForm: React.FC<NewGoalFormProps> = ({ open, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState<number>(50000);
  const [priority, setPriority] = useState<GoalPriority>('medium');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit({ name, targetAmount, priority });
      setName('');
      setTargetAmount(50000);
      setPriority('medium');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create New Goal</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="Goal Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
          <TextField
            label="Target Amount (₹)"
            type="number"
            value={targetAmount}
            onChange={(e) => setTargetAmount(Number(e.target.value))}
            fullWidth
          />
          <ToggleButtonGroup
            exclusive
            value={priority}
            onChange={(_event, value) => value && setPriority(value)}
            size="small"
            color="primary"
          >
            <ToggleButton value="high">High</ToggleButton>
            <ToggleButton value="medium">Medium</ToggleButton>
            <ToggleButton value="low">Low</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading || !name || targetAmount <= 0}>
          {loading ? 'Saving…' : 'Save Goal'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewGoalForm;



