import React, { useState } from 'react';
import { Box, Button, MenuItem, TextField, IconButton, Collapse, Badge, Stack, Typography, Paper } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import DateRangePicker from '../common/DateRangePicker';
import { useFilters } from '../../context/FilterContext';
import CategorySelect from '../common/CategorySelect';
import AccountSelector from '../common/AccountSelector';

const TransactionFilters: React.FC = () => {
  const { filters, setFilters, reset } = useFilters();
  const [expanded, setExpanded] = useState(false);

  // Calculate active filters count
  const activeCount = [
    filters.search,
    filters.type,
    filters.category,
    filters.account,
    filters.startDate,
    filters.endDate
  ].filter(Boolean).length;

  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: expanded ? 2 : 0 }}>
        <Button
          startIcon={
            <Badge badgeContent={activeCount} color="primary">
              <FilterListIcon />
            </Badge>
          }
          onClick={() => setExpanded(!expanded)}
          variant={expanded ? "contained" : "outlined"}
          color={expanded ? "primary" : "inherit"}
          size="small"
        >
          {expanded ? "Hide Filters" : "Filters"}
        </Button>

        {!expanded && activeCount > 0 && (
          <Button size="small" onClick={reset} color="inherit">
            Clear {activeCount} active filters
          </Button>
        )}
      </Stack>

      <Collapse in={expanded}>
        <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <TextField
              label="Search"
              value={filters.search ?? ''}
              onChange={(event) => setFilters({ search: event.target.value })}
              size="small"
            />
            <TextField
              select
              label="Type"
              value={filters.type ?? ''}
              onChange={(event) => setFilters({ type: (event.target.value || undefined) as 'income' | 'expense' | undefined })}
              size="small"
              sx={{ minWidth: 160 }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="income">Income</MenuItem>
              <MenuItem value="expense">Expense</MenuItem>
            </TextField>
            <Box sx={{ minWidth: 200 }}>
              <CategorySelect
                value={filters.category}
                onChange={(value) => setFilters({ category: value })}
                type={filters.type ?? ('all' as const)}
                label="Category"
              />
            </Box>
            <Box sx={{ minWidth: 200 }}>
              <AccountSelector
                value={filters.account}
                onChange={(value) => setFilters({ account: value })}
              />
            </Box>
            <DateRangePicker
              startDate={filters.startDate}
              endDate={filters.endDate}
              onChange={({ startDate, endDate }) => setFilters({ startDate, endDate })}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
              <Button variant="text" onClick={reset} startIcon={<CloseIcon />}>
                Clear All
              </Button>
            </Box>
          </Box>
        </Paper>
      </Collapse>
    </Box>
  );
};

export default TransactionFilters;
