import React, { useEffect, useState } from 'react';
import { Paper, Typography, Box, Chip, Stack, Collapse, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { getPredictedBills } from '../../services/predictionService';
import { formatCurrency } from '../../utils/format';

interface PredictedBill {
  merchant: string;
  amount: number;
  expectedDate: string;
  confidence: number;
  lastPaid: string;
}

const BillPredictor: React.FC = () => {
  const [bills, setBills] = useState<PredictedBill[]>([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    getPredictedBills().then(setBills).catch(() => { });
  }, []);

  const totalBills = bills.reduce((sum, b) => sum + b.amount, 0);

  return (
    <Paper sx={{ p: 2, mb: 2, borderRadius: 2, bgcolor: '#fef3c7', border: '1px solid #fbbf24' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            Predicted bills this month
          </Typography>
          <Typography variant="h5" sx={{ color: '#92400e', fontWeight: 700 }}>
            {formatCurrency(totalBills, 'INR')}
          </Typography>
        </Box>
        <IconButton size="small" onClick={() => setExpanded(!expanded)}>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Stack>

      <Collapse in={expanded}>
        <Stack spacing={1} mt={2}>
          {bills.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No recurring bills detected yet. Add more transactions to see predictions.
            </Typography>
          ) : (
            bills.map((bill, idx) => (
              <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" fontWeight={600}>{bill.merchant}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Last paid: {new Date(bill.lastPaid).toLocaleDateString()} • {(bill.confidence * 100).toFixed(0)}% confidence
                  </Typography>
                </Box>
                <Chip
                  label={`${formatCurrency(bill.amount, 'INR')} on ${new Date(bill.expectedDate).toLocaleDateString()}`}
                  size="small"
                />
              </Box>
            ))
          )}
        </Stack>
      </Collapse>
    </Paper>
  );
};

export default BillPredictor;

