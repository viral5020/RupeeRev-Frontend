import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Chip,
  LinearProgress,
  Box,
} from '@mui/material';
import { CategoryPerformance } from '../../types';

interface CategoryPerformanceTableProps {
  data: CategoryPerformance[];
  loading?: boolean;
}

const categoryColors: Record<string, string> = {
  index: '#6366f1',
  equity: '#22c55e',
  balanced: '#f97316',
  gold: '#facc15',
  debt: '#0ea5e9',
};

const formatPercent = (value?: number) =>
  value || value === 0 ? `${value.toFixed(2)}%` : 'NA';

const CategoryPerformanceTable: React.FC<CategoryPerformanceTableProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Category Performance
        </Typography>
        <LinearProgress />
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        📊 Category Performance
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Rank</TableCell>
            <TableCell>Category</TableCell>
            <TableCell align="right">1M Avg</TableCell>
            <TableCell align="right">3M Avg</TableCell>
            <TableCell align="right">1Y Avg</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={row.id}>
              <TableCell>
                <Chip
                  size="small"
                  label={`#${index + 1}`}
                  sx={{ fontWeight: 600, backgroundColor: '#eef2ff' }}
                />
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {row.category}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {row.normalizedCategory.toUpperCase()}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell align="right" sx={{ color: (row.avg1Month ?? 0) >= 0 ? 'success.main' : 'error.main' }}>
                {formatPercent(row.avg1Month)}
              </TableCell>
              <TableCell align="right" sx={{ color: (row.avg3Month ?? 0) >= 0 ? 'success.main' : 'error.main' }}>
                {formatPercent(row.avg3Month)}
              </TableCell>
              <TableCell align="right">
                <Chip
                  size="small"
                  label={formatPercent(row.avg1Year)}
                  sx={{
                    fontWeight: 600,
                    backgroundColor: `${categoryColors[row.normalizedCategory] || '#e5e7eb'}20`,
                    color: categoryColors[row.normalizedCategory] || '#475569',
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default CategoryPerformanceTable;


