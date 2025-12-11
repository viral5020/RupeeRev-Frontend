import apiClient from './apiClient';
import { IPO, IPOStatus, IPOWatchlistItem } from '../types/ipo';

export const listIPOs = async (filters?: { status?: IPOStatus; industry?: string; search?: string }) => {
    const { data } = await apiClient.get('/ipos', { params: filters });
    return data.data as IPO[];
};

export const getIPOById = async (id: string) => {
    const { data } = await apiClient.get(`/ipos/${id}`);
    return data.data as IPO;
};

export const getUpcomingIPOs = async (limit: number = 3) => {
    const { data } = await apiClient.get('/ipos/upcoming', { params: { limit } });
    return data.data as IPO[];
};

export const addToWatchlist = async (ipoId: string) => {
    const { data } = await apiClient.post('/ipos/watchlist/add', { ipoId });
    return data.data;
};

export const removeFromWatchlist = async (ipoId: string) => {
    const { data } = await apiClient.post('/ipos/watchlist/remove', { ipoId });
    return data.data;
};

export const getUserWatchlist = async () => {
    const { data } = await apiClient.get('/ipos/watchlist/list');
    return data.data as IPOWatchlistItem[];
};

export const checkWatchlistStatus = async (ipoId: string) => {
    const { data } = await apiClient.get(`/ipos/watchlist/status/${ipoId}`);
    return data.data.inWatchlist as boolean;
};
