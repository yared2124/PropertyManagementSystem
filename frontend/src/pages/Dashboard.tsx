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
  UserIcon,
  HomeIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

export default function Dashboard() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [tenantData, setTenantData] = useState<any>(null);

  const role = user?.role;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // For admin/manager/accountant – fetch all metrics
        if (
          ["SYSTEM_ADMIN", "PROPERTY_MANAGER", "ACCOUNTANT"].includes(
            role || "",
          )
        ) {
          const { data } = await api.get("/dashboard/overview");
          setMetrics(data.data);
        }
        // For tenant and landlord – fetch personal data
        else if (role === "TENANT" || role === "LANDLORD") {
          const [contracts, payments, maintenance] = await Promise.all([
            api.get("/contracts"),
            api.get("/payments"),
            api.get("/maintenance"),
          ]);
          setTenantData({
            contracts: contracts.data.data,
            payments: payments.data.data,
            maintenance: maintenance.data.data,
          });
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [role]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading dashboard...
      </div>
    );
  }

  // ============================================
  // ADMIN / MANAGER / ACCOUNTANT DASHBOARD
  // ============================================
  if (["SYSTEM_ADMIN", "PROPERTY_MANAGER", "ACCOUNTANT"].includes(role || "")) {
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

  // ============================================
  // TENANT DASHBOARD
  // ============================================
  if (role === "TENANT") {
    const totalContracts = tenantData?.contracts?.length || 0;
    const totalPayments =
      tenantData?.payments
        ?.filter((p: any) => p.status === "PAID")
        .reduce((sum: number, p: any) => sum + p.amount, 0) || 0;
    const pendingMaintenance =
      tenantData?.maintenance?.filter(
        (m: any) => m.status !== "COMPLETED" && m.status !== "CANCELLED",
      ).length || 0;

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-gray-600">Overview of your activity</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MetricCard
            title="My Contracts"
            value={totalContracts}
            icon={DocumentTextIcon}
            color="blue"
          />
          <MetricCard
            title="Total Paid"
            value={`SAR ${totalPayments.toLocaleString()}`}
            icon={CreditCardIcon}
            color="green"
          />
          <MetricCard
            title="Pending Maintenance"
            value={pendingMaintenance}
            icon={WrenchScrewdriverIcon}
            color="yellow"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">My Recent Payments</h3>
            {tenantData?.payments?.length === 0 ? (
              <p className="text-gray-500 text-sm">No payments yet.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {tenantData?.payments?.slice(0, 5).map((p: any) => (
                  <li key={p.id} className="py-2 flex justify-between">
                    <span className="text-sm">{p.paymentNumber}</span>
                    <span className="text-sm font-medium">SAR {p.amount}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(p.paymentDate).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">
              My Maintenance Requests
            </h3>
            {tenantData?.maintenance?.length === 0 ? (
              <p className="text-gray-500 text-sm">No maintenance requests.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {tenantData?.maintenance?.slice(0, 5).map((m: any) => (
                  <li key={m.id} className="py-2 flex justify-between">
                    <span className="text-sm">{m.title}</span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        m.status === "COMPLETED"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {m.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">My Contracts</h3>
          {tenantData?.contracts?.length === 0 ? (
            <p className="text-gray-500 text-sm">No active contracts.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {tenantData?.contracts?.slice(0, 5).map((c: any) => (
                <li key={c.id} className="py-2 flex justify-between">
                  <span className="text-sm">{c.title}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      c.status === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {c.status}
                  </span>
                  <span className="text-sm font-medium">
                    SAR {c.monthlyRent}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  // ============================================
  // LANDLORD DASHBOARD
  // ============================================
  if (role === "LANDLORD") {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Landlord Dashboard</h1>
        <p className="text-gray-600">Overview of your properties</p>
        <div className="card">
          <p className="text-gray-500">
            Your properties and rental income will appear here.
          </p>
          {/* You can expand this similarly to tenant */}
        </div>
      </div>
    );
  }

  // ============================================
  // LEGAL_ADMIN DASHBOARD
  // ============================================
  if (role === "LEGAL_ADMIN") {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Legal Dashboard</h1>
        <p className="text-gray-600">Manage legal documents and POAs</p>
        <div className="card">
          <p className="text-gray-500">Legal admin dashboard coming soon.</p>
        </div>
      </div>
    );
  }

  // Fallback
  return (
    <div className="text-gray-500">
      Welcome to the Property Management System.
    </div>
  );
}
