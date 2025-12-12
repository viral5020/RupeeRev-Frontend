import React, { useCallback, useEffect, useState } from 'react';
import { Box, Button, Grid, Typography, CircularProgress, IconButton, TextField, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { useSnackbar } from 'notistack';
import PageHeader from '../components/common/PageHeader';
import GoalsList from '../components/goals/GoalsList';
import RecommendedPlanCard from '../components/goals/RecommendedPlanCard';
import NewGoalForm from '../components/goals/NewGoalForm';
import GoalDetailDialog from '../components/goals/GoalDetailDialog';
import { Goal, CreateGoalPayload } from '../types';
import { fetchGoals, createGoal, deleteGoal } from '../services/goalService';
import { getSurplus, updateManualSurplus } from '../services/investmentService';
import PremiumGuard from '../components/common/PremiumGuard';

const GoalsPage: React.FC = () => {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState(true);
    const [formOpen, setFormOpen] = useState(false);
    const [detailGoal, setDetailGoal] = useState<Goal | null>(null);
    const [surplus, setSurplus] = useState(0);
    const [manualSurplus, setManualSurplus] = useState<number | null>(null);
    const [editingSurplus, setEditingSurplus] = useState(false);
    const [surplusInput, setSurplusInput] = useState('');
    const { enqueueSnackbar } = useSnackbar();

   const loadGoals = useCallback(async () => {
        try {
            setLoading(true);
            const [goalData, surplusData] = await Promise.all([fetchGoals(), getSurplus()]);
            setGoals(goalData);
            setSurplus(surplusData.surplus);
            setManualSurplus(surplusData.manualSurplus ?? null);
            setSurplusInput(
                (surplusData.manualSurplus ?? surplusData.surplus).toString()
            );
        } catch (error: any) {
            if (error.response?.status !== 403) {
                enqueueSnackbar(error.response?.data?.message || 'Unable to load goals', {
                    variant: 'error',
                });
            }
        } finally {
            setLoading(false);
        }
    }, [enqueueSnackbar]);

    useEffect(() => {
        loadGoals();
    }, [loadGoals]);

    const handleCreateGoal = async (payload: CreateGoalPayload) => {
        await createGoal(payload);
        enqueueSnackbar('Goal created', { variant: 'success' });
        await loadGoals();
    };

    const handleDeleteGoal = async (goal: Goal) => {
        await deleteGoal(goal._id);
        enqueueSnackbar('Goal removed', { variant: 'info' });
        await loadGoals();
    };

    const handleSaveSurplus = async () => {
        try {
            const value = parseFloat(surplusInput);
            if (isNaN(value) || value < 0) {
                enqueueSnackbar('Please enter a valid surplus amount', { variant: 'error' });
                return;
            }
            await updateManualSurplus(value);
            setManualSurplus(value);
            setEditingSurplus(false);
            enqueueSnackbar('Surplus updated successfully', { variant: 'success' });
            await loadGoals();
        } catch (error: any) {
            // Don't show toast for 403 - PremiumGuard handles the UI
            if (error.response?.status !== 403) {
                enqueueSnackbar(error.response?.data?.message || 'Failed to update surplus', { variant: 'error' });
            }
        }
    };

    const handleCancelEdit = () => {
        setSurplusInput((manualSurplus ?? surplus).toString());
        setEditingSurplus(false);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    return (
        <PremiumGuard
            title="Goal Planning"
            description="Set financial goals and get personalized savings plans to achieve them."
        >
            <Box>
                <PageHeader
                    title="🎯 Goal Planning"
                    action={
                        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setFormOpen(true)}>
                            New Goal
                        </Button>
                    }
                />

                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Box sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                            <Typography variant="overline" sx={{ color: 'text.secondary' }}>Monthly Surplus</Typography>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                {editingSurplus ? (
                                    <>
                                        <TextField
                                            size="small"
                                            type="number"
                                            value={surplusInput}
                                            onChange={(e) => setSurplusInput(e.target.value)}
                                            sx={{ width: 200 }}
                                            autoFocus
                                        />
                                        <IconButton size="small" color="primary" onClick={handleSaveSurplus}>
                                            <SaveIcon />
                                        </IconButton>
                                        <IconButton size="small" onClick={handleCancelEdit}>
                                            <CancelIcon />
                                        </IconButton>
                                    </>
                                ) : (
                                    <>
                                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                            ₹{(manualSurplus ?? surplus).toLocaleString('en-IN')}
                                        </Typography>
                                        {manualSurplus !== null && (
                                            <Typography variant="caption" color="text.secondary">
                                                (Manual Override)
                                            </Typography>
                                        )}
                                        <IconButton size="small" onClick={() => setEditingSurplus(true)}>
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                    </>
                                )}
                            </Stack>
                            <Typography variant="caption" color="text.secondary">
                                Calculated: ₹{surplus.toLocaleString('en-IN')}
                            </Typography>
                        </Box>
                        <RecommendedPlanCard goals={goals} surplus={manualSurplus ?? surplus} />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                            Active Goals
                        </Typography>
                        <GoalsList goals={goals} onSelect={setDetailGoal} onDelete={handleDeleteGoal} />
                    </Grid>
                </Grid>

                <NewGoalForm open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleCreateGoal} />
                <GoalDetailDialog goal={detailGoal} onClose={() => setDetailGoal(null)} />
            </Box>
        </PremiumGuard>
    );
};

export default GoalsPage;



