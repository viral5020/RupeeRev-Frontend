import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    Grid,
    Chip,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Alert,
    CircularProgress,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    createPremiumOrder,
    createAnnualOrder,
    createTokenOrder,
    verifyPayment,
    getSubscriptionStatus,
    SubscriptionStatus,
} from '../services/paymentService';
import { useSnackbar } from 'notistack';

declare global {
    interface Window {
        Razorpay: any;
    }
}

const PricingPage: React.FC = () => {
    const { user, refreshUser } = useAuth();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [processingPayment, setProcessingPayment] = useState(false);

    const loadSubscriptionStatus = useCallback(async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        try {
            const status = await getSubscriptionStatus();
            setSubscription(status);
        } catch (error) {
            console.error('Failed to load subscription status', error);
        } finally {
            setLoading(false);
        }
    }, [user]); 

    useEffect(() => {
        loadSubscriptionStatus();
    }, [loadSubscriptionStatus]);


    const handlePurchase = async (type: 'monthly' | 'yearly' | 'tokens') => {
        // Check if user is logged in
        if (!user) {
            enqueueSnackbar('Please login to purchase', { variant: 'warning' });
            navigate(`/login?redirect=/pricing`);
            return;
        }

        setProcessingPayment(true);

        try {
            let orderData;
            let planName;

            // Create order based on type
            if (type === 'monthly') {
                orderData = await createPremiumOrder();
                planName = 'Premium Monthly';
            } else if (type === 'yearly') {
                orderData = await createAnnualOrder();
                planName = 'Premium Yearly';
            } else {
                orderData = await createTokenOrder();
                planName = 'Token Pack';
            }

            // Initialize Razorpay
            const options = {
                key: orderData.keyId,
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'RupeeRev',
                description: planName,
                order_id: orderData.orderId,
                handler: async (response: any) => {
                    try {
                        await verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });

                        enqueueSnackbar('Payment successful! Your subscription is now active.', { variant: 'success' });

                        // Refresh user data to update premium status
                        await refreshUser();

                        // Reload subscription status
                        await loadSubscriptionStatus();

                        // Navigate to dashboard
                        navigate('/dashboard');
                    } catch (error) {
                        enqueueSnackbar('Payment verification failed', { variant: 'error' });
                    } finally {
                        setProcessingPayment(false);
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                },
                theme: {
                    color: '#1976d2',
                },
                modal: {
                    ondismiss: () => {
                        setProcessingPayment(false);
                    },
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error: any) {
            enqueueSnackbar(error.response?.data?.message || 'Failed to create order', { variant: 'error' });
            setProcessingPayment(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 8 }}>
            {/* Header */}
            <Box textAlign="center" mb={6}>
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                    Choose Your Plan
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Unlock premium features and take control of your finances
                </Typography>
            </Box>

            {/* User Balance Section */}
            {user && (
                <Card
                    elevation={2}
                    sx={{
                        mb: 6,
                        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                        border: '1px solid',
                        borderColor: 'divider'
                    }}
                >
                    <CardContent sx={{ p: 4 }}>
                        <Grid container spacing={4} alignItems="center">
                            <Grid item xs={12} md={8}>
                                <Typography variant="h5" fontWeight="bold" gutterBottom>
                                    Your Balance
                                </Typography>
                                <Typography variant="body1" color="text.secondary" paragraph>
                                    Total PDF uploads available for bank statement analysis.
                                </Typography>

                                <Grid container spacing={2} sx={{ mt: 1 }}>
                                    <Grid item xs={6} sm={4}>
                                        <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                                            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                                                Monthly Limit
                                            </Typography>
                                            <Typography variant="h6" fontWeight="bold">
                                                {(() => {
                                                    const limit = subscription?.isPremium ? 5 : 0;
                                                    const used = user.monthlyPdfUploads?.count || 0;
                                                    const remaining = Math.max(0, limit - used);
                                                    return remaining;
                                                })()}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6} sm={4}>
                                        <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                                            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                                                Purchased Tokens
                                            </Typography>
                                            <Typography variant="h6" fontWeight="bold">
                                                {user.tokenBalance || 0}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Box sx={{
                                            p: 2,
                                            bgcolor: 'primary.main',
                                            color: 'primary.contrastText',
                                            borderRadius: 2,
                                            boxShadow: 2
                                        }}>
                                            <Typography variant="caption" display="block" sx={{ opacity: 0.9 }} gutterBottom>
                                                Total Available
                                            </Typography>
                                            <Typography variant="h5" fontWeight="bold">
                                                {(() => {
                                                    const limit = subscription?.isPremium ? 5 : 0;
                                                    const used = user.monthlyPdfUploads?.count || 0;
                                                    const remaining = Math.max(0, limit - used);
                                                    return remaining + (user.tokenBalance || 0);
                                                })()}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Alert severity="info" icon={<CheckCircleIcon />}>
                                    1 Token = 1 PDF Upload
                                </Alert>
                                <Typography variant="caption" color="text.secondary">
                                    Monthly limit resets on the 1st of every month. Purchased tokens never expire.
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            )}

            {/* Current Plan Status */}
            {user && subscription?.isPremium && (
                <Alert severity="success" sx={{ mb: 4 }}>
                    <Typography variant="h6">You are a Premium Member! 🎉</Typography>
                    <Typography variant="body2">
                        Your subscription is active until {new Date(subscription.premiumExpiresAt!).toLocaleDateString()}
                    </Typography>
                </Alert>
            )}

            {/* Pricing Cards */}
            <Grid container spacing={4} justifyContent="center">
                {/* Free Plan */}
                <Grid item xs={12} md={4}>
                    <Card
                        elevation={3}
                        sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                        }}
                    >
                        <CardContent sx={{ flexGrow: 1, p: 4 }}>
                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                Free
                            </Typography>
                            <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
                                ₹0
                            </Typography>
                            <Typography variant="body2" color="text.secondary" mb={3}>
                                Forever free
                            </Typography>

                            <List>
                                <ListItem disableGutters>
                                    <ListItemIcon>
                                        <CheckCircleIcon color="primary" />
                                    </ListItemIcon>
                                    <ListItemText primary="Basic transaction tracking" />
                                </ListItem>
                                <ListItem disableGutters>
                                    <ListItemIcon>
                                        <CheckCircleIcon color="primary" />
                                    </ListItemIcon>
                                    <ListItemText primary="Manual categorization" />
                                </ListItem>
                                <ListItem disableGutters>
                                    <ListItemIcon>
                                        <CheckCircleIcon color="primary" />
                                    </ListItemIcon>
                                    <ListItemText primary="Basic reports" />
                                </ListItem>
                            </List>

                            <Button
                                variant="outlined"
                                fullWidth
                                sx={{ mt: 3 }}
                                disabled
                            >
                                Current Plan
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Premium Monthly */}
                <Grid item xs={12} md={4}>
                    <Card
                        elevation={6}
                        sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                            border: '2px solid',
                            borderColor: 'primary.main',
                        }}
                    >
                        <Chip
                            label="POPULAR"
                            color="primary"
                            sx={{ position: 'absolute', top: 16, right: 16 }}
                        />
                        <CardContent sx={{ flexGrow: 1, p: 4 }}>
                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                Premium Monthly
                            </Typography>
                            <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
                                ₹149
                            </Typography>
                            <Typography variant="body2" color="text.secondary" mb={3}>
                                per month
                            </Typography>

                            <List>
                                <ListItem disableGutters>
                                    <ListItemIcon>
                                        <CheckCircleIcon color="primary" />
                                    </ListItemIcon>
                                    <ListItemText primary="All Free features" />
                                </ListItem>
                                <ListItem disableGutters>
                                    <ListItemIcon>
                                        <CheckCircleIcon color="primary" />
                                    </ListItemIcon>
                                    <ListItemText primary="AI-powered categorization" />
                                </ListItem>
                                <ListItem disableGutters>
                                    <ListItemIcon>
                                        <CheckCircleIcon color="primary" />
                                    </ListItemIcon>
                                    <ListItemText primary="5 PDF bank statement imports/month" />
                                </ListItem>
                                <ListItem disableGutters>
                                    <ListItemIcon>
                                        <CheckCircleIcon color="primary" />
                                    </ListItemIcon>
                                    <ListItemText primary="Advanced analytics" />
                                </ListItem>
                                <ListItem disableGutters>
                                    <ListItemIcon>
                                        <CheckCircleIcon color="primary" />
                                    </ListItemIcon>
                                    <ListItemText primary="Investment tracking" />
                                </ListItem>
                                <ListItem disableGutters>
                                    <ListItemIcon>
                                        <CheckCircleIcon color="primary" />
                                    </ListItemIcon>
                                    <ListItemText primary="Priority support" />
                                </ListItem>
                            </List>

                            <Button
                                variant="contained"
                                fullWidth
                                size="large"
                                sx={{ mt: 3 }}
                                onClick={() => handlePurchase('monthly')}
                                disabled={subscription?.isPremium || processingPayment}
                            >
                                {processingPayment ? <CircularProgress size={24} /> : subscription?.isPremium ? 'Active' : 'Start Free Trial'}
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Premium Yearly */}
                <Grid item xs={12} md={4}>
                    <Card
                        elevation={3}
                        sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                        }}
                    >
                        <Chip
                            label="SAVE 44%"
                            color="success"
                            sx={{ position: 'absolute', top: 16, right: 16 }}
                        />
                        <CardContent sx={{ flexGrow: 1, p: 4 }}>
                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                Premium Yearly
                            </Typography>
                            <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
                                ₹999
                            </Typography>
                            <Typography variant="body2" color="text.secondary" mb={3}>
                                per year (₹83/month)
                            </Typography>

                            <List>
                                <ListItem disableGutters>
                                    <ListItemIcon>
                                        <CheckCircleIcon color="primary" />
                                    </ListItemIcon>
                                    <ListItemText primary="All Premium features" />
                                </ListItem>
                                <ListItem disableGutters>
                                    <ListItemIcon>
                                        <CheckCircleIcon color="primary" />
                                    </ListItemIcon>
                                    <ListItemText primary="Save ₹789 per year" />
                                </ListItem>
                                <ListItem disableGutters>
                                    <ListItemIcon>
                                        <CheckCircleIcon color="primary" />
                                    </ListItemIcon>
                                    <ListItemText primary="Exclusive features" />
                                </ListItem>
                            </List>

                            <Button
                                variant="contained"
                                fullWidth
                                size="large"
                                sx={{ mt: 3 }}
                                onClick={() => handlePurchase('yearly')}
                                disabled={subscription?.isPremium || processingPayment}
                            >
                                {processingPayment ? <CircularProgress size={24} /> : subscription?.isPremium ? 'Active' : 'Start Annual Plan'}
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Token Pack Add-on */}
            <Box mt={6}>
                <Card elevation={2}>
                    <CardContent sx={{ p: 4 }}>
                        <Grid container spacing={3} alignItems="center">
                            <Grid item xs={12} md={8}>
                                <Typography variant="h5" fontWeight="bold" gutterBottom>
                                    Token Pack Add-on
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Get 1 token to upload 1 PDF bank statement.
                                </Typography>
                                {user && subscription && (
                                    <Typography variant="body2" color="primary" mt={1}>
                                        Current balance: {(() => {
                                            let available = subscription.tokenBalance;
                                            if (subscription.isPremium) {
                                                // Note: subscription object might not have monthlyPdfUploads yet if not updated in backend response type
                                                // But we can use user object if subscription is just a subset or check if we need to update the type
                                                // For now, let's assume we need to use 'user' from context which has the latest structure
                                                const monthlyUsed = user.monthlyPdfUploads?.count || 0;
                                                available += Math.max(0, 5 - monthlyUsed);
                                            }
                                            return available;
                                        })()} upload{(() => {
                                            let available = subscription.tokenBalance;
                                            if (subscription.isPremium) {
                                                const monthlyUsed = user.monthlyPdfUploads?.count || 0;
                                                available += Math.max(0, 5 - monthlyUsed);
                                            }
                                            return available !== 1 ? 's' : '';
                                        })()} left
                                    </Typography>
                                )}
                            </Grid>
                            <Grid item xs={12} md={4} textAlign="right">
                                <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
                                    ₹49
                                </Typography>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    onClick={() => handlePurchase('tokens')}
                                    disabled={!user || processingPayment}
                                >
                                    {processingPayment ? <CircularProgress size={24} /> : 'Buy Token Pack'}
                                </Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Box>

            {/* Razorpay Script */}
            <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
        </Container>
    );
};

export default PricingPage;
