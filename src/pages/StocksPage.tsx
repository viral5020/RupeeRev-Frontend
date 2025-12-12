import React, { useCallback, useEffect, useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Chip,
    Button,
    CircularProgress,
    Stack,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useSnackbar } from 'notistack';
import PageHeader from '../components/common/PageHeader';
import { getTopStocks, getStocksBySector, updateStockPrices, StockRecommendation } from '../services/stockService';
import PremiumGuard from '../components/common/PremiumGuard';

const StocksPage: React.FC = () => {
    const [topStocks, setTopStocks] = useState<StockRecommendation[]>([]);
    const [stocksBySector, setStocksBySector] = useState<Record<string, StockRecommendation[]>>({});
    const [loading, setLoading] = useState(true);
    const { enqueueSnackbar } = useSnackbar();

    const loadStocks = useCallback(async () => {
    try {
        setLoading(true);
        const [top, bySector] = await Promise.all([getTopStocks(5), getStocksBySector()]);
        setTopStocks(top);
        setStocksBySector(bySector);
    } catch (error: any) {
        if (error.response?.status !== 403) {
            enqueueSnackbar(
                error.response?.data?.message || 'Failed to load stocks',
                { variant: 'error' }
            );
        }
    } finally {
        setLoading(false);
    }
}, [enqueueSnackbar]);

    useEffect(() => {
        loadStocks();
    }, [loadStocks]);


    const handleUpdatePrices = async () => {
        try {
            setLoading(true);
            const result = await updateStockPrices();
            enqueueSnackbar(`Updated ${result.updated}/${result.total} stocks`, { variant: 'success' });
            await loadStocks();
        } catch (error: any) {
            // Don't show toast for 403 - PremiumGuard handles the UI
            if (error.response?.status !== 403) {
                enqueueSnackbar(error.response?.data?.message || 'Failed to update prices', { variant: 'error' });
            }
        } finally {
            setLoading(false);
        }
    };

    const getRiskColor = (risk: string) => {
        switch (risk) {
            case 'low':
                return 'success';
            case 'medium':
                return 'warning';
            case 'high':
                return 'error';
            default:
                return 'default';
        }
    };

    const getMarketCapLabel = (cap: string) => {
        switch (cap) {
            case 'large':
                return 'Large Cap';
            case 'mid':
                return 'Mid Cap';
            case 'small':
                return 'Small Cap';
            default:
                return cap;
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    return (
        <PremiumGuard
            title="Stock Recommendations"
            description="Access expert stock picks, sector analysis, and real-time market data."
        >
            <Box>
                <PageHeader
                    title="📈 Long-Term Stock Recommendations"
                    action={
                        <Button
                            variant="outlined"
                            onClick={handleUpdatePrices}
                            disabled={loading}
                        >
                            🔄 Update Prices
                        </Button>
                    }
                />

                {/* Top Picks */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                        🌟 Top Picks
                    </Typography>
                    <Grid container spacing={3}>
                        {topStocks.map((stock) => (
                            <Grid item xs={12} md={6} lg={4} key={stock._id}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        borderRadius: 3,
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        '&:hover': { boxShadow: 6, borderColor: 'primary.main' },
                                    }}
                                >
                                    <CardContent>
                                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                            <Box>
                                                <Typography variant="h6" fontWeight={700}>
                                                    {stock.symbol}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {stock.name}
                                                </Typography>
                                            </Box>
                                            <Chip
                                                label={stock.riskLevel.toUpperCase()}
                                                color={getRiskColor(stock.riskLevel)}
                                                size="small"
                                            />
                                        </Stack>

                                        <Stack direction="row" spacing={1} mb={2}>
                                            <Chip label={stock.sector} size="small" variant="outlined" />
                                            <Chip label={getMarketCapLabel(stock.marketCap)} size="small" variant="outlined" />
                                        </Stack>

                                        <Box sx={{ bgcolor: 'success.lighter', p: 1.5, borderRadius: 2, mb: 2 }}>
                                            <Typography variant="caption" color="text.secondary">
                                                Current Price
                                            </Typography>
                                            <Typography variant="h5" fontWeight={700} color="success.main">
                                                ₹{stock.currentPrice.toLocaleString('en-IN')}
                                            </Typography>
                                            <Stack direction="row" alignItems="center" spacing={0.5} mt={0.5}>
                                                <TrendingUpIcon fontSize="small" color="success" />
                                                <Typography variant="body2" color="success.main" fontWeight={600}>
                                                    Target: ₹{stock.targetPrice.toLocaleString('en-IN')} (+{stock.upside.toFixed(1)}%)
                                                </Typography>
                                            </Stack>
                                        </Box>

                                        <Typography variant="body2" color="text.secondary" mb={1}>
                                            {stock.rationale}
                                        </Typography>

                                        <Divider sx={{ my: 1.5 }} />

                                        <Stack direction="row" justifyContent="space-between">
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">
                                                    Horizon
                                                </Typography>
                                                <Typography variant="body2" fontWeight={600}>
                                                    {stock.investmentHorizon}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">
                                                    Allocation
                                                </Typography>
                                                <Typography variant="body2" fontWeight={600}>
                                                    {stock.recommendedAllocation}%
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Stocks by Sector */}
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                        📊 Stocks by Sector
                    </Typography>
                    {Object.entries(stocksBySector).map(([sector, stocks]) => (
                        <Accordion key={sector} sx={{ mb: 1, borderRadius: 2, '&:before': { display: 'none' } }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h6" fontWeight={600}>
                                    {sector} ({stocks.length})
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={2}>
                                    {stocks.map((stock) => (
                                        <Grid item xs={12} sm={6} md={4} key={stock._id}>
                                            <Card variant="outlined" sx={{ height: '100%' }}>
                                                <CardContent>
                                                    <Typography variant="subtitle1" fontWeight={700}>
                                                        {stock.symbol}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                                                        {stock.name}
                                                    </Typography>
                                                    <Stack direction="row" spacing={1} mb={1}>
                                                        <Chip label={stock.riskLevel} color={getRiskColor(stock.riskLevel)} size="small" />
                                                        <Chip label={`+${stock.upside.toFixed(1)}%`} color="success" size="small" />
                                                    </Stack>
                                                    <Typography variant="body2" color="text.secondary" fontSize="0.75rem">
                                                        ₹{stock.currentPrice} → ₹{stock.targetPrice}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Box>
            </Box>
        </PremiumGuard>
    );
};

export default StocksPage;
