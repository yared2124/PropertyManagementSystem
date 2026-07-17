import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { DashboardMetrics } from "../types";
import MetricCard from "../components/dashboard/MetricCard";
import RevenueChart from "../components/dashboard/RevenueChart";
import RecentActivity from "../components/dashboard/RecentActivity";
import api from "../api/client";
import {
  ArrowDownTrayIcon,
  ArrowRightIcon,
  BuildingOffice2Icon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  CreditCardIcon,
  DocumentTextIcon,
  HomeModernIcon,
  PlusIcon,
  ScaleIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";

const panelClass =
  "rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6";

const formatCurrency = (value?: number) =>
  `SAR ${(value || 0).toLocaleString()}`;

function SectionHeader({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <h3 className="text-base font-semibold text-gray-950">{title}</h3>
      {action}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
      {message}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const isPositive = status === "ACTIVE" || status === "COMPLETED";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
        isPositive
          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
          : "bg-amber-50 text-amber-700 ring-1 ring-amber-100"
      }`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

function QuickAction({
  to,
  label,
  icon: Icon,
  tone,
}: {
  to: string;
  label: string;
  icon: any;
  tone: string;
}) {
  return (
    <Link
      to={to}
      className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
    >
      <span className="flex min-w-0 items-center gap-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tone}`}
        >
          <Icon className="h-5 w-5" />
        </span>
        <span className="truncate">{label}</span>
      </span>
      <ArrowRightIcon className="h-4 w-4 text-gray-400 transition group-hover:translate-x-0.5 group-hover:text-blue-600" />
    </Link>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [tenantData, setTenantData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const role = user?.role;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (
          ["SYSTEM_ADMIN", "PROPERTY_MANAGER", "ACCOUNTANT"].includes(
            role || "",
          )
        ) {
          const { data } = await api.get("/dashboard/overview");
          setMetrics(data.data);
        } else if (role === "TENANT" || role === "LANDLORD") {
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
      <div className="flex h-64 items-center justify-center">
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-5 text-sm font-medium text-gray-600 shadow-sm">
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (["SYSTEM_ADMIN", "PROPERTY_MANAGER", "ACCOUNTANT"].includes(role || "")) {
    const cards = [
      {
        title: "Total Assets",
        value: metrics?.totalAssets || 0,
        icon: BuildingOffice2Icon,
        color: "blue" as const,
      },
      {
        title: "Active Contracts",
        value: metrics?.activeContracts || 0,
        icon: DocumentTextIcon,
        color: "green" as const,
      },
      {
        title: "Pending Maintenance",
        value: metrics?.pendingMaintenance || 0,
        icon: WrenchScrewdriverIcon,
        color: "yellow" as const,
      },
      {
        title: "Total Paid",
        value: formatCurrency(metrics?.totalPaid),
        icon: CreditCardIcon,
        color: "purple" as const,
      },
    ];

    return (
      <div className="space-y-6">
        <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-blue-600 via-sky-600 to-emerald-500 px-6 py-6 text-white sm:px-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-wide text-white/75">
                  Property operations
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-normal">
                  Dashboard
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-white/80">
                  A fast view of assets, contracts, maintenance, and payments.
                </p>
              </div>
              <button
                onClick={() => navigate("/sales")}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50 sm:w-auto"
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
                Download Report
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <MetricCard key={card.title} {...card} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className={`${panelClass} xl:col-span-2`}>
            <SectionHeader title="Revenue Overview" />
            <RevenueChart />
          </div>

          <div className={panelClass}>
            <SectionHeader title="Quick Actions" />
            <div className="space-y-3">
              <QuickAction
                to="/properties/new"
                label="New Property"
                icon={PlusIcon}
                tone="bg-blue-50 text-blue-600"
              />
              <QuickAction
                to="/contracts/new"
                label="New Contract"
                icon={DocumentTextIcon}
                tone="bg-emerald-50 text-emerald-600"
              />
              <QuickAction
                to="/maintenance/new"
                label="Report Maintenance"
                icon={WrenchScrewdriverIcon}
                tone="bg-amber-50 text-amber-600"
              />
              <button
                onClick={() => navigate("/sales")}
                className="group flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 text-left text-sm font-medium text-gray-700 shadow-sm transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                    <ChartBarIcon className="h-5 w-5" />
                  </span>
                  <span className="truncate">View Reports</span>
                </span>
                <ArrowRightIcon className="h-4 w-4 text-gray-400 transition group-hover:translate-x-0.5 group-hover:text-violet-600" />
              </button>
            </div>
          </div>
        </div>

        <div className={panelClass}>
          <SectionHeader title="Recent Activity" />
          <RecentActivity />
        </div>
      </div>
    );
  }

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
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-blue-600">
                Tenant portal
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-normal text-gray-950">
                My Dashboard
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Payments, contracts, and maintenance in one clear place.
              </p>
            </div>
            <Link
              to="/maintenance/new"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              <PlusIcon className="h-5 w-5" />
              Request Maintenance
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <MetricCard
            title="My Contracts"
            value={totalContracts}
            icon={DocumentTextIcon}
            color="blue"
          />
          <MetricCard
            title="Total Paid"
            value={formatCurrency(totalPayments)}
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

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className={panelClass}>
            <SectionHeader title="My Recent Payments" />
            {tenantData?.payments?.length === 0 ? (
              <EmptyState message="No payments yet." />
            ) : (
              <div className="divide-y divide-gray-100">
                {tenantData?.payments?.slice(0, 5).map((payment: any) => (
                  <div
                    key={payment.id}
                    className="grid gap-2 py-3 sm:grid-cols-[1fr_auto_auto] sm:items-center"
                  >
                    <span className="min-w-0 truncate text-sm font-medium text-gray-900">
                      {payment.paymentNumber}
                    </span>
                    <span className="text-sm font-semibold text-gray-950">
                      {formatCurrency(payment.amount)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(payment.paymentDate).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={panelClass}>
            <SectionHeader title="My Maintenance Requests" />
            {tenantData?.maintenance?.length === 0 ? (
              <EmptyState message="No maintenance requests." />
            ) : (
              <div className="divide-y divide-gray-100">
                {tenantData?.maintenance?.slice(0, 5).map((request: any) => (
                  <div
                    key={request.id}
                    className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span className="min-w-0 truncate text-sm font-medium text-gray-900">
                      {request.title}
                    </span>
                    <StatusPill status={request.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={panelClass}>
          <SectionHeader title="My Contracts" />
          {tenantData?.contracts?.length === 0 ? (
            <EmptyState message="No active contracts." />
          ) : (
            <div className="divide-y divide-gray-100">
              {tenantData?.contracts?.slice(0, 5).map((contract: any) => (
                <div
                  key={contract.id}
                  className="grid gap-2 py-3 sm:grid-cols-[1fr_auto_auto] sm:items-center"
                >
                  <span className="min-w-0 truncate text-sm font-medium text-gray-900">
                    {contract.title}
                  </span>
                  <StatusPill status={contract.status} />
                  <span className="text-sm font-semibold text-gray-950">
                    {formatCurrency(contract.monthlyRent)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (role === "LANDLORD") {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium uppercase tracking-wide text-emerald-600">
            Landlord portal
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-normal text-gray-950">
            Landlord Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Overview of your properties and rental activity.
          </p>
        </div>
        <div className={panelClass}>
          <EmptyState message="Your properties and rental income will appear here." />
        </div>
      </div>
    );
  }

  if (role === "LEGAL_ADMIN") {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium uppercase tracking-wide text-violet-600">
            Legal workspace
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-normal text-gray-950">
            Legal Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage legal documents, contracts, and power of attorney records.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <QuickAction
            to="/poa"
            label="Power of Attorney"
            icon={ScaleIcon}
            tone="bg-violet-50 text-violet-600"
          />
          <QuickAction
            to="/contracts"
            label="Contracts"
            icon={ClipboardDocumentListIcon}
            tone="bg-blue-50 text-blue-600"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={panelClass}>
      <div className="flex items-center gap-3 text-gray-600">
        <HomeModernIcon className="h-6 w-6 text-blue-600" />
        <span>Welcome to the Property Management System.</span>
      </div>
    </div>
  );
}
