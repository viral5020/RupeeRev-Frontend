import apiClient from './apiClient';
import { Goal, CreateGoalPayload } from '../types';

type GoalsResponse = { success: boolean; data: Goal[] };
type GoalResponse = { success: boolean; data: Goal };

export const fetchGoals = async () => {
  const { data } = await apiClient.get<GoalsResponse>('/goals');
  return data.data;
};

export const createGoal = async (payload: CreateGoalPayload) => {
  const { data } = await apiClient.post<GoalResponse>('/goals', payload);
  return data.data;
};

export const updateGoal = async (id: string, payload: Partial<CreateGoalPayload> & { status?: Goal['status'] }) => {
  const { data } = await apiClient.put<GoalResponse>(`/goals/${id}`, payload);
  return data.data;
};

export const deleteGoal = async (id: string) => {
  await apiClient.delete(`/goals/${id}`);
};



