import React, { useMemo, useEffect } from 'react';
import { Grid, Paper, Typography, Button, Stack, Box, CircularProgress } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { formatCurrency } from '../utils/format';
import PageHeader from '../components/common/PageHeader';
import { exportCsv, exportExcel, exportPdf } from '../services/exportService';
import NetWorthTracker from '../components/dashboard/NetWorthTracker';
import EmergencyFundStatus from '../components/dashboard/EmergencyFundStatus';
import SurplusAllocationHealth from '../components/dashboard/SurplusAllocationHealth';
import SpendingTwins from '../components/dashboard/SpendingTwins';
import TransactionTrendChart from '../components/dashboard/TransactionTrendChart';
import IPODashboardWidget from '../components/dashboard/IPODashboardWidget';
import { fetchTransactions } from '../services/transactionService';
import apiClient from '../services/apiClient';
import { Transaction } from '../types';
import { useAuth } from '../context/AuthContext';

const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

    // Fetch transactions for the current month
    const { data: transactionsData, isLoading } = useQuery({
        queryKey: ['dashboard-transactions', startOfMonth, endOfMonth],
        queryFn: () => fetchTransactions({
            startDate: startOfMonth,
            endDate: endOfMonth,
            limit: 1000 // Ensure we get all transactions for the month
        })
    });

    const transactions = useMemo(() => {
        return transactionsData?.docs || [];
    }, [transactionsData]);

    // Calculate totals from transactions
    const stats = useMemo(() => {
        let totalIncome = 0;
        let totalExpense = 0;

        transactions.forEach((t: Transaction) => {
            if (t.type === 'income') {
                totalIncome += t.amount;
            } else {
                totalExpense += t.amount;
            }
        });

        return {
            totalIncome,
            totalExpense,
            savings: totalIncome - totalExpense
        };
    }, [transactions]);

    // Fetch other dashboard data (NetWorth, etc.)
    const { data: dashboardData } = useQuery({
        queryKey: ['dashboard-data'],
        queryFn: async () => {
            const res = await apiClient.get('/dashboard/data');
            return res.data.data;
        }
    });

    // Refetch dashboard data when user becomes premium
    useEffect(() => {
        if (user?.isPremium) {
            queryClient.invalidateQueries({ queryKey: ['dashboard-data'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-transactions'] });
        }
    }, [user?.isPremium, queryClient]);

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <div>
            <PageHeader title="Dashboard" />
            <Grid container spacing={2}>
                {/* New Dashboard Widgets */}
                <Grid item xs={12} md={4}>
                    {dashboardData?.netWorth && (
                        <NetWorthTracker
                            currentNetWorth={dashboardData.netWorth.current}
                            lastMonthNetWorth={dashboardData.netWorth.lastMonth}
                        />
                    )}
                </Grid>
                <Grid item xs={12} md={4}>
                    {dashboardData?.emergencyFund && (
                        <EmergencyFundStatus
                            currentFund={dashboardData.emergencyFund.current}
                            avgMonthlyExpense={dashboardData.emergencyFund.avgMonthlyExpense}
                            recommendedMonths={dashboardData.emergencyFund.recommendedMonths}
                        />
                    )}
                </Grid>
                <Grid item xs={12} md={4}>
                    {dashboardData?.surplusAllocation && (
                        <SurplusAllocationHealth
                            essentials={dashboardData.surplusAllocation.essentials}
                            bills={dashboardData.surplusAllocation.bills}
                            sips={dashboardData.surplusAllocation.sips}
                            surplus={dashboardData.surplusAllocation.surplus}
                            total={dashboardData.surplusAllocation.total}
                        />
                    )}
                </Grid>

                {/* Spending Twins */}
                {dashboardData?.spendingTwins && (
                    <Grid item xs={12}>
                        <SpendingTwins
                            currentSurplus={dashboardData.spendingTwins.avgSurplus}
                            currentExpenses={dashboardData.spendingTwins.avgExpense}
                        />
                    </Grid>
                )}

                {/* IPO Widget */}
                <Grid item xs={12}>
                    <IPODashboardWidget />
                </Grid>


                {/* Transaction Trend Chart */}
                <Grid item xs={12} md={8}>
                    <TransactionTrendChart transactions={transactions} />
                </Grid>

                {/* Summary Cards */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{
                        p: { xs: 2, sm: 3 },
                        background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
                        border: '2px solid #e0f2fe',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 12px 24px rgba(59, 130, 246, 0.15)',
                        },
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                    }}>
                        <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1 }}>Total Income</Typography>
                        <Typography variant="h4" sx={{
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontWeight: 700,
                        }}>
                            {formatCurrency(stats.totalIncome)}
                        </Typography>
                        <Typography variant="subtitle2" sx={{ mt: 3, color: '#64748b', mb: 1 }}>
                            Total Expenses
                        </Typography>
                        <Typography variant="h4" sx={{
                            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontWeight: 700,
                        }}>
                            {formatCurrency(stats.totalExpense)}
                        </Typography>
                        <Typography variant="subtitle2" sx={{ mt: 3, color: '#64748b', mb: 1 }}>
                            Savings
                        </Typography>
                        <Typography variant="h4" sx={{
                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontWeight: 700,
                        }}>
                            {formatCurrency(stats.savings)}
                        </Typography>
                    </Paper>
                </Grid>

                {/* Quick Export */}
                <Grid item xs={12}>
                    <Paper sx={{
                        p: { xs: 2, sm: 3 },
                        background: 'linear-gradient(135deg, #ffffff 0%, #ede9fe 100%)',
                        border: '2px solid #ddd6fe',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 12px 24px rgba(139, 92, 246, 0.15)',
                        },
                    }}>
                        <Typography variant="h6" sx={{
                            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontWeight: 700,
                            mb: 2,
                        }}>
                            Quick Export
                        </Typography>
                        <Stack direction="row" spacing={2}>
                            <Button variant="contained" onClick={exportCsv} fullWidth>
                                Export CSV
                            </Button>
                            <Button variant="outlined" onClick={exportExcel} fullWidth>
                                Export Excel
                            </Button>
                            <Button variant="outlined" onClick={exportPdf} fullWidth>
                                Export PDF
                            </Button>
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
};

export default DashboardPage;

