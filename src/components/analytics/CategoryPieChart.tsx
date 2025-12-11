import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { CategoryStats } from '../../types';

const CategoryPieChart: React.FC<{ data: CategoryStats[] }> = ({ data }) => (
  <ResponsiveContainer width="100%" height={320}>
    <PieChart>
      <Pie data={data} dataKey="total" nameKey="name" innerRadius={60} outerRadius={120} paddingAngle={4}>
        {data?.map((entry) => (
          <Cell key={entry.categoryId} fill={entry.color} />
        ))}
      </Pie>
      <Legend />
      <Tooltip />
    </PieChart>
  </ResponsiveContainer>
);

export default CategoryPieChart;

