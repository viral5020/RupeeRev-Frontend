import apiClient from './apiClient';

export interface SubscriptionStatus {
    isPremium: boolean;
    premiumExpiresAt?: string;
    tokenBalance: number;
    subscriptionId?: string;
}

export interface OrderResponse {
    orderId: string;
    amount: number;
    currency: string;
    keyId: string;
}

export const createPremiumOrder = async (): Promise<OrderResponse> => {
    const { data } = await apiClient.post<{ success: boolean; data: OrderResponse }>('/payments/create-premium-order');
    return data.data;
};

export const createAnnualOrder = async (): Promise<OrderResponse> => {
    const { data } = await apiClient.post<{ success: boolean; data: OrderResponse }>('/payments/create-annual-order');
    return data.data;
};

export const createTokenOrder = async (): Promise<OrderResponse> => {
    const { data } = await apiClient.post<{ success: boolean; data: OrderResponse }>('/payments/create-token-order');
    return data.data;
};

export const verifyPayment = async (paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}) => {
    const { data } = await apiClient.post('/payments/verify', paymentData);
    return data.data;
};

export const getSubscriptionStatus = async (): Promise<SubscriptionStatus> => {
    const { data } = await apiClient.get<{ success: boolean; data: SubscriptionStatus }>('/payments/subscription-status');
    return data.data;
};
