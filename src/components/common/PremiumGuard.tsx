import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import LockIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

interface PremiumGuardProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
}

const PremiumGuard: React.FC<PremiumGuardProps> = ({
    children,
    title = "Premium Feature",
    description = "Upgrade to unlock this advanced feature and take control of your finances."
}) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // If user is premium, render children
    if (user?.isPremium) {
        return <>{children}</>;
    }

    // Otherwise render lock screen
    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="60vh"
            p={3}
        >
            <Paper
                elevation={0}
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                sx={{
                    p: 6,
                    textAlign: 'center',
                    maxWidth: 500,
                    borderRadius: 4,
                    border: '1px solid',
                    borderColor: 'divider',
                    background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(99, 102, 241, 0.05) 100%)'
                }}
            >
                <Box
                    sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        bgcolor: 'primary.light',
                        color: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 3,
                        opacity: 0.2
                    }}
                >
                    <LockIcon sx={{ fontSize: 40 }} />
                </Box>

                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    {title}
                </Typography>

                <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
                    {description}
                </Typography>

                <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/pricing')}
                    sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        fontWeight: 600,
                        textTransform: 'none',
                        fontSize: '1.1rem'
                    }}
                >
                    View Plans & Upgrade
                </Button>
            </Paper>
        </Box>
    );
};

export default PremiumGuard;
