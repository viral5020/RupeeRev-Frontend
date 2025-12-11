import React, { useEffect, useState } from 'react';
import { Paper, Typography, Box, Alert, Chip, Stack, Collapse, IconButton, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getCategorySpike, getOverspendingWarning, getSubscriptionPredictions, getRepeatedMerchants, getAIInsights } from '../../services/predictionService';
import { formatCurrency } from '../../utils/format';
import apiClient from '../../services/apiClient';

interface AIInsight {
  type: 'warning' | 'info' | 'success';
  title: string;
  message: string;
}

const TransactionInsights: React.FC = () => {
  const [categorySpike, setCategorySpike] = useState<any>(null);
  const [overspending, setOverspending] = useState<any>(null);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [merchants, setMerchants] = useState<any[]>([]);
  const [aiInsights, setAIInsights] = useState<AIInsight[]>([]);
  const [expanded, setExpanded] = useState(false);

  // Edit State
  const [editItem, setEditItem] = useState<any>(null);
  const [editType, setEditType] = useState<string>('');
  const [editAmount, setEditAmount] = useState<string>('');
  const [editDate, setEditDate] = useState<string>('');

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = () => {
    getCategorySpike().then(setCategorySpike).catch(() => { });
    getOverspendingWarning().then(setOverspending).catch(() => { });
    getSubscriptionPredictions().then(setSubscriptions).catch(() => { });
    getRepeatedMerchants().then(setMerchants).catch(() => { });
    getAIInsights().then(setAIInsights).catch(() => { });
  };

  const handleEditClick = (item: any, type: string) => {
    setEditItem(item);
    setEditType(type);
    setEditAmount(item.amount || item.avgAmount || '');
    // Handle date formatting if needed
    const dateStr = item.nextChargeDate ? new Date(item.nextChargeDate).toISOString().split('T')[0] : '';
    setEditDate(dateStr);
  };

  const handleIgnore = async (merchantName: string, type: string) => {
    try {
      // Optimistic update for now since backend endpoint might not exist
      if (type === 'subscription') {
        setSubscriptions(prev => prev.filter(s => s.merchant !== merchantName));
      } else if (type === 'merchant_insight') {
        setMerchants(prev => prev.filter(m => m.merchant !== merchantName));
      }
    } catch (error) {
      console.error('Error ignoring item:', error);
    }
  };

  const handleSaveEdit = async () => {
    if (!editItem) return;

    try {
      // Prepare payload
      const payload = {
        merchant: editItem.merchant,
        amount: parseFloat(editAmount),
        date: editDate,
        type: editType
      };

      // Optimistic update
      if (editType === 'subscription') {
        setSubscriptions(prev => prev.map(s => s.merchant === editItem.merchant ? { ...s, amount: payload.amount, nextChargeDate: payload.date } : s));
      }

      setEditItem(null);
    } catch (error) {
      console.error('Error saving edit:', error);
    }
  };

  return (
    <Paper sx={{ p: 2, mb: 2, borderRadius: 2, bgcolor: '#f8fafc' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="h6" fontWeight={700}>
          🤖 AI-Based Insights
        </Typography>
        <IconButton size="small" onClick={() => setExpanded(!expanded)}>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Stack>

      <Collapse in={expanded || !expanded}>
        <Stack spacing={2}>
          {/* AI Generated Insights */}
          {aiInsights.length > 0 && (
            <Box>
              <Typography variant="subtitle2" fontWeight={600} mb={1}>
                💡 AI Recommendations
              </Typography>
              <Stack spacing={1}>
                {aiInsights.map((insight, idx) => (
                  <Alert key={idx} severity={insight.type}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {insight.title}
                    </Typography>
                    <Typography variant="body2">{insight.message}</Typography>
                  </Alert>
                ))}
              </Stack>
            </Box>
          )}

          {categorySpike && (
            <Alert severity="warning">
              <Typography variant="subtitle2" fontWeight={600}>
                Biggest Category Spike
              </Typography>
              <Typography variant="body2">
                {categorySpike.category}: {formatCurrency(categorySpike.currentMonth, 'INR')} this month vs{' '}
                {formatCurrency(categorySpike.lastMonth, 'INR')} last month ({categorySpike.spikePercent > 0 ? '+' : ''}
                {categorySpike.spikePercent}%)
              </Typography>
            </Alert>
          )}

          {overspending && (
            <Alert severity="error">
              <Typography variant="subtitle2" fontWeight={600}>
                Predicted Overspending Warning
              </Typography>
              <Typography variant="body2">{overspending.message}</Typography>
            </Alert>
          )}

          {subscriptions.length > 0 && (
            <Box>
              <Typography variant="subtitle2" fontWeight={600} mb={1}>
                Subscription Predictor
              </Typography>
              <Stack spacing={1}>
                {subscriptions.slice(0, 3).map((sub, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label={`${sub.merchant}: ${formatCurrency(sub.amount, 'INR')} on ${new Date(sub.nextChargeDate).toLocaleDateString()}`}
                      size="small"
                      sx={{ justifyContent: 'flex-start', flexGrow: 1 }}
                    />
                    <IconButton size="small" onClick={() => handleEditClick(sub, 'subscription')} sx={{ p: 0.5 }}>
                      <EditIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleIgnore(sub.merchant, 'subscription')} sx={{ p: 0.5, color: 'error.main' }}>
                      <DeleteIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          {merchants.length > 0 && (
            <Box>
              <Typography variant="subtitle2" fontWeight={600} mb={1}>
                Repeated Merchant Insights
              </Typography>
              <Stack spacing={1}>
                {merchants.slice(0, 3).map((m, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label={`${m.merchant}: ${m.count}x, Avg: ${formatCurrency(m.avgAmount, 'INR')}`}
                      size="small"
                      sx={{ justifyContent: 'flex-start', flexGrow: 1 }}
                    />
                    <IconButton size="small" onClick={() => handleEditClick(m, 'merchant_insight')} sx={{ p: 0.5 }}>
                      <EditIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleIgnore(m.merchant, 'merchant_insight')} sx={{ p: 0.5, color: 'error.main' }}>
                      <DeleteIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}
        </Stack>
      </Collapse>

      {/* Edit Dialog */}
      <Dialog open={!!editItem} onClose={() => setEditItem(null)}>
        <DialogTitle>Edit Insight</DialogTitle>
        <DialogContent sx={{ minWidth: 300, pt: 1 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Amount"
            type="number"
            fullWidth
            value={editAmount}
            onChange={(e) => setEditAmount(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Date"
            type="date"
            fullWidth
            value={editDate}
            onChange={(e) => setEditDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditItem(null)}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default TransactionInsights;
