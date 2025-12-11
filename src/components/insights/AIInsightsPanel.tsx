import React, { useEffect, useState } from 'react';
import {
    Paper,
    Typography,
    Box,
    Alert,
    Stack,
    Button,
    CircularProgress,
    Chip,
    Grid,
    Card,
    CardContent,
    IconButton,
    Collapse
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningIcon from '@mui/icons-material/Warning';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import EditIcon from '@mui/icons-material/Edit';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { getAiInsights, refreshAiInsights, AiInsights } from '../../services/aiInsightsService';
import { formatCurrency } from '../../utils/format';
import { useSnackbar } from 'notistack';

const AIInsightsPanel: React.FC = () => {
    const [insights, setInsights] = useState<AiInsights | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [showAll, setShowAll] = useState(false);
    const [expandedSections, setExpandedSections] = useState({
        insights: true,
        predictions: true,
        savings: true,
        risks: false
    });

    // Monthly Income Edit State
    const [customIncome, setCustomIncome] = useState<number | null>(null);
    const [editIncomeOpen, setEditIncomeOpen] = useState(false);
    const [tempIncome, setTempIncome] = useState('');

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        loadInsights();
    }, []);

    const loadInsights = async () => {
        try {
            setLoading(true);
            const data = await getAiInsights();
            setInsights(data);
        } catch (error: any) {
            enqueueSnackbar(error.response?.data?.message || 'Failed to load AI insights', {
                variant: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        try {
            setRefreshing(true);
            const data = await refreshAiInsights();
            setInsights(data);
            enqueueSnackbar('AI insights refreshed successfully', { variant: 'success' });
        } catch (error: any) {
            enqueueSnackbar(error.response?.data?.message || 'Failed to refresh insights', {
                variant: 'error'
            });
        } finally {
            setRefreshing(false);
        }
    };

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    if (loading) {
        return (
            <Paper sx={{ p: 3, mb: 2, textAlign: 'center' }}>
                <CircularProgress />
                <Typography variant="body2" sx={{ mt: 2 }}>
                    Generating AI insights...
                </Typography>
            </Paper>
        );
    }

    if (!insights) {
        return null;
    }

    const displayedInsights = showAll ? insights.insights : insights.insights.slice(0, 5);

    // Dynamic Calculations
    const monthlyIncome = customIncome ?? (insights.spendingPatterns.totalIncome / 3);
    const monthlyExpense = insights.spendingPatterns.totalSpending / 3;
    const monthlySavings = monthlyIncome - monthlyExpense;

    // Calculate dynamic investment suggestion
    // Use original ratio if possible, otherwise default to 20% of positive savings
    const originalSavings = (insights.spendingPatterns.totalIncome - insights.spendingPatterns.totalSpending) / 3;
    const investmentRatio = originalSavings > 0
        ? insights.recommendations.investmentSuggestion / originalSavings
        : 0.2;

    const investmentSuggestion = monthlySavings > 0 ? monthlySavings * investmentRatio : 0;

    return (
        <Paper sx={{ p: 3, mb: 2, borderRadius: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            {/* Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Box>
                    <Typography variant="h5" fontWeight={700} color="white">
                        🤖 AI Financial Insights
                    </Typography>
                    <Typography variant="body2" color="rgba(255,255,255,0.8)">
                        Powered by Google Gemini
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={refreshing ? <CircularProgress size={16} color="inherit" /> : <RefreshIcon />}
                    onClick={handleRefresh}
                    disabled={refreshing}
                    sx={{
                        bgcolor: 'rgba(255,255,255,0.15)',
                        color: 'white',
                        fontWeight: 'bold',
                        backdropFilter: 'blur(10px)',
                        boxShadow: 'none',
                        border: '1px solid rgba(255,255,255,0.2)',
                        '&:hover': {
                            bgcolor: 'rgba(255,255,255,0.25)',
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        },
                        transition: 'all 0.2s'
                    }}
                >
                    Refresh
                </Button>
            </Stack>

            {/* Summary Cards */}
            <Grid container spacing={2} mb={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ bgcolor: 'rgba(255,255,255,0.95)' }}>
                        <CardContent>
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Monthly Income
                                    </Typography>
                                    <Typography variant="h6" fontWeight={700} color="success.main">
                                        {formatCurrency(monthlyIncome, 'INR')}
                                    </Typography>
                                </Box>
                                <IconButton
                                    size="small"
                                    onClick={() => {
                                        setTempIncome(monthlyIncome.toString());
                                        setEditIncomeOpen(true);
                                    }}
                                    sx={{ mt: -0.5, mr: -0.5 }}
                                >
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ bgcolor: 'rgba(255,255,255,0.95)' }}>
                        <CardContent>
                            <Typography variant="caption" color="text.secondary">
                                Avg Monthly Expense
                            </Typography>
                            <Typography variant="h6" fontWeight={700} color="error.main">
                                {formatCurrency(monthlyExpense, 'INR')}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ bgcolor: 'rgba(255,255,255,0.95)' }}>
                        <CardContent>
                            <Typography variant="caption" color="text.secondary">
                                Monthly Savings
                            </Typography>
                            <Typography variant="h6" fontWeight={700} color={monthlySavings > 0 ? 'primary.main' : 'warning.main'}>
                                {formatCurrency(monthlySavings, 'INR')}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ bgcolor: 'rgba(255,255,255,0.95)' }}>
                        <CardContent>
                            <Typography variant="caption" color="text.secondary">
                                Investment Suggestion
                            </Typography>
                            <Typography variant="h6" fontWeight={700} color="success.main">
                                {formatCurrency(investmentSuggestion, 'INR')}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* AI Insights Section */}
            <Paper sx={{ p: 2, mb: 2, bgcolor: 'rgba(255,255,255,0.95)' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <LightbulbIcon color="primary" />
                        <Typography variant="h6" fontWeight={600}>
                            AI Recommendations
                        </Typography>
                    </Stack>
                    <IconButton size="small" onClick={() => toggleSection('insights')}>
                        {expandedSections.insights ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                </Stack>
                <Collapse in={expandedSections.insights}>
                    <Stack spacing={1.5}>
                        {displayedInsights.map((insight, idx) => (
                            <Alert key={idx} severity="info" icon={<TrendingUpIcon />}>
                                {insight}
                            </Alert>
                        ))}
                        {insights.insights.length > 5 && (
                            <Button size="small" onClick={() => setShowAll(!showAll)}>
                                {showAll ? 'Show Less' : `Show ${insights.insights.length - 5} More Insights`}
                            </Button>
                        )}
                    </Stack>
                </Collapse>
            </Paper>

            {/* Predicted Expenses */}
            {insights.predictedExpenses.length > 0 && (
                <Paper sx={{ p: 2, mb: 2, bgcolor: 'rgba(255,255,255,0.95)' }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <AccountBalanceWalletIcon color="warning" />
                            <Typography variant="h6" fontWeight={600}>
                                Predicted Upcoming Expenses
                            </Typography>
                        </Stack>
                        <IconButton size="small" onClick={() => toggleSection('predictions')}>
                            {expandedSections.predictions ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                    </Stack>
                    <Collapse in={expandedSections.predictions}>
                        <Stack spacing={1}>
                            {insights.predictedExpenses.slice(0, 5).map((expense, idx) => (
                                <Box
                                    key={idx}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        p: 1.5,
                                        bgcolor: '#f5f5f5',
                                        borderRadius: 1
                                    }}
                                >
                                    <Box>
                                        <Typography variant="body2" fontWeight={600}>
                                            {expense.category}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {new Date(expense.predictedDate).toLocaleDateString()} • {(expense.confidence * 100).toFixed(0)}% confidence
                                        </Typography>
                                    </Box>
                                    <Typography variant="h6" fontWeight={700} color="warning.main">
                                        {formatCurrency(expense.amount, 'INR')}
                                    </Typography>
                                </Box>
                            ))}
                        </Stack>
                    </Collapse>
                </Paper>
            )}

            {/* Saving Tips */}
            {insights.savingTips.length > 0 && (
                <Paper sx={{ p: 2, mb: 2, bgcolor: 'rgba(255,255,255,0.95)' }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <TrendingUpIcon color="success" />
                            <Typography variant="h6" fontWeight={600}>
                                Money Saving Tips
                            </Typography>
                        </Stack>
                        <IconButton size="small" onClick={() => toggleSection('savings')}>
                            {expandedSections.savings ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                    </Stack>
                    <Collapse in={expandedSections.savings}>
                        <Stack spacing={1}>
                            {insights.savingTips.map((tip, idx) => (
                                <Alert key={idx} severity="success" sx={{ '& .MuiAlert-message': { width: '100%' } }}>
                                    {tip}
                                </Alert>
                            ))}
                            {insights.recommendations.unnecessaryExpenses.length > 0 && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="subtitle2" fontWeight={600} mb={1}>
                                        Consider Reducing:
                                    </Typography>
                                    <Stack direction="row" flexWrap="wrap" gap={1}>
                                        {insights.recommendations.unnecessaryExpenses.map((expense, idx) => (
                                            <Chip key={idx} label={expense} size="small" color="warning" />
                                        ))}
                                    </Stack>
                                </Box>
                            )}
                        </Stack>
                    </Collapse>
                </Paper>
            )}

            {/* Risky Spending */}
            {insights.riskySpending.length > 0 && (
                <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.95)' }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <WarningIcon color="error" />
                            <Typography variant="h6" fontWeight={600}>
                                Risky Spending Alerts
                            </Typography>
                        </Stack>
                        <IconButton size="small" onClick={() => toggleSection('risks')}>
                            {expandedSections.risks ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                    </Stack>
                    <Collapse in={expandedSections.risks}>
                        <Stack spacing={1}>
                            {insights.riskySpending.map((risk, idx) => (
                                <Alert key={idx} severity="error">
                                    {risk}
                                </Alert>
                            ))}
                        </Stack>
                    </Collapse>
                </Paper>
            )}

            {/* Income Edit Dialog */}
            <Dialog open={editIncomeOpen} onClose={() => setEditIncomeOpen(false)}>
                <DialogTitle>Edit Monthly Income</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Monthly Income"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={tempIncome}
                        onChange={(e) => setTempIncome(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditIncomeOpen(false)}>Cancel</Button>
                    <Button
                        onClick={() => {
                            const val = parseFloat(tempIncome);
                            if (!isNaN(val)) {
                                setCustomIncome(val);
                                setEditIncomeOpen(false);
                            }
                        }}
                        variant="contained"
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default AIInsightsPanel;
