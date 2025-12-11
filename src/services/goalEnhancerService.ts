import apiClient from './apiClient';

export const getGoalConfidence = async (goalId: string) => {
  const { data } = await apiClient.get(`/goal-enhancer/${goalId}/confidence`);
  return data.data;
};

export const detectSalaryIncrease = async () => {
  const { data } = await apiClient.get('/goal-enhancer/salary-increase');
  return data.data;
};

export const fixSipTimeline = async (goalId: string) => {
  const { data } = await apiClient.put(`/goal-enhancer/${goalId}/fix-timeline`);
  return data.data;
};

