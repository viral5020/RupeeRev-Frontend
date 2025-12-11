import apiClient from './apiClient';

export interface StockRecommendation {
    _id: string;
    symbol: string;
    name: string;
    sector: string;
    marketCap: 'large' | 'mid' | 'small';
    currentPrice: number;
    targetPrice: number;
    upside: number;
    investmentHorizon: '1-3 years' | '3-5 years' | '5+ years';
    riskLevel: 'low' | 'medium' | 'high';
    rationale: string;
    keyStrengths: string[];
    risks: string[];
    dividendYield?: number;
    peRatio?: number;
    recommendedAllocation: number;
}

export interface PortfolioSuggestion {
    totalInvestment: number;
    riskLevel: 'low' | 'medium' | 'high';
    portfolio: {
        symbol: string;
        name: string;
        sector: string;
        currentPrice: number;
        targetPrice: number;
        upside: number;
        recommendedAllocation: number;
        suggestedAmount: number;
        suggestedShares: number;
        actualInvestment: number;
        rationale: string;
    }[];
    diversification: {
        sectors: number;
        stocks: number;
    };
}

export const getStockRecommendations = async (filters?: {
    sector?: string;
    marketCap?: string;
    riskLevel?: string;
    investmentHorizon?: string;
    minUpside?: number;
}) => {
    const params = new URLSearchParams();
    if (filters?.sector) params.append('sector', filters.sector);
    if (filters?.marketCap) params.append('marketCap', filters.marketCap);
    if (filters?.riskLevel) params.append('riskLevel', filters.riskLevel);
    if (filters?.investmentHorizon) params.append('investmentHorizon', filters.investmentHorizon);
    if (filters?.minUpside) params.append('minUpside', filters.minUpside.toString());

    const { data } = await apiClient.get<{ success: boolean; data: StockRecommendation[] }>(
        `/stocks?${params.toString()}`
    );
    return data.data;
};

export const getTopStocks = async (limit: number = 5) => {
    const { data } = await apiClient.get<{ success: boolean; data: StockRecommendation[] }>(
        `/stocks/top?limit=${limit}`
    );
    return data.data;
};

export const getStockDetail = async (symbol: string) => {
    const { data } = await apiClient.get<{ success: boolean; data: StockRecommendation }>(
        `/stocks/${symbol}`
    );
    return data.data;
};

export const getStocksBySector = async () => {
    const { data } = await apiClient.get<{ success: boolean; data: Record<string, StockRecommendation[]> }>(
        '/stocks/by-sector'
    );
    return data.data;
};

export const getPortfolioSuggestion = async (investmentAmount: number, riskLevel: 'low' | 'medium' | 'high') => {
    const { data } = await apiClient.post<{ success: boolean; data: PortfolioSuggestion }>(
        '/stocks/portfolio-suggestion',
        { investmentAmount, riskLevel }
    );
    return data.data;
};

export const updateStockPrices = async () => {
    const { data } = await apiClient.post<{ success: boolean; data: { updated: number; total: number } }>(
        '/stocks/update-prices'
    );
    return data.data;
};
