import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  data: { name: string; income: number; expense: number }[];
}

const MonthlyBarChart: React.FC<Props> = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="income" fill="#22c55e" />
      <Bar dataKey="expense" fill="#ef4444" />
    </BarChart>
  </ResponsiveContainer>
);

export default MonthlyBarChart;

