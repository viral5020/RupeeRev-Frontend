import apiClient from './apiClient';
import { CategoryPerformance, AIRecommendation } from '../types';

export const getCategoryPerformance = async () => {
  const { data } = await apiClient.get<{ success: boolean; data: CategoryPerformance[] }>(
    '/mutualfunds/categories/performance'
  );
  return data.data;
};

export const getAIRecommendation = async (surplus: number, riskLevel: 'low' | 'medium' | 'high') => {
  const { data } = await apiClient.post<{ success: boolean; data: AIRecommendation }>(
    '/investments/recommend',
    { surplus, riskLevel }
  );
  return data.data;
};


