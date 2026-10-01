/**
 * @file TenantGrowthChart.jsx
 * @description Visualizes school growth over time for the super-admin dashboard.
 *
 * Responsibilities:
 * - Map monthly tenant data into chart series.
 * - Render the growth chart and its axes.
 */
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import './TenantGrowthChart.css'

function TenantGrowthChart({ data }) {
  return (
    <section className="tenant-growth-chart">
      <h2 className="chart-title">
        Tenant Growth
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="schools"
            stroke="#2563eb"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </section>
  );
}

export default TenantGrowthChart;