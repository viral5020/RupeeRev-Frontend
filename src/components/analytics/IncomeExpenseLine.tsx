import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface Props {
  data: { name: string; income: number; expense: number }[];
}

const IncomeExpenseLine: React.FC<Props> = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="income" stroke="#22c55e" />
      <Line type="monotone" dataKey="expense" stroke="#ef4444" />
    </LineChart>
  </ResponsiveContainer>
);

export default IncomeExpenseLine;

