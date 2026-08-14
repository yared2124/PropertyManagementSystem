import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "../../api/client";

interface RevenueData {
  period: string;
  totalAmount: number;
  count: number;
}

export default function RevenueChart() {
  const [data, setData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 6);
        const { data } = await api.get(
          `/reports/revenue?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&groupBy=month`,
        );
        // Format the data for the chart
        const chartData = data.data.byPeriod.map((item: any) => ({
          month: new Date(item.period).toLocaleDateString("en-US", {
            month: "short",
          }),
          revenue: item.totalAmount,
        }));
        setData(chartData);
      } catch (error) {
        console.error("Failed to fetch revenue data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRevenue();
  }, []);

  if (loading) {
    return (
      <div className="flex h-72 items-center justify-center rounded-xl bg-slate-50 text-sm font-semibold text-slate-400">
        Loading chart...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center rounded-xl bg-slate-50 text-sm font-semibold text-slate-400">
        No revenue data
      </div>
    );
  }

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 12, right: 18, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
            tickFormatter={(value) => `SAR ${value}`}
          />
          <Tooltip
            formatter={(value) => `SAR ${Number(value).toLocaleString()}`}
            contentStyle={{
              border: "1px solid #e2e8f0",
              borderRadius: "14px",
              boxShadow: "0 20px 35px rgba(15, 23, 42, 0.12)",
              fontWeight: 600,
            }}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#0891b2"
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2, fill: "#ffffff", stroke: "#0891b2" }}
            activeDot={{ r: 6, strokeWidth: 0, fill: "#10b981" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
