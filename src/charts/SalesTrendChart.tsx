import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface SalesTrendChartProps {
  data: { date: string; sales: number }[];
}

const SalesTrendChart: React.FC<SalesTrendChartProps> = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#888" />
      <XAxis dataKey="date" stroke="#888" />
      <YAxis stroke="#888" />
      <Tooltip
        contentStyle={{
          backgroundColor: "rgba(17, 17, 17, 0.9)",
          border: "1px solid #475569",
        }}
      />
      <Line type="monotone" dataKey="sales" stroke="#10B981" strokeWidth={2} />
    </LineChart>
  </ResponsiveContainer>
);

export default SalesTrendChart;
