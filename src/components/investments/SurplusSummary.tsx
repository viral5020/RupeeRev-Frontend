import React from 'react';
import { Paper, Typography, Box, LinearProgress, Grid } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { formatCurrency } from '../../utils/format';
import { SurplusData } from '../../types';

interface SurplusSummaryProps {
    data: SurplusData;
}

const SurplusSummary: React.FC<SurplusSummaryProps> = ({ data }) => {
    const { income = 0, expenses = 0, surplus = 0, savingsRate = 0 } = data || {};
    
    // Show message if no data available
    const hasNoData = income === 0 && expenses === 0 && surplus === 0;

    const getSavingsColor = (rate: number) => {
        if (rate >= 30) return '#10b981'; // Green
        if (rate >= 15) return '#f59e0b'; // Orange
        return '#ef4444'; // Red
    };

    const getSavingsLabel = (rate: number) => {
        if (rate >= 30) return 'Excellent!';
        if (rate >= 15) return 'Good';
        return 'Needs Improvement';
    };

    return (
        <Paper sx={{
            p: 3,
            background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
            border: '2px solid #bbf7d0',
            borderRadius: 3,
        }}>
            <Typography variant="h5" sx={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 700,
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
            }}>
                💰 Monthly Financial Summary
            </Typography>

            {hasNoData && (
                <Box sx={{ 
                    p: 2, 
                    mb: 3, 
                    borderRadius: 2, 
                    bgcolor: '#fef3c7', 
                    border: '1px solid #fbbf24',
                    textAlign: 'center'
                }}>
                    <Typography variant="body2" color="text.secondary">
                        📊 No transaction data available for this month. Add income and expense transactions to see your financial summary.
                    </Typography>
                </Box>
            )}

            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={4}>
                    <Box sx={{
                        p: 2,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                        border: '1px solid #a7f3d0',
                    }}>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                            Total Income
                        </Typography>
                        <Typography variant="h5" sx={{
                            color: '#059669',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                        }}>
                            <TrendingUpIcon /> {formatCurrency(income, 'INR')}
                        </Typography>
                    </Box>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Box sx={{
                        p: 2,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)',
                        border: '1px solid #fca5a5',
                    }}>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                            Total Expenses
                        </Typography>
                        <Typography variant="h5" sx={{
                            color: '#dc2626',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                        }}>
                            <TrendingDownIcon /> {formatCurrency(expenses, 'INR')}
                        </Typography>
                    </Box>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Box sx={{
                        p: 2,
                        borderRadius: 2,
                        background: surplus >= 0
                            ? 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)'
                            : 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                        border: surplus >= 0 ? '1px solid #c4b5fd' : '1px solid #fca5a5',
                    }}>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                            Monthly Surplus
                        </Typography>
                        <Typography variant="h5" sx={{
                            color: surplus >= 0 ? '#7c3aed' : '#dc2626',
                            fontWeight: 700,
                        }}>
                            {formatCurrency(surplus, 'INR')}
                        </Typography>
                    </Box>
                </Grid>
            </Grid>

            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                        Savings Rate
                    </Typography>
                    <Typography variant="h6" sx={{ color: getSavingsColor(savingsRate), fontWeight: 700 }}>
                        {savingsRate.toFixed(1)}% {getSavingsLabel(savingsRate)}
                    </Typography>
                </Box>
                <LinearProgress
                    variant="determinate"
                    value={Math.min(savingsRate, 100)}
                    sx={{
                        height: 12,
                        borderRadius: 6,
                        backgroundColor: '#e5e7eb',
                        '& .MuiLinearProgress-bar': {
                            background: `linear-gradient(90deg, ${getSavingsColor(savingsRate)} 0%, ${getSavingsColor(savingsRate)}dd 100%)`,
                            borderRadius: 6,
                        },
                    }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    {savingsRate < 15 && '💡 Try to save at least 15% of your income'}
                    {savingsRate >= 15 && savingsRate < 30 && '👍 You\'re on the right track!'}
                    {savingsRate >= 30 && '🎉 Outstanding savings rate!'}
                </Typography>
            </Box>
        </Paper>
    );
};

export default SurplusSummary;
