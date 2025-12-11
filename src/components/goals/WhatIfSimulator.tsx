import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Slider,
  Box,
  Paper,
  Stack,
} from '@mui/material';
import { formatCurrency } from '../../utils/format';
import apiClient from '../../services/apiClient';

interface WhatIfSimulatorProps {
  goalId: string;
  targetAmount: number;
  currentSip: number;
  currentMonths: number;
  open: boolean;
  onClose: () => void;
}

const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  goalId,
  targetAmount,
  currentSip,
  currentMonths,
  open,
  onClose,
}) => {
  const [sipAmount, setSipAmount] = useState(currentSip);
  const [tenureMonths, setTenureMonths] = useState(currentMonths);
  const [projection, setProjection] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const calculateProjection = async () => {
    setLoading(true);
    try {
      // This would call backend to calculate with new SIP and tenure
      // For now, using simplified calculation
      const annualReturn = 12; // Default
      const monthlyRate = annualReturn / 100 / 12;
      const months = tenureMonths;
      const sip = sipAmount;

      // FV = P * [((1 + r)^n - 1) / r]
      const futureValue = sip * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate));
      const totalInvested = sip * months;
      const returns = futureValue - totalInvested;

      setProjection({
        futureValue: Math.round(futureValue),
        totalInvested: Math.round(totalInvested),
        returns: Math.round(returns),
        months,
      });
    } catch (error) {
      console.error('Failed to calculate projection', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Simulate Different SIP Amounts</DialogTitle>
      <DialogContent>
        <Stack spacing={3}>
          <Box>
            <Typography gutterBottom>SIP Amount: {formatCurrency(sipAmount, 'INR')}</Typography>
            <Slider
              value={sipAmount}
              onChange={(_, value) => setSipAmount(value as number)}
              min={500}
              max={currentSip * 3}
              step={500}
              marks
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => formatCurrency(value, 'INR')}
            />
          </Box>

          <Box>
            <Typography gutterBottom>Tenure: {tenureMonths} months ({Math.round(tenureMonths / 12 * 10) / 10} years)</Typography>
            <Slider
              value={tenureMonths}
              onChange={(_, value) => setTenureMonths(value as number)}
              min={12}
              max={120}
              step={6}
              marks={[
                { value: 12, label: '1Y' },
                { value: 36, label: '3Y' },
                { value: 60, label: '5Y' },
                { value: 120, label: '10Y' },
              ]}
              valueLabelDisplay="auto"
            />
          </Box>

          <Button variant="contained" onClick={calculateProjection} disabled={loading} fullWidth>
            Calculate Projection
          </Button>

          {projection && (
            <Paper sx={{ p: 2, bgcolor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
              <Typography variant="h6" sx={{ color: '#059669', mb: 1 }}>
                Projected Results
              </Typography>
              <Stack spacing={1}>
                <Typography>
                  Future Value: <strong>{formatCurrency(projection.futureValue, 'INR')}</strong>
                </Typography>
                <Typography>
                  Total Invested: {formatCurrency(projection.totalInvested, 'INR')}
                </Typography>
                <Typography>
                  Expected Returns: {formatCurrency(projection.returns, 'INR')}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Based on 12% annual return assumption
                </Typography>
              </Stack>
            </Paper>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default WhatIfSimulator;

