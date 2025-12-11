import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface SurplusAllocationHealthProps {
  essentials: number;
  bills: number;
  sips: number;
  surplus: number;
  total: number;
}

const SurplusAllocationHealth: React.FC<SurplusAllocationHealthProps> = ({
  essentials,
  bills,
  sips,
  surplus,
  total,
}) => {
  const data = [
    { name: 'Essentials', value: essentials, color: '#ef4444' },
    { name: 'Bills', value: bills, color: '#f59e0b' },
    { name: 'SIPs', value: sips, color: '#10b981' },
    { name: 'Surplus', value: surplus, color: '#6366f1' },
  ].filter((item) => item.value > 0);

  return (
    <Paper
      sx={{
        p: 2,
        background: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)',
        border: '2px solid #c4b5fd',
        borderRadius: 2,
        height: '100%',
      }}
    >
      <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 2 }}>
        Surplus Allocation Health
      </Typography>
      <Box sx={{ height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={70}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default SurplusAllocationHealth;

