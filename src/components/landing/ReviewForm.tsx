import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, X, Loader2 } from 'lucide-react';
import * as reviewService from '../../services/reviewService';
import { useSnackbar } from 'notistack';

interface ReviewFormProps {
    onClose: () => void;
    onSuccess: () => void;
    existingReview?: {
        _id: string;
        rating: number;
        content: string;
        role?: string;
    } | null;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onClose, onSuccess, existingReview }) => {
    const { enqueueSnackbar } = useSnackbar();
    const [rating, setRating] = useState(existingReview?.rating || 0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [content, setContent] = useState(existingReview?.content || '');
    const [role, setRole] = useState(existingReview?.role || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const maxLength = 500;
    const minLength = 10;
    const remainingChars = maxLength - content.length;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (rating === 0) {
            enqueueSnackbar('Please select a rating', { variant: 'error' });
            return;
        }

        if (content.trim().length < minLength) {
            enqueueSnackbar(`Review must be at least ${minLength} characters`, { variant: 'error' });
            return;
        }

        if (content.trim().length > maxLength) {
            enqueueSnackbar(`Review must not exceed ${maxLength} characters`, { variant: 'error' });
            return;
        }

        setIsSubmitting(true);

        try {
            if (existingReview) {
                await reviewService.updateReview(existingReview._id, {
                    rating,
                    content: content.trim(),
                    role: role.trim() || undefined,
                });
                enqueueSnackbar('Review updated successfully!', { variant: 'success' });
            } else {
                await reviewService.submitReview({
                    rating,
                    content: content.trim(),
                    role: role.trim() || undefined,
                });
                enqueueSnackbar('Review submitted successfully!', { variant: 'success' });
            }
            onSuccess();
            onClose();
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to submit review';
            enqueueSnackbar(errorMessage, { variant: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-[#1A1F2E] border border-white/10 rounded-2xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">
                        {existingReview ? 'Edit Your Review' : 'Write a Review'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Star Rating */}
                    <div>
                        <label className="block text-white font-semibold mb-3">
                            Rating <span className="text-red-400">*</span>
                        </label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    className="transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={`w-10 h-10 ${star <= (hoveredRating || rating)
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'fill-gray-600 text-gray-600'
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                        {rating > 0 && (
                            <p className="text-sm text-gray-400 mt-2">
                                {rating === 1 && 'Poor'}
                                {rating === 2 && 'Fair'}
                                {rating === 3 && 'Good'}
                                {rating === 4 && 'Very Good'}
                                {rating === 5 && 'Excellent'}
                            </p>
                        )}
                    </div>

                    {/* Role/Profession */}
                    <div>
                        <label htmlFor="role" className="block text-white font-semibold mb-2">
                            Your Role/Profession (Optional)
                        </label>
                        <input
                            id="role"
                            type="text"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            maxLength={50}
                            placeholder="e.g., Software Engineer, Business Owner"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                        />
                    </div>

                    {/* Review Content */}
                    <div>
                        <label htmlFor="content" className="block text-white font-semibold mb-2">
                            Your Review <span className="text-red-400">*</span>
                        </label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={6}
                            maxLength={maxLength}
                            placeholder="Share your experience with RupeeRev..."
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                        />
                        <div className="flex justify-between items-center mt-2">
                            <p className="text-sm text-gray-400">
                                Minimum {minLength} characters
                            </p>
                            <p className={`text-sm ${remainingChars < 50 ? 'text-yellow-400' : 'text-gray-400'}`}>
                                {remainingChars} characters remaining
                            </p>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-colors font-semibold"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || rating === 0 || content.trim().length < minLength}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                existingReview ? 'Update Review' : 'Submit Review'
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default ReviewForm;
