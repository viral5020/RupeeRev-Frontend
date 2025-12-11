import apiClient from './apiClient';
import { Category } from '../types';

export const fetchCategories = async () => {
  const { data } = await apiClient.get<{ success: boolean; data: Category[] }>('/categories');
  return data.data;
};

export const createCategory = async (payload: Partial<Category>) => {
  const { data } = await apiClient.post<{ success: boolean; data: Category }>('/categories', payload);
  return data.data;
};

export const updateCategory = async (id: string, payload: Partial<Category>) => {
  const { data } = await apiClient.put<{ success: boolean; data: Category }>(`/categories/${id}`, payload);
  return data.data;
};

export const deleteCategory = async (id: string) => {
  await apiClient.delete(`/categories/${id}`);
};

