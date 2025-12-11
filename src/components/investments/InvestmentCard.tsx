import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Button } from '@mui/material';
import { InvestmentSuggestion } from '../../types';
import { formatCurrency } from '../../utils/format';

interface InvestmentCardProps {
    suggestion: InvestmentSuggestion;
}

const InvestmentCard: React.FC<InvestmentCardProps> = ({ suggestion }) => {
    const getRiskColor = (risk: 'low' | 'medium' | 'high') => {
        switch (risk) {
            case 'low': return { bg: '#10b981', light: '#d1fae5' };
            case 'medium': return { bg: '#f59e0b', light: '#fef3c7' };
            case 'high': return { bg: '#ef4444', light: '#fee2e2' };
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'SIP': return '📈';
            case 'FD': return '🏦';
            case 'RD': return '💰';
            case 'ETF': return '📊';
            case 'GOLD': return '🥇';
            case 'STOCK': return '📉';
            case 'CRYPTO': return '₿';
            case 'GOVT_BOND': return '🏛️';
            case 'P2P': return '🤝';
            default: return '💼';
        }
    };

    const colors = getRiskColor(suggestion.risk);

    return (
        <Card sx={{
            height: '100%',
            background: `linear-gradient(135deg, #ffffff 0%, ${colors.light} 100%)`,
            border: `2px solid ${colors.bg}40`,
            borderRadius: 3,
            transition: 'all 0.3s ease',
            '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: `0 12px 24px ${colors.bg}30`,
                borderColor: colors.bg,
            },
        }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" sx={{
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                    }}>
                        {getTypeIcon(suggestion.type)} {suggestion.title}
                    </Typography>
                    <Chip
                        label={suggestion.risk.toUpperCase()}
                        size="small"
                        sx={{
                            background: colors.bg,
                            color: 'white',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                        }}
                    />
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                    {suggestion.description}
                </Typography>

                <Box sx={{
                    p: 2,
                    borderRadius: 2,
                    background: `${colors.bg}15`,
                    mb: 2,
                }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                        Suggested Amount
                    </Typography>
                    <Typography variant="h5" sx={{
                        color: colors.bg,
                        fontWeight: 700,
                    }}>
                        {formatCurrency(suggestion.suggestedAmount)}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            Expected Return
                        </Typography>
                        <Typography variant="body2" fontWeight={600} color={colors.bg}>
                            {suggestion.expectedReturn}
                        </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            Min - Max
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                            {formatCurrency(suggestion.minAmount)} - {formatCurrency(suggestion.maxAmount)}
                        </Typography>
                    </Box>
                </Box>

                <Button
                    variant="contained"
                    fullWidth
                    sx={{
                        background: `linear-gradient(135deg, ${colors.bg} 0%, ${colors.bg}dd 100%)`,
                        '&:hover': {
                            background: `linear-gradient(135deg, ${colors.bg}dd 0%, ${colors.bg}bb 100%)`,
                        },
                    }}
                >
                    Learn More
                </Button>
            </CardContent>
        </Card>
    );
};

export default InvestmentCard;
