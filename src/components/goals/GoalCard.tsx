import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  IconButton,
  Tooltip,
  Stack,
  Alert,
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import InfoIcon from '@mui/icons-material/InfoOutlined';
import PriorityTag from './PriorityTag';
import { Goal } from '../../types';
import { getGoalConfidence } from '../../services/goalEnhancerService';

interface GoalCardProps {
  goal: Goal;
  onSelect: (goal: Goal) => void;
  onDelete: (goal: Goal) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onSelect, onDelete }) => {
  const expectedYears = goal.expectedYears?.toFixed(1) ?? '0';
  const progress =
    goal.monthlyContribution > 0 && goal.expectedMonths > 0
      ? Math.min(100, (goal.monthlyContribution * goal.expectedMonths) / goal.targetAmount * 100)
      : 0;
  const [confidence, setConfidence] = useState<number | null>(null);

  useEffect(() => {
    getGoalConfidence(goal._id)
      .then((data) => setConfidence(data.score))
      .catch(() => {});
  }, [goal._id]);

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
        border: '1px solid rgba(99,102,241,0.15)',
        '&:hover': { boxShadow: '0 12px 30px rgba(79,70,229,0.15)', borderColor: '#6366f1' },
      }}
    >
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box>
            <Typography variant="subtitle1" fontWeight={700}>
              {goal.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Target: ₹{goal.targetAmount.toLocaleString('en-IN')}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <PriorityTag priority={goal.priority} />
            <Tooltip title="Goal details">
              <IconButton size="small" onClick={() => onSelect(goal)}>
                <InfoIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete goal">
              <IconButton size="small" onClick={() => onDelete(goal)}>
                <DeleteIcon fontSize="small" color="error" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        <Box mb={2}>
          <Typography variant="body2" color="text.secondary">
            Suggested SIP: ₹{goal.monthlyContribution.toLocaleString('en-IN')} / month
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Timeline: {expectedYears} years ({goal.expectedMonths} months)
          </Typography>
          {goal.note && (
            <Alert
              severity={goal.minimumTenureApplied ? "warning" : "info"}
              sx={{ mt: 1, py: 0, px: 1, fontSize: '0.75rem' }}
            >
              {goal.note}
            </Alert>
          )}
        </Box>

        <Box mb={2}>
          <Typography variant="caption" color="text.secondary">
            Progress towards target
          </Typography>
          <LinearProgress
            variant="determinate"
            value={Number(progress.toFixed(0))}
            sx={{ mt: 0.5, height: 8, borderRadius: 4 }}
          />
        </Box>

        <Stack direction="row" spacing={2} justifyContent="space-between" mt={2}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Recommended Category
            </Typography>
            <Typography variant="subtitle1" fontWeight={600}>
              {goal.categorySuggested?.toUpperCase()}
            </Typography>
          </Box>
          {confidence !== null && (
            <Box textAlign="right">
              <Typography variant="body2" color="text.secondary">
                Confidence Score
              </Typography>
              <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                <CircularProgress
                  variant="determinate"
                  value={confidence}
                  size={40}
                  sx={{ color: confidence >= 70 ? '#10b981' : confidence >= 50 ? '#f59e0b' : '#ef4444' }}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="caption" component="div" fontWeight={700}>
                    {confidence}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default GoalCard;



