import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    IconButton,
} from '@mui/material';
import { Star, Close } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import * as reviewService from '../../services/reviewService';
import ReviewForm from '../landing/ReviewForm';

const ReviewPromptDialog: React.FC = () => {
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [isEligible, setIsEligible] = useState(false);

    useEffect(() => {
        const checkAndShowPrompt = async () => {
            if (!user) return;

            // Check if user has already dismissed the prompt in this session
            const dismissed = sessionStorage.getItem('reviewPromptDismissed');
            if (dismissed) return;

            // Check if user has already reviewed
            try {
                const { hasReview } = await reviewService.getMyReview();
                if (hasReview) return;

                // Check eligibility
                const eligibility = await reviewService.checkEligibility();
                setIsEligible(eligibility.eligible);

                if (eligibility.eligible) {
                    // Show prompt after a short delay (3 seconds after login)
                    setTimeout(() => {
                        setOpen(true);
                    }, 3000);
                }
            } catch (error) {
                console.error('Failed to check review status:', error);
            }
        };

        checkAndShowPrompt();
    }, [user]);

    const handleClose = () => {
        setOpen(false);
        sessionStorage.setItem('reviewPromptDismissed', 'true');
    };

    const handleWriteReview = () => {
        setOpen(false);
        setShowReviewForm(true);
    };

    const handleReviewFormClose = () => {
        setShowReviewForm(false);
        sessionStorage.setItem('reviewPromptDismissed', 'true');
    };

    const handleReviewSuccess = () => {
        setShowReviewForm(false);
        sessionStorage.setItem('reviewPromptDismissed', 'true');
    };

    if (!isEligible) return null;

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        bgcolor: '#1A1F2E',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 2,
                    },
                }}
            >
                <DialogTitle sx={{ color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Star sx={{ color: '#fbbf24' }} />
                        <Typography variant="h6" component="span">
                            Enjoying RupeeRev?
                        </Typography>
                    </Box>
                    <IconButton onClick={handleClose} size="small" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 2 }}>
                        We'd love to hear about your experience! Your feedback helps us improve and helps others discover RupeeRev.
                    </Typography>
                    <Box
                        sx={{
                            bgcolor: 'rgba(168, 85, 247, 0.1)',
                            border: '1px solid rgba(168, 85, 247, 0.3)',
                            borderRadius: 1,
                            p: 2,
                            mt: 2,
                        }}
                    >
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            ✨ Share your thoughts in just a minute
                            <br />
                            💡 Help others make informed decisions
                            <br />
                            🎯 Your review will be featured on our landing page
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 0 }}>
                    <Button
                        onClick={handleClose}
                        sx={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            '&:hover': {
                                bgcolor: 'rgba(255, 255, 255, 0.05)',
                            },
                        }}
                    >
                        Maybe Later
                    </Button>
                    <Button
                        onClick={handleWriteReview}
                        variant="contained"
                        sx={{
                            background: 'linear-gradient(to right, #a855f7, #ec4899)',
                            '&:hover': {
                                background: 'linear-gradient(to right, #9333ea, #db2777)',
                            },
                        }}
                    >
                        Write a Review
                    </Button>
                </DialogActions>
            </Dialog>

            {showReviewForm && (
                <ReviewForm
                    onClose={handleReviewFormClose}
                    onSuccess={handleReviewSuccess}
                    existingReview={null}
                />
            )}
        </>
    );
};

export default ReviewPromptDialog;
