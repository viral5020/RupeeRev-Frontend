import apiClient from './apiClient';

export interface SalaryPlan {
    _id: string;
    user: string;
    monthlySalary: number;
    allocations: {
        essentials: { percentage: number; amount: number };
        lifestyle: { percentage: number; amount: number };
        investments: { percentage: number; amount: number };
        emergencyFund: { percentage: number; amount: number };
        miscellaneous: { percentage: number; amount: number };
    };
    investmentBreakdown: {
        equitySIP: { percentage: number; amount: number; expectedReturn: string };
        hybridGoldSIP: { percentage: number; amount: number; expectedReturn: string };
        shortTermSavings: { percentage: number; amount: number; expectedReturn: string };
    };
    isCustom: boolean;
    insights: string[];
    createdAt: string;
    updatedAt: string;
}

export interface CustomPercentages {
    essentials?: number;
    lifestyle?: number;
    investments?: number;
    emergencyFund?: number;
    miscellaneous?: number;
}

export const generateSalaryPlan = async (monthlySalary: number, customPercentages?: CustomPercentages) => {
    const { data } = await apiClient.post<{ success: boolean; data: SalaryPlan }>(
        '/salary-planner/generate',
        { monthlySalary, customPercentages }
    );
    return data.data;
};

export const getSalaryPlan = async () => {
    const { data } = await apiClient.get<{ success: boolean; data: SalaryPlan }>(
        '/salary-planner'
    );
    return data.data;
};

export const updateSalaryPlan = async (monthlySalary: number, customPercentages: CustomPercentages) => {
    const { data } = await apiClient.put<{ success: boolean; data: SalaryPlan }>(
        '/salary-planner/update',
        { monthlySalary, customPercentages }
    );
    return data.data;
};
