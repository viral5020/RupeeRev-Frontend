import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, CheckCircle, PenSquare, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import * as reviewService from '../../services/reviewService';
import ReviewForm from './ReviewForm';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

interface Review {
    _id: string;
    userId: string;
    name: string;
    role?: string;
    rating: number;
    content: string;
    verified: boolean;
    avatarUrl?: string;
    createdAt: string;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`w-4 h-4 ${star <= rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-600 text-gray-600'
                        }`}
                />
            ))}
        </div>
    );
};

const ReviewsSection: React.FC = () => {
    const { user } = useAuth();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [myReview, setMyReview] = useState<Review | null>(null);
    const [checkingEligibility, setCheckingEligibility] = useState(false);

    useEffect(() => {
        fetchReviews();
        if (user) {
            checkMyReview();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const fetchReviews = async () => {
        try {
            const data = await reviewService.getReviews();
            setReviews(data);
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const checkMyReview = async () => {
        try {
            const { review } = await reviewService.getMyReview();
            setMyReview(review);
        } catch (error) {
            console.error('Failed to check user review:', error);
        }
    };

    const handleWriteReviewClick = async () => {
        if (!user) {
            enqueueSnackbar('Please login to write a review', { variant: 'error' });
            navigate('/login');
            return;
        }

        // Check eligibility
        setCheckingEligibility(true);
        try {
            const eligibility = await reviewService.checkEligibility();

            if (!eligibility.eligible) {
                enqueueSnackbar(
                    eligibility.reason || 'You need to be a premium user or have purchased tokens to write a review',
                    { variant: 'error' }
                );
                // Optionally navigate to pricing page
                setTimeout(() => {
                    navigate('/pricing');
                }, 2000);
                return;
            }

            setShowForm(true);
        } catch (error: any) {
            enqueueSnackbar('Failed to check eligibility. Please try again.', { variant: 'error' });
        } finally {
            setCheckingEligibility(false);
        }
    };

    const handleFormSuccess = () => {
        fetchReviews();
        if (user) {
            checkMyReview();
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    // Calculate average rating
    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : '4.9';

    return (
        <section className="py-24 lg:py-32 relative" id="reviews">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-transparent to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-purple-400 font-semibold tracking-wide uppercase mb-3"
                    >
                        Real Reviews
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-white mb-4"
                    >
                        What Our Users Say
                    </motion.p>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 text-lg max-w-2xl mx-auto mb-6"
                    >
                        Join thousands of satisfied users who have transformed their financial lives with RupeeRev
                    </motion.p>

                    {/* Write Review Button */}
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        onClick={handleWriteReviewClick}
                        disabled={checkingEligibility}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all font-semibold shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {checkingEligibility ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Checking...
                            </>
                        ) : (
                            <>
                                <PenSquare className="w-5 h-5" />
                                {myReview ? 'Edit Your Review' : 'Write a Review'}
                            </>
                        )}
                    </motion.button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-lg">No reviews yet. Be the first to share your experience!</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {reviews.map((review, index) => (
                            <motion.div
                                key={review._id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] flex flex-col"
                            >
                                {/* Header with user info */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        {review.avatarUrl ? (
                                            <img
                                                src={review.avatarUrl}
                                                alt={review.name}
                                                className="w-12 h-12 rounded-full border-2 border-purple-500/30 object-cover"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full border-2 border-purple-500/30 bg-purple-500/20 flex items-center justify-center">
                                                <span className="text-white font-semibold text-lg">
                                                    {review.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-white font-semibold text-sm">
                                                    {review.name}
                                                </h4>
                                                {review.verified && (
                                                    <CheckCircle className="w-4 h-4 text-blue-400" />
                                                )}
                                            </div>
                                            {review.role && (
                                                <p className="text-gray-400 text-xs">{review.role}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Rating and date */}
                                <div className="flex items-center justify-between mb-4">
                                    <StarRating rating={review.rating} />
                                    <span className="text-gray-500 text-xs">{formatDate(review.createdAt)}</span>
                                </div>

                                {/* Review content */}
                                <p className="text-gray-300 leading-relaxed text-sm flex-grow">
                                    "{review.content}"
                                </p>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Stats section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
                >
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                        <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-2">{averageRating}</div>
                        <div className="text-gray-400 text-sm">Average Rating</div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                        <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-2">{reviews.length}+</div>
                        <div className="text-gray-400 text-sm">User Reviews</div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                        <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-2">50K+</div>
                        <div className="text-gray-400 text-sm">Transactions Tracked</div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                        <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-2">₹2Cr+</div>
                        <div className="text-gray-400 text-sm">Money Managed</div>
                    </div>
                </motion.div>
            </div>

            {/* Review Form Modal */}
            <AnimatePresence>
                {showForm && (
                    <ReviewForm
                        onClose={() => setShowForm(false)}
                        onSuccess={handleFormSuccess}
                        existingReview={myReview}
                    />
                )}
            </AnimatePresence>
        </section>
    );
};

export default ReviewsSection;
