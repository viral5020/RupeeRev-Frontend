import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Transaction } from '../../types';
import { formatCurrency } from '../../utils/format';
import { Paper, Typography, Box } from '@mui/material';

interface TransactionTrendChartProps {
    transactions: Transaction[];
}

const TransactionTrendChart: React.FC<TransactionTrendChartProps> = ({ transactions }) => {
    const data = useMemo(() => {
        const dailyStats: Record<string, { date: string; income: number; expense: number }> = {};

        transactions.forEach((t) => {
            const date = new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if (!dailyStats[date]) {
                dailyStats[date] = { date, income: 0, expense: 0 };
            }
            if (t.type === 'income') {
                dailyStats[date].income += t.amount;
            } else {
                dailyStats[date].expense += t.amount;
            }
        });

        // Sort by date (assuming transactions might not be sorted, or we want chronological order)
        // Note: LocaleDateString sorting is tricky, better to use timestamp for sorting
        // const sortedData = Object.values(dailyStats).sort((a, b) => {
        //     return new Date(a.date).getTime() - new Date(b.date).getTime();
        // });

        // Actually, let's do it properly with timestamps
        const map = new Map<string, { date: string; income: number; expense: number; timestamp: number }>();

        transactions.forEach((t) => {
            const d = new Date(t.date);
            const key = d.toISOString().split('T')[0]; // YYYY-MM-DD
            const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            if (!map.has(key)) {
                map.set(key, { date: label, income: 0, expense: 0, timestamp: d.getTime() });
            }
            const entry = map.get(key)!;
            if (t.type === 'income') {
                entry.income += t.amount;
            } else {
                entry.expense += t.amount;
            }
        });

        return Array.from(map.values()).sort((a, b) => a.timestamp - b.timestamp);

    }, [transactions]);

    return (
        <Paper sx={{
            p: 3,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            border: '1px solid #e2e8f0',
            borderRadius: 4,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            height: '100%'
        }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: '#1e293b' }}>
                Income vs Expense Trend
            </Typography>
            <Box sx={{ height: 300, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            formatter={(value: number) => formatCurrency(value)}
                        />
                        <Legend iconType="circle" />
                        <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" name="Income" strokeWidth={2} />
                        <Area type="monotone" dataKey="expense" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpense)" name="Expense" strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>
            </Box>
        </Paper>
    );
};

export default TransactionTrendChart;
