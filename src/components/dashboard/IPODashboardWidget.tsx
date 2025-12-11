import React from 'react';
import { Paper, Typography, Stack, Button, Box, Chip, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useQuery } from '@tanstack/react-query';
import { getUpcomingIPOs } from '../../services/ipoService';
import { formatDate } from '../../utils/format';

const IPODashboardWidget: React.FC = () => {
    const navigate = useNavigate();

    const { data: upcomingIPOs, isLoading, error } = useQuery({
        queryKey: ['upcoming-ipos', 3],
        queryFn: () => getUpcomingIPOs(3),
        staleTime: 0, // Always fetch fresh data
        retry: 2, // Retry failed requests
    });

    return (
        <Paper sx={{ p: 3, mb: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <TrendingUpIcon color="primary" />
                    <Typography variant="h6" fontWeight={700}>
                        Upcoming IPOs
                    </Typography>
                </Stack>
                <Button size="small" onClick={() => navigate('/ipos')}>
                    View All
                </Button>
            </Stack>

            {isLoading ? (
                <Box display="flex" justifyContent="center" py={2}>
                    <CircularProgress size={24} />
                </Box>
            ) : error ? (
                <Typography variant="body2" color="error" textAlign="center" py={2}>
                    Failed to load IPOs. Please try again later.
                </Typography>
            ) : upcomingIPOs && upcomingIPOs.length > 0 ? (
                <Stack spacing={2}>
                    {upcomingIPOs.map((ipo) => (
                        <Box
                            key={ipo._id}
                            sx={{
                                p: 2,
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 1,
                                cursor: 'pointer',
                                '&:hover': { bgcolor: 'action.hover' },
                            }}
                            onClick={() => navigate(`/ipos/${ipo._id}`)}
                        >
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                <Box>
                                    <Typography variant="subtitle2" fontWeight={600}>
                                        {ipo.companyName}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {ipo.symbol} • {ipo.industry}
                                    </Typography>
                                </Box>
                                <Chip label="Upcoming" color="info" size="small" />
                            </Stack>

                            <Stack direction="row" spacing={2} mt={1}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Price Range
                                    </Typography>
                                    <Typography variant="body2" fontWeight={600}>
                                        ₹{ipo.priceRange.min} - ₹{ipo.priceRange.max}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Opens On
                                    </Typography>
                                    <Typography variant="body2">{formatDate(ipo.openDate)}</Typography>
                                </Box>
                            </Stack>
                        </Box>
                    ))}
                </Stack>
            ) : (
                <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                    No upcoming IPOs at the moment
                </Typography>
            )}
        </Paper>
    );
};

export default IPODashboardWidget;
