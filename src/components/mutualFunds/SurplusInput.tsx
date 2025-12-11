import React from 'react';
import { Paper, Typography, TextField, Button, Stack, Slider } from '@mui/material';

interface SurplusInputProps {
  value: number;
  onChange: (value: number) => void;
  onSubmit: () => void;
  loading?: boolean;
}

const presets = [3000, 8000, 15000, 25000];

const SurplusInput: React.FC<SurplusInputProps> = ({ value, onChange, onSubmit, loading }) => {
  const handleSlider = (_: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') onChange(newValue);
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        💰 Monthly Surplus
      </Typography>
      <TextField
        label="Surplus (₹)"
        value={value}
        onChange={(event) => onChange(Number(event.target.value) || 0)}
        fullWidth
        type="number"
        InputProps={{ inputProps: { min: 0, step: 500 } }}
      />

      <Slider
        min={0}
        max={50000}
        step={500}
        value={Math.min(value, 50000)}
        onChange={handleSlider}
        sx={{ mt: 2 }}
      />

      <Stack direction="row" spacing={1} sx={{ my: 2, flexWrap: 'wrap' }}>
        {presets.map((amount) => (
          <Button key={amount} size="small" variant="outlined" onClick={() => onChange(amount)}>
            ₹{amount.toLocaleString('en-IN')}
          </Button>
        ))}
      </Stack>

      <Button variant="contained" fullWidth onClick={onSubmit} disabled={loading || value <= 0}>
        {loading ? 'Thinking…' : 'Generate Plan'}
      </Button>
    </Paper>
  );
};

export default SurplusInput;


