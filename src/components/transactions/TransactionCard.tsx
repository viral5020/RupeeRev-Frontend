import React from 'react';
import { Card, CardContent, Typography, Chip, Stack, IconButton, Tooltip, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Transaction } from '../../types';
import { formatCurrency, formatDate } from '../../utils/format';
import AttachmentPreview from '../attachments/AttachmentPreview';

interface Props {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

const TransactionCard: React.FC<Props> = ({ transaction, onEdit, onDelete }) => {
  const isIncome = transaction.type === 'income';
  const isLowConfidence = (transaction.categoryConfidence ?? 1) < 0.5;
  const whyText =
    transaction.categorySource || transaction.categoryConfidence !== undefined
      ? `Source: ${transaction.categorySource || 'unknown'} • Confidence: ${Math.round(
        (transaction.categoryConfidence ?? 1) * 100
      )}%`
      : undefined;

  return (
    <Card
      sx={{
        borderLeft: `4px solid ${isIncome ? '#22c55e' : '#ef4444'}`,
        '&:hover': {
          boxShadow: 3,
          transform: 'translateY(-2px)',
          transition: 'all 0.2s ease-in-out'
        }
      }}
    >
      <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          {/* Date Column - Compact */}
          <Box sx={{ minWidth: 80 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.7rem' }}>
              {formatDate(transaction.date)}
            </Typography>
          </Box>

          {/* Title & Category Column - Flexible */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" fontWeight={600} noWrap sx={{ fontSize: '0.875rem' }}>
              {transaction.title}
            </Typography>
            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.25 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                {transaction.category || 'Uncategorized'}
              </Typography>
              {isLowConfidence && (
                <Chip
                  label="Low confidence"
                  size="small"
                  color="warning"
                  onClick={() => onEdit(transaction)}
                  sx={{ height: 16, fontSize: '0.65rem', '& .MuiChip-label': { px: 0.75, py: 0 } }}
                />
              )}
              {whyText && (
                <Tooltip title={whyText}>
                  <Chip
                    label="?"
                    size="small"
                    variant="outlined"
                    sx={{ height: 16, minWidth: 20, fontSize: '0.65rem', '& .MuiChip-label': { px: 0.5, py: 0 } }}
                  />
                </Tooltip>
              )}
            </Stack>
          </Box>

          {/* Tags Column - Compact */}
          {transaction.tags && transaction.tags.length > 0 && (
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5 }}>
              {transaction.tags.slice(0, 2).map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  sx={{ height: 18, fontSize: '0.65rem', '& .MuiChip-label': { px: 0.75, py: 0 } }}
                />
              ))}
              {transaction.tags.length > 2 && (
                <Chip
                  label={`+${transaction.tags.length - 2}`}
                  size="small"
                  variant="outlined"
                  sx={{ height: 18, fontSize: '0.65rem', '& .MuiChip-label': { px: 0.75, py: 0 } }}
                />
              )}
            </Box>
          )}

          {/* Amount Column - Fixed width */}
          <Box sx={{ minWidth: 100, textAlign: 'right' }}>
            <Typography
              variant="body1"
              fontWeight={700}
              sx={{
                color: isIncome ? 'success.main' : 'error.main',
                fontSize: '0.95rem'
              }}
            >
              {isIncome ? '+' : '-'}{formatCurrency(transaction.amount, 'INR')}
            </Typography>
          </Box>

          {/* Actions Column - Compact */}
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Edit">
              <IconButton
                onClick={() => onEdit(transaction)}
                size="small"
                sx={{ p: 0.5 }}
              >
                <EditIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                onClick={() => onDelete(transaction)}
                size="small"
                sx={{ p: 0.5 }}
              >
                <DeleteIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        {/* Attachments Row - Only show if exists */}
        {transaction.attachments && transaction.attachments.length > 0 && (
          <Box sx={{ mt: 1, pl: 10 }}>
            <AttachmentPreview attachments={transaction.attachments} />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionCard;
