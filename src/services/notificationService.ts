import apiClient from './apiClient';
import { Notification } from '../types';

export const fetchNotifications = async () => {
  const { data } = await apiClient.get<{ success: boolean; data: Notification[] }>('/notifications');
  return data.data;
};

export const markNotificationRead = async (id: string) => {
  const { data } = await apiClient.post<{ success: boolean; data: Notification }>(`/notifications/${id}/read`, {});
  return data.data;
};

