import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Alert,
    Stack,
    Chip,
    Switch,
    FormControlLabel,
    Divider,
    CircularProgress,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import PageHeader from '../components/common/PageHeader';
import { generateSalaryPlan, getSalaryPlan, updateSalaryPlan, SalaryPlan, CustomPercentages } from '../services/salaryPlannerService';
import PremiumGuard from '../components/common/PremiumGuard';

const SalaryPlannerPage: React.FC = () => {
    const [salary, setSalary] = useState<string>('');
    const [plan, setPlan] = useState<SalaryPlan | null>(null);
    const [loading, setLoading] = useState(false);
    const [customMode, setCustomMode] = useState(false);
    const [customPercentages, setCustomPercentages] = useState<CustomPercentages>({
        essentials: 50,
        lifestyle: 20,
        investments: 25,
        emergencyFund: 10,
        miscellaneous: 5,
    });
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        loadExistingPlan();
    }, []);

    const loadExistingPlan = async () => {
        try {
            const existingPlan = await getSalaryPlan();
            setPlan(existingPlan);
            setSalary(existingPlan.monthlySalary.toString());
            if (existingPlan.isCustom) {
                setCustomMode(true);
                setCustomPercentages({
                    essentials: existingPlan.allocations.essentials.percentage,
                    lifestyle: existingPlan.allocations.lifestyle.percentage,
                    investments: existingPlan.allocations.investments.percentage,
                    emergencyFund: existingPlan.allocations.emergencyFund.percentage,
                    miscellaneous: existingPlan.allocations.miscellaneous.percentage,
                });
            }
        } catch (error: any) {
            // No existing plan, that's okay
        }
    };

    const handleGenerate = async () => {
        const salaryNum = parseFloat(salary);
        if (!salaryNum || salaryNum <= 0) {
            enqueueSnackbar('Please enter a valid salary amount', { variant: 'error' });
            return;
        }

        try {
            setLoading(true);
            const newPlan = await generateSalaryPlan(salaryNum, customMode ? customPercentages : undefined);
            setPlan(newPlan);
            enqueueSnackbar('Salary plan generated successfully!', { variant: 'success' });
        } catch (error: any) {
            // Don't show toast for 403 - PremiumGuard handles the UI
            if (error.response?.status !== 403) {
                enqueueSnackbar(error.response?.data?.message || 'Failed to generate plan', { variant: 'error' });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        const salaryNum = parseFloat(salary);
        if (!salaryNum || salaryNum <= 0) {
            enqueueSnackbar('Please enter a valid salary amount', { variant: 'error' });
            return;
        }

        const total = Object.values(customPercentages).reduce((sum, val) => sum + (val || 0), 0);
        if (Math.abs(total - 100) > 0.01) {
            enqueueSnackbar(`Percentages must total 100% (currently ${total.toFixed(1)}%)`, { variant: 'error' });
            return;
        }

        try {
            setLoading(true);
            const updatedPlan = await updateSalaryPlan(salaryNum, customPercentages as Required<CustomPercentages>);
            setPlan(updatedPlan);
            enqueueSnackbar('Salary plan updated successfully!', { variant: 'success' });
        } catch (error: any) {
            // Don't show toast for 403 - PremiumGuard handles the UI
            if (error.response?.status !== 403) {
                enqueueSnackbar(error.response?.data?.message || 'Failed to update plan', { variant: 'error' });
            }
        } finally {
            setLoading(false);
        }
    };

    const handlePercentageChange = (key: keyof CustomPercentages, value: string) => {
        const numValue = parseFloat(value) || 0;
        setCustomPercentages(prev => ({ ...prev, [key]: numValue }));
    };

    const getTotalPercentage = () => {
        return Object.values(customPercentages).reduce((sum, val) => sum + (val || 0), 0);
    };

    if (loading && !plan) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    return (
        <PremiumGuard
            title="Smart Salary Planner"
            description="Plan your monthly budget, savings, and investments with our smart salary planner."
        >
            <Box>
                <PageHeader title="💰 Smart Salary Planner" />

                {/* Salary Input Card */}
                <Card sx={{ mb: 3, borderRadius: 3 }}>
                    <CardContent>
                        <Typography variant="h6" fontWeight={700} mb={2}>
                            Enter Your Monthly Salary
                        </Typography>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Monthly Salary"
                                    type="number"
                                    value={salary}
                                    onChange={(e) => setSalary(e.target.value)}
                                    placeholder="e.g., 50000"
                                    InputProps={{
                                        startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={customMode}
                                            onChange={(e) => setCustomMode(e.target.checked)}
                                        />
                                    }
                                    label="Custom Percentages"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={customMode && plan ? handleUpdate : handleGenerate}
                                    disabled={loading}
                                    fullWidth
                                >
                                    {loading ? 'Generating...' : customMode && plan ? 'Update Plan' : 'Generate Plan'}
                                </Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* Custom Percentages */}
                {customMode && (
                    <Card sx={{ mb: 3, borderRadius: 3, bgcolor: 'primary.lighter' }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight={700} mb={2}>
                                Customize Allocation Percentages
                            </Typography>
                            <Grid container spacing={2}>
                                {Object.entries(customPercentages).map(([key, value]) => (
                                    <Grid item xs={12} sm={6} md={2.4} key={key}>
                                        <TextField
                                            fullWidth
                                            label={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                                            type="number"
                                            value={value}
                                            onChange={(e) => handlePercentageChange(key as keyof CustomPercentages, e.target.value)}
                                            InputProps={{
                                                endAdornment: <Typography>%</Typography>,
                                            }}
                                            size="small"
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                            <Box sx={{ mt: 2 }}>
                                <Chip
                                    label={`Total: ${getTotalPercentage().toFixed(1)}%`}
                                    color={Math.abs(getTotalPercentage() - 100) < 0.01 ? 'success' : 'error'}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                )}

                {/* Insights */}
                {plan && plan.insights.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                        {plan.insights.map((insight, index) => (
                            <Alert
                                key={index}
                                severity={insight.includes('⚠️') ? 'warning' : insight.includes('✅') ? 'success' : 'info'}
                                sx={{ mb: 1 }}
                            >
                                {insight}
                            </Alert>
                        ))}
                    </Box>
                )}

                {/* Summary Cards */}
                {plan && (
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                        <Grid item xs={12} sm={6} md={2.4}>
                            <Card sx={{ bgcolor: 'primary.main', color: 'white', borderRadius: 3 }}>
                                <CardContent>
                                    <Typography variant="caption">Monthly Salary</Typography>
                                    <Typography variant="h5" fontWeight={700}>
                                        ₹{plan.monthlySalary.toLocaleString('en-IN')}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2.4}>
                            <Card sx={{ bgcolor: 'error.main', color: 'white', borderRadius: 3 }}>
                                <CardContent>
                                    <Typography variant="caption">Essentials ({plan.allocations.essentials.percentage}%)</Typography>
                                    <Typography variant="h5" fontWeight={700}>
                                        ₹{plan.allocations.essentials.amount.toLocaleString('en-IN')}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2.4}>
                            <Card sx={{ bgcolor: 'warning.main', color: 'white', borderRadius: 3 }}>
                                <CardContent>
                                    <Typography variant="caption">Lifestyle ({plan.allocations.lifestyle.percentage}%)</Typography>
                                    <Typography variant="h5" fontWeight={700}>
                                        ₹{plan.allocations.lifestyle.amount.toLocaleString('en-IN')}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2.4}>
                            <Card sx={{ bgcolor: 'success.main', color: 'white', borderRadius: 3 }}>
                                <CardContent>
                                    <Typography variant="caption">Investments ({plan.allocations.investments.percentage}%)</Typography>
                                    <Typography variant="h5" fontWeight={700}>
                                        ₹{plan.allocations.investments.amount.toLocaleString('en-IN')}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2.4}>
                            <Card sx={{ bgcolor: 'info.main', color: 'white', borderRadius: 3 }}>
                                <CardContent>
                                    <Typography variant="caption">Emergency ({plan.allocations.emergencyFund.percentage}%)</Typography>
                                    <Typography variant="h5" fontWeight={700}>
                                        ₹{plan.allocations.emergencyFund.amount.toLocaleString('en-IN')}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                )}

                {/* Allocation Breakdown Table */}
                {plan && (
                    <Card sx={{ mb: 3, borderRadius: 3 }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight={700} mb={2}>
                                📊 Allocation Breakdown
                            </Typography>
                            <TableContainer component={Paper} variant="outlined">
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><strong>Category</strong></TableCell>
                                            <TableCell align="right"><strong>Percentage</strong></TableCell>
                                            <TableCell align="right"><strong>Amount</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Object.entries(plan.allocations).map(([key, value]) => (
                                            <TableRow key={key}>
                                                <TableCell>
                                                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                                                </TableCell>
                                                <TableCell align="right">{value.percentage}%</TableCell>
                                                <TableCell align="right">₹{value.amount.toLocaleString('en-IN')}</TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow sx={{ bgcolor: 'primary.lighter' }}>
                                            <TableCell><strong>TOTAL</strong></TableCell>
                                            <TableCell align="right"><strong>100%</strong></TableCell>
                                            <TableCell align="right"><strong>₹{plan.monthlySalary.toLocaleString('en-IN')}</strong></TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                )}

                {/* Investment Breakdown */}
                {plan && (
                    <Card sx={{ borderRadius: 3 }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight={700} mb={2}>
                                💼 Investment Breakdown (₹{plan.allocations.investments.amount.toLocaleString('en-IN')})
                            </Typography>
                            <TableContainer component={Paper} variant="outlined">
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><strong>Investment Type</strong></TableCell>
                                            <TableCell align="right"><strong>Percentage</strong></TableCell>
                                            <TableCell align="right"><strong>Amount</strong></TableCell>
                                            <TableCell align="right"><strong>Expected Return</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Equity SIP</TableCell>
                                            <TableCell align="right">{plan.investmentBreakdown.equitySIP.percentage}%</TableCell>
                                            <TableCell align="right">₹{plan.investmentBreakdown.equitySIP.amount.toLocaleString('en-IN')}</TableCell>
                                            <TableCell align="right">
                                                <Chip label={plan.investmentBreakdown.equitySIP.expectedReturn} color="success" size="small" />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Hybrid/Gold SIP</TableCell>
                                            <TableCell align="right">{plan.investmentBreakdown.hybridGoldSIP.percentage}%</TableCell>
                                            <TableCell align="right">₹{plan.investmentBreakdown.hybridGoldSIP.amount.toLocaleString('en-IN')}</TableCell>
                                            <TableCell align="right">
                                                <Chip label={plan.investmentBreakdown.hybridGoldSIP.expectedReturn} color="warning" size="small" />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Short-term Savings</TableCell>
                                            <TableCell align="right">{plan.investmentBreakdown.shortTermSavings.percentage}%</TableCell>
                                            <TableCell align="right">₹{plan.investmentBreakdown.shortTermSavings.amount.toLocaleString('en-IN')}</TableCell>
                                            <TableCell align="right">
                                                <Chip label={plan.investmentBreakdown.shortTermSavings.expectedReturn} color="info" size="small" />
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                )}
            </Box>
        </PremiumGuard>
    );
};

export default SalaryPlannerPage;
