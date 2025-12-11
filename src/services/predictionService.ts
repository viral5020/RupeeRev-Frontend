import apiClient from './apiClient';

export const getCategorySpike = async () => {
  const { data } = await apiClient.get('/predictions/category-spike');
  return data.data;
};

export const getOverspendingWarning = async () => {
  const { data } = await apiClient.get('/predictions/overspending-warning');
  return data.data;
};

export const getSubscriptionPredictions = async () => {
  const { data } = await apiClient.get('/predictions/subscriptions');
  return data.data;
};

export const getRepeatedMerchants = async () => {
  const { data } = await apiClient.get('/predictions/repeated-merchants');
  return data.data;
};

export const getPredictedBills = async () => {
  const { data } = await apiClient.get('/predictions/bills');
  return data.data;
};

export const getAIInsights = async () => {
  const { data } = await apiClient.get('/predictions/ai-insights');
  return data.data;
};

