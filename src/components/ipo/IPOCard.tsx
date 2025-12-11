import React from 'react';
import { Card, CardContent, Typography, Chip, Stack, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { IPO } from '../../types/ipo';
import { formatDate } from '../../utils/format';

interface Props {
    ipo: IPO;
    isInWatchlist?: boolean;
    onWatchlistToggle?: (ipoId: string) => void;
}

const IPOCard: React.FC<Props> = ({ ipo, isInWatchlist = false, onWatchlistToggle }) => {
    const navigate = useNavigate();

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'upcoming':
                return 'info';
            case 'open':
                return 'success';
            case 'closed':
                return 'default';
            default:
                return 'default';
        }
    };

    const getStatusLabel = (status: string) => {
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', '&:hover': { boxShadow: 4 } }}>
            <CardContent sx={{ flexGrow: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box>
                        <Typography variant="h6" fontWeight={700} gutterBottom>
                            {ipo.companyName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {ipo.symbol} • {ipo.industry}
                        </Typography>
                    </Box>
                    {onWatchlistToggle && (
                        <Button
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                onWatchlistToggle(ipo._id);
                            }}
                            startIcon={isInWatchlist ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                            color={isInWatchlist ? 'primary' : 'inherit'}
                        >
                            {isInWatchlist ? 'Saved' : 'Save'}
                        </Button>
                    )}
                </Stack>

                <Stack spacing={1.5}>
                    <Box>
                        <Typography variant="caption" color="text.secondary">
                            Price Range
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
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

                    <Stack direction="row" spacing={2}>
                        <Box>
                            <Typography variant="caption" color="text.secondary">
                                Lot Size
                            </Typography>
                            <Typography variant="body2">{ipo.lotSize} shares</Typography>
                        </Box>
                        <Box>
                            <Typography variant="caption" color="text.secondary">
                                Type
                            </Typography>
                            <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                                {ipo.issueType.replace('-', ' ')}
                            </Typography>
                        </Box>
                    </Stack>

                    <Box>
                        <Typography variant="caption" color="text.secondary">
                            Open - Close
                        </Typography>
                        <Typography variant="body2">
                            {formatDate(ipo.openDate)} - {formatDate(ipo.closeDate)}
                        </Typography>
                    </Box>

                    <Chip label={getStatusLabel(ipo.status)} color={getStatusColor(ipo.status)} size="small" sx={{ alignSelf: 'flex-start' }} />
                </Stack>

                <Button variant="outlined" fullWidth sx={{ mt: 2 }} onClick={() => navigate(`/ipos/${ipo._id}`)}>
                    View Details
                </Button>
            </CardContent>
        </Card>
    );
};

export default IPOCard;
