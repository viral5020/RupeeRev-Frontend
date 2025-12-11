import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Paper,
    Typography,
    Grid,
    Chip,
    Stack,
    Button,
    Divider,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    Table,
    TableBody,
    TableRow,
    TableCell,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import PageHeader from '../components/common/PageHeader';
import ComplianceDisclaimer from '../components/ipo/ComplianceDisclaimer';
import { getIPOById, addToWatchlist, removeFromWatchlist, checkWatchlistStatus } from '../services/ipoService';
import { formatDate } from '../utils/format';

const IPODetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const queryClient = useQueryClient();

    const { data: ipo, isLoading } = useQuery({
        queryKey: ['ipo', id],
        queryFn: () => getIPOById(id!),
        enabled: !!id,
    });

    const { data: watchlistStatus } = useQuery({
        queryKey: ['ipo-watchlist-status', id],
        queryFn: () => checkWatchlistStatus(id!),
        enabled: !!id,
    });

    const addMutation = useMutation({
        mutationFn: addToWatchlist,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ipo-watchlist-status', id] });
            queryClient.invalidateQueries({ queryKey: ['ipo-watchlist'] });
            enqueueSnackbar('Added to watchlist', { variant: 'success' });
        },
    });

    const removeMutation = useMutation({
        mutationFn: removeFromWatchlist,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ipo-watchlist-status', id] });
            queryClient.invalidateQueries({ queryKey: ['ipo-watchlist'] });
            enqueueSnackbar('Removed from watchlist', { variant: 'info' });
        },
    });

    const handleWatchlistToggle = () => {
        if (!id) return;
        if (watchlistStatus) {
            removeMutation.mutate(id);
        } else {
            addMutation.mutate(id);
        }
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!ipo) {
        return (
            <Box textAlign="center" py={4}>
                <Typography variant="h6">IPO not found</Typography>
                <Button onClick={() => navigate('/ipos')} sx={{ mt: 2 }}>
                    Back to IPO List
                </Button>
            </Box>
        );
    }

    return (
        <div>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/ipos')} sx={{ mb: 2 }}>
                Back to IPO List
            </Button>

            <PageHeader
                title={ipo.companyName}
                action={
                    <Button
                        variant={watchlistStatus ? 'contained' : 'outlined'}
                        startIcon={watchlistStatus ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                        onClick={handleWatchlistToggle}
                    >
                        {watchlistStatus ? 'In Watchlist' : 'Add to Watchlist'}
                    </Button>
                }
            />

            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
                {ipo.symbol} • {ipo.industry}
            </Typography>

            <ComplianceDisclaimer />

            <Grid container spacing={3}>
                {/* Left Column */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" fontWeight={700} gutterBottom>
                            Company Overview
                        </Typography>
                        <Typography variant="body1" paragraph>
                            {ipo.overview}
                        </Typography>
                    </Paper>

                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" fontWeight={700} gutterBottom>
                            Strengths
                        </Typography>
                        <List>
                            {ipo.strengths.map((strength, index) => (
                                <ListItem key={index}>
                                    <ListItemText primary={`• ${strength}`} />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>

                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" fontWeight={700} gutterBottom>
                            Risks
                        </Typography>
                        <List>
                            {ipo.risks.map((risk, index) => (
                                <ListItem key={index}>
                                    <ListItemText primary={`• ${risk}`} />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>

                    {ipo.financialHighlights && ipo.financialHighlights.length > 0 && (
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight={700} gutterBottom>
                                Financial Highlights (Historical)
                            </Typography>
                            <Table>
                                <TableBody>
                                    {ipo.financialHighlights.map((highlight, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <strong>{highlight.year}</strong>
                                            </TableCell>
                                            <TableCell>Revenue: {highlight.revenue}</TableCell>
                                            <TableCell>Profit: {highlight.profit}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Paper>
                    )}
                </Grid>

                {/* Right Column */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" fontWeight={700} gutterBottom>
                            Issue Details
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Stack spacing={2}>
                            <Box>
                                <Typography variant="caption" color="text.secondary">
                                    Price Range
                                </Typography>
                                <Typography variant="h6" fontWeight={600}>
                                    ₹{ipo.priceRange.min} - ₹{ipo.priceRange.max}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography variant="caption" color="text.secondary">
                                    Issue Size
                                </Typography>
                                <Typography variant="body1" fontWeight={600}>
                                    {ipo.issueSize}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography variant="caption" color="text.secondary">
                                    Lot Size
                                </Typography>
                                <Typography variant="body1">{ipo.lotSize} shares</Typography>
                            </Box>

                            <Box>
                                <Typography variant="caption" color="text.secondary">
                                    Issue Type
                                </Typography>
                                <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                                    {ipo.issueType.replace('-', ' ')}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography variant="caption" color="text.secondary">
                                    Status
                                </Typography>
                                <Box mt={0.5}>
                                    <Chip label={ipo.status.toUpperCase()} color={ipo.status === 'open' ? 'success' : 'default'} size="small" />
                                </Box>
                            </Box>
                        </Stack>
                    </Paper>

                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" fontWeight={700} gutterBottom>
                            Important Dates
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Stack spacing={2}>
                            <Box>
                                <Typography variant="caption" color="text.secondary">
                                    Open Date
                                </Typography>
                                <Typography variant="body1">{formatDate(ipo.openDate)}</Typography>
                            </Box>

                            <Box>
                                <Typography variant="caption" color="text.secondary">
                                    Close Date
                                </Typography>
                                <Typography variant="body1">{formatDate(ipo.closeDate)}</Typography>
                            </Box>

                            {ipo.listingDate && (
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Listing Date
                                    </Typography>
                                    <Typography variant="body1">{formatDate(ipo.listingDate)}</Typography>
                                </Box>
                            )}
                        </Stack>
                    </Paper>

                    {ipo.drhpLink && (
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight={700} gutterBottom>
                                Documents
                            </Typography>
                            <Button variant="outlined" fullWidth endIcon={<OpenInNewIcon />} href={ipo.drhpLink} target="_blank" rel="noopener noreferrer">
                                View DRHP
                            </Button>
                        </Paper>
                    )}
                </Grid>
            </Grid>
        </div>
    );
};

export default IPODetailPage;
