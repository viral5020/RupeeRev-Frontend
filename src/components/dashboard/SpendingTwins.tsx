import React from 'react';
import { Paper, Typography, Box, Grid, Card, CardContent } from '@mui/material';
import { formatCurrency } from '../../utils/format';

interface SpendingTwinsProps {
  currentSurplus: number;
  currentExpenses: number;
}

const SpendingTwins: React.FC<SpendingTwinsProps> = ({ currentSurplus, currentExpenses }) => {
  // Calculate Income derived from Surplus + Expenses
  const currentIncome = currentSurplus + currentExpenses;

  // Good You: Reduces expenses by 10%
  const goodExpenses = currentExpenses * 0.9;
  const goodSurplus = currentIncome - goodExpenses;

  const goodYou = {
    expenses: goodExpenses,
    surplus: goodSurplus,
    netWorth1Y: goodSurplus * 12,
    netWorth3Y: goodSurplus * 36, // Simple projection
    netWorth5Y: goodSurplus * 60,
  };

  // Bad You: Increases expenses by 10%
  const badExpenses = currentExpenses * 1.1;
  const badSurplus = currentIncome - badExpenses;

  const badYou = {
    expenses: badExpenses,
    surplus: badSurplus,
    netWorth1Y: badSurplus * 12,
    netWorth3Y: badSurplus * 36,
    netWorth5Y: badSurplus * 60,
  };

  const scenarios = [
    { title: 'Good You', data: goodYou, color: '#10b981', emoji: '✅' },
    { title: 'Current You', data: { expenses: currentExpenses, surplus: currentSurplus, netWorth1Y: currentSurplus * 12, netWorth3Y: currentSurplus * 36, netWorth5Y: currentSurplus * 60 }, color: '#6366f1', emoji: '📊' },
    { title: 'Bad You', data: badYou, color: '#ef4444', emoji: '⚠️' },
  ];

  return (
    <Paper sx={{ p: 3, borderRadius: 2, background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        Spending Twins™
      </Typography>
      <Grid container spacing={2}>
        {scenarios.map((scenario) => (
          <Grid item xs={12} md={4} key={scenario.title}>
            <Card sx={{ border: `2px solid ${scenario.color}`, height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: scenario.color, fontWeight: 700, mb: 1 }}>
                  {scenario.emoji} {scenario.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Expenses: {formatCurrency(scenario.data.expenses, 'INR')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Surplus: {formatCurrency(scenario.data.surplus, 'INR')}
                </Typography>
                <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e5e7eb' }}>
                  <Typography variant="caption" color="text.secondary">
                    Future Net Worth:
                  </Typography>
                  <Typography variant="body2">1Y: {formatCurrency(scenario.data.netWorth1Y, 'INR')}</Typography>
                  <Typography variant="body2">3Y: {formatCurrency(scenario.data.netWorth3Y, 'INR')}</Typography>
                  <Typography variant="body2">5Y: {formatCurrency(scenario.data.netWorth5Y, 'INR')}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default SpendingTwins;

