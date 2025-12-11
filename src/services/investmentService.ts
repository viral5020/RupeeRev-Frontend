import apiClient from './apiClient';
import { SurplusData, InvestmentPlan, FinancialProfile } from '../types';

export const getSurplus = async (month?: number, year?: number) => {
    const params = new URLSearchParams();
    if (month) params.append('month', month.toString());
    if (year) params.append('year', year.toString());

    const { data } = await apiClient.get<{ success: boolean; data: SurplusData }>(
        `/finance/surplus?${params.toString()}`
    );
    return data.data;
};

export const getInvestmentSuggestions = async (surplus: number, riskLevel: 'low' | 'medium' | 'high') => {
    const { data } = await apiClient.post<{ success: boolean; data: InvestmentPlan }>(
        '/investments/suggestions',
        { surplus, riskLevel }
    );
    return data.data;
};

export const getFinancialProfile = async () => {
    const { data } = await apiClient.get<{ success: boolean; data: FinancialProfile }>(
        '/investments/profile'
    );
    return data.data;
};

export const updateRiskLevel = async (riskLevel: 'low' | 'medium' | 'high', isAuto: boolean) => {
    const { data } = await apiClient.put<{ success: boolean; data: FinancialProfile }>(
        '/investments/risk-level',
        { riskLevel, isAuto }
    );
    return data.data;
};

export const updateFinancialProfile = async () => {
    const { data } = await apiClient.put<{ success: boolean; data: FinancialProfile }>(
        '/investments/profile'
    );
    return data.data;
};

export const updateManualSurplus = async (manualSurplus: number | null) => {
    const { data } = await apiClient.put<{ success: boolean; data: FinancialProfile }>(
        '/investments/profile',
        { manualSurplus }
    );
    return data.data;
};
