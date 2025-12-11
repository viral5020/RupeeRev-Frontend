import apiClient from './apiClient';

export interface AiInsights {
    insights: string[];
    predictedExpenses: Array<{
        category: string;
        amount: number;
        predictedDate: string;
        confidence: number;
    }>;
    savingTips: string[];
    riskySpending: string[];
    spendingPatterns: {
        totalSpending: number;
        totalIncome: number;
        netSavings: number;
        savingsRate: number;
        topCategories: string[];
        unusualSpikes: string[];
        recurringBills: string[];
    };
    recommendations: {
        monthlySavingTarget: number;
        weeklySavingTarget: number;
        unnecessaryExpenses: string[];
        emergencyFundTarget: number;
        investmentSuggestion: number;
    };
}

export const getAiInsights = async (): Promise<AiInsights> => {
    const { data } = await apiClient.get('/ai/insights');
    return data.data;
};

export const refreshAiInsights = async (): Promise<AiInsights> => {
    const { data } = await apiClient.post('/ai/insights/refresh');
    return data.data;
};

export const getSpendingPatterns = async () => {
    const { data } = await apiClient.get('/ai/spending-patterns');
    return data.data;
};
