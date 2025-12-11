import api from './apiClient';

export interface ReviewData {
    rating: number;
    content: string;
    role?: string;
}

export interface Review {
    _id: string;
    userId: string;
    name: string;
    role?: string;
    rating: number;
    content: string;
    verified: boolean;
    isApproved: boolean;
    avatarUrl?: string;
    createdAt: string;
    updatedAt: string;
}

export interface EligibilityResponse {
    eligible: boolean;
    reason?: string;
}

/**
 * Check if current user is eligible to submit a review
 */
export const checkEligibility = async (): Promise<EligibilityResponse> => {
    const response = await api.get('/reviews/eligibility');
    return response.data.data;
};

/**
 * Submit a new review
 */
export const submitReview = async (data: ReviewData): Promise<Review> => {
    const response = await api.post('/reviews', data);
    return response.data.data.review;
};

/**
 * Get all approved reviews
 */
export const getReviews = async (): Promise<Review[]> => {
    const response = await api.get('/reviews');
    return response.data.data.reviews;
};

/**
 * Get current user's review
 */
export const getMyReview = async (): Promise<{ review: Review | null; hasReview: boolean }> => {
    const response = await api.get('/reviews/my-review');
    return response.data.data;
};

/**
 * Update user's review
 */
export const updateReview = async (id: string, data: Partial<ReviewData>): Promise<Review> => {
    const response = await api.put(`/reviews/${id}`, data);
    return response.data.data.review;
};

/**
 * Delete user's review
 */
export const deleteReview = async (id: string): Promise<void> => {
    await api.delete(`/reviews/${id}`);
};
