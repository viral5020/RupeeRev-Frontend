import React, { useEffect, useState } from 'react';
import { Grid, Typography, Box, CircularProgress, Alert } from '@mui/material';
import PageHeader from '../components/common/PageHeader';
import SurplusSummary from '../components/investments/SurplusSummary';
import RiskSelector from '../components/investments/RiskSelector';
import InvestmentCard from '../components/investments/InvestmentCard';
import { getSurplus, getInvestmentSuggestions, getFinancialProfile } from '../services/investmentService';
import { getCategoryPerformance, getAIRecommendation } from '../services/mutualFundService';
import {
    SurplusData,
    InvestmentPlan,
    FinancialProfile,
    CategoryPerformance,
    AIRecommendation as AIMutualFundRecommendation,
} from '../types';
import { useSnackbar } from 'notistack';
import CategoryPerformanceTable from '../components/mutualFunds/CategoryPerformanceTable';
import BestCategoryCard from '../components/mutualFunds/BestCategoryCard';
import SurplusInput from '../components/mutualFunds/SurplusInput';
import RecommendationPanel from '../components/mutualFunds/RecommendationPanel';
import PremiumGuard from '../components/common/PremiumGuard';

const InvestmentsPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [surplus, setSurplus] = useState<SurplusData | null>(null);
    const [profile, setProfile] = useState<FinancialProfile | null>(null);
    const [investmentPlan, setInvestmentPlan] = useState<InvestmentPlan | null>(null);
    const [categoryPerformance, setCategoryPerformance] = useState<CategoryPerformance[]>([]);
    const [performanceLoading, setPerformanceLoading] = useState(true);
    const [aiRecommendation, setAIRecommendation] = useState<AIMutualFundRecommendation | null>(null);
    const [manualSurplus, setManualSurplus] = useState(0);
    const [aiRiskLevel, setAIRiskLevel] = useState<'low' | 'medium' | 'high'>('medium');
    const [aiLoading, setAILoading] = useState(false);
    const [aiError, setAIError] = useState<string | null>(null);
    const { enqueueSnackbar } = useSnackbar();

    const fetchData = async () => {
        try {
            setLoading(true);

            // Fetch surplus and profile
            const [surplusData, profileData] = await Promise.all([
                getSurplus(),
                getFinancialProfile(),
            ]);

            setSurplus(surplusData);
            setManualSurplus(Math.max(0, surplusData.surplus));
            setProfile(profileData);

            // Get investment suggestions
            if (surplusData.surplus > 0) {
                const suggestions = await getInvestmentSuggestions(
                    surplusData.surplus,
                    profileData.riskLevel
                );
                setInvestmentPlan(suggestions);
            }
        } catch (error: any) {
            // Don't show toast for 403 - PremiumGuard handles the UI
            if (error.response?.status !== 403) {
                enqueueSnackbar(error.response?.data?.message || 'Failed to load investment data', {
                    variant: 'error',
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchCategoryPerformance = async () => {
        try {
            setPerformanceLoading(true);
            const data = await getCategoryPerformance();
            setCategoryPerformance(data);
        } catch (error: any) {
            // Don't show toast for 403 - PremiumGuard handles the UI
            if (error.response?.status !== 403) {
                enqueueSnackbar(error.response?.data?.message || 'Failed to load AMFI performance', {
                    variant: 'error',
                });
            }
        } finally {
            setPerformanceLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        fetchCategoryPerformance();
    }, []);

    useEffect(() => {
        if (profile) {
            setAIRiskLevel(profile.riskLevel);
        }
    }, [profile]);

    const handleGenerateAIRecommendation = async () => {
        if (manualSurplus <= 0) {
            setAIError('Enter a surplus greater than zero to get a plan.');
            return;
        }
        try {
            setAILoading(true);
            setAIError(null);
            const recommendation = await getAIRecommendation(manualSurplus, aiRiskLevel);
            setAIRecommendation(recommendation);
        } catch (error: any) {
            // Don't show toast for 403 - PremiumGuard handles the UI
            if (error.response?.status !== 403) {
                const message = error.response?.data?.message || 'Failed to generate recommendation';
                setAIError(message);
                enqueueSnackbar(message, { variant: 'error' });
            }
        } finally {
            setAILoading(false);
        }
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
            title="Investment Recommendations"
            description="Unlock personalized AI-driven investment plans, mutual fund insights, and surplus analysis."
        >
            <Box>
                <PageHeader title="💎 Investment Recommendations" />

                {surplus && (
                    <Grid container spacing={3}>
                        {/* Surplus Summary */}
                        <Grid item xs={12}>
                            <SurplusSummary data={surplus} />
                        </Grid>
                        {/* Mutual Fund Intelligence Section */}
                        <Grid item xs={12}>
                            <Typography variant="h5" sx={{
                                fontWeight: 700,
                                mt: 2,
                                background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}>
                                🧠 Mutual Fund Intelligence
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <BestCategoryCard category={categoryPerformance[0]} />
                        </Grid>

                        <Grid item xs={12} md={8}>
                            <CategoryPerformanceTable data={categoryPerformance} loading={performanceLoading} />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <SurplusInput
                                value={manualSurplus}
                                onChange={setManualSurplus}
                                onSubmit={handleGenerateAIRecommendation}
                                loading={aiLoading}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <RiskSelector
                                riskLevel={aiRiskLevel}
                                isAuto={false}
                                onChange={(risk) => setAIRiskLevel(risk)}
                                showAutoToggle={false}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <RecommendationPanel
                                recommendation={aiRecommendation}
                                loading={aiLoading}
                                error={aiError}
                            />
                        </Grid>
                    </Grid>
                )}
            </Box>
        </PremiumGuard>
    );
};

export default InvestmentsPage;
