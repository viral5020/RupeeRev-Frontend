import React from 'react';
import { Grid, Pagination, Stack, Button, Dialog, DialogContent, DialogTitle, TextField, Typography, Alert, Box, Tooltip, Menu, MenuItem } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import TransactionFilters from '../components/filters/TransactionFilters';
import TransactionCard from '../components/transactions/TransactionCard';
import TransactionForm, { TransactionFormValues } from '../components/transactions/TransactionForm';

import BankStatementUploader from '../components/transactions/BankStatementUploader';
import AIInsightsPanel from '../components/insights/AIInsightsPanel';
import { useTransactions } from '../hooks/useTransactions';
import { useFilters } from '../context/FilterContext';
import { createTransaction, deleteTransaction, deleteAllTransactions, updateTransaction } from '../services/transactionService';
import { Transaction } from '../types';
import { useSnackbar } from 'notistack';
import { useAuth } from '../context/AuthContext';

const TransactionsPage: React.FC = () => {
    const { data, isLoading } = useTransactions();
    const { filters, setFilters } = useFilters();
    const [open, setOpen] = React.useState(false);
    const [selected, setSelected] = React.useState<Transaction | null>(null);
    const { enqueueSnackbar } = useSnackbar();
    const queryClient = useQueryClient();
    const [confirmOpen, setConfirmOpen] = React.useState(false);
    const [confirmDeleteAllOpen, setConfirmDeleteAllOpen] = React.useState(false);
    const [pdfUploadOpen, setPdfUploadOpen] = React.useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    // Check if user has access to PDF upload (premium or has tokens)
    const hasPdfAccess = user?.isPremium || (user?.tokenBalance && user.tokenBalance > 0);

    const handleOpen = (transaction?: Transaction) => {
        setSelected(transaction ?? null);
        setOpen(true);
    };

    const handleSubmit = async (values: TransactionFormValues, attachments: FileList | null) => {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            if (value === undefined || value === null) return;
            if (key === 'recurrenceEnabled' || key === 'frequency') return;
            formData.append(key, String(value));
        });
        if (values.recurrenceEnabled && values.frequency) {
            formData.append(
                'recurrence',
                JSON.stringify({
                    frequency: values.frequency,
                })
            );
        }
        if (attachments) {
            Array.from(attachments).forEach((file) => formData.append('attachments', file));
        }
        if (selected) {
            await updateTransaction(selected._id, formData);
            enqueueSnackbar('Transaction updated', { variant: 'success' });
        } else {
            await createTransaction(formData);
            enqueueSnackbar('Transaction created', { variant: 'success' });
        }
        setOpen(false);
        queryClient.invalidateQueries({ queryKey: ['transactions'] });
    };

    const handleDelete = async () => {
        if (selected) {
            await deleteTransaction(selected._id);
            enqueueSnackbar('Transaction deleted', { variant: 'info' });
            setConfirmOpen(false);
            setSelected(null);
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
        }
    };

    const handleDeleteAll = async () => {
        try {
            const result = await deleteAllTransactions();
            enqueueSnackbar(`Deleted ${result.deletedCount} transactions`, { variant: 'success' });
            setConfirmDeleteAllOpen(false);
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
        } catch (error: any) {
            enqueueSnackbar(error.response?.data?.message || 'Failed to delete transactions', { variant: 'error' });
        }
    };

    const handlePdfUploadClick = () => {
        if (!hasPdfAccess) {
            // Redirect to pricing page if user doesn't have access
            navigate('/pricing');
        } else {
            // Open upload dialog if user has access
            setPdfUploadOpen(true);
        }
    };

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const menuOpen = Boolean(anchorEl);

    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box sx={{ maxWidth: '100vw', overflowX: 'hidden', px: { xs: 2, sm: 3 } }}>
            <PageHeader
                title="Transactions"
                action={
                    <>
                        {/* Mobile Menu Button */}
                        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                            <Button
                                variant="contained"
                                onClick={handleMenuClick}
                                sx={{ minWidth: 'auto', px: 2 }}
                            >
                                ☰ Menu
                            </Button>
                            <Menu
                                anchorEl={anchorEl}
                                open={menuOpen}
                                onClose={handleMenuClose}
                                PaperProps={{
                                    sx: { width: '250px' }
                                }}
                            >
                                <MenuItem
                                    onClick={() => {
                                        handleMenuClose();
                                        handleOpen();
                                    }}
                                >
                                    ➕ Add Transaction
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        handleMenuClose();
                                        handlePdfUploadClick();
                                    }}
                                >
                                    {!hasPdfAccess && '🔒 '}📄 Upload Statement
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        handleMenuClose();
                                        queryClient.invalidateQueries({ queryKey: ['transactions'] });
                                    }}
                                >
                                    ↻ Refresh
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        handleMenuClose();
                                        setConfirmDeleteAllOpen(true);
                                    }}
                                    sx={{ color: 'error.main' }}
                                >
                                    🗑️ Delete All
                                </MenuItem>
                            </Menu>
                        </Box>

                        {/* Desktop Buttons */}
                        <Stack
                            direction="row"
                            spacing={1}
                            sx={{ display: { xs: 'none', md: 'flex' } }}
                        >
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={() => setConfirmDeleteAllOpen(true)}
                                size="small"
                            >
                                🗑️ Delete All
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => queryClient.invalidateQueries({ queryKey: ['transactions'] })}
                                startIcon={<RefreshIcon />}
                                size="small"
                            >
                                Refresh
                            </Button>
                            <Tooltip
                                title={!hasPdfAccess ? "Premium feature - Click to view plans" : ""}
                                arrow
                            >
                                <Button
                                    variant="outlined"
                                    onClick={handlePdfUploadClick}
                                    startIcon={!hasPdfAccess ? <LockIcon /> : undefined}
                                    size="small"
                                    sx={{
                                        ...((!hasPdfAccess) && {
                                            borderColor: 'warning.main',
                                            color: 'warning.main',
                                            '&:hover': {
                                                borderColor: 'warning.dark',
                                                backgroundColor: 'warning.light',
                                            }
                                        })
                                    }}
                                >
                                    📄 Upload Bank Statement
                                </Button>
                            </Tooltip>
                            <Button
                                variant="contained"
                                onClick={() => handleOpen()}
                                size="small"
                            >
                                Add Transaction
                            </Button>
                        </Stack>
                    </>
                }
            />

            {/* Info Banner for Recurring Transactions */}
            <Box sx={{ mb: 3 }}>
                <Alert severity="info" icon={<span>💡</span>}>
                    <Typography variant="body2" fontWeight={600} gutterBottom>
                        Missing some income in your insights?
                    </Typography>
                    <Typography variant="body2">
                        If your insights are missing regular income like monthly salary, rent income, cash transactions, or other recurring payments, consider adding them as <strong>recurring transactions manually</strong> to get more accurate insights and predictions.
                    </Typography>
                </Alert>
            </Box>

            <AIInsightsPanel />

            <TransactionFilters />
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <Grid container spacing={2}>
                    {data?.docs.map((transaction) => (
                        <Grid item xs={12} md={6} key={transaction._id}>
                            <TransactionCard
                                transaction={transaction}
                                onEdit={() => handleOpen(transaction)}
                                onDelete={(tx) => {
                                    setSelected(tx);
                                    setConfirmOpen(true);
                                }}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}
            <Stack alignItems="center" sx={{ mt: 3 }}>
                <Pagination count={data?.totalPages || 1} page={filters.page || 1} onChange={(_event, page) => setFilters({ page })} color="primary" />
            </Stack>
            <TransactionForm
                open={open}
                initialValues={
                    selected
                        ? {
                            title: selected.title,
                            amount: selected.amount,
                            type: selected.type,
                            category: selected.category,
                            date: selected.date.slice(0, 10),
                            notes: selected.notes,
                        }
                        : undefined
                }
                onClose={() => {
                    setSelected(null);
                    setOpen(false);
                }}
                onSubmit={handleSubmit}
            />
            <Dialog
                open={confirmOpen}
                onClose={() => {
                    setConfirmOpen(false);
                    setSelected(null);
                }}
            >
                <DialogTitle>Confirm delete</DialogTitle>
                <DialogContent>
                    <TextField value={selected?.title || ''} fullWidth disabled />
                    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                        <Button
                            onClick={() => {
                                setConfirmOpen(false);
                                setSelected(null);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={async () => {
                                await handleDelete();
                                setSelected(null);
                            }}
                        >
                            Delete
                        </Button>
                    </Stack>
                </DialogContent>
            </Dialog>
            <Dialog
                open={confirmDeleteAllOpen}
                onClose={() => setConfirmDeleteAllOpen(false)}
            >
                <DialogTitle>Delete All Transactions?</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        This will permanently delete ALL your transactions. This action cannot be undone.
                    </Typography>
                    <Stack direction="row" spacing={2}>
                        <Button onClick={() => setConfirmDeleteAllOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleDeleteAll}
                        >
                            Delete All
                        </Button>
                    </Stack>
                </DialogContent>
            </Dialog>
            <BankStatementUploader
                open={pdfUploadOpen}
                onClose={() => setPdfUploadOpen(false)}
                onSuccess={() => {
                    queryClient.invalidateQueries({ queryKey: ['transactions'] });
                    queryClient.invalidateQueries({ queryKey: ['predictions'] });
                    queryClient.invalidateQueries({ queryKey: ['goals'] });
                }}
                onDataRefresh={() => {
                    // Invalidate all data that depends on transactions
                    queryClient.invalidateQueries({ queryKey: ['ai-insights'] });
                    queryClient.invalidateQueries({ queryKey: ['predictions'] });
                    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
                    queryClient.invalidateQueries({ queryKey: ['transactions'] });
                }}
            />
        </Box>
    );
};

export default TransactionsPage;
