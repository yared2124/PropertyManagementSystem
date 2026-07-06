import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { DashboardMetrics } from "../types";
import MetricCard from "../components/dashboard/MetricCard";
import RevenueChart from "../components/dashboard/RevenueChart";
import RecentActivity from "../components/dashboard/RecentActivity";
import api from "../api/client";
import {
  BuildingOffice2Icon,
  DocumentTextIcon,
  WrenchScrewdriverIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";

export default function Dashboard() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get("/dashboard/overview");
        setMetrics(data.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        Loading dashboard...
      </div>
    );

  const cards = [
    {
      title: "Total Assets",
      value: metrics?.totalAssets || 0,
      icon: BuildingOffice2Icon,
      color: "blue",
    },
    {
      title: "Active Contracts",
      value: metrics?.activeContracts || 0,
      icon: DocumentTextIcon,
      color: "green",
    },
    {
      title: "Pending Maintenance",
      value: metrics?.pendingMaintenance || 0,
      icon: WrenchScrewdriverIcon,
      color: "yellow",
    },
    {
      title: "Total Paid",
      value: `SAR ${metrics?.totalPaid?.toLocaleString() || 0}`,
      icon: CreditCardIcon,
      color: "purple",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Overview of your property management system
          </p>
        </div>
        <button className="btn-primary">Download Report</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <MetricCard key={i} {...card} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <h3 className="text-lg font-semibold mb-4">Revenue Overview</h3>
          <RevenueChart />
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full text-left px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
              ➕ New Property
            </button>
            <button className="w-full text-left px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100">
              📄 New Contract
            </button>
            <button className="w-full text-left px-4 py-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100">
              🔧 Report Maintenance
            </button>
          </div>
        </div>
      </div>
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <RecentActivity />
      </div>
    </div>
  );
}
