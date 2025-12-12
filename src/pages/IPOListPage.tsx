import React, { useState } from 'react';
import { Grid, Tabs, Tab, Box, TextField, InputAdornment, CircularProgress, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import PageHeader from '../components/common/PageHeader';
import IPOCard from '../components/ipo/IPOCard';
import ComplianceDisclaimer from '../components/ipo/ComplianceDisclaimer';
import { listIPOs, addToWatchlist, removeFromWatchlist, getUserWatchlist } from '../services/ipoService';
import { IPOStatus } from '../types/ipo';
import PremiumGuard from '../components/common/PremiumGuard';

const IPOListPage: React.FC = () => {
    const [selectedTab, setSelectedTab] = useState<IPOStatus>('upcoming');
    const [searchQuery, setSearchQuery] = useState('');
    const { enqueueSnackbar } = useSnackbar();
    const queryClient = useQueryClient();

    const { data: ipos, isLoading } = useQuery({
        queryKey: ['ipos', selectedTab, searchQuery],
        queryFn: () => listIPOs({ status: selectedTab, search: searchQuery }),
    });

    const { data: watchlist } = useQuery({
        queryKey: ['ipo-watchlist'],
        queryFn: getUserWatchlist,
    });

    const addMutation = useMutation({
        mutationFn: addToWatchlist,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ipo-watchlist'] });
            enqueueSnackbar('Added to watchlist', { variant: 'success' });
        },
        onError: (error: any) => {
            // Don't show toast for 403 - PremiumGuard handles the UI
            if (error.response?.status !== 403) {
                enqueueSnackbar('Failed to add to watchlist', { variant: 'error' });
            }
        },
    });

    const removeMutation = useMutation({
        mutationFn: removeFromWatchlist,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ipo-watchlist'] });
            enqueueSnackbar('Removed from watchlist', { variant: 'info' });
        },
        onError: (error: any) => {
            // Don't show toast for 403 - PremiumGuard handles the UI
            if (error.response?.status !== 403) {
                enqueueSnackbar('Failed to remove from watchlist', { variant: 'error' });
            }
        },
    });

    const handleWatchlistToggle = (ipoId: string) => {
        const isInWatchlist = watchlist?.some((item) => item.ipo._id === ipoId);
        if (isInWatchlist) {
            removeMutation.mutate(ipoId);
        } else {
            addMutation.mutate(ipoId);
        }
    };

    const isInWatchlist = (ipoId: string) => {
        return watchlist?.some((item) => item.ipo._id === ipoId) || false;
    };

    return (
        <PremiumGuard
            title="IPO Information"
            description="Get detailed insights on upcoming, open, and closed IPOs."
        >
            <div>
                <PageHeader title="IPO Information" />

                <ComplianceDisclaimer />

                <Box sx={{ mb: 3 }}>
                    <Tabs value={selectedTab} onChange={(_, value) => setSelectedTab(value)} sx={{ mb: 2 }}>
                        <Tab label="Upcoming" value="upcoming" />
                        <Tab label="Open" value="open" />
                        <Tab label="Closed" value="closed" />
                    </Tabs>

                    <TextField
                        fullWidth
                        placeholder="Search by company name or symbol..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                {isLoading ? (
                    <Box display="flex" justifyContent="center" py={4}>
                        <CircularProgress />
                    </Box>
                ) : ipos && ipos.length > 0 ? (
                    <Grid container spacing={3}>
                        {ipos.map((ipo) => (
                            <Grid item xs={12} md={6} lg={4} key={ipo._id}>
                                <IPOCard ipo={ipo} isInWatchlist={isInWatchlist(ipo._id)} onWatchlistToggle={handleWatchlistToggle} />
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Box textAlign="center" py={4}>
                        <Typography variant="h6" color="text.secondary">
                            No IPOs found
                        </Typography>
                    </Box>
                )}
            </div>
        </PremiumGuard>
    );
};

export default IPOListPage;
