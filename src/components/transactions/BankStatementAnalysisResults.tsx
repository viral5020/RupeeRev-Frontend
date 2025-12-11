import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Stack,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { formatCurrency } from '../../utils/format';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
} from 'recharts';

interface AnalysisResult {
  summary: {
    totalImported: number;
    dateRange: { start: string; end: string };
    totalIncome: number;
    totalExpenses: number;
    avgMonthlyIncome: number;
    avgMonthlyExpense: number;
  };
  categories: Array<{ name: string; total: number; count: number }>;
  subscriptions: Array<{ merchant: string; amount: number; frequency: string }>;
  salaryDetected: number | null;
  monthlyAverages: Array<{ month: string; income: number; expense: number; surplus: number }>;
  spendingSpikes: Array<{ month: string; amount: number; category: string }>;
  updatedSurplus: number;
  updatedSavingsRate: number;
  goalImpact: Array<{ goalId: string; goalName: string; newSip: number; oldSip: number }>;
}

interface BankStatementAnalysisResultsProps {
  analysis: AnalysisResult;
}

const BankStatementAnalysisResults: React.FC<BankStatementAnalysisResultsProps> = ({ analysis }) => {
  // Prepare data for charts
  const monthlyChartData = analysis.monthlyAverages.map((m) => ({
    month: new Date(m.month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    income: m.income,
    expense: m.expense,
    surplus: m.surplus,
  }));

  const categoryChartData = analysis.categories.slice(0, 10).map((cat) => ({
    name: cat.name.length > 15 ? cat.name.substring(0, 15) + '...' : cat.name,
    amount: cat.total,
    count: cat.count,
  }));

  // Year-over-year comparison
  const yearComparison = React.useMemo(() => {
    const byYear: Record<string, { income: number; expense: number; count: number }> = {};
    analysis.monthlyAverages.forEach((m) => {
      const year = m.month.split('-')[0];
      if (!byYear[year]) {
        byYear[year] = { income: 0, expense: 0, count: 0 };
      }
      byYear[year].income += m.income;
      byYear[year].expense += m.expense;
      byYear[year].count += 1;
    });
    return Object.entries(byYear).map(([year, data]) => ({
      year,
      income: data.income / data.count,
      expense: data.expense / data.count,
      savingsRate: ((data.income - data.expense) / data.income) * 100,
    }));
  }, [analysis.monthlyAverages]);

  // Spending heatmap data (monthly spending intensity)
  const heatmapData = analysis.monthlyAverages.map((m) => ({
    month: m.month,
    intensity: m.expense / analysis.summary.avgMonthlyExpense,
    amount: m.expense,
  }));

  const getHeatmapColor = (intensity: number) => {
    if (intensity < 0.8) return '#4caf50'; // Green (low)
    if (intensity < 1.2) return '#ffeb3b'; // Yellow (normal)
    if (intensity < 1.5) return '#ff9800'; // Orange (high)
    return '#f44336'; // Red (very high)
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h5" gutterBottom fontWeight={700}>
        📊 Detailed Analysis Results
      </Typography>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        {/* Financial Behavior Over Time */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              📈 Your Financial Behavior Over {analysis.monthlyAverages.length} Months
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#4caf50" strokeWidth={2} name="Income" />
                <Line type="monotone" dataKey="expense" stroke="#f44336" strokeWidth={2} name="Expenses" />
                <Line type="monotone" dataKey="surplus" stroke="#2196f3" strokeWidth={2} name="Surplus" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Year-over-Year Comparison */}
        {yearComparison.length > 1 && (
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                📅 Year-over-Year Comparison
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={yearComparison}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="income" fill="#4caf50" name="Avg Monthly Income" />
                  <Bar dataKey="expense" fill="#f44336" name="Avg Monthly Expense" />
                </BarChart>
              </ResponsiveContainer>
              <Stack spacing={1} sx={{ mt: 2 }}>
                {yearComparison.map((y) => (
                  <Box key={y.year} display="flex" justifyContent="space-between">
                    <Typography variant="body2">{y.year} Savings Rate:</Typography>
                    <Chip
                      label={`${y.savingsRate.toFixed(1)}%`}
                      color={y.savingsRate > 20 ? 'success' : y.savingsRate > 10 ? 'warning' : 'error'}
                      size="small"
                    />
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>
        )}

        {/* Monthly Spending Heatmap */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              🔥 Monthly Spending Heatmap
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
              {heatmapData.map((h) => (
                <Box
                  key={h.month}
                  sx={{
                    bgcolor: getHeatmapColor(h.intensity),
                    color: 'white',
                    p: 1,
                    borderRadius: 1,
                    minWidth: 80,
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="caption" display="block">
                    {new Date(h.month + '-01').toLocaleDateString('en-US', { month: 'short' })}
                  </Typography>
                  <Typography variant="caption" fontWeight={600}>
                    {formatCurrency(h.amount)}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <Chip label="Low" size="small" sx={{ bgcolor: '#4caf50', color: 'white' }} />
              <Chip label="Normal" size="small" sx={{ bgcolor: '#ffeb3b' }} />
              <Chip label="High" size="small" sx={{ bgcolor: '#ff9800', color: 'white' }} />
              <Chip label="Very High" size="small" sx={{ bgcolor: '#f44336', color: 'white' }} />
            </Stack>
          </Paper>
        </Grid>

        {/* Category Breakdown */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              💰 Top Categories
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={categoryChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Bar dataKey="amount" fill="#2196f3" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Spending Spikes & Anomalies */}
        {analysis.spendingSpikes.length > 0 && (
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                ⚠️ Expense Anomalies & Spikes
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Month</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell align="right">Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {analysis.spendingSpikes.map((spike, idx) => (
                      <TableRow key={idx}>
                        <TableCell>
                          {new Date(spike.month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </TableCell>
                        <TableCell>{spike.category}</TableCell>
                        <TableCell align="right">{formatCurrency(spike.amount)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        )}

        {/* Salary Detection */}
        {analysis.salaryDetected && (
          <Grid item xs={12} md={6}>
            <Alert severity="info" icon={<span>💼</span>}>
              <Typography variant="subtitle2" fontWeight={600}>
                Detected Monthly Salary
              </Typography>
              <Typography variant="h6" color="primary">
                {formatCurrency(analysis.salaryDetected)}
              </Typography>
            </Alert>
          </Grid>
        )}

        {/* Subscriptions */}
        {analysis.subscriptions.length > 0 && (
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                🔔 Auto-Detected Subscriptions
              </Typography>
              <Stack spacing={1}>
                {analysis.subscriptions.map((sub, idx) => (
                  <Box key={idx} display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        {sub.merchant}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {sub.frequency}
                      </Typography>
                    </Box>
                    <Typography variant="body2" fontWeight={600}>
                      {formatCurrency(sub.amount)}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default BankStatementAnalysisResults;

