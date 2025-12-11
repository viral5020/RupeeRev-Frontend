import React from 'react';
import { Box, TextField } from '@mui/material';

interface Props {
  startDate?: string;
  endDate?: string;
  onChange: (range: { startDate?: string; endDate?: string }) => void;
}

const DateRangePicker: React.FC<Props> = ({ startDate, endDate, onChange }) => (
  <Box sx={{ display: 'flex', gap: 2 }}>
    <TextField
      type="date"
      label="Start"
      InputLabelProps={{ shrink: true }}
      value={startDate ?? ''}
      onChange={(event) => onChange({ startDate: event.target.value, endDate })}
      fullWidth
    />
    <TextField
      type="date"
      label="End"
      InputLabelProps={{ shrink: true }}
      value={endDate ?? ''}
      onChange={(event) => onChange({ startDate, endDate: event.target.value })}
      fullWidth
    />
  </Box>
);

export default DateRangePicker;

