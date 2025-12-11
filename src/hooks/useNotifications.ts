import { useQuery } from '@tanstack/react-query';
import { fetchNotifications } from '../services/notificationService';

export const useNotifications = () =>
  useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    refetchInterval: 60000,
  });

